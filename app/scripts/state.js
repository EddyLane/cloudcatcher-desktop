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
        $rootScope.$on('authenticationError', function () {
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
            templateUrl: 'views/base/podcast.html',
            resolve:{
                podcast: ['user', '$stateParams', function (user, $stateParams) {
                    return _.find(user.getPodcasts(), { slug: $stateParams.slug });
                }],
                episodes: ['podcast', 'GoogleFeedApi', function (podcast, GoogleFeedApi) {
                    return GoogleFeedApi.one('load').getList(null, { q: podcast.feed });
                }]
            },
            controller: 'BasepodcastCtrl'
        });

        $urlRouterProvider.otherwise('');

    });