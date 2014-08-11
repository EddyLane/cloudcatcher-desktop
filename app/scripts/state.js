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

        $rootScope.$on('$stateChangeStart', function () {
            $rootScope.loading = true;
        });

        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.loading = false;
        });

        $rootScope.$state = $state;

    }])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        });

        $stateProvider.state('base', {
            url: '',
            abstract: true,
            resolve: {
                user: ['CloudcatcherAuth', function (CloudcatcherAuth) {
                    return CloudcatcherAuth.check();
                }],
                audioPlayer: ['AudioPlayer', function (AudioPlayer) {
                    return AudioPlayer;
                }]
            },
            templateUrl: 'views/base.html',
            controller: 'BaseCtrl'
        });

        $stateProvider.state('base.podcasts', {
            templateUrl: 'views/base/podcasts.html',
            abstract: true,
            resolve: {
                podcasts: ['user', function (user) {
                    return user.getPodcasts();
                }]
            },
            controller: 'BasepodcastsCtrl'
        });

        $stateProvider.state('base.podcasts.thumbnails', {
            url: '/list',
            templateUrl: 'views/base/podcasts/list.html'
        });

        $stateProvider.state('base.podcasts.unplayed', {
            url: '/unplayed',
            templateUrl: 'views/base/podcasts/unplayed.html',
            controller: 'PodcastsunplayedCtrl'
        });

        $stateProvider.state('base.search', {
            url: '/search?term',
            templateUrl: 'views/base/search.html',
            resolve: {
                results: ['ItunesPodcastApi', '$stateParams', function (ItunesPodcastApi, $stateParams) {
                    return ItunesPodcastApi.all('search').getList({ term: $stateParams.term });
                }]
            },
            controller: 'SearchCtrl'
        });

        $stateProvider.state('base.search.preview', {
            url: '/?preview',
            templateUrl: 'views/base/search/preview.html',
            resolve: {
                episodes: ['$stateParams', 'GoogleFeedApi', function ($stateParams, GoogleFeedApi) {
                    return GoogleFeedApi.one('load').getList(null, { q: $stateParams.preview });
                }]
            },
            controller: 'SearchpreviewctrlCtrl'
        });

        $stateProvider.state('base.podcast', {
            url: '/podcasts/:slug',
            abstract: true,
            templateUrl: 'views/base/podcast.html',
            resolve: {
                podcast: ['user', '$stateParams', function (user, $stateParams) {
                    return user.getPodcasts().$loaded().then(function (podcasts) {
                        return _.find(podcasts, { slug: $stateParams.slug });
                    });
                }],
                episodes: ['podcast', 'GoogleFeedApi', function (podcast, GoogleFeedApi) {
                    return GoogleFeedApi.one('load').getList(null, { q: podcast.feed });
                }]
            },
            controller: 'BasepodcastCtrl'
        });

        $stateProvider.state('base.podcast.episodes', {
            url: '/episodes',
            templateUrl: 'views/base/podcast/episodes.html',
            controller: 'BasepodcastepisodesCtrl'
        });

        $stateProvider.state('base.podcast.info', {
            url: '/info',
            templateUrl: 'views/base/podcast/info.html',
            controller: 'PodcastinfoCtrl'
        });

        $urlRouterProvider.otherwise('/list');

    });