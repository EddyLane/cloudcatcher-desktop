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
            url: '',
            resolve: {
                user: ['CloudcatcherAuth', function (CloudcatcherAuth) {
                    return CloudcatcherAuth.check();
                }]
            },
            templateUrl: 'views/base.html',
            controller: 'BaseCtrl'
        });

        $stateProvider.state('base.podcast', {
            url: '/:slug',
            resolve:{
                podcast: ['$scope', '$stateParams', function ($scope, $stateParams) {
                    console.log($stateParams);
                    console.log($scope.user.podcasts);
                    //return _.find($scope.user.podcasts, { slug: $stateParams.slug });
                }]
            },
            controller: 'BasepodcastCtrl'
        });

        $urlRouterProvider.otherwise('');

    });