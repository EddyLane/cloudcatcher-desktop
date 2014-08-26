'use strict';

/**
 * @ngInject
 * @param $scope
 * @param $location
 * @param episodes
 * @param podcast
 * @param user
 * @param audioPlayer
 * @param EpisodeStorage
 * @constructor
 */
function BasePodcastEpisodesCtrl ($scope, $location, $q, episodes, podcast, user, audioPlayer, EpisodeStorage) {

    var addHeard = user.addHeard(podcast),
        hearAll = user.hearAll(podcast);

    _.assign($scope, {
        listen: function (episode) {
            if (episode.downloaded) {
                EpisodeStorage.getEpisode(episode).then(function (data) {
                    episode.media.dataUri = data[episode.media.url];
                    audioPlayer.play(episode);
                });
            } else {
                audioPlayer.play(episode);
            }
            addHeard(episode);
        },
        page: $location.search().page || 1,
        limit: 15,
        total: episodes.length,
        podcast: podcast,
        current: user.getCurrentPlaying(),

        markAllAsPlayed: function () {
            hearAll(episodes);
        },

        store: function (episode) {
            return EpisodeStorage.hasEpisode(episode).then(function (downloaded) {
                if (!downloaded) {
                    EpisodeStorage.storeEpisode(episode).then(function () {
                        episode.downloaded = true;
                    });
                }
                return downloaded;
            });
        }

    });

    function hasDownloaded(episodes) {
        _.forEach(episodes, function (episode) {
            EpisodeStorage.hasEpisode(episode).then(function (downloaded) {
                episode.downloaded = downloaded;
            });
        })
    }

    $scope.$watch('page', function (page) {
        var start = (page - 1) * $scope.limit,
            end = start + $scope.limit;
        $scope.episodes = episodes.slice(start, end);
        hasDownloaded($scope.episodes);
        $location.search('page', page);
    });

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
