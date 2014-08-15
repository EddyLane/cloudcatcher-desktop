'use strict';

/**
 * @ngInject
 * @param $scope
 * @param $location
 * @param episodes
 * @param podcast
 * @param user
 * @param audioPlayer
 * @constructor
 */
function BasePodcastEpisodesCtrl ($scope, $location, episodes, podcast, user, audioPlayer) {

    var addHeard = user.addHeard(podcast),
        hearAll = user.hearAll(podcast);

    _.assign($scope, {
        listen: function (episode) {
            audioPlayer.play(episode);
            addHeard(episode);
        },
        page: $location.search().page || 1,
        limit: 15,
        total: episodes.length,
        podcast: podcast,
        current: user.getCurrentPlaying(),

        markAllAsPlayed: function () {
            hearAll(episodes);
        }

    });

    $scope.$watch('page', function (page) {
        var start = (page - 1) * $scope.limit,
            end = start + $scope.limit;
        $scope.episodes = episodes.slice(start, end);
        $location.search('page', page);
    });

}

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastepisodesCtrl
 * @description
 * # BasepodcastepisodesCtrl
 * Controller of the cloudcatcherDesktopApp
 */

angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastepisodesCtrl', BasePodcastEpisodesCtrl);
