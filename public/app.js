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
            templateUrl: 'views/2-trail-search/search.html'
        })
        .state('trail-data', {
            url: '/search/trail/:id',
            templateUrl: 'views/3-trail-data/data.html'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/5-profile-wrapper/profile.html'
        })
        .state('stats', {
            parent: 'profile',
            url: '/profile/stats',
            templateUrl: 'views/6-user-stats/stats.html'
        })
        .state('saved-trails', {
            parent: 'profile',
            url: '/profile/saved-trails',
            templateUrl: 'views/7-saved-trails/saved.html'
        })


        $urlRouterProvider.otherwise('/');
})