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
        var defer = $q.defer();

        soundManager.defaultOptions = {

            autoLoad: true,

            onplay: function () {
                $rootScope.$emit('onPlay', this);
            },

            onload: function () {
                this.play();
            },

            whileplaying: function () {

            }
        };

        soundManager.setup({
            onready: resolveAudioPlayer
        });

        function resolveAudioPlayer() {
            defer.resolve({
                play: function (episode) {

                    var sound = soundManager.createSound({
                        id: episode.media.url,
                        url: episode.media.url
                    });

                    sound.data = episode;

                }
            })
        }

        return defer.promise;
  });
