angular.module('trailsApp').service('loginSvc', function ($http) {


  this.updateFavorite = updateFavorite;
  this.updateCompleted = updateCompleted;

  function updateFavorite(id) {
    return $http.put('/api/updateFavoriteList/' + id).then(response => {
      console.log(response.data)
    })
  }

  function updateCompleted(id) {
    return $http.put('/api/updateCompletedList/' + id).then(response => {
      console.log(response.data)
    })
  }


  this.getUser = function () {
    return $http({
        method: 'GET',
        url: '/auth/me'
      })
      .then(function (res) {
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