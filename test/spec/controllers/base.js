'use strict';

describe('Controller: BaseCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BaseCtrl,
        scope,
        user,
        podcasts;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        podcasts = [
            { name: 'Test Podcast' }
        ];

        user = {
            getPodcasts: function () {
                return podcasts;
            }
        };

        scope = $rootScope.$new();
        BaseCtrl = $controller('BaseCtrl', {
            $scope: scope,
            user: user
        });
    }));

    it('should assign the resolved users podcasts to the scope', function () {
        expect(scope.podcasts).to.deep.equal(podcasts);
        expect(scope.podcasts).to.equal(podcasts);
    });

});
