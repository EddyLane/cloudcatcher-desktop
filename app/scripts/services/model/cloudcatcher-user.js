'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.CloudcatcherUser
 * @description
 * # Cloudcatcheruser
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('CloudcatcherUser', function CloudcatcherUser() {
        return function (userData) {
            var podcasts;

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
                    podcasts = _podcasts_
                    return this;
                },

                getPodcasts: function () {
                    return podcasts;
                }

            }

        }
    });
