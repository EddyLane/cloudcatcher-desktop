'use strict';

describe('Factory: Cloudcatcheruser', function () {


    // instantiate service
    var CloudcatcherUser,
        EpisodeCounter,
        userData,
        user,
        $q,
        $rootScope,
        mockFirebase;

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));


    beforeEach(function () {
        EpisodeCounter = sinon.spy();
        module(function ($provide) {
            $provide.value('EpisodeCounter', EpisodeCounter);
        });
    });

    beforeEach(inject(function (_CloudcatcherUser_, _$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        userData = {
            username: 'eddy',
            email: 'eddy@eddylane.co.uk',
            firebase_token: 'abcdefg12345'
        };
        CloudcatcherUser = _CloudcatcherUser_;
        user = CloudcatcherUser(userData);
    }));

    function setUpMockFirebase() {
        mockFirebase = {

            123: { title: 'Test', itunesId: 1 },
            456: { title: 'Test2', itunesId: 2 },
            789: { title: 'Test3', itunesId: 3 },

            $update: function () {
            }
        };

        user.setPodcasts(mockFirebase);

    }

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

    it('should allow you to add a podcast to the users firebase, call the EpisodeCounter and return itself', function () {
        var podcast = { title: 'test title', itunesId: 2 },
            mockFirebase = [],
            mockAddedPodcast = _.cloneDeep(podcast); // When added to firebase the reference is lossed

        mockFirebase.$add = function (podcast) {
            var defer = $q.defer();
            this.push(mockAddedPodcast);
            defer.resolve();
            return defer.promise;
        };

        expect(user.addPodcast).to.be.a('function');

        user.setPodcasts(mockFirebase);

        expect(user.addPodcast(podcast)).to.equal(user);

        expect(user.getPodcasts()[0]).to.equal(mockAddedPodcast);
        expect(user.getPodcasts()[0]).to.deep.equal(podcast);

        $rootScope.$apply();

        expect(EpisodeCounter).to.have.been.calledOnce;
        expect(EpisodeCounter).to.have.been.calledWithExactly([mockAddedPodcast]);

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

        expect(_.size(user.getPodcasts())).to.equal(3);

        expect(user.removePodcast({ itunesId: 'nope' })).to.be.false;
        ;
        expect(_.size(user.getPodcasts())).to.equal(3)

        expect(user.removePodcast(_.cloneDeep(podcast2))).to.be.true;
        expect(_.size(user.getPodcasts())).to.equal(2);

        expect(user.getPodcasts()[1]).to.equal(podcast);

    });

    it('should allow you to find a podcast in the firebase by the itunesId ', function () {

        setUpMockFirebase();

        var podcast = mockFirebase[123],
            podcast2 = { itunesId: 'podcas2' };

        expect(user.findPodcast).to.be.a('function');
        expect(user.findPodcast(_.cloneDeep(podcast))).to.equal(mockFirebase[123]);
        expect(user.findPodcast(_.cloneDeep(podcast2))).to.be.undefined;
    });

    it('should have a function to add a new "heard" property to a podcast for an episode', function () {

        var podcast = { title: 'Test', newEpisodes: 3 },
            episode = { media: { url: 'testurl' } };

        setUpMockFirebase();

        user.setPodcasts(mockFirebase);

        expect(user.addHeard).to.be.a('function');

        user.addHeard(podcast, episode);
        expect(podcast.newEpisodes).to.equal(2);
        expect(podcast.heard).to.be.a('array');
        expect(podcast.heard.indexOf(episode.media.url)).to.equal(0);
    });

    it('should allow you to save a podcast to the $firebase, omitting its episodes', function () {

        var payload = { title: 'Test2', itunesId: 2 };

        setUpMockFirebase();

        sinon.spy(mockFirebase, '$update');

        expect(user.savePodcast).to.be.a('function');

        user.setPodcasts(mockFirebase);
        user.savePodcast(payload);

        expect(mockFirebase.$update).to.have.been.calledOnce.and.calledWithExactly({
            456: payload
        });

    });

    it('should allow you to mark all episodes of a podcast as played which should persist to firebase, but not add episodes that are already heard', function () {

        var mockFirebase = {

                123: { title: 'Test', itunesId: 1 },
                456: { title: 'Test2', itunesId: 2 },
                789: { title: 'Test3', itunesId: 3, heard: ['3'] },

                $update: function () {
                }
            },

            episodes = [
                { id: 1, media: { url: '1' } },
                { id: 2, media: { url: '2' } },
                { id: 3, media: { url: '3' } }
            ],

            payload = _.cloneDeep(mockFirebase[789]);

        payload = _.omit(payload, 'episodes');
        payload.heard = ['3', '1', '2'];
        payload.newEpisodes = 0;

        sinon.spy(mockFirebase, '$update');
        user.setPodcasts(mockFirebase);

        expect(user.hearAll).to.be.a('function');

        user.hearAll(mockFirebase[789], episodes);

        expect(mockFirebase[789].heard).to.deep.equal(payload.heard);

        expect(mockFirebase.$update).to.have.been.calledOnce.and.calledWithExactly({
            789: payload
        });

        expect(mockFirebase[789].newEpisodes).to.equal(0);

    });


});
