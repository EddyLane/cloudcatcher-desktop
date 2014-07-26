'use strict';

describe('Service: EpisodeCounter', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var EpisodeCounter,
        GoogleFeedApi,
        $rootScope,
        $q,
        podcasts;

    function resolveFeed (feed) {
        return [
            { media: { url: feed.q + '-episode1' }, date: "2014-04-22T01:30:21.196Z" },
            { media: { url: feed.q + '-episode2' }, date: "2014-04-22T01:32:21.196Z" },
            { media: { url: feed.q + '-episode3' }, date: "2014-04-25T01:32:21.196Z" }
        ];
    }

    beforeEach(inject(function (_EpisodeCounter_, _GoogleFeedApi_, _$q_, _$rootScope_) {

        EpisodeCounter = _EpisodeCounter_;
        GoogleFeedApi = _GoogleFeedApi_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        podcasts = [
            { feed: 'feed1' },
            { feed: 'feed2' },
            { feed: 'feed3' }
        ];

    }));

    it('should be a function', function () {
        expect(EpisodeCounter).to.be.a('function');
    });

    it('should return a promise', function () {
        expect(EpisodeCounter(podcasts).then).to.be.a('function');
    });

    it('should make a http request for each of the podcasts', function () {

        var feedSpy = {
            getList: function () {
                var defer = $q.defer();
                defer.resolve(true);
                return defer.promise;
            }
        };

        sinon.spy(feedSpy, 'getList');

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        EpisodeCounter(podcasts);
        expect(GoogleFeedApi.one).to.have.callCount(3);
        expect(feedSpy.getList).to.have.been.calledThrice;

        expect(feedSpy.getList).to.have.been.calledWith(null, { q: 'feed1' });
        expect(feedSpy.getList).to.have.been.calledWith(null, { q: 'feed2' });
        expect(feedSpy.getList).to.have.been.calledWith(null, { q: 'feed3' });

        GoogleFeedApi.one.restore();
        feedSpy.getList.restore();
    });

    it('should set the episodes property on the podcast as a object with keys set to the episode urls', function () {

        var feedSpy = {
            getList: function (thing, feed) {
                var defer = $q.defer();
                defer.resolve(resolveFeed(feed));
                return defer.promise;
            }
        };

        sinon.spy(feedSpy, 'getList');

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        EpisodeCounter(podcasts);

        $rootScope.$apply();

        expect(podcasts[0].episodes).to.deep.equal({
            'feed1-episode1': false,
            'feed1-episode2': false,
            'feed1-episode3': false
        });
        expect(podcasts[1].episodes).to.deep.equal({
            'feed2-episode1': false,
            'feed2-episode2': false,
            'feed2-episode3': false
        });
        expect(podcasts[2].episodes).to.deep.equal({
            'feed3-episode1': false,
            'feed3-episode2': false,
            'feed3-episode3': false
        });

        GoogleFeedApi.one.restore();
        feedSpy.getList.restore();

    });

    it('should set the episodes property to false if the user has heard the episode already', function () {


        //extend the middle podcast
        _.merge(podcasts[1], { heard: ['feed2-episode2', 'feed2-episode3'] });


        var feedSpy = {
            getList: function (thing, feed) {
                var defer = $q.defer();
                defer.resolve([
                    { media: { url: feed.q + '-episode1' } },
                    { media: { url: feed.q + '-episode2' } },
                    { media: { url: feed.q + '-episode3' } }
                ]);
                return defer.promise;
            }
        };

        sinon.spy(feedSpy, 'getList');

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        EpisodeCounter(podcasts);

        $rootScope.$apply();

        expect(podcasts[0].episodes).to.deep.equal({
            'feed1-episode1': false,
            'feed1-episode2': false,
            'feed1-episode3': false
        });
        expect(podcasts[1].episodes).to.deep.equal({
            'feed2-episode1': false,
            'feed2-episode2': true,
            'feed2-episode3': true
        });
        expect(podcasts[2].episodes).to.deep.equal({
            'feed3-episode1': false,
            'feed3-episode2': false,
            'feed3-episode3': false
        });

        expect(podcasts[0].newEpisodes).to.equal(3);
        expect(podcasts[1].newEpisodes).to.equal(1);
        expect(podcasts[2].newEpisodes).to.equal(3);

        GoogleFeedApi.one.restore();
        feedSpy.getList.restore();


    });

    it('should ignore episodes which dont have a media or url', function () {

        var feedSpy = {
            getList: function (thing, feed) {
                var defer = $q.defer();
                defer.resolve([
                    { media: { url: feed.q + '-episode1' } },
                    {  },
                    { media: { } }
                ]);
                return defer.promise;
            }
        };
        sinon.spy(feedSpy, 'getList');

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        EpisodeCounter(podcasts);

        $rootScope.$apply();

        expect(podcasts[0].episodes).to.deep.equal({
            'feed1-episode1': false
        });
        expect(podcasts[1].episodes).to.deep.equal({
            'feed2-episode1': false
        });
        expect(podcasts[2].episodes).to.deep.equal({
            'feed3-episode1': false
        });

        GoogleFeedApi.one.restore();
        feedSpy.getList.restore();

    });

    it('should add a "newEpisodes" property on to the podcast', function () {

        var feedSpy = {
            getList: function (thing, feed) {
                var defer = $q.defer();
                defer.resolve(resolveFeed(feed));
                return defer.promise;
            }
        };

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        EpisodeCounter(podcasts);

        $rootScope.$apply();

        expect(podcasts[0].newEpisodes).to.equal(3);
        expect(podcasts[1].newEpisodes).to.equal(3);
        expect(podcasts[2].newEpisodes).to.equal(3);

        GoogleFeedApi.one.restore();

    });

    it('should reset the last episode property on each podcast', function () {

        var feedSpy = {
            getList: function (thing, feed) {
                var defer = $q.defer();
                defer.resolve(resolveFeed(feed));
                return defer.promise;
            }
        };

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        var date = new Date();
        moment = sinon.stub();
        moment.returns(date);

        EpisodeCounter(podcasts);

        $rootScope.$apply();
        expect(moment).to.have.been.calledThrice.and.calledWith("2014-04-22T01:30:21.196Z");

        expect(podcasts[0].newEpisodes).to.equal(3);

        expect(podcasts[0].latest).to.equal(date);

        GoogleFeedApi.one.restore();

    });


    it('should add the latest episode to the podcast', function () {

        var feedSpy = {
            getList: function (thing, feed) {
                var defer = $q.defer();
                defer.resolve(resolveFeed(feed));
                return defer.promise;
            }
        };

        sinon.stub(GoogleFeedApi, 'one', function () {
            return feedSpy;
        });

        EpisodeCounter(podcasts);

        $rootScope.$apply();
        expect(podcasts[0].latestEpisode).to.deep.equal({ media: { url: 'feed1-episode1' }, date: "2014-04-22T01:30:21.196Z" });
        expect(podcasts[1].latestEpisode).to.deep.equal({ media: { url: 'feed2-episode1' }, date: "2014-04-22T01:30:21.196Z" });
        expect(podcasts[2].latestEpisode).to.deep.equal({ media: { url: 'feed3-episode1' }, date: "2014-04-22T01:30:21.196Z" });

        GoogleFeedApi.one.restore();

    });
});
