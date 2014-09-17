'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastCtrl
 * @description
 * # BasepodcastCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastCtrl', function ($scope, podcast, user) {
        _.assign($scope, {
            podcast: podcast,
            unsubscribe: function () {
                user.removePodcast(podcast);
            }
        });

        $scope.$watch('podcast.autoDownload', function (value) {
            user.savePodcast(podcast);
        });

    });
