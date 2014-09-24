'use strict';

/**
 * @ngInject
 * @param $scope
 * @param $location
 * @param episodes
 * @param podcast
 * @param user
 * @param AudioPlayer
 * @param EpisodeStorage
 * @constructor
 */
function BasePodcastEpisodesCtrl ($scope, $location, episodes, podcast, user, AudioPlayer, EpisodeStorage) {

    var addHeard = user.addHeard(podcast),
        hearAll = user.hearAll(podcast),
        locallyStored = EpisodeStorage.getEpisodes(podcast);

    console.log('downloading', podcast.downloading);

    if (podcast.downloading) {
        _.each(podcast.downloading, function (download) {
            var found = _.findIndex(episodes, { media: { url: download.media.url } });
            if (found) {
                episodes[found] = download;
            }
        });
    }

    locallyStored.then(function (stored) {

        console.log('locallyStored', stored);

        _.each(episodes, function (ep) {
            var found = _.find(stored, { media: { url: ep.media.url } });
            if (found) {
                console.log('merging', ep, found);
                ep = _.merge(ep, _.omit(found, 'date'));
            } else {
                ep.downloaded = false;
            }
        });
    });

    _.assign($scope, {

        listen: function (episode) {
            episode.imageUrl = podcast.imageUrl;
            AudioPlayer.play(episode);
            addHeard(episode);
        },

        page: $location.search().page || 1,
        limit: 9,
        total: episodes.length,
        podcast: podcast,
        current: user.getCurrentPlaying(),

        markAllAsPlayed: function () {
            hearAll(episodes);
        },

        store: function (episode) {


            return EpisodeStorage.hasEpisode(episode).then(function (downloaded) {
                if (!downloaded) {
                    EpisodeStorage.storeEpisode(episode, podcast, $scope);
                }
                return downloaded;
            });
        }

    });

    function paginate(page) {

        var start = (page - 1) * $scope.limit,
            end = start + $scope.limit;

        $scope.episodes = episodes.slice(start, end);
        $location.search('page', page);
    }



    $scope.$watch('page', paginate);

}

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:BasepodcastepisodesCtrl
 * @description
 * # BasepodcastepisodesCtrl
 * Controller of the cloudcatcherDesktopApp
 */

angular.module('cloudcatcherDesktopApp')
    .controller('BasepodcastepisodesCtrl', BasePodcastEpisodesCtrl);
