'use strict';

Firebase.INTERNAL.forceWebSockets();

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
    .constant('PLACEHOLDER_IMAGE', 'loading.gif')
;
