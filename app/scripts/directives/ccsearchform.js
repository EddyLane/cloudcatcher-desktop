'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:CCSearchForm
 * @description
 * # CcSearchForm
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccSearchForm', function ($state) {
        return {
            templateUrl: 'views/directives/search-form.html',
            restrict: 'E',
            link: function (scope) {
                _.assign(scope, {

                    name: 'searchForm',

                    values: {
                        term: ''
                    },

                    submit: function () {

                        if (this[this.name].$invalid) {
                            return false;
                        }

                        $state.go('base.search', this.values);

                        this.values.term = '';
                    }
                });
            }
        };
    });
