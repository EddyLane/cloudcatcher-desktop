'use strict';

describe('Service: CloudcatcherAuth', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var CloudcatcherAuth,
        CloudcatcherApi,
        $httpBackend,

        serverResponse;

    beforeEach(inject(function (_CloudcatcherAuth_, _$httpBackend_, _CloudcatcherApi_) {
        CloudcatcherAuth = _CloudcatcherAuth_;
        $httpBackend = _$httpBackend_;
        CloudcatcherApi = _CloudcatcherApi_;

        serverResponse = {
            username: 'Eddy',
            email: 'Eddy@eddy.com',
            firebase_token: 'abcde'
        };

    }));

    it('should have an authenticate method', function () {
        expect(CloudcatcherAuth.authenticate).to.be.a('function');
    });

    it('should have a check method', function () {
        expect(CloudcatcherAuth.check).to.be.a('function');
    });


//    it('should attempt to authenticate against the API and format the request as form url encoded and return a promise', function () {
//        var resolved;
//
//        $httpBackend.expectPOST(CloudcatcherApi.configuration.baseUrl + '/security/login', '_username=eddy&_password=lane', function (headers) {
//            return headers['Content-Type'] === 'application/x-www-form-urlencoded';
//        }).respond(serverResponse);
//
//        CloudcatcherAuth.authenticate('eddy', 'lane').then(function (data) {
//            resolved = CloudcatcherApi.stripRestangular(data);
//        });
//
//        $httpBackend.flush();
//
//        console.log(resolved);
//        expect(resolved).to.deep.equal(serverResponse);
//
//        $httpBackend.verifyNoOutstandingExpectation();
//    });


});
