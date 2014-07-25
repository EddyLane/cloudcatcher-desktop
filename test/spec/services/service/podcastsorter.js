'use strict';

describe('Service: PodcastSorter', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var PodcastSorter,
        podcasts;

    beforeEach(inject(function (_PodcastSorter_) {
        podcasts = [
            { id: 3, name: 'Eddy', newEpisodes: 5, latest: "2014-06-20T09:08:00Z" },
            { id: 2, name: 'Tom', newEpisodes: 10, latest: "2014-06-20T09:09:00Z" },
            { id: 1, name: 'Adam and Joe', newEpisodes: 9, latest: "2012-11-18T10:00:00Z" }
        ];
        PodcastSorter = _PodcastSorter_;
    }));

    function getSorter() {
        return PodcastSorter.getSorter(podcasts);
    }

    it('should have curry function to get a new sorter', function () {
        expect(PodcastSorter.getSorter).to.be.a('function');
        expect(PodcastSorter.getSorter(podcasts)).to.be.a('function');
    });

    it('should allow you to sort by name', function () {
        var sorter = getSorter();
        var result = sorter('name');
        expect(_.pluck(result, 'name')).to.deep.equal(['Adam and Joe', 'Eddy', 'Tom']);
    });

    it('should allow you to sort by newEpisodes', function () {
        var sorter = getSorter();
        var result = sorter('newEpisodes');
        expect(_.pluck(result, 'name')).to.deep.equal(['Tom', 'Adam and Joe', 'Eddy']);
    });

    it('should allow you to sort by newest', function () {
        var sorter = getSorter();
        var result = sorter('latest');
        expect(_.pluck(result, 'name')).to.deep.equal(['Tom', 'Eddy', 'Adam and Joe']);
    });

});
