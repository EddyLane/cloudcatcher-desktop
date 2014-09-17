chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': 1440,
            'height': 884
        }
    });
});

chrome.gcm.onMessage.addListener(function(message) {

    console.log('incoming notification', message);

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

                chrome.notifications.create(notificationId, notificationData , function (notificationId) {
                    console.log('done notification', notificationId);
                });

            }
        });

    });



});

console.log('background page');