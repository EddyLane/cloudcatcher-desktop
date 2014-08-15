'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.services:ImageLoader
 * @description
 * # ImageLoader
 * Image loader
 */

function ImageLoader () {

    var ImageLoader = function (uri, callback) {

        console.log('wat');
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            callback(window.URL.createObjectURL(xhr.response), uri);
        };
        xhr.open('GET', uri, true);
        xhr.send();
    };


    return ImageLoader;

}

angular.module('cloudcatcherDesktopApp')
    .service('ImageLoader', ImageLoader);