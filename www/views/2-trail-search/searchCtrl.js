angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc, $q, $state, $mdSidenav) {

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
            for (let i = 0; i < geo.features.length; i++) {
                var lowerCase = JSON.parse(geo.features[i].properties.name).split(" ");
                for (let i = 0; i < lowerCase.length; i++) {
                    var w = lowerCase[i][0] + lowerCase[i].slice(1).toLowerCase()
                    lowerCase[i] = w;
                };
                var obj = {
                    name: lowerCase.join(" ").replace(/\"/g, ""),
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

            map.addControl(new mapboxgl.GeolocateControl())


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
                            .setHTML('<p style="color:black; text-align: center;"><strong>TRAILHEAD</strong></p>' +
                                '<a style="color:black; text-align: center;">' + name + '</a>')
                            .addTo(map);
                    }

                    $scope.hidePopup = function () {
                        popup.remove();
                    }

                    $scope.trailListing = uniqueFeatures;
                    $scope.listNumber = uniqueFeatures.length;
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
                    .setHTML('<p style="color:black; text-align: center;"><strong>TRAILHEAD</strong></p>' +
                        '<a style="color:black; text-align: center;" href="#!/trail/' + feature.properties.id + '">' + feature.properties.name + '</a>')
                    .addTo(map);
            });

            //------------drop down search--------------//

            $scope.showList = function () {
                document.getElementById("dropdownList").classList.toggle("show")
            }

            window.onclick = function (event) {
                if (!event.target.matches('.dropbtn')) {

                    var dropdowns = document.getElementsByClassName("dropdown-content");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                            $('#drop-search').blur();
                        }
                    }
                }
            }

            //--------------button toggle--------------//

            $scope.filter = {};
            $scope.filter.difficulty = [];

            $scope.selected = function (e) {
                document.getElementById(e).classList.toggle("button-toggle")
                if ($scope.filter.difficulty.indexOf(e) === -1) {
                    $scope.filter.difficulty.push(e)
                } else {
                    $scope.filter.difficulty.splice($scope.filter.difficulty.indexOf(e), 1)
                }

            }

            //------------run filter -------------//

            $scope.filter.distance = 0;
            $scope.filter.time = 0;

            $scope.searchWithFilter = function () {
                let newFT = [];
                let dist = $scope.filter.distance;
                let time = $scope.filter.time * 60;
                let diff = $scope.filter.difficulty;
                let diffNums = []
                for (let i = 0; i < diff.length; i++) {
                    if (diff[i] === "easy") {
                        diffNums.push(0, 1, 2, 3, 4, 5)
                    }
                    if (diff[i] === "moderate") {
                        diffNums.push(6, 7, 8, 9, 10)
                    }
                    if (diff[i] === "challenging") {
                        diffNums.push(11, 12, 13, 14, 15, 16)
                    }
                    if (diff[i] === "hard") {
                        diffNums.push(17, 18, 19, 20, 21, 22)
                    }
                    if (diff[i] === "very hard") {
                        diffNums.push(23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34)
                    }
                }
                for (let i = 0; i < geojson.features.length; i++) {
                    let geo = geojson.features[i].properties;
                    if (JSON.parse(geo.distance) <= dist &&
                        geo.time <= time &&
                        diffNums.indexOf(geo.difficulty) !== -1) {
                        newFT.push(geojson.features[i])
                    }
                }
                let newGeojson = {
                    "type": "FeatureCollection",
                    "features": newFT
                }
                map.getSource('trails').setData(newGeojson)
                $mdSidenav('right').toggle()
                resetButton();
            }

            $scope.resetFilter = function () {
                map.getSource('trails').setData(geojson)
                $scope.filter.distance = 0;
                $scope.filter.time = 0;
                $scope.filter.difficulty.forEach((e) => {
                    document.getElementById(e).classList.toggle("button-toggle");
                })
                $scope.filter.difficulty = [];
                resetButton();

            }

            //------------ right side filter slide out ------------//

            $scope.openRightMenu = function () {
                $mdSidenav('right').toggle();
            };

            function resetButton() {
                let t = document.getElementsByClassName('advanced-search')
                var panel = document.getElementById('reset-button')
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                    document.getElementsByClassName('traillisting-container').style.top = '125px'
                } else {
                    panel.style.display = "block";
                    document.getElementsByClassName('traillisting-container').style.top = '175px'
                }
            }











        });





    });









})