angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc, $q) {

    function allTrails() {
        let deferred = $q.defer()
        if (mainSvc.trailNames) {
            $scope.trails = mainSvc.trailNames
            return deferred.resolve($scope.trails)
        } else {
            mainSvc.allTrails().then(response => {
                $scope.trails = response;
                return deferred.resolve($scope.trails)
            })
        }
        return deferred.promise;
    }

    allTrails().then(response => {

        let trails = response;

        //---------set map------------//

        let map = L.map('alltrails').setView([40.233845, -111.658531], 7);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA', {
            maxZoom: 18
        }).addTo(map);


        var cluster = L.markerClusterGroup({
            showCoverageOnHover: false,
        });

        for (var i = 0; i < trails.length; i++) {
            var marker = new L.marker([trails[i].coords[0][0], trails[i].coords[0][1]])
            .bindPopup(trails[i].trail_name)
            cluster.addLayer(marker);
        }

        map.addLayer(cluster)

        

    });

    

    $scope.difficulty = [];

    $scope.filterTrails = function () {
        console.log($scope.distance, $scope.height, $scope.difficulty, $scope.time)
        mainSvc.filterTrails($scope.distance, $scope.height, $scope.difficulty, $scope.time)
    }





})