'use strict';

/**
 * @ngdoc service
 * @name cloudcatcherDesktopApp.AudioPlayer
 * @description
 * # AudioPlayer
 * Service in the cloudcatcherDesktopApp.
 */
angular.module('cloudcatcherSharedServices')
  .service('AudioPlayer', function AudioPlayer($q, $rootScope) {
        var defer = $q.defer(),
            current;

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

        soundManager.setup({
            onready: resolveAudioPlayer
        });

        function resolveAudioPlayer() {
            defer.resolve({
                play: function (episode) {

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
                }
            })
        }

        $rootScope.$on('scrub', function (e, position) {
            if (current) {
                position = (current.duration / 100) * position;
                current.setPosition(position);
            }
        });

        return defer.promise;
  });
