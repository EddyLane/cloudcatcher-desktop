'use strict';

/**
 *
 * @param $log
 * @param $q
 * @param $firebase
 * @param FirebaseProxy
 * @param FIREBASE_URL
 * @returns {FirebaseAuth}
 * @constructor
 */
function FirebaseAuth ($log, $q, $firebase, FirebaseProxy, FIREBASE_URL) {

    /**
     * Get the child function
     *
     * @param firebase
     * @returns {getChild}
     */
    function getChildFunction (firebase) {
        /**
         * Get the child of a firebase
         *
         * @param child
         * @returns {*}
         */
        function getChild(child) {
            var defer, podcasts;
            defer = $q.defer();
            podcasts = $firebase(firebase.child(child));
            podcasts.$on('loaded', function () {
                defer.resolve(podcasts);
            });
            return defer.promise;
        }
        return getChild;
    }

    /**
     * The users firebase
     *
     * @param userFirebase
     * @constructor
     */
    function UserFirebase (userFirebase) {

        var getChild = getChildFunction(userFirebase);

        this.getPodcasts = function () {
            return getChild('podcasts');
        };

        this.getCurrentPlaying = function () {
            return getChild('playing');
        };

    }

    /**
     *
     * @param user
     * @returns {*}
     * @constructor
     */
    function FirebaseAuth (user) {

        /**
         * Connect to the users firebase
         *
         * @param user
         * @returns {*}
         */
        function connect(user) {
            var defer, firebase;
            defer = $q.defer();
            firebase = new FirebaseProxy(FIREBASE_URL);
            firebase.auth(user.getFirebaseToken(), function (e) {
                if (e) {
                    $log.error(e);
                    defer.reject(e);
                } else {
                    defer.resolve(firebase.child('users/' + user.getUsername()));
                }
            });
            return defer.promise;
        }

        return connect(user).then(function (userFirebase) {
            return new UserFirebase(userFirebase);
        });

    }

    return FirebaseAuth;
}

/**
 * @ngdoc service
 * @name cloudcatcherSharedServices.FirebaseAuth
 * @description
 * # FirebaseAuth
 * Factory in the cloudcatcherSharedServices.
 */
angular.module('cloudcatcherSharedServices')
    .factory('FirebaseAuth', FirebaseAuth);
