'use strict';

describe('Service: FirebaseAuth', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var FirebaseAuth, firebase, user, authCallback, $rootScope, loadedCallback, $firebase;

    beforeEach(function () {

        firebase = {
            auth: function (token, cb) {
                authCallback = cb;
            },
            child: function () {
                return this;
            }
        };

        $firebase = {
            $on: function (param, cb) {
                loadedCallback = cb;
            }
        };

        sinon.spy(firebase, 'auth');
        sinon.spy(firebase, 'child');
        sinon.spy($firebase, '$on');

        module(function ($provide) {

            $provide.constant('FirebaseProxy', function () {
                return firebase;
            });

            $provide.constant('$firebase', function () {
                return new function () {
                    return $firebase;
                };
            });

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
    });

    it('should be a single function', function () {
        expect(FirebaseAuth).to.be.a('function');
    })

    it('should attempt to connect to the specific users firebase', function () {
        FirebaseAuth(user);
        expect(firebase.auth).to.have.been.calledOnce;
        expect(firebase.auth).to.have.been.calledWith('abcde');
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

    });

    describe('if connection successful', function () {

        if('should connect to that users firebase', function () {
            var res;
            FirebaseAuth(user);
            authCallback();
            $rootScope.$apply();
            expect(firebase.child).to.have.been.calledOnce;
            expect(firebase.auth).to.have.been.calledWith('users/Eddy');
        });

        it('should resolve with a getPodcasts function', function () {
            var res;
            FirebaseAuth(user).then(function (_res_) {
                res = _res_;
            });
            authCallback();
            $rootScope.$apply();
            expect(res.getPodcasts).to.be.a('function');
        });

        it('should listen for the loaded event on the podcasts firebase when calling getPodcasts', function () {
            var res, loadedRes;
            FirebaseAuth(user).then(function (_res_) {
                res = _res_;
            });
            authCallback();
            $rootScope.$apply();
            res.getPodcasts();
            expect($firebase.$on).to.have.been.calledOnce;
            expect($firebase.$on).to.have.been.calledWith('loaded');
        });

        it('should resolve a call to getPodcasts with the firebase for the podcasts', function () {
            var res, call, loadedRes;
            FirebaseAuth(user).then(function (_res_) {
                res = _res_;
            });
            authCallback();
            $rootScope.$apply();
            call = res.getPodcasts();
            call.then(function (_loadedRes_) {
                loadedRes = _loadedRes_;
            });
            loadedCallback();
            $rootScope.$apply();
            expect(loadedRes).to.deep.equal($firebase);
        });


    });

});
