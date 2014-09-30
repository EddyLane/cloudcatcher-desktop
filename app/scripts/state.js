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
                user: ['CloudcatcherAuth', '$q', function (CloudcatcherAuth, $q) {
                    var defer = $q.defer();
                    chrome.storage.local.get('token', function (data) {
                        defer.resolve(CloudcatcherAuth.check({ access_token: data.token }));
                    });
                    return defer.promise;
                }]
            },
            templateUrl: 'views/base.html',
            controller: 'BaseCtrl',
            controlleAs: 'base'
        });

        $stateProvider.state('base.podcasts', {
            templateUrl: 'views/base/podcasts.html',
            abstract: true,
            resolve: {
                original: ['user', 'ImageLoader', function (user, ImageLoader) {
                    return ImageLoader.loadImages(user.getPodcasts()).then(function () {
                        return user.getPodcasts();
                    });
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
            resolve: SearchCtrl.resolve,
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
                    return user.getPodcast($stateParams.slug);
                }],
                episodes: ['podcast', 'EpisodeStorage', function (podcast, EpisodeStorage) {
                    return EpisodeStorage.getEpisodes(podcast);
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

        if (window.forwardToPodcast) {
            $urlRouterProvider.otherwise('/podcasts/' + window.forwardToPodcast() + '/episodes');
        } else {
            $urlRouterProvider.otherwise('/list');
        }

    });