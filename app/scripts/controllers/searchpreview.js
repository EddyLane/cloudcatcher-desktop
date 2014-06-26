'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:SearchpreviewctrlCtrl
 * @description
 * # SearchpreviewctrlCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('SearchpreviewctrlCtrl', function ($scope, episodes) {
        $scope.episodes = episodes;
    });
