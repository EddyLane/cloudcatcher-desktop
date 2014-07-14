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

        console.log('oh yeah podcasty', podcast);

        _.assign($scope, {

            podcast: podcast,

            unsubscribe: function () {
                user.removePodcast(podcast);
            }

        });
    });
