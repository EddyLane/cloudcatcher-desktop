'use strict';

describe('Controller: BasepodcastCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var BaseCtrl,
        BasepodcastCtrl,
        CloudcatcherAuth,
        GoogleFeedApi,
        user,
        scope,
        $rootScope,
        baseScope,
        $q,
        podcast,

        dummyEpisodes = [
            { title: 'Test Episode', image: 'testimage.jpg' }
        ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, _$rootScope_, _GoogleFeedApi_, _$q_, _CloudcatcherAuth_, CloudcatcherUser) {

        GoogleFeedApi = _GoogleFeedApi_;
        $rootScope = _$rootScope_;
        CloudcatcherAuth = _CloudcatcherAuth_;
        $q = _$q_;

        user = CloudcatcherUser({"username":"bob","username_canonical":"bob","email":"bob@bob.com","id":1,"firebase_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0MDI5NTczNzIsImRlYnVnIjpmYWxzZSwidiI6MCwiZCI6eyJ1c2VybmFtZSI6ImJvYiJ9fQ.6zuHHzAn9zgVJOw_JVc34DJ4Zx9Xut1BLAfSqUFRmRQ"});
        _.merge(user, {
            getPodcasts: function () {
                return [
                    { slug: 'eddys-awesome-podcast' }
                ]
            }
        });

        podcast = { slug: 'eddys-awesome-podcast' };

        baseScope = $rootScope.$new();



        BaseCtrl = $controller('BaseCtrl', {
            $scope: baseScope,
            user: user,
            audioPlayer: {}
        });

        sinon.stub(CloudcatcherAuth, 'check', function () {
            return true;
        });

        scope = baseScope.$new();

        BasepodcastCtrl = $controller('BasepodcastCtrl', {
            $scope: scope,
            podcast: podcast,
            episodes: dummyEpisodes,
            user: user
        });

    }));

    afterEach(function () {
        CloudcatcherAuth.check.restore();
    });

    it('should set the resolved podcast to scope', function () {
        expect(scope.podcast).to.equal(podcast);
        expect(scope.podcast).to.deep.equal(podcast);
    });

    it('should have an unsubscribe function on scope which removes the podcast and changes state', function () {
        sinon.spy(user, 'removePodcast');
        expect(scope.unsubscribe).to.be.a('function');
        scope.unsubscribe();
        expect(user.removePodcast).to.have.been.calledOnce;
        expect(user.removePodcast).to.have.been.calledWithExactly(podcast);
        user.removePodcast.restore();
    });

});
