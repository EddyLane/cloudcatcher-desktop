'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.Cloudcatcherauth
 * @description
 * # cloudcatcherSharedServices
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .service('CloudcatcherAuth', function CloudcatcherAuth($q, $firebase, FIREBASE_URL, CloudcatcherApi, CloudcatcherUser) {

        function connect(user) {
            var defer, firebase;
            defer = $q.defer();
            firebase = new Firebase(FIREBASE_URL);
            firebase.auth(user.getFirebaseToken(), function (e) {
                if (e) {
                    defer.reject(e);
                } else {
                    defer.resolve(firebase.child('users/' + user.getUsername()));
                }
            });
            return defer.promise;
        }

        function getPodcasts(firebase) {
            var defer, podcasts;
            defer = $q.defer();
            podcasts = $firebase(firebase.child('podcasts'));
            podcasts.$on('loaded', function () {
                defer.resolve(podcasts);
            });
            return defer.promise;
        }

        function getUserData(promise){
            var defer = $q.defer();
            promise.then(function (userData) {
                var user = CloudcatcherUser(userData);
                connect(user)
                    .then(getPodcasts)
                    .then(function (podcasts) {
                        return $q.when(user.setPodcasts(podcasts));
                    })
                    .then(defer.resolve)
                    .catch(defer.reject)
                ;
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
