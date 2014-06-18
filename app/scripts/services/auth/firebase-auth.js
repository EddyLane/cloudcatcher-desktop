'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.FirebaseAuth
 * @description
 * # FirebaseAuth
 * Factory in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('FirebaseAuth', function (FirebaseProxy, FIREBASE_URL, $q, $firebase) {
        return function (user) {

            var defer = $q.defer();

            function connect(user) {
                var defer, firebase;
                defer = $q.defer();
                firebase = new FirebaseProxy(FIREBASE_URL);
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
                var defer, podcasts, child;
                defer = $q.defer();

                child = firebase.child(child);
                podcasts = $firebase(child);
                podcasts.$on('loaded', function () {
                    defer.resolve(podcasts);
                });
                return defer.promise;
            }

            connect(user).then(function (userFirebase) {

                defer.resolve({

                    getPodcasts: function () {
                        return getChild(userFirebase, 'podcasts');
                    }

                });

            }, defer.reject);

            return defer.promise;

        };
    });
