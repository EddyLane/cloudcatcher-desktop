'use strict';

describe('Router', function () {

    var $state, $rootScope, CloudcatcherAuth, $q, $injector, CloudcatcherUser,
        userPodcasts = [
            { slug: 'testtwo' },
            { slug: 'test' }
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

        inject(function (_$rootScope_, _$state_, _CloudcatcherAuth_, _$q_, _$injector_, _CloudcatcherUser_) {
            CloudcatcherAuth = _CloudcatcherAuth_;
            CloudcatcherUser = _CloudcatcherUser_;
            $rootScope = _$rootScope_;
            $state = _$state_;
            $q = _$q_;
            $injector = _$injector_;
        });

        sinon.stub(CloudcatcherAuth, 'check', function () {
            return checkResponse;
        });

        user = CloudcatcherUser(checkResponse);
        user.setPodcasts(userPodcasts);

    });

    afterEach(function () {
        CloudcatcherAuth.check.restore();
    });

    describe('State: "base"', function () {

        it('should respond to URL', function() {
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

        it('should respond to URL', function() {
            expect($state.href('base.podcast', { slug: 'test' })).to.equal('#/test');
        });

        it('should resolve the podcast specified', function () {
            $state.go('base.podcast', { slug: 'test' });
            $rootScope.$digest();
            expect($state.current.name).to.equal('base.podcast');
            expect($injector.invoke($state.current.resolve.podcast, null, { user: user })).to.deep.equal(userPodcasts[1]);
        });


    });

    describe('State: "login"', function () {

        it('should respond to URL', function() {
            expect($state.href('login')).to.equal('#/login');
        });


    });



});