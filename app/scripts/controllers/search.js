'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('SearchCtrl', function ($scope, $state, results, user, $location) {
        _.assign($scope, {

            toggleSubscription: function (podcast) {
                user.findPodcast(podcast) ? user.removePodcast(podcast) : user.addPodcast(podcast);
            },

            select: function (podcast) {
                if (this.selected === podcast) {
                    this.$parent.selected = null;
                } else {
                    this.$parent.selected = podcast;
                    $state.go('base.search.preview', { preview: podcast.feed });
                }
            },

            isSubscribed: user.findPodcast,
            results: results

        });

        if ($location.search().preview) {
            $scope.select(_.find(results, { feed: $location.search().preview }));
        }

    });