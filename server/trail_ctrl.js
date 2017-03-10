const app = require('./index');
const db = app.get('db');
const config = require('./config.js');
const axios = require('axios');
const querystring = require('querystring');

module.exports = {

    //----- read from search page ------//

    allTrails: function (req, res) {
        db.readAll(function (err, trails) {
            if (!err) {
                res.send(trails);
            }
        })
    },
    trailData: function (req, res) {
        db.readOneTrail(req.params.id, function (err, trail) {
            res.send(trail);
        })
    },
    byElevation: function (req, res) {
        db.readByElevation(function (err, elevations) {

        })
    },
    byDistance: function (req, res) {
        db.readByDistance(function (err, distances) {

        })
    },
    byTime: function (req, res) {
        db.readByTime(function (err, times) {

        })
    },
    byCity: function (req, res) {
        db.readByCity(function (err, cities) {

        })
    },
    byDifficulty: function (req, res) {
        db.readByDifficulty(function (err, difficulties) {

        })
    },

    //------------- saved trails -------------- //

    saveTrail: function (req, res) {
        db.updateSavedTrails(function (err, updated) {

        })
    },
    removeSavedTrail: function (req, res) {
        db.deleteSavedTrail(function (err, deleted) {

        })
    },

    //------------- completed trails --------------//

    completedTrail: function (req, res) {
        db.createCompletedTrail(function (err, completed) {

        })
    },

    //----------------- API Calls ----------------//

    elevation: function (req, res) {
        return axios.get('https://maps.googleapis.com/maps/api/elevation/json?path=enc:'+ req.query.polyline + '&samples=' + req.query.samp + '&key=' + config.elevatationAPIkey).then(response => {
                if (response.data.status !== 'OK') return 'Error!';
                return response.data.results;
            })
            .then(response => {
                if (response === 'Error!') return 'Error!';
                var elArr = [];
                for (var i = 0; i < response.length; i++) {
                    elArr.push(response[i].elevation * 3.28084) // convert from meters to feet
                }
                res.send(elArr); 
            })
    } 


}