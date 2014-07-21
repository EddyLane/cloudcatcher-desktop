'use strict';

describe('Controller: BaseCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BaseCtrl,
        scope,
        user,
        podcasts,
        currentlyPlaying,
        audioPlayer;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {

        podcasts = [
            { name: 'Test Podcast' }
        ];

        currentlyPlaying = {
            id: 1, progress: 50.414
        };

        user = {
            getPodcasts: function () {
                return podcasts;
            },
            getCurrentPlaying: function () {
                return currentlyPlaying;
            }
        };

        audioPlayer = {
            play: function () {}
        };

        sinon.spy(audioPlayer, 'play');

        scope = $rootScope.$new();
        BaseCtrl = $controller('BaseCtrl', {
            $scope: scope,
            user: user,
            audioPlayer: audioPlayer
        });

    }));

    it('should assign the resolved users podcasts to the scope', function () {
        expect(scope.podcasts).to.deep.equal(podcasts).and.equal(podcasts);
    });

    it('should assign the resolved users currently playing to the scope', function () {
        expect(scope.currentPlaying).to.deep.equal(currentlyPlaying).and.equal(currentlyPlaying);
    });

    it('should set the header to be collapsed by default', function () {
        expect(scope.isCollapsed).to.be.true;
    });

    it('should start the currently playing podcast to start playing on the audio player if there is one', function () {
        expect(audioPlayer.play).to.have.been.calledOnce.and.calledWithExactly(currentlyPlaying);
    });

});
