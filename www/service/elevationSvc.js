angular.module('trailsApp').service('elevationSvc', function ($http){

    this.getTrailElevation = (polyline, samp) => {
        return $http.get('/api/googleAPIdata/?polyline=' + polyline + '&samp=' + samp).then(response => {
            return response.data;
        })
    }

})
