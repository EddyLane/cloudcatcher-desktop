'use strict';

describe('Controller: BasepodcastepisodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BasepodcastepisodesCtrl,
        scope,
        episodes = [
            { title: 'Episode 1' }
        ],
        podcast = {
            title: 'Test Podcast'
        },
        user;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, CloudcatcherUser) {
        scope = $rootScope.$new();

        user = CloudcatcherUser({});

        BasepodcastepisodesCtrl = $controller('BasepodcastepisodesCtrl', {
            $scope: scope,
            episodes: episodes,
            podcast: podcast,
            user: user
        });


        sinon.stub(user, 'addHeard', function () {});

    }));

    afterEach(function () {
        user.addHeard.restore();
    });

    it('should attach the episodes resolved to the scope', function () {
        expect(scope.episodes).to.equal(episodes);
        expect(scope.episodes).to.deep.equal(episodes);
    });

    it('should have a function to trigger listening to an episode, this should call addHeard on the user', function () {

        expect(scope.listen).to.be.a('function');

        scope.listen(episodes[0]);

        expect(user.addHeard).to.have.been.calledOnce;
        expect(user.addHeard).to.have.been.calledWithExactly(podcast, episodes[0]);

    });

});
