angular.module('trailsApp').service('mainSvc', function($http, polylineSvc, elevationSvc) {
    
    this.allTrails = allTrails;
    let trailNames;
    this.trailNames = trailNames;
    this.trailData = trailData;
    this.filterTrails = filterTrails;

    //-------------- all trails ---------------//

    allTrails().then(response => {
        trailNames = response;
    })

    function allTrails() {
        return $http.get('/api/search').then(response => {
            for(let i = 0; i < response.data.length; i++) {
                response.data[i].coords = fixLatLong(JSON.parse(response.data[i].coords))
            }
            return response.data;
        })
    }

    function fixLatLong(coords) {
        let fixedLatLong = []
        for (let i = 0; i < coords.length; i++) {
            fixedLatLong.push([coords[i][1], coords[i][0]])
        }
        return fixedLatLong;
    }

    //------------- filter trails --------------//

    function filterTrails() {

    }



    //----------- single trail data ------------//

    function trailData(id) {
        return $http.get('/search/trail/' + id).then(response => {
            response.data[0].coords = fixLatLong(JSON.parse(response.data[0].coords));
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


    

})