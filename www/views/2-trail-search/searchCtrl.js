angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc) {

    function allTrails() {
        if (mainSvc.trailNames) {
            $scope.trails = mainSvc.trailNames;
        } else {
            mainSvc.allTrails().then(response => {
                $scope.trails = response;
            })
        }
    }

    allTrails();



})