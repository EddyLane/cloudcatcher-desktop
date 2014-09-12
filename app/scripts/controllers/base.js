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

            console.log(episode);

            $scope.playing = AudioPlayer.playing;

            $scope.audioPlayer.load([{
                src: episode.dataUri || episode.media.url,
                type: 'audio/mpeg',
                media: '.css.media.query'
            }, true]);

            $scope.audioPlayer.play();
        }


        $rootScope.$on('play', function (e, episode) {
            play(episode);
        });

    });