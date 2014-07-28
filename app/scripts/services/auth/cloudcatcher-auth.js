'use strict';

/**
 * @ngInject
 * @param $q
 * @param $firebase
 * @param FIREBASE_URL
 * @param CloudcatcherApi
 * @param CloudcatcherUser
 * @param FirebaseAuth
 * @param EpisodeCounter
 * @constructor
 */
function CloudcatcherAuth($q, $timeout, $log, CloudcatcherApi, CloudcatcherUser, FirebaseAuth, EpisodeCounter) {

    /**
     * Handle setting all firebase data on the CloudcatcherUser instance
     *
     * @param user
     * @returns {*}
     */
    function getFirebaseData(user) {

        /**
         * Set the podcasts on the user and cue up the episode counter
         *
         * @param podcasts
         * @returns {Promise}
         */
        function handlePodcasts(podcasts) {
            var count = {};
            _.each(podcasts, function (podcast, key) {
                if (_.isPlainObject(podcast)) {
                    count[key] = podcast;
                }
            });

//            $timeout(function () {
                $log.info('podcast refresh started');
                EpisodeCounter(count).then(function () {
                    user.saveAllPodcasts();
                    $log.info('podcast refresh completed');
                });
//            }, 7000);


            return $q.when(user.setPodcasts(podcasts));
        }

        /**
         * Set the currently playing on the user
         *
         * @param playing
         * @returns {Promise}
         */
        function handleCurrentPlaying(playing) {
            return $q.when(user.setCurrentPlaying(playing));
        }

        /**
         * Resolve the podcasts and currently playing for the user
         *
         * @param resolutions
         * @returns {Promise|*}
         */
        function resolveFirebase (resolutions) {

            var userResolutions = [
                handlePodcasts(resolutions[0]),
                handleCurrentPlaying(resolutions[1])
            ];

            return $q.all(userResolutions).then(function () {
                return user;
            });
        }

        /**
         * Handle the users resolved firebase
         *
         * @param userFirebase
         * @returns {Promise|*}
         */
        function handleFirebase (userFirebase) {
            return $q.all([userFirebase.getPodcasts(), userFirebase.getCurrentPlaying()]).then(resolveFirebase);
        }


        return FirebaseAuth(user).then(handleFirebase);

    }

    /**
     * Get complete CloudcatcherUser with firebase from data returned from the server
     *
     * @param promise
     * @returns {*}
     */
    function getUserData(promise) {
        return promise.then(function (userData) {
            return getFirebaseData(CloudcatcherUser(userData));
        });
    }

    /**
     * Get user from session
     * @returns {*}
     */
    this.check = function () {
        return this.user || getUserData(CloudcatcherApi.one('users', 'me').get());
    };

    /**
     * Get user from auth data
     *
     * @param username
     * @param password
     * @returns {*}
     */
    this.authenticate = function (username, password) {
        var self = this;
        var user = getUserData(CloudcatcherApi.one('security').post('login', { username: username, password: password }));

        user.then(function (user) {
            self.user = user;
        });

        return user;
    };
}

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.Cloudcatcherauth
 * @description
 * # cloudcatcherSharedServices
 * Service in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .service('CloudcatcherAuth', CloudcatcherAuth);
