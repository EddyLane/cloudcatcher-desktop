/**
 * Created by edwardlane on 17/09/2014.
 */

function downloadEpisode(episode, podcast) {

    var notificationFn = getNotificationFn(podcast);

    var mp3 = Math.floor(Math.random() * (1000000000 - 1)) + 1;
    var xhr = new XMLHttpRequest();
    var notificationId = 'cloudcatcher' + Math.random();

    var notificationData = {
        type: 'progress',
        message: episode.title,
        title: episode.podcast,
        iconUrl: podcast.imageUrl,
        progress: 0,
        priority: 2
    };

    if (!podcast.downloading) {
        podcast.downloading = [episode];
    } else {
        podcast.downloading.push(episode);
    }

    episode.media = JSON.parse(episode.media);
    episode.media.url = episode.media.url[0];
    console.log('download dat epi', episode);
    console.log('attempting to download url', episode.media);
    xhr.open('GET', episode.media.url, true);
    xhr.responseType = 'blob';


    chrome.notifications.create(notificationId, notificationData, function (notificationId) {
        console.log('done notification', notificationId);
    });

    chrome.notifications.onClicked.addListener(notificationFn(notificationId));

    xhr.onprogress = function (e) {
        var progress = parseInt((e.loaded / e.total) * 100, 10);

        if (_.isNumber(progress)) {
            chrome.notifications.update(notificationId, {
                progress: Math.round(progress)
            }, function () {
                var storage = {};
                storage[episode.feed] = [];
                chrome.storage.local.get(storage, function (result) {
                    episode.downloaded = progress;
                    episode.downloading = progress;

                    var i = _.findIndex(result[episode.feed], { media: { url: episode.media.url } });
                    if (i !== -1) {
                        result[episode.feed][i] = episode;
                    } else {
                        result[episode.feed].push(episode);
                    }

                    chrome.storage.local.set(result, function () {});
                });
            });
        }

    };

    xhr.onload = function (e) {

        var blob = new Blob([xhr.response], {type: 'audio/mpeg'});

        window.webkitRequestFileSystem(
            PERSISTENT,
            e.total,
            function (fs) {
                console.log('Filesystem: ' + fs);

                fs.root.getFile(
                    mp3,
                    {create: true, exclusive: true},
                    function (fileEntry) {
                        console.log('fileEntry: ' + fileEntry);

                        fileEntry.createWriter(function (fileWriter) {

                            console.log('fileWriter: ' + fileWriter);

                            fileWriter.onwriteend = function (e) {
                                console.log('Write completed.');
                                var storage = {};
                                storage[episode.feed] = [];

                                chrome.storage.local.get(storage, function (result) {
                                    episode.downloaded = e.total;
                                    episode.file = mp3;
                                    result[episode.feed].push(episode);
                                    chrome.storage.local.set(result, function () {

                                        var completedId = 'cloudcatcher' + Math.random(),
                                            completeNotificationData = {
                                                type: 'basic',
                                                message: 'Downloaded: ' + episode.title,
                                                title: episode.podcast,
                                                iconUrl: podcast.imageUrl,
                                                priority: 0
                                            };

                                        chrome.notifications.clear(notificationId, function () {
                                        });
                                        chrome.notifications.create(completedId, completeNotificationData, function () {
                                        });
                                        chrome.notifications.onClicked.addListener(notificationFn(completedId));

                                    });
                                });
                            };

                            fileWriter.onerror = function (e) {
                                console.log('Write failed: ' + e.toString());
                            };

                            fileWriter.write(blob);

                        }, function (e) {
                            console.log('Error: ' + e);
                        });
                    });
            }
        );
    };

    xhr.send();


}