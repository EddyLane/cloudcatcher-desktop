'use strict';

/**
 * @ngdoc overview
 * @name cloudcatcherDesktopApp
 * @description
 * # cloudcatcherDesktopApp
 *
 * Main module of the application.
 */
angular
    .module('cloudcatcherDesktopApp', [
        'angular-loading-bar',
        'ngCookies',
        'ngSanitize',
        'cloudcatcherSharedServices',
        'ui.router',
        'ui.bootstrap',
        'angularMoment',
        'ngFx'
    ])
;
