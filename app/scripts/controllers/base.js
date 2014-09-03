'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BaseCtrl', function ($scope, $rootScope, user, EpisodeStorage, $q, AudioPlayer, CloudcatcherAuth, $state) {

        _.assign($scope, {
            username: user.getUsername(),
            podcasts: user.getPodcasts(),
            logout: function () {
                CloudcatcherAuth.logout().then(function () {
                    $state.go('login');
                });
            },
            currentPlaying: user.getCurrentPlaying(),
            isCollapsed: true
        });

        function play (episode) {
            var episodeData;

            $scope.playing = AudioPlayer.playing;

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
        }


        $rootScope.$on('play', function (e, episode) {
            play(episode);
        });

    });