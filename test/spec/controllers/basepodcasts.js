'use strict';

describe('Controller: BasepodcastsCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BasepodcastsCtrl,
        scope,
        podcasts;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        podcasts = [
            { name: 'Test Podcast' }
        ];

        scope = $rootScope.$new();
        BasepodcastsCtrl = $controller('BasepodcastsCtrl', {
            $scope: scope,
            podcasts: podcasts
        });
    }));

    it('should put the users podcasts on the scope', function () {
        expect(scope.podcasts).to.equal(podcasts);
        expect(scope.podcasts).to.deep.equal(podcasts);
    })

});
