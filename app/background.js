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

    chrome.storage.local.get(message.data.slug + ':image', function (data) {

        var notificationData = {
            message: message.data.title,
            eventTime: parseInt(message.data.date, 10),
            title: message.data.podcast,
            iconUrl: 'calculator-128.png',
            imageUrl: data[message.data.slug + ':image']
        };

        if (notificationData.imageUrl) {
            notificationData.type = 'image';
            notificationData.iconUrl = notificationData.imageUrl;

//            notificationData.type = 'basic';
        } else {
            notificationData.type = 'basic';
        }


        chrome.notifications.create('cloudcatcher' + Math.random(), notificationData , function (notificationId) {
            console.log('done notification', notificationId);
        });


    });

});

console.log('background page');