'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:ccAudioControls
 * @description
 * # ccAudioControls
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccAudioControls', function ($rootScope) {
        return {
            restrict: 'EA',
            link: function postLink(scope, element) {

                _.assign(scope, {
                    playing: false
                });

                $rootScope.$on('onPlay', function () {
                    scope.playing = true;
                });

            }
        };
    });
