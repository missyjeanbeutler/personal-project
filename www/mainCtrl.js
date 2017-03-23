angular.module('trailsApp').controller('mainCtrl', function ($scope, mainSvc, $state, loginSvc, $mdSidenav) {


  //--------------- login/logout ----------------//

  function getUser() {
    loginSvc.getUser().then((response) => {
      if (response) {
        $scope.user = response.data.username;
        $scope.favorites = response.data.favorites;
        $scope.completed = response.data.completed;
        $scope.photo = response.data.photo
        var totals = userTotalElevation(response.data.completed)
      } else {
        $scope.user = 'NOT LOGGED IN';
      }
      getLoginStatus();
    })


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

    function makeComChart() {
      console.log('running')
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
          labels: totals,
          datasets: [{
            data: totals,
            backgroundColor: "#000",
          }]
        }
      });

    };

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
  }

  getUser();

  //----------------create elevationTotals-------------------//

  function userTotalElevation(obj) {
    let elevationTotals = []
    for (let i = 0; i < obj.length; i++) {
      if (i > 0) {
        let num = JSON.parse(obj[i].elevation) + elevationTotals[i - 1]
        elevationTotals.push(num)
      } else {
        elevationTotals.push(JSON.parse(obj[i].elevation));
      }
    }
    return elevationTotals
  }









})