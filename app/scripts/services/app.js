'use strict';

/**
 * @ngdoc overview
 * @name cloudcatcherSharedServices
 * @description
 * # cloudcatcherSharedServices
 *
 * Services shared between the desktop and mobile applications
 */
angular
    .module('cloudcatcherSharedServices', [
        'restangular',
        'firebase'
    ])
    .constant('ITUNES_URL', 'https://itunes.apple.com/')
    .constant('CLOUDCATCHER_URL', 'http://app.angular-symfony-stripe.local:9000/app_dev.php/api/v1/')
    .constant('FIREBASE_URL', 'https://podcatcher.firebaseio.com')
    .config(function (RestangularProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    })
;
