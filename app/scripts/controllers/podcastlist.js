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

    var init = false;

    function sort (original, sortBy) {

        var sorter = PodcastSorter.getSorter(original);

        $scope.sortBy = function (type) {

            chrome.storage.sync.set({ sortBy: type });

            $scope.type = type;
            $scope.podcasts = sorter(type);
        };


        $scope.sortBy(sortBy || $scope.type || 'name');

    }

    function setOriginal() {
        var podcasts = $scope.original;

        if (!init) {

            chrome.storage.sync.get('sortBy', function (sortBy) {
                sort(podcasts, sortBy.sortBy);
            });

            init = true;

        } else {
            sort(podcasts);
        }
    }

    $scope.original.$watch(setOriginal);
    setOriginal();
}

angular.module('cloudcatcherDesktopApp')
    .controller('PodcastlistCtrl', PodcastListCtrl);
