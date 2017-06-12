angular.module('trailsApp', ['ui.router', 'ngMaterial'])
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('', '/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/1-home/home.html',
                controller: 'homeCtrl'
            })
            .state('search', {
                url: '/search',
                templateUrl: 'views/2-trail-search/search.html',
                controller: 'searchCtrl',
            })
            .state('trail-data', {
                url: '/trail/:id',
                templateUrl: 'views/3-trail-data/data.html',
                controller: 'dataCtrl',
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'views/5-profile/profile.html',
                controller: 'mainCtrl',
                resolve: {
                    authenticate: function (loginSvc, $state, $rootScope) {
                        loginSvc.getUser().then(response => {
                            if (!response) {
                                console.log('not logged in')
                                event.preventDefault()
                                $state.go("home")
                            }
                        })
                    }
                }
            })


        $urlRouterProvider.otherwise('/');
    })