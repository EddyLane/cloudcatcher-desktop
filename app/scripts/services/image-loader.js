'use strict';

/**
 * @ngInject
 * @ngdoc function
 * @name cloudcatcherDesktopApp.services:ImageLoader
 * @description
 * # ImageLoader
 * Image loader
 */
function ImageLoader ($q) {

    /**
     * Load an image
     *
     * @param uri
     * @returns {Promise}
     * @constructor
     */
    function ImageLoader (uri) {
        var defer = $q.defer();
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            defer.resolve(window.URL.createObjectURL(xhr.response));
        };
        xhr.open('GET', uri, true);
        xhr.send();
        return defer.promise;
    }

    return ImageLoader;

}

angular.module('cloudcatcherDesktopApp')
    .service('ImageLoader', ImageLoader);