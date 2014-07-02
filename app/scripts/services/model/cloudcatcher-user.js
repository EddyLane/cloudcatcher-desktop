'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.CloudcatcherUser
 * @description
 * # Cloudcatcheruser
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('CloudcatcherUser', function CloudcatcherUser(EpisodeCounter) {
        return function (userData) {
           
            var $podcasts;

            return {

                getUsername: function () {
                    return userData.username;
                },

                getEmail: function () {
                    return userData.email;
                },

                getFirebaseToken: function () {
                    return userData.firebase_token;
                },

                setPodcasts: function (_podcasts_) {
                    $podcasts = _podcasts_
                    return this;
                },

                getPodcasts: function () {
                    return $podcasts;
                },

                addPodcast: function (podcast) {
                    var self = this;
                    $podcasts.$add(podcast).then(function () {
                        EpisodeCounter([self.findPodcast(podcast)]);
                    });
                    return this;
                },

                removePodcast: function (podcast) {
                    var found = _.findKey($podcasts, { itunesId: podcast.itunesId });
                    if (found) {
                        $podcasts.$remove(found);
                        return true;
                    }
                    return false;
                },

                findPodcast: function (podcast) {
                    return _.find($podcasts, { itunesId: podcast.itunesId });
                },

                savePodcast: function (podcast) {
                    var update = {};
                    update[_.findKey($podcasts, { itunesId: podcast.itunesId })] = _.omit(podcast, 'episodes');
                    $podcasts.$update(update);
                },

                addHeard: function (podcast, episode) {
                    if (!podcast.heard) {
                        podcast.heard = [];
                    }
                    if (podcast.newEpisodes && podcast.newEpisodes > 0) {
                        podcast.newEpisodes--;
                    }
                    podcast.heard.push(episode.media.url);
                    this.savePodcast(podcast);
                }
            }
        }
    });
