'use strict';

/**
 * @ngdoc directive
 * @name cloudcatcherDesktopApp.directive:ccProgressBar
 * @description
 * # ccProgressBar
 */
angular.module('cloudcatcherDesktopApp')
    .directive('ccRightClick', function () {
        return {
            restrict: 'A',
            scope: {
                episode: '=',
                playAction: '='
            },
            link: function (scope, element) {
                element.bind('contextmenu', function () {

                    chrome.contextMenus.create({
                        title: 'Play',
                        id: 'downloadEpisode',
                        contexts: [ 'all', 'audio' ],
                        onclick: function () {
                            scope.playAction(scope.episode);
                        }
                    }, function () {

                        //chrome.contextMenus.remove('downloadEpisode');

                    });


                });
            }
        };
    });