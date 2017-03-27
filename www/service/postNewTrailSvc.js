angular.module('trailsApp').service('postSvc', function ($http, $q, mainSvc) {

    // let trails;

    // this.updateTrail = (id) => {
        // let deferred = $q.defer()
        // if (mainSvc.trailNames) {
        //     trails = mainSvc.trailNames;
        //     callBackend(trails).then(response => {
        //         deferred.resolve(response)
        //     })
        // } else {
            // mainSvc.allTrails(id).then(response => {
                // trails = response;
                // callBackend(id).then(response => {
                    // console.log('1')
                    // deferred.resolve(response)
                    // return response;
                // })
            // })
        // }
        // return deferred.promise;
    // }

    this.callBackend =  (id) => {
        console.log('step 3')
        return $http.put('/api/updateTrail/' + id).then(response => {
            console.log('step 11')
            return response.data;
        })
    }

})