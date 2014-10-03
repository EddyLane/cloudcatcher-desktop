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

        $scope.playing = AudioPlayer.playing;

        $scope.audioPlayer.load([{
            src: episode.dataUri || episode.media.url,
            type: 'audio/mpeg',
            media: '.css.media.query'
        }, true]);

        $scope.audioPlayer.play();
    }

    $scope.$watch('audioPlayer', function (audioPlayer) {
        if (audioPlayer) {
            //Events
            $scope.audioPlayer.on('load', function (evt) {
                $log.debug('song loaded', evt);
            });

            $scope.audioPlayer.on('playing', function (evt) {
                $log.debug('song playing', evt);
            });
        }
    });


    $rootScope.$on('play', function (e, episode) {
        play(episode);
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