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

    // $scope.distanceFilter = function() {

    // }

    // $scope.elevationFilter = function() {

    // }

    // $scope.difficultyFilter = function() {

    // }

    // $scope.timeFilter = function() {
    //     let time
    // }

    $scope.difficulty = [];

    $scope.filterTrails = function() {
        console.log($scope.distance, $scope.height, $scope.difficulty,$scope.time)
        mainSvc.filterTrails($scope.distance, $scope.height, $scope.difficulty,$scope.time)
    }



})