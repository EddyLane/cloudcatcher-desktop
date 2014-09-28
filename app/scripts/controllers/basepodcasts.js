'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastsCtrl
 * @description
 * # BasepodcastsCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastsCtrl', function ($scope, original, PodcastSorter, PLACEHOLDER_IMAGE, ImageLoader) {

        function sort(original) {

            var sorter = PodcastSorter.getSorter(original);

            $scope.sortBy = function (type) {
                $scope.type = type;
                var podcasts = sorter(type);

                console.log(ImageLoader);

                ImageLoader.loadImages(podcasts).then(function () {
                    $scope.listPodcasts = podcasts;
                });
            };

            $scope.sortBy('name');
        }

        $scope.original = original;
        $scope.$watch('original', sort, true);

    });
