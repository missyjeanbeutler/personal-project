angular.module('trailsApp').service('mainSvc', function ($http, polylineSvc, elevationSvc, loginSvc, $q) {

    this.allTrails = allTrails;
    this.trailData = trailData;
    let geojson;
    this.geojson = geojson;
    this.deleteTrail = deleteTrail;
    this.markCompleted = markCompleted;
    this.addToFavorites = addToFavorites;
    this.markCompletedFromTrailData = markCompletedFromTrailData;

    //-------------- all trails ---------------//

    allTrails()

    function allTrails() {
        return $http.get('/api/search').then(response => {
            let geo = []
            response.data.forEach(e => {
                e.coords = JSON.parse(e.coords);
                let lowerCase = e.trail_name.replace(/"/g, "").split(" ")
                for (let i = 0; i < lowerCase.length; i++) {
                    var w = lowerCase[i][0] + lowerCase[i].slice(1).toLowerCase()
                    lowerCase[i] = w;
                };
                e.trail_name = lowerCase.join(" ")
                geo.push({
                    "type": "Feature",
                    "properties": {
                        "name": `"${e.trail_name}"`,
                        "id": e.trail_id,
                        "difficulty": e.difficulty,
                        "elevation": e.elevation,
                        "incline": e.incline,
                        "time": e.time,
                        "distance": e.gis_miles
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": e.coords[0]
                    }
                })
            })
            var final = {
                    "type": "FeatureCollection",
                    "features": geo
                };

            return final
        })
    }

    //----------- single trail data ------------//

    function trailData(id) {
        return $http.get('/search/trail/' + id).then(response => {
            let trail = response.data[0]
            trail.coords = JSON.parse(trail.coords);
            let lowerCase = trail.trail_name.split(" ");
            for (let i = 0; i < lowerCase.length; i++) {
                var w = lowerCase[i][0] + lowerCase[i].slice(1).toLowerCase()
                lowerCase[i] = w;
            };
            trail.trail_name = lowerCase.join(" ").replace(/"/g, "");
            trail.time = Math.round((trail.time / 60) * 10) / 10
            let diff = trail.difficulty
            if(diff < 6) trail.difficulty = 'Easy';
            if(diff > 5 && diff < 11) trail.difficulty = 'Moderate';
            if(diff > 10 && diff < 17) trail.difficulty = 'Challenging';
            if(diff > 16 && diff < 23) trail.difficulty = 'Difficult';
            if(diff > 22) trail.difficulty = 'Very Difficult';
            return trail;
        }).then(response => {
            let deferred = $q.defer()
            deferred.resolve(getElevation(coordsLength(response), response))
            return deferred.promise;
        })
    }


    function coordsLength(trail) {
        if (trail.coords.length < 500) {
            polyline = polylineSvc.createEncodings(trail.coords);
        } else if (trail.coords.length < 640) { // take out every other third element
            for (var k = 1; k < trail.coords.length; k += 3) {
                trail.coords.splice(k, 1)
            }
            polyline = polylineSvc.createEncodings(trail.coords);
        } else if (trail.coords.length < 990) { // take out every other second element
            for (var g = 1; g < trail.coords.length; g += 2) {
                trail.coords.splice(g, 1)
            }
            polyline = polylineSvc.createEncodings(trail.coords);
        } else { // make it fit 499
            let divideNum = Math.ceil(trail.coords.length / 499);
            for (var g = 1; g < trail.coords.length; g++) {
                trail.coords.splice(g, divideNum)
            }
            polyline = polylineSvc.createEncodings(trail.coords);
        }
        return polyline;
    }


    function getElevation(polyline, trail) {    
        return elevationSvc.getTrailElevation(polyline, trail.coords.length)
            .then(response => {
                trail.elevation_array = response;
                return trail;
            })
    }

    //--------------- adjust trails lists for user ----------------//

    function deleteTrail(id) {
        return $http.delete('/api/deletefavorite/' + id)
            .then(response => {
                return response.data;
            })
    }

    function markCompleted(id) {
        return $http.put('/api/markcompleted/' + id).then(response => {
            return response.data;
        })
    }

    function addToFavorites(trailId) {
        return $http.get('/api/userid').then(response => {
            // if (!response) return "Not logged in";
            return $http.put('/api/addtofavorites/' + trailId)
                .then(response => {
                    if (response.status === 200) return response.data[0].trail_id;
                })
        }).catch(function(err) {
            return 'Not logged in'
        })

    }

    function markCompletedFromTrailData(trailId) {
        return $http.get('/api/userid').then(response => {
            // if (!response) return "Not logged in";
            return $http.put('/api/markcompleted/' + trailId).then(response => {
                return response.data[0].trail_id;
            })
        }).catch(function(err) {
            return 'Not logged in'
        })

    }



})