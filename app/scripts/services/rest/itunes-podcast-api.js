'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherDesktopApp.Itunespodcastapi
 * @description
 * # Itunespodcastapi
 * Service in the cloudcatcherDesktopApp.
 */
angular.module('cloudcatcherSharedServices')

    .factory('ItunesPodcastApi', function ItunesPodcastApi(Restangular, ITUNES_URL, $filter) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setJsonp(true);
            RestangularConfigurer.setDefaultRequestParams('jsonp', { callback: 'JSON_CALLBACK', media: 'podcast' });
            RestangularConfigurer.setBaseUrl(ITUNES_URL);
            RestangularConfigurer.setResponseInterceptor(function (data) {
                return data.results.map(function (result) {
                    var res = {
                        episodes: {},
                        heard: {},
                        name: result.collectionName,
                        slug: result.collectionName ? $filter('slugify')(result.collectionName) : undefined,
                        artist: result.artistName,
                        itunesId: result.collectionId,
                        feed: result.feedUrl,
                        artwork: {
                            30: result.artworkUrl30,
                            60: result.artworkUrl50,
                            100: result.artworkUrl100,
                            600: result.artworkurl600
                        },
                        latest: result.releaseDate,
                        explicit: result.collectionExplicitness !== 'notExplicit',
                        amount: result.trackCount,
                        country: result.country,
                        genres: _.without(result.genres, 'Podcasts')
                    }

                    return res;
                });
            });
        });
    });
