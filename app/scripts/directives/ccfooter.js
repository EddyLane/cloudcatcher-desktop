'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:cCFooter
 * @description
 * # cCFooter
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccFooter', function () {
        return {
            templateUrl: 'views/directives/footer.html',
            restrict: 'EA',
            scope: {
                playing: '='
            }
        };
    });
