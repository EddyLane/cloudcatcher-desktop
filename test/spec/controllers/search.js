'use strict';

describe('Controller: SearchCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var SearchCtrl,
        scope,
        results,
        user;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        results = [
            { title: 'Banter', thing: true }
        ];

        user = sinon.spy();

        scope = $rootScope.$new();
        SearchCtrl = $controller('SearchCtrl', {
            $scope: scope,
            results: results,
            user: user
        });
    }));

    it('should set the results on scope', function () {
        expect(scope.results).to.equal(results);
        expect(scope.results).to.deep.equal(results);
    });

    it('should have a subscribe function on scope', function () {
        expect(scope.subscribe).to.be.a('function');
    });

    it('should allow the user to subscribe to a podcast', function () {

    });

});
