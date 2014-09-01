'use strict';

/**
 * @ngInject
 * @param $scope
 * @param $state
 * @param results
 * @param user
 * @param $location
 * @param ImageLoader
 * @constructor
 */
function SearchCtrl($scope, $state, results, term, user, $location, ImageLoader) {


    _.assign($scope, {

        toggleSubscription: function (podcast) {
            user.findPodcast(podcast) ? user.removePodcast(podcast) : user.addPodcast(podcast);
        },

        select: function (podcast) {
            if (this.selected === podcast) {
                this.$parent.selected = null;
            } else {
                this.$parent.selected = podcast;
                $state.go('base.search.preview', { preview: podcast.feed });
            }
        },

        term: term,

        isSubscribed: user.findPodcast

    });

    ImageLoader.loadImages(results).then(function () {
        $scope.results = results;
    });

    if ($location.search().preview) {
        $scope.select(_.find(results, { feed: $location.search().preview }));
    }

}

/**
 * Resolve search results
 *
 * @type {{results: *[]}}
 */
SearchCtrl.resolve = {

    results: ['ItunesPodcastApi', '$stateParams', function (ItunesPodcastApi, $stateParams) {
        return ItunesPodcastApi.all('search').getList({ term: $stateParams.term });
    }],

    term: ['$stateParams', function ($stateParams) {
        return $stateParams.term;
    }]

};

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the cloudcatcherDesktopApp
 */
angular.module('cloudcatcherDesktopApp')
    .controller('SearchCtrl', SearchCtrl);