'use strict';

describe('Service: CloudcatcherAuth', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var CloudcatcherAuth,
        CloudcatcherApi,
        FirebaseAuth,
        $httpBackend,
        $rootScope,
        EpisodeCounter,
        $q,
        serverResponse,
        dummyPodcasts,
        dummyCurrentPlaying;

    beforeEach(module(function ($provide) {

        EpisodeCounter = sinon.spy();

        serverResponse = {
            username: 'Eddy',
            email: 'Eddy@eddy.com',
            firebase_token: 'abcde'
        };

        dummyPodcasts = {
            abcdefg: {},
            $on: function () {
            }
        };

        dummyCurrentPlaying = {
            title: 'Thingy'
        };

        $provide.constant('FirebaseAuth', function (user) {

            var defer = $q.defer();

            defer.resolve({
                getPodcasts: function () {
                    var defer = $q.defer();
                    defer.resolve(dummyPodcasts);
                    return defer.promise;
                },
                getCurrentPlaying: function () {
                    var defer = $q.defer();
                    defer.resolve(dummyCurrentPlaying);
                    return defer.promise;
                }
            });

            return defer.promise;

        });

        $provide.constant('EpisodeCounter', EpisodeCounter);

    }));

    beforeEach(inject(function (_$q_, _CloudcatcherAuth_, _$httpBackend_, _CloudcatcherApi_, _$rootScope_) {
        CloudcatcherAuth = _CloudcatcherAuth_;
        $httpBackend = _$httpBackend_;
        CloudcatcherApi = _CloudcatcherApi_;
        $rootScope = _$rootScope_;
        $q = _$q_;
    }));

    it('should have an authenticate method', function () {
        expect(CloudcatcherAuth.authenticate).to.be.a('function');
    });

    it('should have a check method', function () {
        expect(CloudcatcherAuth.check).to.be.a('function');
    });

    describe('check if authenticated', function () {

        function setUp(response, respondWith) {
            var res;

            sinon.stub(CloudcatcherApi, 'one', function (what, which) {
                expect(what).to.equal('users');
                expect(which).to.equal('me');
                return {
                    get: function () {
                        var defer = $q.defer();
                        defer[response](respondWith);
                        return defer.promise;
                    }
                };
            });

            CloudcatcherAuth.check()
                .then(function (_res_) {
                    res = _res_;
                }).catch(function (_res_) {
                    res = _res_;
                });

            $rootScope.$apply();

            return res;
        }

        it('should return a CloudcatcherUser with podcasts attached if they are logged in', function () {
            var res = setUp('resolve', serverResponse);
            expect(res.getPodcasts()).to.deep.equal(dummyPodcasts);
            CloudcatcherApi.one.restore();
        });

        it('should return a CloudcatcherUser with currentlyPlaying attached if they are logged in', function () {
            var res = setUp('resolve', serverResponse);
            $rootScope.$apply();
            expect(res.getCurrentPlaying()).to.deep.equal(dummyCurrentPlaying);
            CloudcatcherApi.one.restore();
        });

        it('should reject it if something does wrong', function () {
            var error = new Error('rejected');
            var res = setUp('reject', error);
            expect(res).to.equal(error);
            CloudcatcherApi.one.restore();
        });

        it('should call the EpisodeCounter service to count new episodes but only for the actual podcasts in the firebase (plain objects)', function () {
            var res = setUp('resolve', serverResponse),
                expected = _.cloneDeep(dummyPodcasts);
            delete expected.$on;
            expect(EpisodeCounter).to.have.been.calledOnce.and.calledWithExactly(expected);
            CloudcatcherApi.one.restore();
        });

    });

    describe('attempt to authenticate', function () {

        it('should return a CloudcatcherUser with podcasts attached if successful', function () {
            var res;

            sinon.stub(CloudcatcherApi, 'one', function (what) {
                expect(what).to.equal('security');
                return {
                    post: function (thing, userData) {
                        expect(thing).to.equal('login');
                        expect(userData).to.deep.equal({ username: 'eddy', password: 'lane' });
                        var defer = $q.defer();
                        defer.resolve(serverResponse);
                        return defer.promise;
                    }
                };
            });

            CloudcatcherAuth.authenticate('eddy', 'lane').then(function (_res_) {
                res = _res_;
            });

            $rootScope.$apply();
            expect(res.getPodcasts()).to.deep.equal(dummyPodcasts);
            CloudcatcherApi.one.restore();
        });

        it('should reject it if something does wrong', function () {
            var res,
                error = new Error('rejected');

            sinon.stub(CloudcatcherApi, 'one', function (what) {
                expect(what).to.equal('security');
                return {
                    post: function (thing, userData) {
                        expect(thing).to.equal('login');
                        expect(userData).to.deep.equal({ username: 'eddy', password: 'lane' });
                        var defer = $q.defer();
                        defer.reject(error);
                        return defer.promise;
                    }
                };
            });

            CloudcatcherAuth.authenticate('eddy', 'lane').catch(function (_res_) {
                res = _res_;
            });

            $rootScope.$apply();
            expect(res).to.equal(error);
            CloudcatcherApi.one.restore();
        });

    });


});
