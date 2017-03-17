const app = require('./index');
const db = app.get('db');
const config = require('./config.js');
const axios = require('axios');
const q = require('q');


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

    //---------- adjust trails lists for user -----------//

    deleteFavorite: function(req, res) {
        console.log(req.params.trailId, req.params.userId)
        db.deleteFavorite([req.params.trailId, req.params.userId], function(err, deleted) {
            if (!err) res.send(deleted)
        })
    },

    markCompleted: function(req, res) {
        console.log(req.body.trailId, req.body.userId)
        db.updateCompleted([req.body.trailId, req.body.userId], function(err, completed) {
            if (!err) res.send(completed)
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