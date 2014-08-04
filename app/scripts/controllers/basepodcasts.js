'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastsCtrl
 * @description
 * # BasepodcastsCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastsCtrl', function ($scope, $timeout, original, PodcastSorter, PLACEHOLDER_IMAGE, ImageLoader) {


        function loadImages (podcasts) {

            for (var i=0; i < podcasts.length; i++) {

                var podcast = podcasts[i];

                ImageLoader(podcast.artwork[100], function(blob_uri, requested_uri) {

                    $scope.$apply(function() {
                        for (var k=0; k < podcasts.length; k++) {
                            if (podcasts[k].artwork[100] == requested_uri) {
                                podcasts[k].imageUrl = blob_uri;
                                console.log(podcasts[k]);
                            }
                        }
                    });
                });

            }
        }


        function sort (original) {

            var sorter = PodcastSorter.getSorter(original);

            $scope.sortBy = function (type) {
                $scope.type = type;
                $scope.listPodcasts = sorter(type);
                loadImages($scope.listPodcasts);

            };

            $scope.sortBy('name');
        }

        $scope.original = original;

        $scope.$watchCollection('original', sort);
//
//        $timeout(function () {
//            $scope.listPodcasts = podcasts;
//        }, 200);
    });
