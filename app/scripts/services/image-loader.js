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
     * Load images for a bunch of podcasts
     *
     * @param podcasts
     * @returns {Promise}
     */
    this.loadImages = function (podcasts) {
        var self = this;
        var imagePromises = _(podcasts)
            .map(function (podcast) {
                var promise = self.loadImage(podcast.artwork[100]);
                promise.then(function (blobUri) {
                    podcast.imageUrl = blobUri;
                });
                return promise;
            })
            .value();

        return $q.all(imagePromises);
    };

    /**
     * Load a specific image
     *
     * @param uri
     * @returns {Promise}
     */
    this.loadImage = function (uri) {
        var defer = $q.defer();
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            defer.resolve(window.URL.createObjectURL(xhr.response));
        };
        xhr.open('GET', uri, true);
        xhr.send();
        return defer.promise;
    };


}

angular.module('cloudcatcherDesktopApp')
    .service('ImageLoader', ImageLoader);