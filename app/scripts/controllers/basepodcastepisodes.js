'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastepisodesCtrl
 * @description
 * # BasepodcastepisodesCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastepisodesCtrl', function ($scope, episodes, podcast, user) {

        _.assign($scope, {
            listen: function (episode) {
                user.addHeard(podcast, episode);
            },
            page: 1,
            limit: 10,
            total: episodes.length,
            heard: podcast.heard
        });

        $scope.$watch('page', function (page) {
            var start = (page - 1) * $scope.limit,
                end = start + $scope.limit;
            $scope.episodes = episodes.slice(start, end);
        });

    });
