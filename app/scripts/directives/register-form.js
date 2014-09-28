'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:LoginForm
 * @description
 * # LoginForm
 */
angular.module('cloudcatcherDesktopApp')
    .directive('registerForm', function (CloudcatcherAuth) {
        return {
            templateUrl: 'views/directives/register-form.html',
            restrict: 'AE',
            link: function postLink(scope) {

                scope.submit = function () {
                    scope.submitted = true;

                    if (scope.registerForm.$invalid) {
                        return false;
                    }

                };

            }
        };
    });