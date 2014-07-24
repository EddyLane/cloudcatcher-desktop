'use strict';

describe('Controller: PodcastinfoCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var PodcastinfoCtrl,
        scope,
        episodes;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        episodes = [];
        episodes.meta = {
            summary: 'blah'
        };

        scope = $rootScope.$new();
        PodcastinfoCtrl = $controller('PodcastinfoCtrl', {
            $scope: scope,
            episodes: episodes
        });
    }));

    it('should assign the episodes meta to scope', function () {
        expect(scope.info).to.equal(episodes.meta);
    });

});
