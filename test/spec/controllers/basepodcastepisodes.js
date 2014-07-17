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
        current = {
            id: 2
        },
        podcast = {
            title: 'Test Podcast', heard: [ 'something' ]
        },
        $location,
        user,
        audioPlayer,
        hearAll,
        addHeard;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$location_, CloudcatcherUser, CloudcatcherAuth) {
        scope = $rootScope.$new();

        $location = _$location_;

        user = CloudcatcherUser({});

        sinon.stub(user, 'getCurrentPlaying', function () {
            return current;
        });

        audioPlayer = {
            play: function () {}
        };

        hearAll = sinon.spy();
        addHeard = sinon.spy();

        sinon.stub(user, 'hearAll', function () {
            return hearAll;
        });

        sinon.spy(audioPlayer, 'play');


        sinon.stub(CloudcatcherAuth, 'check', function () { return true; });
        sinon.stub(user, 'addHeard', function () {
            return addHeard;
        });

        BasepodcastepisodesCtrl = $controller('BasepodcastepisodesCtrl', {
            $scope: scope,
            episodes: episodes,
            $location: $location,
            podcast: podcast,
            user: user,
            audioPlayer: audioPlayer
        });


    }));

    afterEach(function () {
        user.addHeard.restore();
        user.hearAll.restore();
        user.getCurrentPlaying.restore();
        audioPlayer.play.restore();
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

    it('should change the location query param of search when the page changes', function () {
        scope.page = 2;
        scope.$digest();
        expect($location.search().page).to.equal(2);
    });

    it('should set the page to that in the $location.search if it is there', inject(function ($controller) {
        sinon.stub($location, 'search', function () {
            return {
                page: 3
            }
        });
        BasepodcastepisodesCtrl = $controller('BasepodcastepisodesCtrl', {
            $scope: scope,
            episodes: episodes,
            podcast: podcast,
            user: user,
            $location: $location,
            audioPlayer: audioPlayer
        });
        expect(scope.page).to.equal(3);
        $location.search.restore();

    }));

    it('should assign a total length var to scope', function () {
        expect(scope.total).to.equal(12);
    });

    it('should assign the podcast "heard" to scope', function () {
        expect(scope.heard).to.equal(podcast.heard);
    });

    it('should have a function to trigger listening to an episode, this should call addHeard on the user', function () {
        expect(scope.listen).to.be.a('function');
        expect(user.addHeard).to.have.been.calledOnce.and.calledWithExactly(podcast);
        scope.listen(episodes[0]);
        expect(audioPlayer.play).to.have.been.calledOnce.and.calledWithExactly(episodes[0]);
        expect(addHeard).to.have.been.calledOnce.and.calledWithExactly(episodes[0]);
    });


    it('should have a function that allows you to mark all episodes as played', function () {
        expect(scope.markAllAsPlayed).to.be.a('function');
        scope.markAllAsPlayed();
        expect(user.hearAll).to.have.been.calledOnce.and.calledWithExactly(podcast);
        expect(hearAll).to.have.been.calledOnce.and.calledWithExactly(episodes);
    });

    it('should set currently playing episode to scope', function () {
        expect(scope.current).to.equal(current).and.deep.equal(current);
    });

});
