'use strict';

/**
 * @ngInject
 * @param $scope
 * @param $location
 * @param episodes
 * @param podcast
 * @param useri
 * @param AudioPlayer
 * @param EpisodeStorage
 * @constructor
 */
function BasePodcastEpisodesCtrl ($scope, $location, episodes, podcast, user, AudioPlayer, EpisodeStorage, GoogleFeedApi, $rootScope) {

    var addHeard = user.addHeard(podcast),
        hearAll = user.hearAll(podcast);

    if (podcast.downloading) {
        _.each(podcast.downloading, function (download) {
            var found = _.findIndex(episodes, { media: { url: download.media.url } });
            if (found) {
                episodes[found] = download;
            }
        });
    }

    _.assign($scope, {

        listen: function (episode) {
            episode.imageUrl = podcast.imageUrl;
            episode.podcast = {
                slug: podcast.slug
            };
            AudioPlayer.play(episode, true);
            addHeard(episode);
        },

        page: $location.search().page || 1,
        limit: 9,
        podcast: podcast,
        current: user.getCurrentPlaying(),

        markAllAsPlayed: function () {
            hearAll(episodes);
        },

        contextMenu: [
            {
                title: 'Download',
                id: 'downloadItem',
                contexts: ['all'],
                action: $scope.listen
            }
        ],

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

        $scope.total = episodes.length;
        $scope.episodes = episodes.slice(start, end);
        $location.search('page', page);
    }

    if ($rootScope.online) {
        GoogleFeedApi.one('load').getList(null, { q: podcast.feed }).then(function (remoteEpisodes) {

            _.merge(podcast, remoteEpisodes.meta);

            episodes = _(episodes.concat(remoteEpisodes))
                .uniq(function (e) {
                    return e.media.url;
                })
                .sortBy(function (e) {
                    return new Date(e.date);
                })
                .reverse()
                .value()
            ;

            paginate($scope.page);
        });
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
