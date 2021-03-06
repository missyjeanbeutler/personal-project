angular.module('trailsApp').controller('dataCtrl', function ($scope, $stateParams, mainSvc, loginSvc) {

    trailData($stateParams.id)
    toggleFavorite()

    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            $scope.trail = response;
            let coords = response.coords;
            let middle = response.coords[Math.round(response.coords.length / 2)]
            makeDataChart(response.elevation_array)

            //--------- create map -----------//

            mapboxgl.accessToken = 'pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA';
            var map = new mapboxgl.Map({
                container: 'trailmap', // container id
                style: 'mapbox://styles/missyjean/cj0bnm0ka00202rpbyll4nvzl', //stylesheet location
                center: [middle[0], middle[1]], // starting position
                zoom: 9 // starting zoom
            });

            //-----------directions------------//

            $scope.directions = "https://www.google.com/maps/preview/dir//'" + coords[0][1] + "," + coords[0][0] + "'/@" + coords[0][1] + "," + coords[0][0] + ",12z";

            //------------polyline-------------//

            map.on('load', function () {

                map.addLayer({
                    "id": "route",
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "LineString",
                                "coordinates": coords
                            }
                        }
                    },
                    "layout": {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    "paint": {
                        "line-color": "#7edccc",
                        "line-width": 2
                    }
                });

                map.addLayer({
                    "id": "route-point",
                    "type": "symbol",
                    "source": {
                        "type": "geojson",
                        "data": {
                            "type": "Feature",
                            "properties": {
                                "description": "<strong>Trailhead</strong><p><a href=\"https://www.google.com/maps/preview/dir//'" + coords[0][1] + "," + coords[0][0] + "'/@" + coords[0][1] + "," + coords[0][0] + ",12z\" target=\"_blank\">Click here for directions</a>"
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": coords[0]
                            }
                        }

                    },
                    "layout": {
                        "icon-image": "marker-15"
                    }
                })

                //-------zoom into polyline--------//

                var bounds = coords.reduce(function (bounds, coord) {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(coords[0], coords[0]));

                map.fitBounds(bounds, {
                    padding: 40
                });

            });

            //----------pop up-------------//

            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on('mousemove', function (e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: ['route-point']
                });

                if (!features.length) {
                    popup.remove();
                    return;
                }

                var feature = features[0];

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(feature.geometry.coordinates)
                    .setHTML(feature.properties.description)
                    .addTo(map);
            });

        })
    }

    //-------------adjust user lists--------------//


    $scope.fav = true;
    $scope.rem = false;

    $scope.addToFavorites = function () {
        mainSvc.addToFavorites($stateParams.id).then(response => {
            if (response !== 'Not logged in') {
                loginSvc.updateFavorite(response).then(response => {
                    $scope.fav = false;
                    $scope.rem = true;

                })
            } else {
                alert('not logged in')
            }
        })
    }

    $scope.markCompletedFromTrailData = function () {
        mainSvc.markCompletedFromTrailData($stateParams.id).then(response => {
            if (response !== 'Not logged in') {
                loginSvc.updateCompleted(response).then(response => {
                    if (response.status === 200) {
                        console.log(response, ' added!')
                    }
                })
            } else {
                alert('not logged in')
            }
        })
    }

    //----------disable favorite button----------//

    function toggleFavorite() {
        loginSvc.getUser().then(response => {
            if (response) {
                for (var i = 0; i < response.data.favorites.length; i++) {
                    if (response.data.favorites[i].trail_id === $stateParams.id) {
                        $scope.fav = false;
                        $scope.rem = true;
                        return;
                    }
                }
                $scope.fav = true;
                $scope.rem = false;
            }

        })
    }

    $scope.deleteTrail = function () {
        mainSvc.deleteTrail($stateParams.id).then(response => {
            loginSvc.updateFavorite(response).then(response => {
                $scope.fav = true;
                $scope.rem = false;

            })
        })
    }

    //-----------------elevation chart------------------//

function makeDataChart(elData) {
            var ctx = document.getElementById('elevationChart').getContext('2d');          
            var myChart = new Chart(ctx, {
                type: 'line',

                options: {
                    legend: {
                        display: false,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        point: {
                            radius: 0
                        }
                    },
                scales: {
                    xAxes: [{
                        display: false,
                    }],
                    yAxes: [{
                        gridLines: {
                            tickMarkLength: 0,
                            color: '#000',
                        },
                        ticks: {
                            padding: 15,
                            fontColor: '#000'
                        }
                    }],
                }
                },
                data: {
                    labels: elData,
                    datasets: [{
                        data: elData,
                        backgroundColor: "#171d1f",
                    }]
                }
            });
            
        };

        //---------- expand elevation chart -----------//


        $scope.expandElMap = function() {
            let cc = document.getElementById('cc');
            if (cc.classList.contains('expanded-el-map')) {
                cc.classList.remove('expanded-el-map');
            } else {
                cc.classList.add('expanded-el-map');
            }
        }
        









})