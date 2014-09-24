function createCloudcatcher() {

    return chrome.app.window.create('index.html', {
        'bounds': {
            'width': 1440,
            'height': 884
        },
        minWidth: 700
    });
}

function getNotificationFn(podcast) {
    return function (notificationId) {
        return function (clickedId) {
            var windows;
            if (clickedId === notificationId) {
                windows = chrome.app.window.getAll();
                if (windows.length === 0) {
                    createCloudcatcher(function (window) {
                        window.contentWindow.forwardToPodcast = function () {
                            return podcast.slug;
                        };
                        window.show();
                        window.focus();
                    });
                } else {
                    _.each(windows, function (window) {
                        window.focus();
                        window.show();
                        window.contentWindow.forwardToSlug(podcast.slug);
                    });
                }

            }
        };
    };
}

var recievedIds = [];

chrome.app.runtime.onLaunched.addListener(createCloudcatcher);


window.webkitStorageInfo.queryUsageAndQuota(
    window.PERSISTENT,
    function (usage, quota) {
        console.log('usage ' + usage + ' quota ' + quota);
    },
    function (e) {
        console.log('Error: ' + e);
    });

chrome.gcm.onMessage.addListener(function (message) {

    console.log('incoming notification', message);

    if (recievedIds.indexOf(message.data.id) !== -1) {
        return;
    } else {
        recievedIds.push(message.data.id);
    }

    chrome.storage.local.get('podcasts', function (storedPodcasts) {

        var podcast = _.find(storedPodcasts.podcasts, { feed: message.data.feed });

        console.log('found podcast', podcast);

        chrome.storage.local.get(message.data.slug + ':image', function (data) {
            if (podcast && podcast.autoDownload) {
                podcast.imageUrl = data[message.data.slug + ':image'];
                downloadEpisode(message.data, podcast);
            } else {

                var notificationId = podcast.name + Math.random();
                var notificationData = {
                    type: 'basic',
                    message: message.data.title,
                    title: 'NEW EPISODE: ' + message.data.podcast,
                    iconUrl: data[message.data.slug + ':image'],
                    priority: 0
                };

                chrome.notifications.create(notificationId, notificationData, function (notificationId) {
                    console.log('done notification', notificationId);
                });

                chrome.notifications.onClicked.addListener(getNotificationFn(podcast)(notificationId));


            }
        });

    });


});

console.log('background page');