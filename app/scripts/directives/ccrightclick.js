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
            scope: function (scope, element) {
                element.bind('contextmenu', function (event) {
                    // When the app gets installed, set up the context menus

                    chrome.contextMenus.removeAll(function () {
                        chrome.contextMenus.create({
                            title: 'HOLY SHIT',
                            id: 'contextMenuId2',
                            contexts: [ 'all' ]
                        });
                    });


                    scope.$apply(function () {

//                    event.preventDefault();
                        //fn(scope, {$event: event});
                    });
                });
            }
        };
    });