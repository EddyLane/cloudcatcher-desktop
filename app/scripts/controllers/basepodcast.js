'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastCtrl
 * @description
 * # BasepodcastCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastCtrl', function ($scope, podcast, episodes) {

        $scope.podcast = podcast;
        $scope.episodes = episodes;

    });
