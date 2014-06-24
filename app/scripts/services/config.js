'use strict';

/**
 * @ngdoc overview
 * @name cloudcatcherSharedServices.config
 * @description
 * # cloudcatcherSharedServices.config
 *
 * Configuration
 */
angular
    .module('cloudcatcherSharedServices')
    .config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    })
    .run(function (Restangular, $rootScope) {
        Restangular.setErrorInterceptor(function (response) {
            if (response.status === 401) {
                $rootScope.$emit('authenticationError', response);
                return true;
            }
            return false;
        });
    })
;