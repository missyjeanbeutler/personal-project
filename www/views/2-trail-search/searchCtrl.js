angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc, $q, $state) {

    function allTrails() {
        let deferred = $q.defer()
        if (mainSvc.geojson) {
            return deferred.resolve(response)
        } else {
            mainSvc.allTrails().then(response => {
                return deferred.resolve(response)
            })
        }
        return deferred.promise;
    }

    allTrails().then(response => {

        let geojson = response;
        $scope.nameList;

        function searchTrailNames(geo) {
            var nl = []
            for(let i = 0; i < geo.features.length; i++) {
                var obj = {
                    name: JSON.parse(geo.features[i].properties.name),
                    id: JSON.parse(geo.features[i].properties.id)
                }
                nl.push(obj)
            }
            $scope.nameList = nl;
        }

        searchTrailNames(geojson);


        //---------set map------------//

        mapboxgl.accessToken = 'pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA';
        var map = new mapboxgl.Map({
            container: 'alltrails', // container id
            style: 'mapbox://styles/missyjean/cj0bnm0ka00202rpbyll4nvzl', //stylesheet location
            center: [-110.6585, 40.3338], // starting position
            zoom: 9 // starting zoom
        });


        //------------clusters---------------//

        map.on('load', function () {
            map.addSource("trails", {
                type: "geojson",
                data: geojson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            map.addLayer({
                "id": "unclustered-points",
                "type": "symbol",
                "source": "trails",
                "filter": ["!has", "point_count"],
                "layout": {
                    "icon-image": "marker-15"
                }
            });

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
                

            // }); ORIGINAL

            //------------ geocoding ----------------//

            map.addControl(new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                position: "top-left"
            }));
            map.addControl(new mapboxgl.NavigationControl());


            //-------------- center on click  ----------------//

            map.on('click', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-points']
                });
                if (features.length) {
                    map.flyTo({
                        center: features[0].geometry.coordinates,
                        speed: 0.7
                    });
                }
            });


            map.on('mousemove', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-points', 'cluster-count']
                });
                map.getCanvas().style.cursor = features.length ? 'pointer' : '';
            });

            //-------------- center and zoom on click for clusters ----------------//

            map.on('click', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['cluster-count']
                });
                if (features.length) {
                    map.flyTo({
                        center: features[0].geometry.coordinates,
                        speed: 0.7,
                        zoom: map.getZoom() + 1
                    });
                }
            });

            //---------------- filter and list based on map view ----------------//


            var filteredTrails = [];

            var popup = new mapboxgl.Popup({
                closeButton: false
            });

            // var filterEl = document.getElementById('feature-filter'); // input bar

            function normalize(string) {
                return string.trim().toLowerCase();
            }

            function getUniqueFeatures(array, comparatorProperty) {
                var existingFeatureKeys = {};
                var uniqueFeatures = array.filter(function (el) {
                    if (existingFeatureKeys[el.properties[comparatorProperty]]) {
                        return false;
                    } else {
                        existingFeatureKeys[el.properties[comparatorProperty]] = true;
                        return true;
                    }
                });
                return uniqueFeatures;
            }



            map.on('render', function () {
                var features = map.queryRenderedFeatures({
                    layers: ['unclustered-points']
                });
                if (features) {
                    var uniqueFeatures = getUniqueFeatures(features, "name");
                    // Populate features for the listing overlay.
                    $scope.hoverList = function (coords, name) {
                        popup.setLngLat(coords)
                            .setHTML('<h3>TrailHead</h3>' +
                                '<h4>' + name + '</h4>')
                            .addTo(map);
                    }

                    $scope.hidePopup = function () {
                        popup.remove();
                    }

                    $scope.trailListing = uniqueFeatures;
                    $scope.$digest()

                    filteredTrails = uniqueFeatures;
                }
            });



            map.on('mousemove', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['unclustered-points']
                });
                if (!features.length) {
                    popup.remove();
                    return;
                }
                var feature = features[0];
                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(feature.geometry.coordinates)
                    .setHTML('<h3>TrailHead</h3>' +
                        '<a href="#!/trail/' + feature.properties.id + '"><h4>' + feature.properties.name + '</h4></a>')
                    .addTo(map);
            });

            // filterEl.addEventListener('keyup', function (e) {
            //     var value = normalize(e.target.value);
            //     // Filter visible features that don't match the input value.
            //     var filtered = filteredTrails.filter(function (feature) {
            //         var name = normalize(feature.properties.name);
            //         return name.indexOf(value) > -1;
            //     });
            //     $scope.trailListing = filtered;
            //     $scope.$digest()
            //     // Set the filter to populate features into the layer.
            //     map.setFilter('unclustered-points', ['in', 'name'].concat(filtered.map(function (feature) {
            //         return feature.properties.name;
            //     })));
                

            // });

        });





    });









})