const app = require('./index');
const db = app.get('db');
const axios = require('axios');
const q = require('q');
const polylineCtrl = require('./polyline_ctrl')
const controller = require('./trail_ctrl')
// const host =  require('./config.js');
const host = process.env;

module.exports = {

    updateTrail: function (req, res, next) {

        if (req.body.password != 'updaterGo') return res.send('wrong password')

        let trailIds;
        let errors = []

        db.getIds(function (err, response) {
            if (err) console.log(err)
            else trailIds = response
            let first = trailIds.shift()
            startUpdate(first)
        })





        //---------- elevation data ------------//

        function startUpdate(id) {
            console.log('start ', id)
            controller.trailDataWithPromise(id.trail_id)
                .then(response => {
                    console.log('1')
                    let trail = response[0]
                    try {
                        trail.coords = JSON.parse("[" + trail.coords + "]")
                    } catch (e) {
                        return console.error(e);
                    }
                    let polyline = coordsLength(trail);
                    return [polyline, trail];
                })
                .then(data => {
                    console.log('step 2 with id ', data[1].trail_id)
                    console.log(data[1].coords[0])
                    if (!data[1].coords[0]) return data[1]
                    return getElevation(data[0], data[1]).then(response => {
                        if (response === 'Error!') {
                            errors.push(id.trail_id)
                            let nextId = trailIds.shift()
                            console.log('errored at ', id.trail_id)
                            return startUpdate(nextId)
                        } else return response;
                    })
                })
                .then(response => {
                    console.log('step 3 with id ', response.trail_id)

                    let arrayToSend = response.coords[0] ? calculations(response) : []
                    let diff = difficulty(response.gis_miles, arrayToSend[0]);
                    let time = naismithTime(response.gis_miles, arrayToSend[0], 2.5);
                    let head = JSON.stringify(response.coords[0]) || null
                    // let gradient = Math.round((arrayToSend[0]/(response.gis_miles * 5280))); // fix tabel so you don't have to round anymore
                    arrayToSend.push(diff, time, head);
                    db.UPDATEtrailInfo(arrayToSend, function (err, updated) {
                        if (err) errors.push(id.trail_id)
                        if (trailIds.length > 0) {
                            let nextId = trailIds.shift()
                            console.log(trailIds.length)
                            startUpdate(nextId)
                        } else {
                            console.log(errors)
                            return res.send({
                                errored: errors
                            })
                        }
                    })
                });
        }


        function coordsLength(trail) {
            if (trail.coords.length < 5) return null

            if (trail.coords.length < 500) {
                polyline = polylineCtrl.createEncodings(trail.coords);
            } else if (trail.coords.length < 640) { // take out every other third element
                for (var k = 1; k < trail.coords.length; k += 3) {
                    trail.coords.splice(k, 1)
                }
                polyline = polylineCtrl.createEncodings(trail.coords);
            } else if (trail.coords.length < 990) { // take out every other second element
                for (var g = 1; g < trail.coords.length; g += 2) {
                    trail.coords.splice(g, 1)
                }
                polyline = polylineCtrl.createEncodings(trail.coords);
            } else { // make it fit 499
                let divideNum = Math.ceil(trail.coords.length / 499);
                for (var g = 1; g < trail.coords.length; g++) {
                    trail.coords.splice(g, divideNum)
                }
                polyline = polylineCtrl.createEncodings(trail.coords);
            }
            return polyline;
        }


        //----------------- API Calls ----------------//


        function getElevation(polyline, trail) {
            let samp = trail.coords.length;
            return axios.get('https://maps.googleapis.com/maps/api/elevation/json?path=enc:' + polyline + '&samples=' + samp + '&key=' + host.elevatationAPIkey)
                .then(response => {
                    if (response.data.status !== 'OK') return 'Error!';
                    return response.data.results;
                })
                .then(response => {
                    if (response === 'Error!') return 'Error!';
                    var elArr = [];
                    for (var i = 0; i < response.length; i++) {
                        elArr.push(response[i].elevation * 3.28084) // convert from meters to feet
                    }
                    trail.elevation_array = elArr;
                    return trail;
                })
        }


        function calculations(trail) {
            let sorted = trail.elevation_array.sort((a, b) => {
                return b - a;
            })
            let elevationChange = Math.round((sorted[0] - sorted[sorted.length - 1]) * 1000) / 1000;
            let distInFeet = trail.gis_miles * 5280;
            let radians = Math.atan(elevationChange / distInFeet);
            let ratio = radians * (180 / Math.PI);
            ratio = Math.round(ratio * 100) / 100;
            let arrParams = [elevationChange, ratio, trail.trail_id]
            return arrParams
        }

        //---------------------- difficulty ------------------------//

        function difficulty(dist, elevation) {
            dist = dist * 2;
            let diff = (((((elevation / (dist * 5280) * 100) * 5.5) + (Math.sqrt((dist * dist) * 6)))) / 2.5);
            final = Math.round(diff);
            return final;
        }


        //------------------------ time ----------------------------//

        function naismithTime(dist, elevation, mph) {
            dist = dist * 2;
            let time = (dist / mph) + (elevation / 2000)
            return Math.round(time * 60)
        }

    }



}