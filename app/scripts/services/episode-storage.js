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
        $log.info('downloading', episode.media.url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', episode.media.url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            var storage = {};
            storage[episode.media.url] = new Blob([xhr.response], {type: 'audio/mpeg'});;
            chrome.storage.local.set(storage, function () {
                episode.downloaded = true;
                $log.info('stored', storage);
            });
        };
        xhr.send();
    };

    return EpisodeStorage;

}

    angular.module('cloudcatcherDesktopApp')
        .service('EpisodeStorage', EpisodeStorage);