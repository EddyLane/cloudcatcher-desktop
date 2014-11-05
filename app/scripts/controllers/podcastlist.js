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
function PodcastListCtrl($scope, $log, $modal, PodcastSorter, CloudcatcherApi) {

    var init = false;

    function sort(original, sortBy) {

        var sorter = PodcastSorter.getSorter(original);

        $scope.sortBy = function (type) {

            chrome.storage.sync.set({ sortBy: type });

            $scope.type = type;
            $scope.podcasts = sorter(type);
        };

        $scope.sortBy(sortBy || $scope.type || 'name');
    }

    function setOriginal() {
        var podcasts = $scope.original;

        if (!init) {

            chrome.storage.sync.get('sortBy', function (sortBy) {
                sort(podcasts, sortBy.sortBy);
            });

            init = true;

        } else {
            sort(podcasts);
        }
    }

    $scope.openDefaults = function () {
        $modal.open({
            templateUrl: 'views/modal/defaults.html',
            controller: 'PreferenceModal as preferenceModal',
            controllerAs: 'preferenceModal',
            size: 'sm'
        });
    };

    $scope.refresh = function () {

        if ($scope.refreshing) {
            return false;
        }

        $scope.refreshing = true;

        chrome.storage.local.get('token', function (data) {
            CloudcatcherApi.all('podcasts').getList({ token: data.token })
                .then(function (podcasts) {
                    $log.info('refreshed podcasts', podcasts);
                })
                .catch(function () {
                    $log.error('refresh call failed');
                })
                .finally(function () {
                    $scope.refreshing = false;
                })
            ;
        });

        return true;
    };

    //Online (firebase data)
    if (_.isFunction($scope.original.$watch)) {
        $scope.original.$watch(setOriginal);
    }
    setOriginal();
}

angular.module('cloudcatcherDesktopApp')
    .controller('PodcastlistCtrl', PodcastListCtrl);
