'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:LoginForm
 * @description
 * # LoginForm
 */
angular.module('cloudcatcherDesktopApp')
    .directive('loginForm', function (CloudcatcherAuth) {
        return {
            templateUrl: 'views/directives/login-form.html',
            restrict: 'AE',
            link: function postLink(scope) {

                function success() {
                    scope.$emit('loginForm_success');
                }

                function failure() {
                    scope.$emit('loginForm_failure');
                    scope.error = 'Incorrect username or password';
                }

                _.assign(scope, {

                    name: 'loginForm',

                    submitted: false,

                    error: null,

                    values: {
                        username: '',
                        password: ''
                    },

                    submit: function () {
                        var self = this;

                        this.submitted = true;
                        this.error = null;

                        if (this[this.name].$invalid) {
                            return false;
                        }

                        this.submitting = true;

                        CloudcatcherAuth.authenticate(this.values.username, this.values.password)
                            .then(success, failure)
                            .finally(function () {
                                self.submitting = false;
                            });
                    }

                });
            }
        };
    });