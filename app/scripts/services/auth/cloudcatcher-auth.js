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

        function getChild(firebase, child) {
            var defer, podcasts;
            defer = $q.defer();
            podcasts = $firebase(firebase.child(child));
            podcasts.$on('loaded', function () {
                defer.resolve(podcasts);
            });
            return defer.promise;
        }

        function getPodcasts(firebase) {
            return getChild(firebase, 'podcasts');
        }

        function getCurrentlyPlaying(firebase) {
            return getChild(firebase, 'playing');
        }

        function getAllUserServices(firebase) {
            return $q.all([getPodcasts(firebase), getCurrentlyPlaying(firebase)]);
        }

        function setAllUserServices(services) {
            return $q.all($q.when(user.setPodcasts(services[0])), $q.when(setCurrentlyPlaying(services[1])));
        }

        function getUserData(promise){
            var defer = $q.defer();
            promise.then(function (userData) {
                var user = CloudcatcherUser(userData);
                connect(user)
                    .then(getAllUserServices)
                    .then(setAllUserServices)
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
