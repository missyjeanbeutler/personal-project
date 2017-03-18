angular.module('trailsApp').controller('dataCtrl', function ($scope, $stateParams, mainSvc, postSvc, loginSvc) {

    trailData($stateParams.id)




    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            response.time = Math.round((response.time / 60) * 10) / 10;
            $scope.trail = response;
            let coords = response.coords;
            let middle = response.coords[Math.round(response.coords.length / 2)]

            //--------- create map -----------//

            mapboxgl.accessToken = 'pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA';
            var map = new mapboxgl.Map({
                container: 'trailmap', // container id
                style: 'mapbox://styles/missyjean/cj0bnm0ka00202rpbyll4nvzl', //stylesheet location
                center: [middle[0], middle[1]], // starting position
                zoom: 9 // starting zoom
            });

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

map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ['route-point'] });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

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

//-------------adjust user lists--------------//

$scope.addToFavorites = function(trailId) {
    mainSvc.addToFavorites(trailId).then(response => {
        if (response !== 'Not logged in') {
            loginSvc.updateFavorite(response)
            console.log(response, ' added!')
        } else console.log(response)
    })
}

$scope.markCompletedFromTrailData = function(trailId) {
    mainSvc.markCompletedFromTrailData(id).then(response => {
      if (response !== 'Not logged in') {
            loginSvc.updateCompleted(response)
            console.log(response, ' added!')
        } else console.log(response)
    })
}



        })
    }







})