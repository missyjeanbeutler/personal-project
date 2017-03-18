angular.module('trailsApp').controller('mainCtrl', function($scope, mainSvc, $state, loginSvc) {
    

 //--------------- login/logout ----------------//

    let id;

    function getUser() {
    loginSvc.getUser().then((response) => {
      if (response) {
        console.log('again')
        $scope.user = response.data.username;
        id = response.data.id
        $scope.favorites = response.data.favorites;
        $scope.completed = response.data.completed;
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