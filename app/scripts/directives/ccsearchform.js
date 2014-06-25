'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:CCSearchForm
 * @description
 * # CcSearchForm
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccSearchForm', function () {
        return {
            templateUrl: 'views/directives/search-form.html',
            restrict: 'E'
        };
    });
