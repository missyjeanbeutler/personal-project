angular.module('trailsApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('', '/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/1-home/home.html'
        })
        .state('search', {
            url: '/search',
            templateUrl: 'views/2-trail-search/search.html',
            controller: 'searchCtrl'
        })
        .state('trail-data', {
            url: '/trail/:id',
            templateUrl: 'views/3-trail-data/data.html',
            controller: 'dataCtrl'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/5-profile/profile.html',
            controller: 'mainCtrl'
        })
        


        $urlRouterProvider.otherwise('/');
})