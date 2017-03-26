angular.module('trailsApp').controller('mainCtrl', function ($scope, mainSvc, $state, loginSvc, $mdSidenav) {


  //--------------- login/logout ----------------//

  function getUser() {
    loginSvc.getUser().then((response) => {
      if (response) {
        $scope.user = response.data.username;
        $scope.favorites = response.data.favorites;
        $scope.completed = response.data.completed;
        $scope.photo = response.data.photo
        console.log(response.data)
        var totalEl = userTotalElevation(response.data.completed)
        var totalMi = userTotalMiles(response.data.completed)

      } else {
        $scope.user = 'NOT LOGGED IN';
        console.log($scope.user)
      }
      getLoginStatus();



      $scope.logout = loginSvc.logout;


      //------------ adjust favorites list -------------//

      $scope.deleteTrail = function (id) {
        mainSvc.deleteTrail(id).then(response => {
          for (let i = 0; i < $scope.favorites.length; i++) {
            if ($scope.favorites[i].trail_id === response[0].trail_id) {
              $scope.favorites.splice(i, 1);
            }
          }
        })
      }

      $scope.markCompleted = function (id) {
        mainSvc.markCompleted(id).then(response => {
          $scope.completed.push(response[0])
        })
      }

      //-----------------fav/completed toggle-------------------------//

      $('#com').addClass('selected')
      $scope.section = true;
      $scope.selected = function (e) {
        $(e).addClass('selected');
        if (e === '#fav') {
          $('#com').removeClass('selected');
          $scope.section = false;
        } else {
          $('#fav').removeClass('selected')
          $scope.section = true;
        }
      }

      //---------------------------charts-----------------------------//

      var radius = 0;

      function makeComChart() {
        var ctx = document.getElementById("comChart").getContext('2d');
        var comChart = new Chart(ctx, {
          type: 'line',

          options: {
            legend: {
              display: false,
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
              display: false,
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
        makeDisChart()
        makeComChart()
      })

      //---------- disable profile button when not logged in --------- //


      function getLoginStatus() {
        if ($scope.user === 'NOT LOGGED IN') {
          document.getElementById('loginProfile').innerHTML = "<a href='/auth'>Login</a>";
          document.getElementById('logoutProfile').style.visibility = 'hidden';
          document.getElementById('loginProfile-desktop').innerHTML = "<a href='/auth'>Login</a>";
          document.getElementById('logoutProfile-desktop').style.display = 'none';
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

    })
  }

  getUser();

  //----------------create totals-------------------//

  function userTotalElevation(obj) {
    let totals = []
    for (let i = 0; i < obj.length; i++) {
      if (i > 0) {
        let num = JSON.parse(obj[i].elevation) + totals[i - 1]
        totals.push(num)
      } else {
        totals.push(JSON.parse(obj[i].elevation));
      }
    }
    return totals
  }

  function userTotalMiles(obj) {
    let totals = []
    for (let i = 0; i < obj.length; i++) {
      if (i > 0) {
        let num = JSON.parse(obj[i].gis_miles) + totals[i - 1]
        totals.push(num)
      } else {
        totals.push(JSON.parse(obj[i].gis_miles));
      }
    }
    return totals
  }

  $scope.expand = false;


  //-------------------expand fav list--------------------//
  
    $scope.accordion = function (id) {
      let t = document.getElementById(id)
      t.classList.toggle("active");
      var panel = t.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    }
  




})