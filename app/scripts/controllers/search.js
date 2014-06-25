'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('SearchCtrl', function ($scope, results, user) {

        _.assign($scope, {

            subscribe: function (podcast) {

            },

            results: results

        });


    });