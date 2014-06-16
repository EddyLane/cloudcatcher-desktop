'use strict';

describe('Controller: BaseCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BaseCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BaseCtrl = $controller('BaseCtrl', {
            $scope: scope
        });
    }));

});
