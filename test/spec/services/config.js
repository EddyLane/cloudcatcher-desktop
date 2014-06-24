'use strict';

describe('Configuration', function () {

    var Restangular,
        $rootScope,
        errorInterceptorCb;

    beforeEach(module('cloudcatcherSharedServices'));

    beforeEach(function () {

        Restangular = {
            setErrorInterceptor: function () {}
        };

        sinon.stub(Restangular, 'setErrorInterceptor', function (cb) {
            errorInterceptorCb = cb;
            return true;
        });

        module(function ($provide) {
            $provide.value('Restangular', Restangular);
        })
    });

    beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    afterEach(function () {
        Restangular.setErrorInterceptor.restore();
    });

    it('should set $httpProvider defaults withCredentials to true', inject(function ($http) {
        expect($http.defaults.withCredentials).to.be.true;
    }));

    it('should add an error interceptor', function () {
        expect(Restangular.setErrorInterceptor).to.have.been.calledOnce;
    });

    it('should add a response interceptor that emits if the status code is 401 and returns true', function () {

        var response = {
            status: 401
        };

        sinon.spy($rootScope, '$emit');

        var cbResult = errorInterceptorCb(response);

        expect($rootScope.$emit).to.have.been.calledOnce;
        expect($rootScope.$emit).to.have.been.calledWithExactly('authenticationError', response);
        expect(cbResult).to.be.true;

        $rootScope.$emit.restore();
    });

    it('should return false and not $emit anything if the status code is not 401', function () {


        var response = {
            status: 400
        };

        sinon.spy($rootScope, '$emit');

        var cbResult = errorInterceptorCb(response);

        expect($rootScope.$emit).to.have.not.been.called;
        expect(cbResult).to.be.false;

        $rootScope.$emit.restore();

    });




});