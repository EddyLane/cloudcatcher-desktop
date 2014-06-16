'use strict';

describe('Service: CloudcatcherApi', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var Restangular,
        callback,
        interceptorCallback,
        configurer;

    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('CLOUDCATCHER_URL', 'cloudcatcher-url');
        })
    });

    beforeEach(inject(function (_Restangular_) {

        Restangular = _Restangular_;

        sinon.stub(Restangular, 'withConfig', function (cb) {
            callback = cb;
            return true;
        });

        configurer = {
            setBaseUrl: sinon.spy(),
            addFullRequestInterceptor: function () {}
        };

        sinon.stub(configurer, 'addFullRequestInterceptor', function (cb) {
            interceptorCallback = cb;
            return true;
        });


    }));

    afterEach(function () {
        Restangular.withConfig.restore();
    });

    it('should exist', inject(function (CloudcatcherApi) {
        expect(CloudcatcherApi).to.exist;
    }));

    describe('Basic configuration', function () {

        it('should return Restangular with config', inject(function (CloudcatcherApi) {
            expect(Restangular.withConfig).to.have.been.called;
        }));

        it('should set the base url to that specified in a constant', inject(function (CloudcatcherApi) {
            callback(configurer);
            expect(configurer.setBaseUrl).to.have.been.calledWithExactly('cloudcatcher-url');
        }));

    });

    describe('Formatters and interceptors', function () {

        it('should set add one request interceptor', inject(function (CloudcatcherApi) {
            callback(configurer);
            expect(configurer.addFullRequestInterceptor).to.have.been.calledOnce;
        }));

        it('should set the Content-Type header to form-url encoded if the login action', function () {
            var request;
            request = interceptorCallback({ username: 'Eddy', password: 'Lane' }, 'POST', 'not');
            expect(request.headers).to.deep.equal({});
            request = interceptorCallback({ username: 'Eddy', password: 'Lane' }, 'POST', 'login');
            expect(request.headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
        });

        it('should url encode the parametters if the login action', function () {

            var request;
            request = interceptorCallback({ username: 'Eddy', password: 'Lane' }, 'POST', 'not');
            expect(request.element).to.deep.equal({ username: 'Eddy', password: 'Lane' });

            request = interceptorCallback({ username: 'Eddy', password: 'Lane' }, 'POST', 'login');
            expect(request.element).to.equal('_username=Eddy&_password=Lane');

        });


    });

});
