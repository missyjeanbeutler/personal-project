angular.module('trailsApp').service('mainSvc', function($http) {
    
    this.allTrails = allTrails;
    let trailNames;
    this.trailNames = trailNames;

    allTrails().then(response => {
        trailNames = response;
    })

    function allTrails() {
        return $http.get('/search').then(response => {
            return response.data;
        })
    }
    

})