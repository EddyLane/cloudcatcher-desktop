'use strict';

describe('Directive: loginForm', function () {

    // load the directive's module
    beforeEach(function () {
        module('cloudcatcherDesktopApp');
        module('cloudcatcherSharedServices');
    });

    var element,
        scope,
        CloudCatcherAuth,
        $q;

    beforeEach(inject(function ($rootScope, $compile, _CloudcatcherAuth_, _$q_) {

        CloudCatcherAuth = _CloudcatcherAuth_;
        $q = _$q_;

        sinon.stub(CloudCatcherAuth, 'check', function () {
            var defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });

        scope = $rootScope.$new();
        element = angular.element('<login-form></login-form>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    afterEach(function () {
        CloudCatcherAuth.check.restore();
    });


    it('should have a submit function', function () {
        expect(scope.submit).to.be.a('function');
    });

    it('should assign base values to scope', function () {
        expect(scope.values).to.deep.equal({
            username: '',
            password: ''
        });
    });

    it('should set a submitted var on scope to true when the form is submitted', function () {
        expect(scope.submitted).to.be.false;
        scope.submit();
        expect(scope.submitted).to.be.true;
    });

    it('should assign the forms name to scope', function () {
        expect(scope.name).to.equal('loginForm');
    })

    it('should return early from submission if the form isnt valid', function () {
        sinon.spy(CloudCatcherAuth, 'authenticate');
        expect(scope.submit()).to.be.false;
        expect(CloudCatcherAuth.authenticate).to.have.not.been.called;
        CloudCatcherAuth.authenticate.restore();
    });

    it('should try and authenticate with the auth service if the form is valid', function () {
        sinon.spy(CloudCatcherAuth, 'authenticate');
        scope.values.username = 'Eddy';
        scope.values.password = 'Lane';
        scope.$apply();
        scope.submit();
        expect(CloudCatcherAuth.authenticate).to.have.been.calledOnce;
        expect(CloudCatcherAuth.authenticate).to.have.been.calledWithExactly('Eddy', 'Lane');
        CloudCatcherAuth.authenticate.restore();
    });

    it('should set a submitting propert on and off regardless of response', function () {
        sinon.stub(CloudCatcherAuth, 'authenticate', function () {
            var defer = $q.defer();
            defer.resolve();
            return defer.promise;
        });
        expect(scope.submitting).to.not.exist;
        scope.values.username = 'Eddy';
        scope.values.password = 'Lane';
        scope.$apply();
        scope.submit();
        expect(scope.submitting).to.be.true;
        scope.$apply();
        expect(scope.submitting).to.be.false;
    });

    describe('success', function () {

        it('should $emit its cheerful success message', function () {

            sinon.stub(CloudCatcherAuth, 'authenticate', function () {
                var defer = $q.defer();
                defer.resolve();
                return defer.promise;
            });

            sinon.spy(scope, '$emit');

            scope.values.username = 'Eddy';
            scope.values.password = 'Lane';
            scope.$apply();
            scope.submit();
            expect(scope.$emit).to.have.not.been.called;
            scope.$apply();
            expect(scope.$emit).to.have.been.calledOnce;
            expect(scope.$emit).to.have.been.calledWithExactly('loginForm_success');
            CloudCatcherAuth.authenticate.restore();
            scope.$emit.restore();
        });


    });

    describe('failure', function () {

        it('should $emit its sad failure message', function () {

            sinon.stub(CloudCatcherAuth, 'authenticate', function () {
                var defer = $q.defer();
                defer.reject();
                return defer.promise;
            });

            sinon.spy(scope, '$emit');

            scope.values.username = 'Eddy';
            scope.values.password = 'Lane';
            scope.$apply();
            scope.submit();
            expect(scope.$emit).to.have.not.been.called;
            scope.$apply();
            expect(scope.$emit).to.have.been.calledOnce;
            expect(scope.$emit).to.have.been.calledWithExactly('loginForm_failure');
            CloudCatcherAuth.authenticate.restore();
            scope.$emit.restore();

        });

        it('should set an error message on scope', function () {

            sinon.stub(CloudCatcherAuth, 'authenticate', function () {
                var defer = $q.defer();
                defer.reject();
                return defer.promise;
            });

            scope.values.username = 'Eddy';
            scope.values.password = 'Lane';
            scope.$apply();
            scope.submit();
            scope.$apply();

            expect(scope.error).to.equal('Incorrect username or password');

            CloudCatcherAuth.authenticate.restore();

        });

        it('should reset the error each submit', function () {

            scope.error = 'Error message';
            scope.submit();
            expect(scope.error).to.be.null;

        });

    });


});
