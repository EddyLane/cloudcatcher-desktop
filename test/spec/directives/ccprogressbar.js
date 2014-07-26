'use strict';

describe('Directive: ccProgressBar', function () {

    // load the directive's module
//    beforeEach(module('cloudcatcherDesktopApp'));

    beforeEach(function() {
        module('cloudcatcherDesktopApp');
    });

    var element,
        compiled,
        $rootS,
        scope,
        $timeout,
        template = '<div class="progress" cc-progress-bar><div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ng-click="emit($event)"></div></div>';

    beforeEach(inject(function ($rootScope, $compile, CloudcatcherAuth, _$timeout_) {
        $rootS = $rootScope;
        $timeout = _$timeout_;
        scope = $rootS.$new();
        scope.playing = {
            progress: 1
        };
        element = angular.element(template);
        compiled = $compile(element)(scope);

        sinon.stub(CloudcatcherAuth, 'check', function () {
            return true;
        });

        scope.$digest();
    }));

    it('should have an emit function on scope which emits based on event', function () {
        expect(scope.emit).to.be.a('function');
        sinon.spy($rootS, '$emit');

        scope.emit({
            offsetX: 100
        });

        expect($rootS.$emit).to.have.been.calledOnce.and.calledWithExactly('scrub', Infinity);

        $rootS.$emit.restore();

    });

});
