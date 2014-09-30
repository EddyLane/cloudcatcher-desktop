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

                scope.values = {};

                scope.submit = function (values) {

                    scope.submitted = true;

                    if (scope.registerForm.$invalid) {
                        return false;
                    }

                    CloudcatcherAuth.register({
                        email: values.email,
                        username: values.username,
                        plainPassword: {
                            first: values.plainPassword,
                            second: values.plainPassword
                        }
                    }).then(function () {

                        CloudcatcherAuth.authenticate(values.username, values.plainPassword).then(function () {
                            scope.$emit('loginForm_success');
                        });

                    });

                };
            }
        };
    });