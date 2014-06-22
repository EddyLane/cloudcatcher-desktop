'use strict';

describe('Factory: Cloudcatcheruser', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var CloudcatcherUser,
        userData,
        user;

    beforeEach(inject(function (_CloudcatcherUser_) {

        userData = {
            username: 'eddy',
            email: 'eddy@eddylane.co.uk',
            firebase_token: 'abcdefg12345'
        };
        CloudcatcherUser = _CloudcatcherUser_;
        user = CloudcatcherUser(userData);
    }));

    it('should have a username', function () {
        expect(user.getUsername()).to.equal('eddy');
    });

    it('should have an email address', function () {
        expect(user.getEmail()).to.equal('eddy@eddylane.co.uk');
    });

    it('should have a firebase token', function () {
        expect(user.getFirebaseToken()).to.equal('abcdefg12345')
    });

    it('should allow you to set podcasts', function () {
        var podcasts = [
            { id: 1, name: 'Eddys fab podcast' }
        ];

        expect(user.setPodcasts(podcasts)).to.equal(user);
        expect(user.getPodcasts()).to.deep.equal(podcasts);
    });


});
