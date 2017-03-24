'use strict';

angular.module('trailsApp', ['ui.router', 'ngMaterial']).config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/');

    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'views/1-home/home.html',
        controller: 'homeCtrl'
    }).state('search', {
        url: '/search',
        templateUrl: 'views/2-trail-search/search.html',
        controller: 'searchCtrl'
    }).state('trail-data', {
        url: '/trail/:id',
        templateUrl: 'views/3-trail-data/data.html',
        controller: 'dataCtrl'
    }).state('profile', {
        url: '/profile',
        templateUrl: 'views/5-profile/profile.html',
        controller: 'mainCtrl',
        resolve: {
            authenticate: function authenticate(loginSvc, $state, $rootScope) {
                loginSvc.getUser().then(function (response) {
                    if (!response) {
                        console.log('not logged in');
                        event.preventDefault();
                        $state.go("login");
                    }
                });
            }
        }
    }).state('login', {
        url: '/login',
        templateUrl: 'views/4-login/login.html'
    });

    $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('trailsApp').controller('mainCtrl', function ($scope, mainSvc, $state, loginSvc, $mdSidenav) {

  //--------------- login/logout ----------------//

  function getUser() {
    loginSvc.getUser().then(function (response) {
      if (response) {
        $scope.user = response.data.username;
        $scope.favorites = response.data.favorites;
        $scope.completed = response.data.completed;
        $scope.photo = response.data.photo;
        var totalEl = userTotalElevation(response.data.completed);
        var totalMi = userTotalMiles(response.data.completed);
      } else {
        $scope.user = 'NOT LOGGED IN';
      }
      getLoginStatus();

      $scope.logout = loginSvc.logout;

      //------------ adjust favorites list -------------//

      $scope.deleteTrail = function (id) {
        mainSvc.deleteTrail(id).then(function (response) {
          for (var i = 0; i < $scope.favorites.length; i++) {
            if ($scope.favorites[i].trail_id === response[0].trail_id) {
              $scope.favorites.splice(i, 1);
            }
          }
        });
      };

      $scope.markCompleted = function (id) {
        mainSvc.markCompleted(id).then(function (response) {
          $scope.completed.push(response[0]);
        });
      };

      //-----------------fav/completed toggle-------------------------//

      $('#com').addClass('selected');
      $scope.section = true;
      $scope.selected = function (e) {
        $(e).addClass('selected');
        if (e === '#fav') {
          $('#com').removeClass('selected');
          $scope.section = false;
        } else {
          $('#fav').removeClass('selected');
          $scope.section = true;
        }
      };

      //---------------------------charts-----------------------------//

      var radius = 0;

      function makeComChart() {
        var ctx = document.getElementById("comChart").getContext('2d');
        var comChart = new Chart(ctx, {
          type: 'line',

          options: {
            legend: {
              display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              point: {
                radius: radius
              }
            },
            scales: {
              xAxes: [{
                display: false
              }],
              yAxes: [{
                gridLines: {
                  tickMarkLength: 0,
                  color: '#000'
                },
                ticks: {
                  padding: 15,
                  fontColor: '#000'
                }
              }]
            }
          },
          data: {
            labels: totalEl,
            datasets: [{
              data: totalEl,
              backgroundColor: "transparent",
              borderColor: "#000"
            }]
          }
        });
      };

      function makeDisChart() {
        var ctx = document.getElementById("disChart").getContext('2d');
        var comChart = new Chart(ctx, {
          type: 'line',

          options: {
            legend: {
              display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            elements: {
              point: {
                radius: radius
              }
            },
            scales: {
              xAxes: [{
                display: false
              }],
              yAxes: [{
                gridLines: {
                  tickMarkLength: 0,
                  color: '#000'
                },
                ticks: {
                  padding: 15,
                  fontColor: '#000'
                }
              }]
            }
          },
          data: {
            labels: totalMi,
            datasets: [{
              data: totalMi,
              backgroundColor: "transparent",
              borderColor: "#000"
            }]
          }
        });
      };

      $(document).ready(function () {
        makeDisChart();
        makeComChart();
      });

      //---------- disable profile button when not logged in --------- //


      function getLoginStatus() {
        if ($scope.user === 'NOT LOGGED IN') {
          document.getElementById('loginProfile').innerHTML = "<a href='/auth'>Login</a>";
          document.getElementById('logout').style.visibility = 'hidden';
        }
      }

      //---------------slide in nav bar -----------------//

      $scope.openLeftMenu = function () {
        $mdSidenav('left').toggle();
      };

      //--------------loading animation---------------//

      function onReady(callback) {
        var intervalID = window.setInterval(checkReady, 1000);

        function checkReady() {
          if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
          }
        }
      }

      function show(id, value) {
        document.getElementById(id).style.display = value ? 'block' : 'none';
      }

      onReady(function () {
        show('loading', false);
      });
    });
  }

  getUser();

  //----------------create totals-------------------//

  function userTotalElevation(obj) {
    var totals = [];
    for (var i = 0; i < obj.length; i++) {
      if (i > 0) {
        var num = JSON.parse(obj[i].elevation) + totals[i - 1];
        totals.push(num);
      } else {
        totals.push(JSON.parse(obj[i].elevation));
      }
    }
    return totals;
  }

  function userTotalMiles(obj) {
    var totals = [];
    for (var i = 0; i < obj.length; i++) {
      if (i > 0) {
        var num = JSON.parse(obj[i].gis_miles) + totals[i - 1];
        totals.push(num);
      } else {
        totals.push(JSON.parse(obj[i].gis_miles));
      }
    }
    return totals;
  }

  $scope.expand = false;

  //-------------------expand fav list--------------------//

  $scope.accordion = function (id) {
    var t = document.getElementById(id);
    t.classList.toggle("active");
    var panel = t.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  };
});
'use strict';

