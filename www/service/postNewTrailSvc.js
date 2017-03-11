angular.module('trailsApp').service('postSvc', function ($http, $q, mainSvc) {

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