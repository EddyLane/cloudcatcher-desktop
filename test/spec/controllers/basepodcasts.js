'use strict';

describe('Controller: BasepodcastsCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BasepodcastsCtrl,
        scope,
        podcasts,
        $timeout;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$timeout_, CloudcatcherAuth) {

        sinon.stub(CloudcatcherAuth, 'check', function () {
            return true;
        });

        $timeout = _$timeout_;

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
        $timeout.flush();
        expect(scope.listPodcasts).to.equal(podcasts);
    });

});
