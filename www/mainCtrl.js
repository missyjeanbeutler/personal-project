angular.module('trailsApp').controller('mainCtrl', function($scope, mainSvc, $state, loginSvc) {
    
    function getUser() {
    loginSvc.getUser().then(function(user) {
      if (user) $scope.user = user.username;
      else   $scope.user = 'NOT LOGGED IN';
    })
  }

  getUser();

  $scope.loginLocal = function(username, password) {
    console.log('Logging in with', username, password);
    loginSvc.loginLocal({
      username: username,
      password: password
    })
    .then(function(res) {
      getUser();
    })
  }

  $scope.logout = loginSvc.logout;
    


})