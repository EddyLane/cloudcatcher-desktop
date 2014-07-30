'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BaseCtrl', function ($scope, user, audioPlayer) {
        _.assign($scope, {
            podcasts: user.getPodcasts(),
            currentPlaying: user.getCurrentPlaying(),
            isCollapsed: true
        });

        if ($scope.currentPlaying && $scope.currentPlaying.media) {
            audioPlayer.play($scope.currentPlaying);
        }

    });