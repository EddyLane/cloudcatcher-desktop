'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('LoginCtrl', function ($scope, $state) {
        console.log('LoginCtrl');
        $scope.$on('loginForm_success', function () {
            $state.go('base.podcasts.thumbnails');
        });
    });
