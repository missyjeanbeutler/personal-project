const app = require('./index');
const db = app.get('db');
// const config = require('./config.js');
// const host = require('./config.js');
const host = process.env;
const axios = require('axios');
const q = require('q');


module.exports = {

    //----- read from search page ------//

    allTrails: function (req, res) {
        db.readAll(function (err, trails) {
            if (err) {
                console.log(err)
            } else {
                res.send(trails);
            }
        })
    },
    trailData: function (req, res) {
        db.readOneTrail(req.params.id, function (err, trail) {
            res.send(trail);
        })
    },

    elevationData: function (req, res) {
        let polyline = req.query.polyline;
        let samp = req.query.samp;
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
                return res.send(elArr);
            })

    },

    //---------- adjust trails lists for user -----------//

    deleteFavorite: function (req, res) {
        db.deleteFavorite([req.params.id, req.user.authid], function (err, deleted) {
            if (!err) {
                for (let i = 0; i < req.user.favorites.length; i++) {
                    if (req.user.favorites[i].trail_id === req.params.id) {
                        console.log('splicing!')
                        req.user.favorites.splice(i, 1);
                    }
                }
                res.send(deleted)
            }
        })
    },

    markCompleted: function (req, res) {
        db.updateCompleted([req.params.id, req.user.authid], function (err, completed) {
            if (!err) res.send(completed)
        })
    },

    addtofavorites: function (req, res) {
        db.updateFavorites([req.params.id, req.user.authid], function (err, added) {
            if (!err) res.send(added)
        })
    },



    //---------------------------------------------//
    //-------------- Backend Calls ----------------//
    //---------------------------------------------//

    trailDataWithPromise: function (id) {
        let deferred = q.defer()
        db.readOneTrail(id, function (err, trail) {
            return deferred.resolve(trail);
        })
        return deferred.promise;
    },


}