angular.module('trailsApp').controller('dataCtrl', function($scope, $stateParams, mainSvc, postSvc, NgMap) {

    trailData($stateParams.id)

    function trailData(id) {
        mainSvc.trailData(id).then(response => {
            response.time = Math.round((response.time / 60) * 10) / 10;
            $scope.trail = response;
            response.coords = path(JSON.parse(response.coords))
            $scope.path = response.coords;
            let middle = response.coords[Math.round(response.coords.length / 2)]
            $scope.center = middle[0] + ',' + middle[1];
            $scope.trailhead = $scope.path[0][0] + ',' + $scope.path[0][1];
            $scope.trailend = $scope.path[$scope.path.length - 1][0] + ',' + $scope.path[$scope.path.length - 1][1];
        })
    }

    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAVCXggIslnObF-rgqIyZzScfscjv_-o8I"

    // NgMap.getMap().then(function (map) {
    //     console.log(map.getCenter());
    //     console.log('markers', map.markers);
    //     console.log('shapes', map.shapes);

    // })

$scope.styles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#004358"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1f8a70"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1f8a70"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fd7400"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1f8a70"
            },
            {
                "lightness": -20
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1f8a70"
            },
            {
                "lightness": -17
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "visibility": "on"
            },
            {
                "weight": 0.9
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1f8a70"
            },
            {
                "lightness": -10
            }
        ]
    },
    {},
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#1f8a70"
            },
            {
                "weight": 0.7
            }
        ]
    }
]


    function path(coords) {
            let fixedLatLong = []
            for (let i = 0; i < coords.length; i++) {
                fixedLatLong.push([coords[i][1], coords[i][0]])
            }
            return fixedLatLong;
        }

    

    

})