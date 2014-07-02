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

                if (!podcast.heard) {
                    podcast.heard = [];
                }

                promise.then(function (episodes) {
                    var all;

                    podcast.episodes = {};

                    _.each(episodes, function (episode) {

                        if (episode.media && episode.media.url) {
                            podcast.episodes[episode.media.url] = podcast.heard.indexOf(episode.media.url) !== -1;
                        }

                    });

                    all = _.values(podcast.episodes);
                    podcast.newEpisodes = all.length - _.compact(all).length;

                });
                return promise;
            }));
        };
    });