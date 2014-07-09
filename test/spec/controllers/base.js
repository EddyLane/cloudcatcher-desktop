'use strict';

describe('Controller: BaseCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BaseCtrl,
        scope,
        user,
        podcasts,
        currentlyPlaying;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        podcasts = [
            { name: 'Test Podcast' }
        ];

        currentlyPlaying = {
            id: 1
        };

        user = {
            getPodcasts: function () {
                return podcasts;
            },
            getCurrentPlaying: function () {
                return currentlyPlaying;
            }
        };

        scope = $rootScope.$new();
        BaseCtrl = $controller('BaseCtrl', {
            $scope: scope,
            user: user
        });
    }));

    it('should assign the resolved users podcasts to the scope', function () {
        expect(scope.podcasts).to.deep.equal(podcasts).and.equal(podcasts);
    });

    it('should assign the resolved users currently playing to the scope', function () {
        expect(scope.currentPlaying).to.deep.equal(currentlyPlaying).and.equal(currentlyPlaying);
    });

});
