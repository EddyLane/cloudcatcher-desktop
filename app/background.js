chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        'bounds': {
            'width': 1440,
            'height': 884
        }
    });
});

chrome.gcm.onMessage.addListener(function(message) {
    console.log('message', message);

    chrome.storage.local.get(message.data.slug + ':image', function (data) {

        console.log('imagedata', data);

        chrome.notifications.create('cloudcatcher' + Math.random(), {
            type: 'basic',
            message: message.data.title,
            eventTime: parseInt(message.data.date, 10),
            title: message.data.podcast,
            iconUrl: data[message.data.slug + ':image'] || 'calculator-128.png'
        }, function (notificationId) {
            console.log('done notification', notificationId);
        });


    });

});

console.log('background page');