angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc) {

    function allTrails() {
        if (mainSvc.trailNames) {
            $scope.trails = mainSvc.trailNames;
            console.log($scope.trails, ' 1')
        } else {
            mainSvc.allTrails().then(response => {
                $scope.trails = response;
            console.log($scope.trails, ' 2')
                
            })
        }
    }

    allTrails();

    $scope.filterButtons = function() {
        
    }

    $scope.difficulty = [];

    $scope.filterTrails = function() {
        console.log($scope.distance, $scope.height, $scope.difficulty,$scope.time)
        mainSvc.filterTrails($scope.distance, $scope.height, $scope.difficulty,$scope.time)
    }

    //--map

    let map = L.map('alltrails').setView([40, -120], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA', {
                maxZoom: 18,
                id: 'your.mapbox.project.id',
                accessToken: 'pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA'
            }).addTo(map);


})