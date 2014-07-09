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
            return FirebaseAuth(user).then(function (userFirebase) {
                return userFirebase.getPodcasts()
                    .then(function (podcasts) {
                        var count = {};
                        _.each(podcasts, function (podcast, key) {
                            if (_.isPlainObject(podcast)) {
                                count[key] = podcast;
                            }
                        });
                        EpisodeCounter(count);
                        return $q.when(user.setPodcasts(podcasts));
                    })
                ;
            });
        }

        function getUserData(promise){
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
