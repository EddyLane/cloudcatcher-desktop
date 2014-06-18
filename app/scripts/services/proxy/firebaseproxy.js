'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.FirebaseProxy
 * @description
 * # FirebaseProxy
 * Factory in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .service('FirebaseProxy', function () {
        return Firebase;
    });
