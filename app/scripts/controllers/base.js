'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BaseCtrl', function ($scope, $rootScope, user) {

        _.assign($scope, {
            podcasts: user.getPodcasts(),
            currentPlaying: user.getCurrentPlaying(),
            isCollapsed: true
        });

        $rootScope.$on('play', function (sound, data) {

            $scope.audioPlayer.load([{
                src: data,
                type: 'audio/mpeg',
                media: '.css.media.query'
            }, true]);

            $scope.audioPlayer.play();

        });

    });