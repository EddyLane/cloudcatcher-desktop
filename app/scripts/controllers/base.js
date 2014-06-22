'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('BaseCtrl', function ($scope, user, GoogleFeedApi) {
        $scope.user = user;

        GoogleFeedApi.one('load').get({
            q: 'http://downloads.bbc.co.uk/podcasts/radio2/gms/rss.xml'
        }).then(function (data) {
            console.log(JSON.stringify(data));
        });
    });
