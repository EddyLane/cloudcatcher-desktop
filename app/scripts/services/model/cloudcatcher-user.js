'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.CloudcatcherUser
 * @description
 * # Cloudcatcheruser
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('CloudcatcherUser', function CloudcatcherUser(EpisodeCounter, $rootScope) {
        return function (userData) {

            var $podcasts,
                $currentPlaying;

            var user = {

                getUsername: function () {
                    return userData.username;
                },

                getEmail: function () {
                    return userData.email;
                },

                getFirebaseToken: function () {
                    return userData.firebase_token;
                },

                setCurrentPlaying: function (_currentPlaying_) {
                    $currentPlaying = _currentPlaying_;
                    return this;
                },

                getCurrentPlaying: function () {
                    return $currentPlaying;
                },

                updateCurrentPlaying: function (episode) {
                    $currentPlaying.$set(_.assign(episode.data, {
                        position: episode.position
                    }));
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

                addHeard: function (podcast) {
                    var self = this;
                    return function (episode) {
                        if (!podcast.heard) {
                            podcast.heard = [];
                        }

                        if (episode.media && episode.media.url && podcast.heard.indexOf(episode.media.url) === -1) {
                            if (podcast.newEpisodes && podcast.newEpisodes > 0) {
                                podcast.newEpisodes--;
                            }
                            podcast.heard.push(episode.media.url);
                        }

                        self.savePodcast(podcast);
                    };
                },

                hearAll: function (podcast) {
                    var self = this;
                    return function (episodes) {
                        if (!podcast.heard) {
                            podcast.heard = [];
                        }

                        _.each(episodes, function (episode) {
                            if (episode.media && episode.media.url && podcast.heard.indexOf(episode.media.url) === -1) {
                                podcast.heard.push(episode.media.url);
                            }
                        });

                        podcast.newEpisodes = 0;

                        self.savePodcast(podcast);
                    };
                }
            };

            $rootScope.$on('onPlay', function (event, episode) {
                user.updateCurrentPlaying(episode);
            });

            $rootScope.$on('whilePlaying', function (event, episode) {
                user.updateCurrentPlaying(episode);
            });

            $rootScope.$on('whileLoading', function (event, episode) {
                user.updateCurrentPlaying(episode);
            });
            return user;
        }
    });