angular.module('trailsApp').controller('updateCtrl', function (postSvc) {

    function updateTrail() {
        postSvc.updateTrail().then(function (response) {
            console.log(response, ' this is the FRONT END!');
        });
    }

    // updateTrail();
});
'use strict';

angular.module('trailsApp').service('elevationSvc', function ($http) {

    this.getTrailElevation = function (polyline, samp) {
        return $http.get('/api/googleAPIdata/?polyline=' + polyline + '&samp=' + samp).then(function (response) {
            return response.data;
        });
    };
});
'use strict';

angular.module('trailsApp').service('loginSvc', function ($http) {

  this.updateFavorite = updateFavorite;
  this.updateCompleted = updateCompleted;

  function updateFavorite(id) {
    return $http.put('/api/updateFavoriteList/' + id).then(function (response) {
      return response;
    });
  }

  function updateCompleted(id) {
    return $http.put('/api/updateCompletedList/' + id).then(function (response) {
      return response;
    });
  }

  this.getUser = function () {
    return $http({
      method: 'GET',
      url: '/auth/me'
    }).then(function (res) {
      return res;
    }).catch(function (err) {
      console.log(err);
    });
  };

  this.logout = function () {
    return $http({
      method: 'GET',
      url: '/auth/logout'
    }).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.log(err);
    });
  };
});
'use strict';

