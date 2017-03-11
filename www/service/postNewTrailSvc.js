angular.module('trailsApp').service('postSvc', function($http, $q, mainSvc) {

    // this.updateEndpoint = updateEndpoint;
    // this.startUpdate = startUpdate;


    // //---------- elevation data ------------//

    // function startUpdate(id) {
    //     let deferred = $q.defer() 
    //     $http.get('/search/trail/' + id).then(response => {
    //         let trail = response.data[0]
    //         if(!trail.coords) return deferred.resolve('No data');
    //         trail.coords = JSON.parse(trail.coords)
    //         let polyline = coordsLength(trail);
    //         getElevation(polyline, trail).then(response => {
    //             return deferred.resolve(response)
    //         })
    //     })
    //     return deferred.promise;
    // }


    // function coordsLength(trail) {

    //     if (trail.coords.length < 500) {
    //         polyline = polylineSvc.createEncodings(trail.coords);
    //     } else if (trail.coords.length < 640) { // take out every other third element
    //         for (var k = 1; k < trail.coords.length; k += 3) {
    //             trail.coords.splice(k, 1)
    //         }
    //         polyline = polylineSvc.createEncodings(trail.coords);
    //     } else if (trail.coords.length < 990) { // take out every other second element
    //         for (var g = 1; g < trail.coords.length; g += 2) {
    //             trail.coords.splice(g, 1)
    //         }
    //         polyline = polylineSvc.createEncodings(trail.coords);
    //     } else { // make it fit 499
    //         let divideNum = Math.ceil(trail.coords.length / 499);
    //         for (var g = 1; g < trail.coords.length; g++) {
    //             trail.coords.splice(g, divideNum)
    //         }
    //         polyline = polylineSvc.createEncodings(trail.coords);
    //     }
    //     return polyline;
    // }


    // function getElevation(polyline, trail) {
    //     return elevationSvc.getTrailElevation(polyline, trail.coords.length)
    //         .then(response => {
    //             trail.elevation_array = response;
    //             return trail;
    //         }) 
    // }

    // //------------- update API ----------------//

    // function updateEndpoint(elevationChange, ratio, id) {
    //     return $http.put('/api/updateTrail', {
    //         elevationChange: elevationChange,
    //         ratio: ratio,
    //         id: id
    //     })
    //     .then(response => {
    //         return response.data;
    //     })
    // }

    let trails;

    this.updateTrail = (trails) => {
        let deferred = $q.defer()
        if (mainSvc.trailNames) {
            trails = mainSvc.trailNames;
            callBackend(trails).then(response => {
                deferred.resolve(response)
            })
        } else {
            mainSvc.allTrails().then(response => {
                trails = response;
                callBackend(trails).then(response => {
                    deferred.resolve(response)
                })
            })
        }
        return deferred.promise;
    }

    function callBackend(trails) {
        return $http.put('/api/updateTrail', {
            trails: trails
        }).then(response => {
            return response.data;
        })
    }

})