'use strict';

/**
 *
 * @param $scope
 * @param $modal
 * @param podcast
 * @param user
 * @constructor
 */
function BasepodcastCtrl ($scope, $modal, podcast, episodes, user) {

    /**
     * Remove subscription
     */
    function unsubscribe () {
        user.removePodcast(podcast);
    }

    /**
     * View podcast info in a modal
     */
    function viewInfo () {
        var modalInstance = $modal.open({
            templateUrl: 'views/directives/modal/podcast-info.html',
            resolve: {
                podcast: function () {
                    return podcast;
                },
                meta: function () {
                    return episodes.meta;
                }
            },
            controller: function ($scope, podcast, meta) {
                $scope.podcast = podcast;
                $scope.meta = meta;
            }
        });
    }

    /**
     * Public functions
     */
    _.assign($scope, {
        podcast: podcast,
        unsubscribe: unsubscribe,
        viewInfo: viewInfo
    });

    /**
     * Save podcast when updating autoDownload settings
     */
    $scope.$watch('podcast.autoDownload', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            user.savePodcast(podcast);
        }
    });

}

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastCtrl
 * @description
 * # BasepodcastCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastCtrl', BasepodcastCtrl);
