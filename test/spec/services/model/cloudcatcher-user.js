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

    it('should allow you to add a podcast to the users firebase and return itself', function () {
        var podcast = { title: 'test title' },
            mockFirebase = [];

        mockFirebase.$add = function (podcast) {
            this.push(podcast);
        };

        expect(user.addPodcast).to.be.a('function');

        user.setPodcasts(mockFirebase);

        expect(user.addPodcast(podcast)).to.equal(user);
        expect(user.getPodcasts()[0]).to.equal(podcast);
        expect(user.getPodcasts()[0]).to.deep.equal(podcast);
    });

    it('should allow you to remove a podcast from the users firebase by slug', function () {

        var podcast = { slug: 'podcast1' },
            podcast2 = { slug: 'podcas2' },
            mockFirebase = [];

        mockFirebase.$add = function (podcast) {
            this.push(podcast);
        };

        expect(user.removePodcast).to.be.a('function');
        user.setPodcasts(mockFirebase);
        user.addPodcast(podcast);
        user.addPodcast(podcast2);
        expect(user.getPodcasts()).to.have.length(2);
        expect(user.removePodcast({ slug: 'nope' })).to.be.false;;
        expect(user.getPodcasts()).to.have.length(2);
        expect(user.removePodcast(_.cloneDeep(podcast2))).to.be.true;
        expect(user.getPodcasts()).to.have.length(1);
        expect(user.getPodcasts()[0]).to.equal(podcast);

    });

    it('should allow you to find a podcast in the firebase by the slug ', function () {

        var podcast = { slug: 'podcast1' },
            podcast2 = { slug: 'podcas2' },
            mockFirebase = [];

        mockFirebase.$add = function (podcast) {
            this.push(podcast);
        };

        expect(user.findPodcast).to.be.a('function');

        user.setPodcasts(mockFirebase);
        user.addPodcast(podcast);

        expect(user.findPodcast(_.cloneDeep(podcast))).to.equal(podcast);
        expect(user.findPodcast(_.cloneDeep(podcast2))).to.be.undefined;
    });

});
