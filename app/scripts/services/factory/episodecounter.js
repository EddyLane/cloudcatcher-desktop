'use strict';

/**
 * @param $q
 * @param GoogleFeedApi
 * @returns {EpisodeCounter}
 * @constructor
 */
function EpisodeCounter($q, GoogleFeedApi) {

    /**
     * Perform count actions on all podcasts
     *
     * @param podcasts
     * @returns {Promise}
     * @constructor
     */
    function EpisodeCounter(podcasts) {

        /**
         * Get the function to map episodes for this podcast
         *
         * @param podcast
         * @returns {mapEpisodes}
         */
        function mapEpisodes(podcast) {

            /**
             * Calculate episode counts for a podcast
             * @param episodes
             */
            function mapEpisodes(episodes) {
                var all;
                podcast.episodes = {};

                _.each(episodes, function (episode) {
                    if (episode.media && episode.media.url) {
                        podcast.episodes[episode.media.url] = podcast.heard.indexOf(episode.media.url) !== -1;
                    }
                });

                all = _.values(podcast.episodes);
                podcast.latest = moment(episodes[0].date);
                podcast.newEpisodes = all.length - _.compact(all).length;
                podcast.latestEpisode = episodes[0]
            }

            return mapEpisodes;
        }

        /**
         * Get the feed for the podcast and call the mapping functions on them
         *
         * @param podcast
         * @returns {Promise}
         */
        function mapPodcast(podcast) {

            var promise = GoogleFeedApi.one('load').getList(null, { q: podcast.feed });

            if (!podcast.heard) {
                podcast.heard = [];
            }

            promise.then(mapEpisodes(podcast));

            return promise;
        }



        //Experiment: recursively call the refreshses


        var defer = $q.defer();
        var arrayPodcasts = _.toArray(podcasts);

        function loop(i) {

            var worker = new Worker('scripts/workers/episode-counter-worker.js');

            worker.addEventListener('message', function (e) {
                console.log('Worker said: ', e.data);
            }, false);


            GoogleFeedApi.one('load').getList(null, { q: arrayPodcasts[i].feed }).then(function (e) {
                console.log(JSON.stringify(GoogleFeedApi.stripRestangular(e)));
                worker.postMessage(JSON.stringify(GoogleFeedApi.stripRestangular(e)));
            });


//            mapPodcast(arrayPodcasts[i]).then(function () {
//                if (i < arrayPodcasts.length - 1) {
//                    i++;
//                    loop(i);
//                } else {
//                    defer.resolve();
//                }
//            });
        }

        loop(0);
        return defer.promise;




        //Normal way
        //return $q.all(_.map(podcasts, mapPodcast));

        //Worker way
        var defer = $q.defer();


        return defer.promise;

    }

    return EpisodeCounter;
}

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.EpisodeCounter
 * @description
 * # EpisodeCounter
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('EpisodeCounter', EpisodeCounter);