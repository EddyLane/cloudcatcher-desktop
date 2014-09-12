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

    /**
     * Get locally stored episodes for a podcast
     *
     * @param podcast
     * @returns {promise|e.promise|FirebaseObject.$$conf.promise|Promise.promise|Q.promise}
     */
    this.getEpisodes = function getEpisodes(podcast) {
        var defer = $q.defer();
        var storage = {};
        storage[podcast.feed] = [];
        chrome.storage.local.get(storage, function (data) {
            defer.resolve(data[podcast.feed]);
        });
        return defer.promise;
    };

    /**
     * Get an episode from chrome local storage
     *
     * @param episode
     * @returns {Promise}
     */
    this.getEpisode = function getEpisode(episode) {
        var defer = $q.defer(),
            storage = {};
        if (!episode || !episode.media || !episode.media.url || !episode.feed) {
            defer.reject(new Error('Episode not correct'));
        } else {
            storage[episode.feed] = [];
            chrome.storage.local.get(storage, function (episodes) {
                defer.resolve(_.find(episodes[episode.feed], { media: { url: episode.media.url } }));
            });
        }
        return defer.promise;
    };

    /**
     * Get promise which returns bool is we have the episode
     *
     * @param episode
     * @returns {Promise}
     */
    this.hasEpisode = function hasEpisode(episode) {
        return this.getEpisode(episode).then(function (episode) {
            return _.size(episode) > 0;
        })
    };

    /**
     * Store an episode
     *
     * @param episode
     * @returns {Promise}
     */
    this.storeEpisode = function storeEpisode(episode) {
        console.log(episode);
        var defer = $q.defer();
        $log.info('downloading', episode.media.url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', episode.media.url, true);
        xhr.responseType = 'blob';

        xhr.onprogress = function (e) {
            episode.downloadProgress = (e.loaded / e.total) * 100;
        };

        xhr.onload = function (e) {
            var fileReader = new FileReader();
            // Create a blob from the response
            var blob = new Blob([xhr.response], {type: 'audio/mpeg'});

            // onload needed since Google Chrome doesn't support addEventListener for FileReader
            fileReader.onload = function (evt) {
                // Read out file contents as a Data URL
                var storage = {};

                episode.dataUri = evt.target.result;

                // Store Data URL in localStorage
                try {
                    storage[episode.feed] = [];

                    chrome.storage.local.get(storage, function (result) {
                        $log.info('got', result);
                        result[episode.feed].push(_.omit(episode.plain(), ['episodes', '$$hashKey', '$id', '$priority', 'imageUrl']));
                        chrome.storage.local.set(result, function () {
                            defer.resolve();
                            $log.info('stored', result);
                        });
                    });

                }
                catch (e) {
                    defer.reject(e);
                    $log.error('Storage failed', e);
                }
            };
            // Load blob as Data URL
            fileReader.readAsDataURL(blob);


        };
        xhr.send();
        return defer.promise;
    };

}

angular.module('cloudcatcherDesktopApp')
    .service('EpisodeStorage', EpisodeStorage);