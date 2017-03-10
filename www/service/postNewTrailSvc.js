angular.module('trailsApp').service('postSvc', function($http, $q, polylineSvc, elevationSvc) {

    function trailData(id) {
        let deferred = $q.defer() 
        $http.get('/search/trail/' + id).then(response => {
            let trail = response.data[0]
            trail.coords = JSON.parse(trail.coords)
            let polyline = coordsLength(trail);
            getElevation(polyline, trail).then(response => {
                return deferred.resolve(response)
            })
        })
        return deferred.promise;
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