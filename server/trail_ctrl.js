const app = require('./index');
const db = app.get('db');

module.exports = {

    //----- read from search page ------//

    allTrails: function(req, res) {
        db.readAll(function(err, trails) {
            if(!err) {
                res.send(trails);
            }
        })
    },
    trailData: function(req, res) {
        db.readOneTrail(function(err, trail) {

        })
    },
    byElevation: function(req, res) {
        db.readByElevation(function(err, elevations) {

        })
    },
    byDistance: function(req, res) {
        db.readByDistance(function(err, distances) {

        })
    },
    byTime: function(req, res) {
        db.readByTime(function(err, times) {

        })
    },
    byCity: function(req, res) {
        db.readByCity(function(err, cities) {

        })
    },
    byDifficulty: function(req, res) {
        db.readByDifficulty(function(err, difficulties) {

        })
    },

    //------------- saved trails -------------- //

    saveTrail: function(req, res) {
        db.updateSavedTrails(function(err, updated) {

        })
    },
    removeSavedTrail: function(req, res) {
        db.deleteSavedTrail(function(err, deleted) {

        })
    },

    //------------- completed trails --------------//

    completedTrail: function(req, res) {
        db.createCompletedTrail(function(err, completed) {
            
        })
    }
     

}