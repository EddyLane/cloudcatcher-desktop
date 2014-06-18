'use strict';

describe('Service: FirebaseProxy', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var FirebaseProxy;
    beforeEach(inject(function (_FirebaseProxy_) {
        FirebaseProxy = _FirebaseProxy_;
    }));

    it('should be an instance of Firebase, which is a function', function () {
        expect(FirebaseProxy).to.be.a('function');
    })

});
