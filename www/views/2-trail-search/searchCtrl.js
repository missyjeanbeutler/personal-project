angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc, $q, $state) {

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

        let map = L.map('alltrails', {
            zoomControl: false
        }).setView([40.233845, -111.658531], 7);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA', {
            maxZoom: 18
        }).addTo(map);

        //----------change side of zoom control------------//

        L.control.zoom({
            position: 'topright'
        }).addTo(map);


        //-------cluster groups-------//

        var cluster = L.markerClusterGroup({
            showCoverageOnHover: false,
        });


        trails.forEach(trail => {
            let marker = L.marker([trail.coords[0][0], trail.coords[0][1]], {
                title: trail.trail_name,
            });
            cluster.addLayer(marker);
        })


        map.addLayer(cluster)

        cluster.on('mouseover', function (e) {
            console.log(e.latlng)

        })

        //--------list trails in map view----------//


        var list = new L.Control.ListMarkers({
            layer: cluster,
            itemIcon: null,
            // position: 'middleleft',
            // label: this.trail_name
        });

        list
            .on('item-mouseover', function (e) {
                e.layer.setIcon(L.icon({
                    iconUrl: '../images/select-marker.png'
                }))
            })
            .on('item-mouseout', function (e) {
                e.layer.setIcon(L.icon({
                    iconUrl: L.Icon.Default.imagePath + '/marker-icon.png'
                }))
            })
            .on('item-click', function (e) {
                console.log('wwwhhhyyy')
                $state.go('trail-data', {
                    id: this.trail_id
                });
            }, this)



        map.addControl(list);



    });



    $scope.difficulty = [];

    $scope.filterTrails = function () {
        console.log($scope.distance, $scope.height, $scope.difficulty, $scope.time)
        mainSvc.filterTrails($scope.distance, $scope.height, $scope.difficulty, $scope.time)
    }





})