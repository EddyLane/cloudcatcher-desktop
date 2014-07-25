'use strict';

describe.only('Controller: PodcastlistCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var PodcastlistCtrl,
        PodcastSorter,
        sortedPodcasts,
        sortStub,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        scope.original = [
            { id: 1, name: 'Test' }
        ];

        sortedPodcasts = [
            { id: 1, name: 'Test' }
        ];

        sortStub = sinon.stub();

        PodcastSorter = {
            getSorter: function () {
                return sortStub;
            }
        };

        sinon.spy(PodcastSorter, 'getSorter');

        PodcastlistCtrl = $controller('PodcastlistCtrl as podcastList', {
            PodcastSorter: PodcastSorter,
            $scope: scope
        });
    }));

    it('should have a sortBy function on scope and should sort by name by default', function () {
        sortStub.returns(sortedPodcasts);
        scope.$digest();
        expect(PodcastSorter.getSorter).to.have.been.calledOnce.and.calledWithExactly(scope.original);
        expect(scope.sortBy).to.be.a('function');
        expect(sortStub).to.have.been.calledOnce.and.calledWithExactly('name');
        expect(scope.podcasts).to.equal(sortedPodcasts).and.deep.equal(sortedPodcasts);
        expect(scope.type).to.equal('name');
    });

    it('should be able to sort by something else', function () {
        sortStub.returns(sortedPodcasts);
        scope.$digest();
        expect(scope.sortBy).to.be.a('function');
        scope.sortBy('newEpisodes');
        expect(sortStub).to.have.been.calledTwice.and.calledWithExactly('newEpisodes');
        expect(PodcastSorter.getSorter).to.have.been.calledOnce.and.calledWithExactly(scope.original);
        expect(scope.podcasts).to.equal(sortedPodcasts).and.deep.equal(sortedPodcasts);
        expect(scope.type).to.equal('newEpisodes');
    });

    it('should update when the original object changes', function () {
        sortStub.returns(sortedPodcasts);
        scope.$digest();
        expect(scope.sortBy).to.be.a('function');

        scope.original.push({ id: 2, name: 'Test two' });
        scope.$digest();
        expect(PodcastSorter.getSorter).to.have.been.calledTwice.and.calledWith(scope.original);
        expect(scope.podcasts).to.equal(sortedPodcasts).and.deep.equal(sortedPodcasts);
        expect(scope.type).to.equal('name');
    });

});
