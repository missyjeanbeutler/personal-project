angular.module('trailsApp').controller('dataCtrl', function ($scope, $stateParams, mainSvc, postSvc) {

    trailData($stateParams.id)




    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            response.time = Math.round((response.time / 60) * 10) / 10;
            $scope.trail = response;
            response.coords = path(JSON.parse(response.coords))
            let coords = response.coords;
            let middle = response.coords[Math.round(response.coords.length / 2)]

            //--------- create map -----------//

            let map = L.map('trailmap').setView([middle[0], middle[1]], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA', {
                maxZoom: 18,
                id: 'your.mapbox.project.id',
                accessToken: 'pk.eyJ1IjoibWlzc3lqZWFuIiwiYSI6ImNqMDl4Zjh0dTBmZTQycXI3M2YyYjh4dnMifQ.p6Wiw8UO6txJFl6lAvGRBA'
            }).addTo(map);

            //----------- markers -----------//

            var trailhead = L.marker([coords[0][0], coords[0][1]]).addTo(map)
            var trailend = L.marker([coords[coords.length - 1][0], coords[coords.length - 1][1]]).addTo(map)

            var markers = new L.featureGroup([trailhead, trailend]);
            map.fitBounds(markers.getBounds());

            //---------- polyline -------------//

            var latlngs = coords;
            var polyline = L.polyline(latlngs, {
                color: 'red'
            }).addTo(map);
            // zoom the map to the polyline
            map.fitBounds(polyline.getBounds());


        })
    }






    function path(coords) {
        let fixedLatLong = []
        for (let i = 0; i < coords.length; i++) {
            fixedLatLong.push([coords[i][1], coords[i][0]])
        }
        return fixedLatLong;
    }





})