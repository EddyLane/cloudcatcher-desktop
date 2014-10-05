'use strict';

/**
 *
 * @param $scope
 * @param $rootScope
 * @param user
 * @param AudioPlayer
 * @param CloudcatcherAuth
 * @param $state
 * @constructor
 */
function BaseCtrl ($scope, $rootScope, user, AudioPlayer, CloudcatcherAuth, $state, $log) {

    _.assign($scope, {
        user: user,
        username: user.getUsername(),
        podcasts: user.getPodcasts(),
        logout: function () {
            CloudcatcherAuth.logout().then(function () {
                $state.go('login');
            });
        },
        currentPlaying: user.getCurrentPlaying(),
        isCollapsed: true,
        speed: 1,
        toggleSpeed: function () {
            this.speed += 0.5;
            $scope.audioPlayer.setPlaybackRate(this.speed);
        }

    });

    function play (episode, autoPlay) {

        $scope.playing = AudioPlayer.playing;

        $scope.audioPlayer.load([{
            src: episode.dataUri || episode.media.url,
            type: 'audio/mpeg',
            media: '.css.media.query'
        }, false]);

        if (autoPlay) {
            $scope.audioPlayer.play();
        }

    }

    $scope.$watch('audioPlayer.currentTime', function (time) {
        if (AudioPlayer.playing && time) {
            AudioPlayer.playing.currentTime = time;
            $log.debug('playing', AudioPlayer.playing);
            $rootScope.$emit('whilePlaying', AudioPlayer.playing);
        }
    });

    $scope.$watch('audioPlayer', function (player) {
        if (player) {

            player.on('playing', function (evt) {
                $log.debug('song playing', evt);
            });

            $scope.currentPlaying.$loaded().then(function () {

                if ($scope.currentPlaying.media) {
                    AudioPlayer.play($scope.currentPlaying);

                    player.one('loadedmetadata', function (evt) {
                        player.pause();
                        player.seek($scope.currentPlaying.currentTime);
                        $log.debug('song loaded', evt);
                    });
                }

            });

        }
    });



    $rootScope.$on('play', function (e, episode) {
        play(episode, true);
    });

}

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BaseCtrl', BaseCtrl);