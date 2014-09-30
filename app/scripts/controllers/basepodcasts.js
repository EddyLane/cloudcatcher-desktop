'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastsCtrl
 * @description
 * # BasepodcastsCtrl
 * Controller of the cloudcatcherDesktopApp
 */

function BasepodcastsCtrl($scope, original, PodcastSorter) {

    function sort() {

        var sorter = PodcastSorter.getSorter(original);

        $scope.sortBy = function (type) {
            $scope.type = type;
            $scope.listPodcasts = sorter(type);
        };

        $scope.sortBy('name');
    }

    $scope.original = original;
    original.$watch(sort);
    sort();

}

angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastsCtrl', BasepodcastsCtrl);
