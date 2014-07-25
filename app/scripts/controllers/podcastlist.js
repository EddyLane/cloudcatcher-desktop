'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:PodcastlistCtrl
 * @description
 * # PodcastlistCtrl
 * Controller of the cloudcatcherDesktopApp
 */

/**
 * @ngInject
 * @constructor
 */
function PodcastListCtrl ($scope, PodcastSorter) {

    $scope.$watchCollection('original', function (original) {

        var sorter = PodcastSorter.getSorter(original);

        $scope.sortBy = function (type) {
            $scope.type = type;
            $scope.podcasts = sorter(type);
        };

        $scope.sortBy($scope.type || 'name');

    });

}

angular.module('cloudcatcherDesktopApp')
    .controller('PodcastlistCtrl', PodcastListCtrl);
