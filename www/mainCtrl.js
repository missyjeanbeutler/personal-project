angular.module('trailsApp').controller('mainCtrl', function($scope, mainSvc, $state, loginSvc) {
    

 //--------------- login/logout ----------------//

// $scope.favorites;
// $scope.completed;
let id;

    function getUser() {
    loginSvc.getUser().then(function(user) {
      if (user) {
        $scope.user = user.username;
        id = user.authid
        $scope.favorites = user.favorites;
        $scope.completed = user.completed;
      } else   $scope.user = 'NOT LOGGED IN';
    })
  }

  getUser();

  $scope.logout = loginSvc.logout;


  //------------ adjust favorites list -------------//

  $scope.deleteTrail = function(trailId) {
    mainSvc.deleteTrail(trailId, id).then(response => {
      for(let i = 0; i < $scope.favorites.length; i++) {
        if($scope.favorites[i].trail_id === response[0].trail_id) {
          $scope.favorites.splice(i, 1);
        }
      }
    })
  }

  $scope.markCompleted = function(trailId) {
    mainSvc.markCompleted(trailId, id).then(response => {
      $scope.completed.push(response[0])
    })
  }





    


})