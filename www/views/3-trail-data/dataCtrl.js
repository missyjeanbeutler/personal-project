angular.module('trailsApp').controller('dataCtrl', function ($scope, $stateParams, mainSvc, postSvc) {

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

                //-------zoom into polyline--------//

                var bounds = coords.reduce(function (bounds, coord) {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(coords[0], coords[0]));

                map.fitBounds(bounds, {
                    padding: 40
                });

            });




        })
    }







})