'use strict';

/**
 * @ngInject
 * @ngdoc function
 * @name cloudcatcherDesktopApp.services:EpisodeStorage
 * @description
 * # EpisodeStorage
 * Episode storage
 */

function EpisodeStorage($q, $log) {

    var EpisodeStorage = {};

    EpisodeStorage.getEpisode = function getEpisode (episode) {
        var defer = $q.defer();
        chrome.storage.local.get(episode.media.url, defer.resolve);
        return defer.promise;
    };

    EpisodeStorage.hasEpisode = function hasEpisode (episode) {
        return EpisodeStorage.getEpisode(episode).then(function (episode) {
            return _.size(episode) > 0;
        })
    };

    EpisodeStorage.storeEpisode = function storeEpisode (episode) {
        var defer = $q.defer();
        $log.info('downloading', episode.media.url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', episode.media.url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            var storage = {};
            var fileReader = new FileReader();
            // Create a blob from the response
            var blob = new Blob([xhr.response], {type: 'audio/mpeg'});

            // onload needed since Google Chrome doesn't support addEventListener for FileReader
            fileReader.onload = function (evt) {
                // Read out file contents as a Data URL
                var result = evt.target.result;
                
                // Store Data URL in localStorage
                try {
                    storage[episode.media.url] = result;

                    chrome.storage.local.set(storage, function () {
                        defer.resolve();
                        $log.info('stored', storage);
                    });
                }
                catch (e) {
                    console.log("Storage failed: " + e);
                }
            };
            // Load blob as Data URL
            fileReader.readAsDataURL(blob);


        };
        xhr.send();
        return defer.promise;
    };

    return EpisodeStorage;

}

    angular.module('cloudcatcherDesktopApp')
        .service('EpisodeStorage', EpisodeStorage);