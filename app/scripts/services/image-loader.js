'use strict';

/**
 * @ngInject
 * @ngdoc function
 * @name cloudcatcherDesktopApp.services:ImageLoader
 * @description
 * # ImageLoader
 * Image loader
 */
function ImageLoader ($q, $log) {

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

                var defer = $q.defer();

                chrome.storage.local.get(podcast.slug + ':image', function (data) {

                    if (data[podcast.slug + ':image']) {

                        $log.info('retrieved image for ' + podcast.name);
                        defer.resolve(data[podcast.slug + ':image']);

                    } else {
                        self.loadImage(podcast.artwork[100]).then(function (blobData) {
                            var blob = new Blob([blobData], {type: 'image/jpg'});
                            var fileReader = new FileReader();

                            fileReader.onload = function (evt) {
                                // Read out file contents as a Data URL
                                var result = evt.target.result,
                                    storage = {};

                                // Store Data URL in localStorage
                                try {
                                    storage[podcast.slug + ':image'] = result;

                                    chrome.storage.local.set(storage, function () {
                                        defer.resolve(result);
                                        $log.info('stored image for ' + podcast.name);
                                    });
                                }
                                catch (e) {
                                    defer.reject(e);
                                    $log.error('Storage failed', e);
                                }
                            };

                            fileReader.readAsDataURL(blob);
                        });
                    }
                });

                defer.promise.then(function (blob) {
                    podcast.imageUrl = blob;
                });

                return defer.promise;
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
            defer.resolve(xhr.response);
            //defer.resolve(window.URL.createObjectURL(xhr.response));
        };
        xhr.open('GET', uri, true);
        xhr.send();
        return defer.promise;
    };


}

angular.module('cloudcatcherDesktopApp')
    .service('ImageLoader', ImageLoader);