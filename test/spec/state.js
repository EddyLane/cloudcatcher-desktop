'use strict';

describe('Router', function () {

    var $state, $rootScope, CloudcatcherAuth, $q, $injector, CloudcatcherUser, GoogleFeedApi,
        podcastEpisodes = [
            { name: 'testEp1' },
            { name: 'testEp2' }
        ],
        userPodcasts = [
            { slug: 'testtwo' },
            { slug: 'test', feed: 'feedy' }
        ],
        checkResponse = {
            username: 'Eddy',
            getPodcasts: function () {
                return userPodcasts;
            }
        },
        user;

    beforeEach(function () {

        module('cloudcatcherDesktopApp');

        inject(function (_$rootScope_, _$state_, _CloudcatcherAuth_, _$q_, _$injector_, _CloudcatcherUser_, _GoogleFeedApi_) {
            CloudcatcherAuth = _CloudcatcherAuth_;
            CloudcatcherUser = _CloudcatcherUser_;
            $rootScope = _$rootScope_;
            GoogleFeedApi = _GoogleFeedApi_;
            $state = _$state_;
            $q = _$q_;
            $injector = _$injector_;
        });

        sinon.stub(CloudcatcherAuth, 'check', function () {
            return checkResponse;
        });

        sinon.stub(GoogleFeedApi, 'one', function (type, thing) {

            expect(type).to.equal('load');
            expect(thing).to.equal('feedy');

            return {
                get: function () {
                    var defer = $q.defer();
                    defer.resolve(podcastEpisodes);
                    return defer.promise;
                }
            }
        });

        user = CloudcatcherUser(checkResponse);
        user.setPodcasts(userPodcasts);

    });

    afterEach(function () {
        CloudcatcherAuth.check.restore();
    });

    describe('State: "base"', function () {

        it('should respond to URL', function () {
            expect($state.href('base')).to.equal('');
        });

        it('should resolve the user', function () {
            $state.go('base');
            $rootScope.$digest();
            expect($state.current.name).to.equal('base');
            expect($injector.invoke($state.current.resolve.user)).to.deep.equal(checkResponse);
        });

    });

    describe('State: "base.podcast"', function () {

        it('should respond to URL', function () {
            expect($state.href('base.podcast', { slug: 'test' })).to.equal('#/test');
        });

        it('should resolve the podcast specified', function () {
            $state.go('base.podcast', { slug: 'test' });
            $rootScope.$digest();
            expect($state.current.name).to.equal('base.podcast');
            expect($injector.invoke($state.current.resolve.podcast, null, { user: user })).to.deep.equal(userPodcasts[1]);
        });

        it('should resolve the episodes for the podcast', function () {
            var res;
            $state.go('base.podcast', { slug: 'test' });
            $rootScope.$digest();
            expect($state.current.name).to.equal('base.podcast');
            $injector.invoke($state.current.resolve.episodes, null, { podcast: userPodcasts[1] }).then(function (_res_) {
                res = _res_;
            });
            $rootScope.$apply();
            expect(res).to.deep.equal(podcastEpisodes);
        })

    });

    describe('State: "login"', function () {

        it('should respond to URL', function () {
            expect($state.href('login')).to.equal('#/login');
        });

    });

});