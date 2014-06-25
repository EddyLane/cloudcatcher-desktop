'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.EpisodeCounter
 * @description
 * # EpisodeCounter
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('EpisodeCounter', function EpisodeCounter($q, GoogleFeedApi) {
        return function (podcasts) {
            return $q.all(_.map(podcasts, function (podcast) {
                var promise = GoogleFeedApi.one('load').getList(null, { q: podcast.feed });
                promise.then(function (episodes) {
                    podcast.episodes = {};
                    _.each(episodes, function (episode) {
                        if (episode.media && episode.media.url) {
                            podcast.episodes[episode.media.url] = false;
                        }
                    });
                    podcast.newEpisodes = _.size(podcast.episodes);
                });
                return promise;
            }));
        };
    });
