'use strict';

/**
 * @ngdoc function
 * @name cloudcatcherDesktopApp.controller:PodcastlistCtrl
 * @description
 * # PodcastlistCtrl
 * Controller of the cloudcatcherDesktopApp
 */

/**
 * @ngInject
 * @constructor
 */
function PreferenceModal(CloudcatcherApi) {

    this.ok = function () {
        CloudcatcherApi.one('preferences').customPUT({ preferences: this.preferences });
        console.log('ok');
    };

    this.cancel = function () {
        console.log('cancel');
    };

}

angular.module('cloudcatcherDesktopApp')
    .controller('PreferenceModal', PreferenceModal);
