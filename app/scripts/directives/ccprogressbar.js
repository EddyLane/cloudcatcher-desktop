'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:ccProgressBar
 * @description
 * # ccProgressBar
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccProgressBar', function ($rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {

                scope.emit = function (e) {
                    $rootScope.$emit('scrub', (e.offsetX / element.width()) * 100);
                };

            }
        };
    });
