'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.Cloudcatcherauth
 * @description
 * # cloudcatcherSharedServices
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .service('CloudcatcherAuth', function CloudcatcherAuth($q, $firebase, FIREBASE_URL, CloudcatcherApi, CloudcatcherUser, FirebaseAuth, EpisodeCounter) {


        function getFirebaseData(user) {

            function handlePodcasts(podcasts) {
                var count = {};
                _.each(podcasts, function (podcast, key) {
                    if (_.isPlainObject(podcast)) {
                        count[key] = podcast;
                    }
                });
                EpisodeCounter(count);
                return $q.when(user.setPodcasts(podcasts));
            }

            function handleCurrentPlaying(playing) {
                return $q.when(user.setCurrentPlaying(playing));
            }

            return FirebaseAuth(user).then(function (userFirebase) {

                return $q.all([userFirebase.getPodcasts(), userFirebase.getCurrentPlaying()])
                    .then(function (resolutions) {

                        var userResolutions = [
                            handlePodcasts(resolutions[0]),
                            handleCurrentPlaying(resolutions[1])
                        ];

                        return $q.all(userResolutions).then(function (res) {
                            return user;
                        });
                    });
            });

        }

        function getUserData(promise) {
            return promise.then(function (userData) {
                return getFirebaseData(CloudcatcherUser(userData));
            });
        }

        return {

            check: function () {
                return getUserData(CloudcatcherApi.one('users', 'me').get());
            },

            authenticate: function (username, password) {
                return getUserData(CloudcatcherApi.one('security').post('login', { username: username, password: password }));
            }

        };
    });
