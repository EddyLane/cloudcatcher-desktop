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

    it('should allow you to remove a podcast from the users firebase by itunesId', function () {

        var podcast = { itunesId: 'podcast1' },
            podcast2 = { itunesId: 'podcas2' },

            mockFirebase = {
                1: podcast,
                2: podcast2,

                $remove: function (key) {
                    delete this[key];
                }

            };

        user.setPodcasts(mockFirebase);

        expect(user.removePodcast).to.be.a('function');

        expect(_.size(user.getPodcasts())).to.equal(2);

        expect(user.removePodcast({ itunesId: 'nope' })).to.be.false;;
        expect(_.size(user.getPodcasts())).to.equal(2)

        expect(user.removePodcast(_.cloneDeep(podcast2))).to.be.true;
        expect(_.size(user.getPodcasts())).to.equal(1);

        expect(user.getPodcasts()[0]).to.equal(podcast);

    });

    it('should allow you to find a podcast in the firebase by the itunesId ', function () {

        var podcast = { itunesId: 'podcast1' },
            podcast2 = { itunesId: 'podcas2' },

            mockFirebase = {
                12345: podcast
            };

        expect(user.findPodcast).to.be.a('function');

        user.setPodcasts(mockFirebase);

        expect(user.findPodcast(_.cloneDeep(podcast))).to.equal(podcast);
        expect(user.findPodcast(_.cloneDeep(podcast2))).to.be.undefined;
    });

    it('should have a function to add a new "heard" property to a podcast for an episode', function () {
        var podcast = { title: 'Test', heard: {} },
            episode = { media: { url: 'testurl' } };

        expect(user.addHeard).to.be.a('function');

        user.addHeard(podcast, episode);
        expect(podcast.heard.testurl).to.be.true;
    });

});
