'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastepisodesCtrl
 * @description
 * # BasepodcastepisodesCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastepisodesCtrl', function ($scope, episodes) {
        $scope.episodes = episodes;
    });
