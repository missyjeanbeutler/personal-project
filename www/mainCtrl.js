angular.module('trailsApp').controller('mainCtrl', function ($scope, mainSvc, $state, loginSvc, $mdSidenav) {


  //--------------- login/logout ----------------//

  function getUser() {
    loginSvc.getUser().then((response) => {
      if (response) {
        $scope.user = response.data.username;
        $scope.favorites = response.data.favorites;
        $scope.completed = response.data.completed;
      } else {
        $scope.user = 'NOT LOGGED IN';
      }
      getLoginStatus();
    })
  }

  getUser();

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
  








})