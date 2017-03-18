angular.module('trailsApp').service('loginSvc', function ($http) {


  this.updateFavorite = updateFavorite;
  let user;

  function updateFavorite(id) {
    user.favorites.push({ trail_id: id })
    console.log('DONE!')
  }


  this.getUser = function () {
    return $http({
        method: 'GET',
        url: '/auth/me'
      })
      .then(function (res) {
        user = res.data;
        return res
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  this.logout = function () {
    return $http({
        method: 'GET',
        url: '/auth/logout'
      })
      .then(function (res) {
        return res.data;
      })
      .catch(function (err) {
        console.log(err);
      })
  }



})