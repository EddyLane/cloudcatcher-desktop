'use strict';

describe.skip('Directive: ccProgressBar', function () {

    // load the directive's module
//    beforeEach(module('cloudcatcherDesktopApp'));

    beforeEach(function() {
        module('cloudcatcherDesktopApp');
    });

    var element,
        compiled,
        $rootS,
        scope,
        template = '<div class="progress" cc-progress-bar><div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div></div>';

    beforeEach(inject(function ($rootScope, $compile) {
        $rootS = $rootScope;
        scope = $rootS.$new();
        scope.playing = {
            progress: 1
        };
        element = angular.element(template);
        compiled = $compile(element)(scope);
        scope.$digest();
    }));

    it('should emit on click', function () {
        angular.element(compiled).triggerHandler('click');
    });

});
