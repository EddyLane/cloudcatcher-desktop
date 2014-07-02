'use strict';

describe('Controller: BasepodcastepisodesCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BasepodcastepisodesCtrl,
        scope,
        episodes = [
            { title: 'Episode 1' },
            { title: 'Episode 2' },
            { title: 'Episode 3' },
            { title: 'Episode 4' },
            { title: 'Episode 5' },
            { title: 'Episode 6' },
            { title: 'Episode 7' },
            { title: 'Episode 8' },
            { title: 'Episode 9' },
            { title: 'Episode 10' },
            { title: 'Episode 11' },
            { title: 'Episode 12' }

        ],
        podcast = {
            title: 'Test Podcast', heard: [ 'something' ]
        },
        user;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, CloudcatcherUser, CloudcatcherAuth) {
        scope = $rootScope.$new();



        user = CloudcatcherUser({});

        BasepodcastepisodesCtrl = $controller('BasepodcastepisodesCtrl', {
            $scope: scope,
            episodes: episodes,
            podcast: podcast,
            user: user
        });

        sinon.stub(CloudcatcherAuth, 'check', function () { return true; });
        sinon.stub(user, 'addHeard', function () {});

    }));

    afterEach(function () {
        user.addHeard.restore();
    });


    it('should have some pagination stuff', function () {
        expect(scope.page).to.equal(1);
        expect(scope.limit).to.equal(10);
    });

    it('should set the first 10 episodes to scope', function () {
        scope.$apply();
        expect(scope.episodes).to.deep.equal([
            { title: 'Episode 1' },
            { title: 'Episode 2' },
            { title: 'Episode 3' },
            { title: 'Episode 4' },
            { title: 'Episode 5' },
            { title: 'Episode 6' },
            { title: 'Episode 7' },
            { title: 'Episode 8' },
            { title: 'Episode 9' },
            { title: 'Episode 10' }
        ]);
    });

    it('should set the next 10 episodes to scope when page changes', function () {
        scope.page = 2;
        scope.$apply();
        expect(scope.episodes).to.deep.equal([
            { title: 'Episode 11' },
            { title: 'Episode 12' }
        ]);
    });

    it('should assign a total length var to scope', function () {
        expect(scope.total).to.equal(12);
    });

    it('should assign the podcast "heard" to scope', function () {
        expect(scope.heard).to.equal(podcast.heard);
    });

    it('should have a function to trigger listening to an episode, this should call addHeard on the user', function () {

        expect(scope.listen).to.be.a('function');

        scope.listen(episodes[0]);

        expect(user.addHeard).to.have.been.calledOnce;
        expect(user.addHeard).to.have.been.calledWithExactly(podcast, episodes[0]);
    });

});
