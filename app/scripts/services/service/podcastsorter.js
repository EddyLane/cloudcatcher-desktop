'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherDesktopApp.PodcastSorter
 * @description
 * # PodcastSorter
 * Service in the cloudcatcherDesktopApp.
 */

function PodcastSorter() {

    var PodcastSorter = {};

    /**
     * Get a Sorter to function by a property of the objects
     *
     * @param podcasts
     * @returns {Sorter}
     */
    PodcastSorter.getSorter = function (podcasts) {

        return function Sorter(type) {

            var sorted = _(podcasts).sortBy(type).filter(function (e) {
                return _.isPlainObject(e);
            });

            switch (type) {
                case 'newEpisodes':
                case 'latest':
                    sorted.reverse();
            }

            podcasts = sorted.value();
            return podcasts;
        };

    };

    return PodcastSorter;

}

angular.module('cloudcatcherSharedServices')
    .service('PodcastSorter', PodcastSorter);
