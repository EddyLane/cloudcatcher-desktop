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

    chrome.notifications.create('cloudcatcher' + Math.random(), {
        type: 'basic',
        message: 'Whats Occuring?',
        title: 'Yo Dawg',
        iconUrl: 'calculator-128.png'
    }, function (notificationId) {
        console.log('done notification', notificationId);
    });

});

console.log('background page');