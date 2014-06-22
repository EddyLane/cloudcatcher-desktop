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

    .run(['$rootScope', '$state', '$log', function ($rootScope, $state, $log) {
        $rootScope.$on('$stateChangeError', function (e) {
            $log.warn(e);
            console.log(e);
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
                podcast: ['user', '$stateParams', function (user, $stateParams) {
                    return _.find(user.getPodcasts(), { slug: $stateParams.slug });
                }]
            },
            controller: 'BasepodcastCtrl'
        });

        $urlRouterProvider.otherwise('');

    });