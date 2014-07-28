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
        'firebase',
        'xml',
        'cloudcatcherConstants'
    ])
;
