angular.module('trailsApp').service('mainSvc', function ($http, polylineSvc, elevationSvc, loginSvc) {

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
            response.data[0].coords = JSON.parse(response.data[0].coords);
            return response.data[0];
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
        console.log(id)
        return $http.delete('/api/deletefavorite/' + id)
            .then(response => {
                console.log(response)
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
            console.log(response)
            if (!response) return "Not logged in";
            return $http.put('/api/addtofavorites/' + trailId)
                .then(response => {
                    console.log(response)
                    if (response.status === 200) return response.data[0].trail_id;
                })
        })

    }

    function markCompletedFromTrailData(trailId) {
        return $http.get('/api/userid').then(response => {
            console.log(response)
            if (!response) return "Not logged in";
            return $http.put('/api/markcompleted/' + trailId).then(response => {
                return response.data[0].trail_id;
            })
        })

    }



})