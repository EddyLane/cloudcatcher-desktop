self.addEventListener('message', function(e) {

    console.log('yo got dis promise', e.data);
    console.log(e);

//    self.postMessage(e.data);
}, false);