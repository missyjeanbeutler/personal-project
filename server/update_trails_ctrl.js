const app = require('./index');
const db = app.get('db');
const config = require('./config.js');
const axios = require('axios');
const q = require('q');
const polylineCtrl = require('./polyline_ctrl')
const controller = require('./trail_ctrl')

module.exports = {

    updateTrail: function (req, res, next) {
        let trails = req.body.trails;
        // for (let i = 7; i < 1; i++) {
        //     if (trails[i].trail_id) {
        startUpdate(trails[30].trail_id)


        // } 
        // }



        //---------- elevation data ------------//

        function startUpdate(id) {
            controller.trailDataWithPromise(id)
                .then(response => {
                    let trail = response[0]
                    trail.coords = JSON.parse(trail.coords)
                    let polyline = coordsLength(trail);
                    return [polyline, trail]; 
                })
                .then(data => {
                    return getElevation(data[0], data[1]).then(response => {
                        return response;
                    })
                })
                .then(response => {
                        let arrayToSend = calculations(response)
                        console.log(arrayToSend, ' post calculations')
                        db.UPDATEtrailInfo(arrayToSend, function (err, updated) {
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
            let ratio = Math.asin(elevationChange / distInFeet);
            if (isNaN(ratio)) ratio = Math.asin(distInFeet / elevationChange)
            ratio = Math.round((ratio * 100) * 10000) / 10000;
            let arrParams = [elevationChange, ratio, trail.trail_id]
            return arrParams
        }
    }
}