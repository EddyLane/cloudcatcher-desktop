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
    .config(function ($compileProvider) {
        //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob:chrome-extension|unsafe:blob:chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
    })
    .constant('PLACEHOLDER_IMAGE', 'loading.gif')
;
