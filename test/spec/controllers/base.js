'use strict';

describe('Controller: BaseCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BaseCtrl,
        scope,
        user;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        user = {"username":"bob","username_canonical":"bob","email":"bob@bob.com","id":1,"firebase_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0MDI5NTczNzIsImRlYnVnIjpmYWxzZSwidiI6MCwiZCI6eyJ1c2VybmFtZSI6ImJvYiJ9fQ.6zuHHzAn9zgVJOw_JVc34DJ4Zx9Xut1BLAfSqUFRmRQ"};

        scope = $rootScope.$new();
        BaseCtrl = $controller('BaseCtrl', {
            $scope: scope,
            user: user
        });
    }));

    it('should assign the resolved user to the scope', function () {
        expect(scope.user).to.deep.equal(user);
    });

});
