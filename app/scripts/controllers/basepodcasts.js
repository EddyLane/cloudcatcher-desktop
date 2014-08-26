'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastsCtrl
 * @description
 * # BasepodcastsCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastsCtrl', function ($scope, original, PodcastSorter, PLACEHOLDER_IMAGE, ImageLoader, $q) {

        function loadImages(podcasts) {
            return $q.all(_.map(podcasts, function (podcast) {
                var promise = ImageLoader(podcast.artwork[100]);
                promise.then(function (blobUri) {
                    podcast.imageUrl = blobUri;
                });
                return promise;
            }));
        }

        function sort(original) {

            var sorter = PodcastSorter.getSorter(original);

            $scope.sortBy = function (type) {
                $scope.type = type;
                var podcasts = sorter(type);
                loadImages(podcasts).then(function () {
                    $scope.listPodcasts = podcasts;
                });
            };

            $scope.sortBy('name');
        }

        $scope.original = original;
        $scope.$watchCollection('original', sort);

    });
