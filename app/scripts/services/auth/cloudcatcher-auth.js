'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.Cloudcatcherauth
 * @description
 * # cloudcatcherSharedServices
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .service('CloudcatcherAuth', function CloudcatcherAuth($q, $firebase, FIREBASE_URL, CloudcatcherApi, CloudcatcherUser, FirebaseAuth) {


        function getUserData(promise){
            var defer = $q.defer();
            promise.then(function (userData) {
                var user = CloudcatcherUser(userData);
                FirebaseAuth(user).then(function (userFirebase) {
                    userFirebase.getPodcasts()
                        .then(function (podcasts) {
                            return $q.when(user.setPodcasts(podcasts));
                        })
                        .then(defer.resolve)
                        .catch(defer.reject)
                    ;
                });
            }, defer.reject);
            return defer.promise;
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
