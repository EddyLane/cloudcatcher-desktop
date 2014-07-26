'use strict';

function PodcastsUnplayedCtrl ($scope, PodcastSorter) {
    $scope.podcasts = PodcastSorter.getSorter($scope.podcasts)('latest');
}

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:PodcastsunplayedCtrl
 * @description
 * # PodcastsunplayedCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('PodcastsunplayedCtrl', PodcastsUnplayedCtrl);
