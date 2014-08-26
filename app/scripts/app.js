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
        'ngSanitize',
        'cloudcatcherSharedServices',
        'ui.router',
        'ui.bootstrap',
        'angularMoment',
        'ngFx'
    ])
    .constant('PLACEHOLDER_IMAGE', 'loading.gif')
    .config(function ($compileProvider) {
        //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob:chrome-extension|unsafe:blob:chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
    })
;
