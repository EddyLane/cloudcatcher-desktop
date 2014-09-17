'use strict';

/**
 * @ngInject
 * @ngdoc function
 * @name cloudcatcherDesktopApp.services:EpisodeStorage
 * @description
 * # EpisodeStorage
 * Episode storage
 */

function EpisodeStorage($q, $log, $state) {

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
        });
    };

    /**
     * Store an episode
     *
     * @param episode
     * @returns {Promise}
     */
    this.storeEpisode = function storeEpisode(episode, podcast, scope) {

        var mp3 = episode.media.url.split('/');
        var xhr = new XMLHttpRequest();
        var notificationId = 'cloudcatcher' + Math.random();
        var defer = $q.defer();

        mp3 = mp3[mp3.length - 1];

        $log.info('downloading', episode.media.url);
        xhr.open('GET', episode.media.url, true);
        xhr.responseType = 'blob';

        chrome.notifications.create(notificationId, {
            type: 'progress',
            message: episode.title,
            title: podcast.name,
            iconUrl: podcast.imageUrl,
            progress: 0,
            priority: 2
        } , function (notificationId) {
            console.log('done notification', notificationId);
        });

        chrome.notifications.onClicked.addListener(function (clickedId) {
            if (clickedId === notificationId) {
                $state.go('base.podcast.episodes', { slug: podcast.slug });
            }
        });

        xhr.onprogress = function (e) {
            var progress = parseInt((e.loaded / e.total) * 100, 10);

            if (scope) {
                scope.$apply(function () {
                    episode.downloadProgress = progress / 100;
                });
            }

            chrome.notifications.update(notificationId,{
                progress: progress
            }, function () {});

        };

        xhr.onload = function (e) {

            var blob = new Blob([xhr.response], {type: 'audio/mpeg'});

            window.webkitRequestFileSystem(
                PERSISTENT,
                e.total,
                function(fs) {
                    console.log('Filesystem: ' + fs);

                    fs.root.getFile(
                        mp3,
                        {create: true, exclusive: true},
                        function(fileEntry) {
                            console.log('fileEntry: ' + fileEntry);


                            fileEntry.createWriter(function(fileWriter) {

                                console.log('fileWriter: ' + fileWriter);

                                fileWriter.onwriteend = function(e) {
                                    console.log('Write completed.');
                                    var storage = {};
                                    storage[episode.feed] = [];

                                    chrome.storage.local.get(storage, function (result) {
                                        $log.info('got', result);
                                        episode.downloaded = e.total;
                                        episode.file = mp3;
                                        result[episode.feed].push(_.omit(episode.plain(), ['episodes', '$$hashKey', '$id', '$priority', 'imageUrl']));
                                        chrome.storage.local.set(result, function () {

                                            var completedId = 'cloudcatcher' + Math.random();

                                            defer.resolve();
                                            $log.info('stored', result);

                                            chrome.notifications.clear(notificationId, function () {
                                                $log.info('notification removed');
                                            });

                                            chrome.notifications.create(completedId, {
                                                type: 'basic',
                                                message: 'Downloaded: ' + episode.title,
                                                title: podcast.name,
                                                iconUrl: podcast.imageUrl,
                                                priority: 0
                                            } , function () {});

                                            chrome.notifications.onClicked.addListener(function (clickedId) {
                                                if (clickedId === completedId) {
                                                    $state.go('base.podcast.episodes', { slug: podcast.slug });
                                                }
                                            });

                                        });
                                    });
                                };

                                fileWriter.onerror = function(e) {
                                    console.log('Write failed: ' + e.toString());
                                };

                                fileWriter.write(blob);
                            }, function(e) {
                                console.log('Error: ' + e);
                            });
                        });

                }
            );
//
//            // onload needed since Google Chrome doesn't support addEventListener for FileReader
//            fileReader.onload = function (evt) {
//                // Read out file contents as a Data URL
//                var storage = {};
//
//                episode.dataUri = evt.target.result;
//
//                // Store Data URL in localStorage
//                try {
//                    storage[episode.feed] = [];
//
//
//
////                    chrome.storage.local.get(storage, function (result) {
////                        $log.info('got', result);
////                        result[episode.feed].push(_.omit(episode.plain(), ['episodes', '$$hashKey', '$id', '$priority', 'imageUrl']));
////                        result[episode.feed].push(_.omit(episode.plain(), ['episodes', '$$hashKey', '$id', '$priority', 'imageUrl']));
////                        chrome.storage.local.set(result, function () {
////                            defer.resolve();
////                            $log.info('stored', result);
////
////                            chrome.notifications.clear(notificationId, function () {
////                                $log.info('notification removed');
////                            });
////
////                        });
////                    });
//
//                }
//                catch (e) {
//                    defer.reject(e);
//                    $log.error('Storage failed', e);
//                }
//            };
//            // Load blob as Data URL
//            fileReader.readAsDataURL(blob);


        };
        xhr.send();
        return defer.promise;
    };

}

angular.module('cloudcatcherDesktopApp')
    .service('EpisodeStorage', EpisodeStorage);