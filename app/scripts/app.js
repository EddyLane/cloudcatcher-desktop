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
        'ngFx',
        'angular-ladda',
        'mediaPlayer'
    ])
    .constant('PLACEHOLDER_IMAGE', 'loading.gif')
    .config(function ($compileProvider) {
        //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob:chrome-extension|unsafe:blob:chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
    })
    .run(function ($rootScope, $window, CloudcatcherAuth) {

        $rootScope.devMode = true;

        $rootScope.online = navigator.onLine;

        $window.addEventListener('online',  function () {
            $rootScope.online = true;
            chrome.storage.local.get('token', function (data) {
                console.log('woah we are totally gunna try and re-auth you you cunt');
                CloudcatcherAuth.check({ access_token: data.token }).then(function (user) {
                    console.log('you lucky prick we actually got data for you server, checkit: ', user);
                    $rootScope.user = user;
                });
            });
        });

        $window.addEventListener('offline', function () {
            $rootScope.online = false;
        });


    })
;
