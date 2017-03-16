angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc, $q, $state) {

    function allTrails() {
        let deferred = $q.defer()
        if (mainSvc.geojson) {
            // $scope.trails = mainSvc.trailNames
            return deferred.resolve(response)
        } else {
            mainSvc.allTrails().then(response => {
                // $scope.trails = response;
                return deferred.resolve(response)
            })
        }
        return deferred.promise;
    }



    allTrails().then(response => {

        let geojson = response;

        //---------set map------------//

        mapboxgl.accessToken = 'pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA';
        var map = new mapboxgl.Map({
            container: 'alltrails', // container id
            style: 'mapbox://styles/mapbox/dark-v9', //stylesheet location
            center: [-110.6585, 40.3338], // starting position
            zoom: 9 // starting zoom
        });



        map.on('load', function () {
            // Add a new source from our GeoJSON data and set the
            // 'cluster' option to true.
            map.addSource("trails", {
                type: "geojson",
                // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
                // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
                data: geojson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            // Use the earthquakes source to create five layers:
            // One for unclustered points, three for each cluster category,
            // and one for cluster labels.
            map.addLayer({
                "id": "unclustered-points",
                "type": "symbol",
                "source": "trails",
                "filter": ["!has", "point_count"],
                "layout": {
                    "icon-image": "marker-15"
                }
            });

            // Display the earthquake data in three layers, each filtered to a range of
            // count values. Each range gets a different fill color.
            var layers = [
                [150, '#f28cb1'],
                [20, '#f1f075'],
                [0, '#51bbd6']
            ];

            layers.forEach(function (layer, i) {
                map.addLayer({
                    "id": "cluster-" + i,
                    "type": "circle",
                    "source": "trails",
                    "paint": {
                        "circle-color": layer[1],
                        "circle-radius": 18
                    },
                    "filter": i === 0 ? [">=", "point_count", layer[0]] : ["all", [">=", "point_count", layer[0]],
                        ["<", "point_count", layers[i - 1][0]]
                    ]
                });
            });

            // Add a layer for the clusters' count labels
            map.addLayer({
                "id": "cluster-count",
                "type": "symbol",
                "source": "trails",
                "layout": {
                    "text-field": "{point_count}",
                    "text-font": [
                        "DIN Offc Pro Medium",
                        "Arial Unicode MS Bold"
                    ],
                    "text-size": 12
                }
            });
        });




    });









})