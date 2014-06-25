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
        serverResponse = {
            username: 'Eddy',
            email: 'Eddy@eddy.com',
            firebase_token: 'abcde'
        },
        dummyPodcasts = [
            { name: 'Test Podcast' }
        ];

    beforeEach(module(function ($provide) {

        EpisodeCounter = sinon.spy();

        $provide.constant('FirebaseAuth', function (user) {

            var defer = $q.defer();

            defer.resolve({
                getPodcasts: function () {
                    var defer = $q.defer();
                    defer.resolve(dummyPodcasts);
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

        it('should return a CloudcatcherUser with podcasts attached if they are logged in', function () {
            var res;

            sinon.stub(CloudcatcherApi, 'one', function (what, which) {
                expect(what).to.equal('users');
                expect(which).to.equal('me');
                return {
                    get: function () {
                        var defer = $q.defer();
                        defer.resolve(serverResponse);
                        return defer.promise;
                    }
                };
            });

            CloudcatcherAuth.check().then(function (_res_) {
                res = _res_;
            });

            $rootScope.$apply();
            expect(res.getPodcasts()).to.deep.equal(dummyPodcasts);
            CloudcatcherApi.one.restore();
        });

        it('should reject it if something does wrong', function () {
            var res,
                error = new Error('rejected');

            sinon.stub(CloudcatcherApi, 'one', function (what, which) {
                expect(what).to.equal('users');
                expect(which).to.equal('me');
                return {
                    get: function () {
                        var defer = $q.defer();
                        defer.reject(error);
                        return defer.promise;
                    }
                };
            });

            CloudcatcherAuth.check().catch(function (_res_) {
                res = _res_;
            });

            $rootScope.$apply();
            expect(res).to.equal(error);
            CloudcatcherApi.one.restore();
        });

        it('should call the EpisodeCounter service to count new episodes', function () {
            var res;

            sinon.stub(CloudcatcherApi, 'one', function (what, which) {
                expect(what).to.equal('users');
                expect(which).to.equal('me');
                return {
                    get: function () {
                        var defer = $q.defer();
                        defer.resolve(serverResponse);
                        return defer.promise;
                    }
                };
            });

            CloudcatcherAuth.check().then(function (_res_) {
                res = _res_;
            });

            $rootScope.$apply();

            expect(EpisodeCounter).to.have.been.calledOnce;
            expect(EpisodeCounter).to.have.been.calledWithExactly(dummyPodcasts);

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
