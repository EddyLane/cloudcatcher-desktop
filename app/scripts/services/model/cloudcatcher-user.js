'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.CloudcatcherUser
 * @description
 * # Cloudcatcheruser
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('CloudcatcherUser', function CloudcatcherUser($filter) {
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
                    return _.filter($podcasts, function (e) { return _.isPlainObject(e); });
                },

                addPodcast: function (podcast) {
                    $podcasts.$add(podcast);
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

                addHeard: function (podcast, episode) {
                    podcast.heard[episode.media.url] = true;
//                    var update = {};
//                    if (_.isUndefined(podcast.heard)) {
//                        podcast.heard = {};
//                    }
//                    podcast.heard[$filter('slugify')(episode.media.url)] = true;
//                    update[_.findKey($podcasts, { itunesId: podcast.itunesId })] = _.omit(podcast, 'episodes');
//                    $podcasts.$update(update);
                }

            }

        }
    });
