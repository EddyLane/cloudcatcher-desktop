'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastepisodesCtrl
 * @description
 * # BasepodcastepisodesCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastepisodesCtrl', function ($scope, $location, episodes, podcast, user) {

        _.assign($scope, {
            listen: function (episode) {
                user.addHeard(podcast, episode);
            },
            page: $location.search().page || 1,
            limit: 10,
            total: episodes.length,
            heard: podcast.heard,

            markAllAsPlayed: function () {
                user.hearAll(podcast, episodes);
            }

        });

        $scope.$watch('page', function (page) {
            var start = (page - 1) * $scope.limit,
                end = start + $scope.limit;
            $scope.episodes = episodes.slice(start, end);
            $location.search('page', page);
        });

    });
