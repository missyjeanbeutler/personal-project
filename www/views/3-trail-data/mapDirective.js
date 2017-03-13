angular.module('trailsApp')
    .directive('mapDirective', function () {
        return {
            restrict: 'E',
            templateUrl: './views/3-trail-data/map.html',
            controller: function ($scope) {
                $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVCXggIslnObF-rgqIyZzScfscjv_-o8I"

            }
        }
    })