angular.module('trailsApp').service('mainSvc', function ($http, polylineSvc, elevationSvc, loginSvc) {

    this.allTrails = allTrails;
    this.trailData = trailData;
    var geojson = void 0;
    this.geojson = geojson;
    this.deleteTrail = deleteTrail;
    this.markCompleted = markCompleted;
    this.addToFavorites = addToFavorites;
    this.markCompletedFromTrailData = markCompletedFromTrailData;

    //-------------- all trails ---------------//

    allTrails();

    function allTrails() {
        return $http.get('/api/search').then(function (response) {
            var geo = [];
            response.data.forEach(function (e) {
                e.coords = JSON.parse(e.coords);
                var lowerCase = e.trail_name.replace(/"/g, "").split(" ");
                for (var i = 0; i < lowerCase.length; i++) {
                    var w = lowerCase[i][0] + lowerCase[i].slice(1).toLowerCase();
                    lowerCase[i] = w;
                };
                e.trail_name = lowerCase.join(" ");
                geo.push({
                    "type": "Feature",
                    "properties": {
                        "name": '"' + e.trail_name + '"',
                        "id": e.trail_id,
                        "difficulty": e.difficulty,
                        "elevation": e.elevation,
                        "incline": e.incline,
                        "time": e.time,
                        "distance": e.gis_miles
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": e.coords[0]
                    }
                });
            });
            var final = {
                "type": "FeatureCollection",
                "features": geo
            };

            return final;
        });
    }

    //----------- single trail data ------------//

    function trailData(id) {
        return $http.get('/search/trail/' + id).then(function (response) {
            var trail = response.data[0];
            trail.coords = JSON.parse(trail.coords);
            var lowerCase = trail.trail_name.split(" ");
            for (var i = 0; i < lowerCase.length; i++) {
                var w = lowerCase[i][0] + lowerCase[i].slice(1).toLowerCase();
                lowerCase[i] = w;
            };
            trail.trail_name = lowerCase.join(" ").replace(/"/g, "");
            trail.time = Math.round(trail.time / 60 * 10) / 10;
            var diff = trail.difficulty;
            if (diff < 6) trail.difficulty = 'Easy';
            if (diff > 5 && diff < 11) trail.difficulty = 'Moderate';
            if (diff > 10 && diff < 17) trail.difficulty = 'Challenging';
            if (diff > 16 && diff < 23) trail.difficulty = 'Difficult';
            if (diff > 22) trail.difficulty = 'Very Difficult';
            return trail;
        });
    }

    function coordsLength(trail) {
        if (trail.coords.length < 500) {
            polyline = polylineSvc.createEncodings(trail.coords);
        } else if (trail.coords.length < 640) {
            // take out every other third element
            for (var k = 1; k < trail.coords.length; k += 3) {
                trail.coords.splice(k, 1);
            }
            polyline = polylineSvc.createEncodings(trail.coords);
        } else if (trail.coords.length < 990) {
            // take out every other second element
            for (var g = 1; g < trail.coords.length; g += 2) {
                trail.coords.splice(g, 1);
            }
            polyline = polylineSvc.createEncodings(trail.coords);
        } else {
            // make it fit 499
            var divideNum = Math.ceil(trail.coords.length / 499);
            for (var g = 1; g < trail.coords.length; g++) {
                trail.coords.splice(g, divideNum);
            }
            polyline = polylineSvc.createEncodings(trail.coords);
        }
        return polyline;
    }

    function getElevation(polyline, trail) {
        return elevationSvc.getTrailElevation(polyline, trail.coords.length).then(function (response) {
            trail.elevation_array = response;
            return trail;
        });
    }

    //--------------- adjust trails lists for user ----------------//

    function deleteTrail(id) {
        console.log(id);
        return $http.delete('/api/deletefavorite/' + id).then(function (response) {
            console.log(response);
            return response.data;
        });
    }

    function markCompleted(id) {
        return $http.put('/api/markcompleted/' + id).then(function (response) {
            return response.data;
        });
    }

    function addToFavorites(trailId) {
        return $http.get('/api/userid').then(function (response) {
            console.log(response);
            if (!response) return "Not logged in";
            return $http.put('/api/addtofavorites/' + trailId).then(function (response) {
                console.log(response);
                if (response.status === 200) return response.data[0].trail_id;
            });
        });
    }

    function markCompletedFromTrailData(trailId) {
        return $http.get('/api/userid').then(function (response) {
            console.log(response);
            if (!response) return "Not logged in";
            return $http.put('/api/markcompleted/' + trailId).then(function (response) {
                return response.data[0].trail_id;
            });
        });
    }
});
'use strict';

angular.module('trailsApp').service('polylineSvc', function () {

    this.createEncodings = function (input) {

        var coords = switchLatLong(input);
        var i = 0;

        var plat = 0;
        var plng = 0;

        var encoded_points = "";

        for (i = 0; i < coords.length; ++i) {
            var lat = coords[i][0];
            var lng = coords[i][1];

            encoded_points += encodePoint(plat, plng, lat, lng);

            plat = lat;
            plng = lng;
        }

        //----------Finished Polyline
        return encoded_points;
    };

    function encodePoint(plat, plng, lat, lng) {
        var late5 = Math.round(lat * 1e5);
        var plate5 = Math.round(plat * 1e5);

        var lnge5 = Math.round(lng * 1e5);
        var plnge5 = Math.round(plng * 1e5);

        dlng = lnge5 - plnge5;
        dlat = late5 - plate5;

        return encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
    };

    function encodeSignedNumber(num) {
        var sgn_num = num << 1;

        if (num < 0) {
            sgn_num = ~sgn_num;
        }

        return encodeNumber(sgn_num);
    };

    function encodeNumber(num) {
        var encodeString = "";

        while (num >= 0x20) {
            encodeString += String.fromCharCode((0x20 | num & 0x1f) + 63);
            num >>= 5;
        }

        encodeString += String.fromCharCode(num + 63);
        return encodeString;
    };

    function switchLatLong(cordArr) {
        var fixedLatLong = [];
        for (var d = 0; d < cordArr.length; d++) {
            fixedLatLong.push([cordArr[d][1], cordArr[d][0]]);
        }

        return fixedLatLong;
    };
});
'use strict';

angular.module('trailsApp').service('postSvc', function ($http, $q, mainSvc) {

    var trails = void 0;

    this.updateTrail = function (trails) {
        var deferred = $q.defer();
        if (mainSvc.trailNames) {
            trails = mainSvc.trailNames;
            callBackend(trails).then(function (response) {
                deferred.resolve(response);
            });
        } else {
            mainSvc.allTrails().then(function (response) {
                trails = response;
                callBackend(trails).then(function (response) {
                    deferred.resolve(response);
                });
            });
        }
        return deferred.promise;
    };

    function callBackend(trails) {
        return $http.put('/api/updateTrail', {
            trails: trails
        }).then(function (response) {
            return response.data;
        });
    }
});
'use strict';

angular.module('trailsApp').controller('homeCtrl', function () {

    //------------parallax scrolling effect----------//

    (function () {
        var parallax = document.querySelectorAll(".parallax"),
            speed = 0.5;
        window.onscroll = function () {
            [].slice.call(parallax).forEach(function (el, i) {
                var windowYOffset = window.pageYOffset,
                    elBackgrounPos = "50% " + windowYOffset * speed + "px";
                el.style.backgroundPosition = elBackgrounPos;
            });
        };
    })();

    //---------------fade in on scroll-----------//

    $(document).ready(function () {
        $('#home-3').css('opacity', 0);
        $('#home-4').css('opacity', 0);
        $('#home-5').css('opacity', 0);
        $('#home-6').css('opacity', 0);
        $('#home-7').css('opacity', 0);
        $('#home-3').waypoint(function () {
            $('#home-3').addClass('fadeInLeft');
        }, {
            offset: '60%'
        });
        $('#home-4').waypoint(function () {
            $('#home-4').addClass('fadeInRight');
        }, {
            offset: '60%'
        });
        $('#home-5').waypoint(function () {
            $('#home-5').addClass('fadeInLeft');
        }, {
            offset: '60%'
        });
        $('#home-6').waypoint(function () {
            $('#home-6').addClass('fadeInRight');
        }, {
            offset: '60%'
        });
        $('#home-7').waypoint(function () {
            $('#home-7').addClass('fadeInLeft');
        }, {
            offset: '60%'
        });
    });
});
'use strict';

angular.module('trailsApp').controller('searchCtrl', function ($scope, mainSvc, $q, $state, $mdSidenav) {

    function allTrails() {
        var deferred = $q.defer();
        if (mainSvc.geojson) {
            return deferred.resolve(response);
        } else {
            mainSvc.allTrails().then(function (response) {
                return deferred.resolve(response);
            });
        }
        return deferred.promise;
    }

    allTrails().then(function (response) {

        var geojson = response;
        $scope.nameList;

        function searchTrailNames(geo) {
            var nl = [];
            for (var i = 0; i < geo.features.length; i++) {
                var lowerCase = JSON.parse(geo.features[i].properties.name).split(" ");
                for (var _i = 0; _i < lowerCase.length; _i++) {
                    var w = lowerCase[_i][0] + lowerCase[_i].slice(1).toLowerCase();
                    lowerCase[_i] = w;
                };
                var obj = {
                    name: lowerCase.join(" ").replace(/\"/g, ""),
                    id: JSON.parse(geo.features[i].properties.id)
                };
                nl.push(obj);
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

            var layers = [[150, '#f28cb1'], [20, '#f1f075'], [0, '#51bbd6']];

            layers.forEach(function (layer, i) {
                map.addLayer({
                    "id": "cluster-" + i,
                    "type": "circle",
                    "source": "trails",
                    "paint": {
                        "circle-color": layer[1],
                        "circle-radius": 18
                    },
                    "filter": i === 0 ? [">=", "point_count", layer[0]] : ["all", [">=", "point_count", layer[0]], ["<", "point_count", layers[i - 1][0]]]
                });
            });

            map.addLayer({
                "id": "cluster-count",
                "type": "symbol",
                "source": "trails",
                "layout": {
                    "text-field": "{point_count}",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
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

            map.addControl(new mapboxgl.GeolocateControl());

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
                        popup.setLngLat(coords).setHTML('<p style="color:black; text-align: center;"><strong>TRAILHEAD</strong></p>' + '<a style="color:black; text-align: center;">' + name + '</a>').addTo(map);
                    };

                    $scope.hidePopup = function () {
                        popup.remove();
                    };

                    $scope.trailListing = uniqueFeatures;
                    $scope.listNumber = uniqueFeatures.length;
                    $scope.$digest();

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
                popup.setLngLat(feature.geometry.coordinates).setHTML('<p style="color:black; text-align: center;"><strong>TRAILHEAD</strong></p>' + '<a style="color:black; text-align: center;" href="#!/trail/' + feature.properties.id + '">' + feature.properties.name + '</a>').addTo(map);
            });

            //------------drop down search--------------//

            $scope.showList = function () {
                document.getElementById("dropdownList").classList.toggle("show");
            };

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
            };

            //--------------button toggle--------------//

            $scope.filter = {};
            $scope.filter.difficulty = [];

            $scope.selected = function (e) {
                document.getElementById(e).classList.toggle("button-toggle");
                if ($scope.filter.difficulty.indexOf(e) === -1) {
                    $scope.filter.difficulty.push(e);
                } else {
                    $scope.filter.difficulty.splice($scope.filter.difficulty.indexOf(e), 1);
                }
            };

            //------------run filter -------------//

            $scope.filter.distance = 0;
            $scope.filter.time = 0;

            $scope.searchWithFilter = function () {
                var newFT = [];
                var dist = $scope.filter.distance;
                var time = $scope.filter.time * 60;
                var diff = $scope.filter.difficulty;
                var diffNums = [];
                for (var i = 0; i < diff.length; i++) {
                    if (diff[i] === "easy") {
                        diffNums.push(0, 1, 2, 3, 4, 5);
                    }
                    if (diff[i] === "moderate") {
                        diffNums.push(6, 7, 8, 9, 10);
                    }
                    if (diff[i] === "challenging") {
                        diffNums.push(11, 12, 13, 14, 15, 16);
                    }
                    if (diff[i] === "hard") {
                        diffNums.push(17, 18, 19, 20, 21, 22);
                    }
                    if (diff[i] === "very hard") {
                        diffNums.push(23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34);
                    }
                }
                for (var _i2 = 0; _i2 < geojson.features.length; _i2++) {
                    var geo = geojson.features[_i2].properties;
                    if (JSON.parse(geo.distance) <= dist && geo.time <= time && diffNums.indexOf(geo.difficulty) !== -1) {
                        newFT.push(geojson.features[_i2]);
                    }
                }
                newGeojson = {
                    "type": "FeatureCollection",
                    "features": newFT
                };
                map.getSource('trails').setData(newGeojson);
                $mdSidenav('right').toggle();
                resetButton();
            };

            $scope.resetFilter = function () {
                map.getSource('trails').setData(geojson);
                $scope.filter.distance = 0;
                $scope.filter.time = 0;
                $scope.filter.difficulty.forEach(function (e) {
                    document.getElementById(e).classList.toggle("button-toggle");
                });
                $scope.filter.difficulty = [];
                resetButton();
            };

            //------------ right side filter slide out ------------//

            $scope.openRightMenu = function () {
                $mdSidenav('right').toggle();
            };

            function resetButton() {
                var t = document.getElementsByClassName('advanced-search');
                var panel = document.getElementById('reset-button');
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            }
        });
    });
});
'use strict';

angular.module('trailsApp').controller('dataCtrl', function ($scope, $stateParams, mainSvc, postSvc, loginSvc) {

    trailData($stateParams.id);
    toggleFavorite();

    function trailData(id) {
        mainSvc.trailData(id).then(function (response) {
            $scope.trail = response;
            var coords = response.coords;
            var middle = response.coords[Math.round(response.coords.length / 2)];

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
                });

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
                // map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

                if (!features.length) {
                    popup.remove();
                    return;
                }

                var feature = features[0];

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(feature.geometry.coordinates).setHTML(feature.properties.description).addTo(map);
            });
        });
    }

    //-------------adjust user lists--------------//


    $scope.fav = true;
    $scope.rem = false;

    $scope.addToFavorites = function () {
        mainSvc.addToFavorites($stateParams.id).then(function (response) {
            if (response !== 'Not logged in') {
                loginSvc.updateFavorite(response).then(function (response) {
                    $scope.fav = false;
                    $scope.rem = true;
                });
            } else console.log(response);
        });
    };

    $scope.markCompletedFromTrailData = function () {
        mainSvc.markCompletedFromTrailData($stateParams.id).then(function (response) {
            if (response !== 'Not logged in') {
                loginSvc.updateCompleted(response).then(function (response) {
                    if (response.status === 200) {
                        console.log(response, ' added!');
                    }
                });
            } else console.log(response);
        });
    };

    //----------disable favorite button----------//

    function toggleFavorite() {
        loginSvc.getUser().then(function (response) {
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
        });
    }

    $scope.deleteTrail = function () {
        mainSvc.deleteTrail($stateParams.id).then(function (response) {
            loginSvc.updateFavorite(response).then(function (response) {
                $scope.fav = true;
                $scope.rem = false;
            });
        });
    };
});