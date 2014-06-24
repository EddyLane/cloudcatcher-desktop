'use strict';

describe('Controller: BasepodcastepisodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BasepodcastepisodesCtrl,
        scope,
        episodes = [
            { title: 'Episode 1' }
        ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        BasepodcastepisodesCtrl = $controller('BasepodcastepisodesCtrl', {
            $scope: scope,
            episodes: episodes
        });
    }));

    it('should attach the episodes resolved to the scope', function () {
        expect(scope.episodes).to.equal(episodes);
        expect(scope.episodes).to.deep.equal(episodes);
    });

});
