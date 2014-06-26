'use strict';

describe('Controller: SearchpreviewctrlCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var SearchpreviewctrlCtrl,
        scope,

        episodes = [
            { id: 1, title: 'Test' }
        ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        SearchpreviewctrlCtrl = $controller('SearchpreviewctrlCtrl', {
            $scope: scope,
            episodes: episodes
        });
    }));

    it('should set the resolved episodes on to the scope', function () {
        expect(scope.episodes).to.equal(episodes);
        expect(scope.episodes).to.deep.equal(episodes);
    });

});
