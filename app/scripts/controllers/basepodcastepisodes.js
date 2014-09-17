'use strict';

/**
 * @ngInject
 * @param $scope
 * @param $location
 * @param episodes
 * @param podcast
 * @param user
 * @param AudioPlayer
 * @param EpisodeStorage
 * @constructor
 */
function BasePodcastEpisodesCtrl ($scope, $location, episodes, podcast, user, AudioPlayer, EpisodeStorage) {

    var addHeard = user.addHeard(podcast),
        hearAll = user.hearAll(podcast),
        locallyStored = EpisodeStorage.getEpisodes(podcast);

    _.assign($scope, {

        listen: function (episode) {
            episode.imageUrl = podcast.imageUrl;
            AudioPlayer.play(episode);
//            if (episode.downloaded) {
//                EpisodeStorage.getEpisode(episode).then(function (data) {
//                    AudioPlayer.play(data[episode.media.url]);
//                });
//            } else {
//                AudioPlayer.play(episode.media.url);
//            }
            addHeard(episode);
        },

        page: $location.search().page || 1,
        limit: 9,
        total: episodes.length,
        podcast: podcast,
        current: user.getCurrentPlaying(),

        markAllAsPlayed: function () {
            hearAll(episodes);
        },

        store: function (episode) {


            return EpisodeStorage.hasEpisode(episode).then(function (downloaded) {
                if (!downloaded) {
                    episode.downloading = true;
                    EpisodeStorage.storeEpisode(episode, podcast, $scope).then(function () {
                        episode.downloading = false;
                        episode.downloaded = true;
                    });
                }
                return downloaded;
            });
        }

    });

//    function hasDownloaded(episodes) {
//        _.forEach(episodes, function (episode) {
//            EpisodeStorage.hasEpisode(episode).then(function (downloaded) {
//                episode.downloaded = downloaded;
//            });
//        })
//    }



    function paginate(page) {
        var start = (page - 1) * $scope.limit,
            end = start + $scope.limit;
        $scope.episodes = episodes.slice(start, end);

        locallyStored.then(function (stored) {
            _.each($scope.episodes, function (ep) {
                _.merge(ep, _.find(stored, { media: { url: ep.media.url } }));
            });
        });


        $location.search('page', page);
    }

    $scope.$watch('page', paginate);

}

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastepisodesCtrl
 * @description
 * # BasepodcastepisodesCtrl
 * Controller of the cloudcatcherDesktopApp
 */

angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastepisodesCtrl', BasePodcastEpisodesCtrl);
