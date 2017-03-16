angular.module('trailsApp').controller('mainCtrl', function($scope, mainSvc, $state, loginSvc) {
    

    //--------login/logout------------//

    function getUser() {
    loginSvc.getUser().then(function(user) {
      if (user) {
        $scope.user = user.username;
        $scope.favorites = user.favorites;
        $scope.completed = user.completed;
      } else   $scope.user = 'NOT LOGGED IN';
    })
  }

  getUser();

  $scope.logout = loginSvc.logout;


  //------------ adjust favorites list -------------//


    


})