'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastsCtrl
 * @description
 * # BasepodcastsCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastsCtrl', function ($scope, $timeout, podcasts) {
        $timeout(function () {
            $scope.listPodcasts = podcasts;
        }, 1500);
    });
