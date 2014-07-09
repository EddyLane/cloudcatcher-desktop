'use strict';

describe('Service: FirebaseAuth', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var FirebaseAuth, firebase, user, authCallback, $rootScope, loadedCallback, $firebase, $log;

    beforeEach(function () {

        firebase = {
            auth: function (token, cb) {
                authCallback = cb;
            },
            child: function (child) {
                switch(child) {
                    case 'users/Eddy':
                    case 'podcasts':
                    case 'playing':
                        return this;
                    default:
                        throw Error('Unexpected child ' + child);
                }
            }
        };

        $firebase = {
            $on: function (param, cb) {
                loadedCallback = cb;
            }
        };

        $log = {
            error: function (error) {
            }
        };

        sinon.spy(firebase, 'auth');
        sinon.spy(firebase, 'child');
        sinon.spy($firebase, '$on');
        sinon.spy($log, 'error');


        module(function ($provide) {

            $provide.constant('FirebaseProxy', function () {
                return firebase;
            });

            $provide.constant('$firebase', function () {
                return new function () {
                    return $firebase;
                };
            });

            $provide.constant('$log', $log);

        })
    });

    beforeEach(inject(function (FirebaseProxy, _FirebaseAuth_, CloudcatcherUser, _$rootScope_) {

        $rootScope = _$rootScope_;

        FirebaseAuth = _FirebaseAuth_;

        user = CloudcatcherUser({
            username: 'Eddy',
            email: 'Eddy@eddy.com',
            firebase_token: 'abcde'
        });

    }));

    afterEach(function () {
        firebase.auth.restore();
        firebase.child.restore();
        $firebase.$on.restore();
        $log.error.restore();
    });

    it('should be a single function', function () {
        expect(FirebaseAuth).to.be.a('function');
    })

    it('should attempt to connect to the specific users firebase', function () {
        FirebaseAuth(user);
        expect(firebase.auth).to.have.been.calledOnce.and.calledWith('abcde');
    });

    describe('if connection not successful', function () {

        it('should reject the response with the error', function () {
            var res, error = new Error('not authed');
            FirebaseAuth(user).catch(function (_res_) {
                res = _res_;
            });
            authCallback(error);
            $rootScope.$apply();
            expect(res).to.equal(error);
        });

        it('should log out the error message', function () {
            var error = new Error('not authed');
            FirebaseAuth(user);
            authCallback(error);
            $rootScope.$apply();
            expect($log.error).to.have.been.calledOnce.and.calledWithExactly(error);
        });

    });

    describe('if connection successful', function () {

        function setUp() {
            var res;
            FirebaseAuth(user).then(function (_res_) {
                res = _res_;
            });
            authCallback();
            $rootScope.$apply();
            return res;
        }

        if('should connect to that users firebase', function () {
            var res;
            FirebaseAuth(user);
            authCallback();
            $rootScope.$apply();
            expect(firebase.child).to.have.been.calledOnce.and.calledWith('users/Eddy');
        });

        describe('getPodcasts', function () {

            it('should resolve with a getPodcasts function', function () {
                var res = setUp();
                expect(res.getPodcasts).to.be.a('function');
            });

            it('should listen for the loaded event on the podcasts firebase when calling getPodcasts', function () {
                var res = setUp();
                res.getPodcasts();
                expect($firebase.$on).to.have.been.calledOnce.and.calledWith('loaded');
            });

            it('should resolve a call to getPodcasts with the firebase for the podcasts', function () {
                var res = setUp(),
                    loadedRes,
                    call = res.getPodcasts();
                call.then(function (_loadedRes_) {
                    loadedRes = _loadedRes_;
                });
                loadedCallback();
                $rootScope.$apply();
                expect(loadedRes).to.deep.equal($firebase);
            });

        });

        describe('getCurrentPlaying', function () {

            it('should resolve with a getCurrentPlaying function', function () {
                var res = setUp();
                expect(res.getCurrentPlaying).to.be.a('function');
            });

            it('should listen for the loaded event on the podcasts firebase when calling getCurrentPlaying', function () {
                var res = setUp();
                res.getPodcasts();
                expect($firebase.$on).to.have.been.calledOnce.and.calledWith('loaded');
            });

            it('should resolve a call to getCurrentPlaying with the firebase for the currentPlaying', function () {

                var res = setUp(),
                    loadedRes,
                    call = res.getCurrentPlaying();

                call.then(function (_loadedRes_) {
                    loadedRes = _loadedRes_;
                });
                loadedCallback();
                $rootScope.$apply();
                expect(loadedRes).to.deep.equal($firebase);

            });

        });



    });

});
