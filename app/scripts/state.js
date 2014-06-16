'use strict';

/**
 * @ngdoc state
 * @name cloudcatcherDesktopApp
 * @description
 * # cloudcatcherDesktopApp
 *
 * States of the application.
 */

angular
    .module('cloudcatcherDesktopApp')

    .run(['$rootScope', '$state', function ($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function () {
            $state.transitionTo('login');
        });
    }])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });

        $stateProvider.state('base', {
            url: '/',
            resolve: {
                user: ['CloudcatcherAuth', function (CloudcatcherAuth) {
                    return CloudcatcherAuth.check();
                }]
            },
            controller: 'BaseCtrl'
        });

        $urlRouterProvider.otherwise('/');

    });