'use strict';

/**
 * @ngInject
 * @ngdoc function
 * @name cloudcatcherDesktopApp.services:EpisodeStorage
 * @description
 * # EpisodeStorage
 * Episode storage
 */

function EpisodeStorage ($http) {

    var EpisodeStorage = {};

    EpisodeStorage.storeEpisode = function (episode) {
        $http.get(episode.media.url).then(function () {
            console.log('boom');
        });
    };

    return EpisodeStorage;

}

angular.module('cloudcatcherDesktopApp')
    .service('EpisodeStorage', EpisodeStorage);