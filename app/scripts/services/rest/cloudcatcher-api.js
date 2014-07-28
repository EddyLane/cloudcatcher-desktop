'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherDesktopApp.CloudcatcherApi
 * @description
 * # CloudcatcherApi
 * Service in the cloudcatcherDesktopApp.
 */
angular.module('cloudcatcherSharedServices')
    .factory('CloudcatcherApi', function CloudcatcherApi(Restangular, CLOUDCATCHER_URL) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(CLOUDCATCHER_URL);
            RestangularConfigurer.setDefaultHttpFields({ withCredentials: true });
            RestangularConfigurer.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig) {

                headers = headers || {};

                if (operation.toLowerCase() === 'post' && route === 'login') {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    element = $.param({
                        _username: element.username,
                        _password: element.password
                    });
                }

                return {
                    element: element,
                    params: params,
                    headers: headers,
                    httpConfig: httpConfig
                };

            });
        });
    });