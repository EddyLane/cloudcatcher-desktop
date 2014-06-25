'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('SearchCtrl', function ($scope, results, user) {

        _.assign($scope, {

            toggleSubscription: function (podcast) {
                user.findPodcast(podcast) ? user.removePodcast(podcast) : user.addPodcast(podcast);
            },

            isSubscribed: user.findPodcast,
            results: results

        });


    });