'use strict';

describe('Controller: PodcastsunplayedCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var PodcastsunplayedCtrl,
        PodcastSorter,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        scope.podcasts = [
            { id: 1 },
            { id: 2 }
        ];

        PodcastSorter = {
            getSorter: sinon.stub()
        };

        PodcastSorter.getSorter.returns(function (sort) {
            expect(sort).to.equal('latest');
            return [
                { id: 2 },
                { id: 1 }
            ];
        });

        PodcastsunplayedCtrl = $controller('PodcastsunplayedCtrl', {
            $scope: scope,
            PodcastSorter: PodcastSorter
        });
    }));

    it('should sort the podcasts by latest episodes', function () {
        expect(PodcastSorter.getSorter).to.have.been.calledOnce;
        expect(scope.podcasts).to.deep.equal([
            { id: 2 },
            { id: 1 }
        ])

    });

});
