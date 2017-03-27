const app = require('./index');
const db = app.get('db');
const config = require('./config.js');
const axios = require('axios');
const q = require('q');
const polylineCtrl = require('./polyline_ctrl')
const controller = require('./trail_ctrl')
// const host = process.env;

module.exports = {

    updateTrail: function (req, res, next) {
        // let trails = req.body.trails;
        // for (let i = 8; i <= 20; i++) {
            console.log('step 4')
        startUpdate(req.params.id)
        // } 




        //---------- elevation data ------------//

        function startUpdate(id) {
            console.log('step 5')
            controller.trailDataWithPromise(id)
                .then(response => {
                    let trail = response[0]
                    trail.coords = JSON.parse(trail.coords)
                    let polyline = coordsLength(trail);
                    return [polyline, trail];
                    console.log('step 6')
                })
                .then(data => {
                    console.log('step 7')
                    return getElevation(data[0], data[1]).then(response => {
                        console.log('step 8')
                        return response;
                    })
                })
                .then(response => {
                    console.log('step 9')
                    let arrayToSend = calculations(response)
                    let diff = difficulty(response.gis_miles, arrayToSend[0]);
                    let time = naismithTime(response.gis_miles, arrayToSend[0], 2.5);
                    // let gradient = Math.round((arrayToSend[0]/(response.gis_miles * 5280))); // fix tabe so you don't have to round anymore
                    arrayToSend.push(diff, time);
                    console.log(arrayToSend, ' post calculations')
                    db.UPDATEtrailInfo(arrayToSend, function (err, updated) {
                        console.log('step 10')
                        if (err) return next(err);
                        else return res.send('updated!');
                    })
                });
        }


        function coordsLength(trail) {

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
            console.log('elevation 1')
            let samp = trail.coords.length;
            return axios.get('https://maps.googleapis.com/maps/api/elevation/json?path=enc:' + polyline + '&samples=' + samp + '&key=' + config.elevatationAPIkey)
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