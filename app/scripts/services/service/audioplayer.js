'use strict';

/**
 * @ngInject
 * @param $q
 * @param $rootScope
 * @returns {*}
 * @constructor
 */
function AudioPlayer($q, $rootScope) {

    var defer = $q.defer();

    /**
     * Set default options
     *
     * @type {{autoLoad: boolean, onplay: onplay, whileplaying: whileplaying}}
     */
    soundManager.defaultOptions = {
        autoLoad: true,

        onplay: function () {
            $rootScope.$emit('onPlay', this);
        },

        whileplaying: function () {
            this.data.progress = (this.position / this.duration) * 100;
            $rootScope.$emit('whilePlaying', this);
        }
    };

    /**
     * Setup
     */
    soundManager.setup({
        onready: function () {
            defer.resolve(new CloudcatcherAudioPlayer);
        }
    });


    /**
     * The Cloudcatcher audio player TM
     *
     * @constructor
     */
    function CloudcatcherAudioPlayer () {

        var current;

        this.setPosition = function (position) {
            if (!current) {
                return false;
            }
            position = (current.duration / 100) * position;
            current.setPosition(position);

            return this;
        };

        this.play = function (episode) {

            soundManager.stopAll();

            var sound = soundManager.createSound({
                id: episode.media.url,
                url: episode.media.url,
                onload: function () {

                    this.play({
                        position: episode.position || 0
                    });

                }
            });

            sound.data = episode;
            current = sound;
            return sound;
        };

    }


    $rootScope.$on('scrub', function (e, position) {
        defer.promise.then(function (player) {
            player.setPosition(position);
        });
    });

    return defer.promise;
}

/**
 * @ngdoc service
 * @name cloudcatcherDesktopApp.AudioPlayer
 * @description
 * # AudioPlayer
 * Service in the cloudcatcherDesktopApp.
 */
angular.module('cloudcatcherSharedServices')
    .service('AudioPlayer', AudioPlayer);
