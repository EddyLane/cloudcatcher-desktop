'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:ccPodcastList
 * @description
 * # ccPodcastList
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccPodcastList', function () {
        return {
            templateUrl: 'views/directives/podcast-list.html',
            restrict: 'E',
            scope: {
                original: '=podcasts'
            },
            controller: PodcastListCtrl,
            controllerAs: 'PodcastlistCtrl'
        };
    });
