'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:CCSearchForm
 * @description
 * # CCSearchForm
 */
angular.module('cloudcatcherDesktopApp')
    .directive('CCSearchForm', function () {
        return {
            templateUrl: 'views/directives/search-form.html',
            restrict: 'E'
        };
    });
