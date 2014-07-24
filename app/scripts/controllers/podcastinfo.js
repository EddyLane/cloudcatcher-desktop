'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:PodcastinfoCtrl
 * @description
 * # PodcastinfoCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('PodcastinfoCtrl', function ($scope, episodes) {
        _.assign($scope, {
            info: episodes.meta
        });
    });
