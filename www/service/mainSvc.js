angular.module('trailsApp').service('mainSvc', function ($http, polylineSvc, elevationSvc) {

    this.allTrails = allTrails;
    this.trailData = trailData;
    let geojson;
    this.geojson = geojson;
    this.deleteTrail = deleteTrail;
    this.markCompleted = markCompleted;

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
                        // id: e.trail_id,
                        // polyline: e.coords
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": e.coords[0]
                    }
                })
            })

            return geo;

            // geojson = JSON.stringify({
            //     type: "FeatureCollection",
            //     crs: {
            //         type: "name",
            //         // properties: {
            //         //     name: "urn:ogc:def:crs:OGC:1.3:CRS84"
            //         // }
            //     },
            //     features: geo
            // });
            // return geojson;
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

    function deleteTrail(trailId, userId) {
        return $http.delete('/api/deletefavorite/' + trailId + '/' + userId)
        .then(response => {
            return response.data;
        })
    }

    function markCompleted(trailId, userId) {
        return $http.put('/api/markcompleted', {
            trailId: trailId,
            userId: userId
        }).then(response => {
            return response.data;
        })
    }



})