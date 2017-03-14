angular.module('trailsApp')
    .directive('mapDirective', function () {
        return {
            restrict: 'E',
            templateUrl: './views/3-trail-data/map.html',
            controller: function ($scope) {
                // $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVCXggIslnObF-rgqIyZzScfscjv_-o8I"
                var map;
      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 13
        });
      }

            }
        }
    })