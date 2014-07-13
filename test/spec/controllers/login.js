'use strict';

describe('Controller: LoginCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var LoginCtrl,
        scope,
        $state;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$state_) {
        scope = $rootScope.$new();
        $state = _$state_;
        LoginCtrl = $controller('LoginCtrl', {
            $scope: scope,
            $state: $state
        });

        sinon.stub($state, 'go', function () {
            return true;
        });

    }));

    afterEach(function () {
        $state.go.restore();
    });

    it('should redirect to base on the "loginForm_success" event', function () {
        scope.$emit('loginForm_success');
        expect($state.go).to.have.been.calledWithExactly('base.podcasts');
    });

});
