'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BaseCtrl', function ($scope, $rootScope, user, EpisodeStorage, $q) {

        _.assign($scope, {
            podcasts: user.getPodcasts(),
            currentPlaying: user.getCurrentPlaying(),
            isCollapsed: true
        });

        $rootScope.$on('play', function (sound, episode) {


            var episodeData;
            if (episode.downloaded) {
                episodeData = EpisodeStorage.getEpisode(episode).then(function (data) {
                    return data[episode.media.url];
                });
            } else {
                episodeData = $q.when(episode.media.url);
            }

            episodeData.then(function (url) {
                $scope.audioPlayer.load([{
                    src: url,
                    type: 'audio/mpeg',
                    media: '.css.media.query'
                }, true]);
                $scope.audioPlayer.play();

            });

        });

    });