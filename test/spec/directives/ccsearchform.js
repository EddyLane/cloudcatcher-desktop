'use strict';

describe('Directive: CcSearchForm', function () {

    // load the directive's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var element,
        scope,
        $state;

    beforeEach(inject(function ($rootScope, $compile, _$state_) {
        scope = $rootScope.$new();
        $state = _$state_;
        element = angular.element('<cc-search-form></cc-search-form>');
        element = $compile(element)(scope);
        scope.$digest();
        sinon.spy($state, 'go');
    }));

    afterEach(function () {
        $state.go.restore();
    });

    it('should have the input value on scope', function () {
        expect(scope.values).to.deep.equal({
            term: ''
        });
    });

    it('should have a function to submit', function () {
        expect(scope.submit).to.be.a('function');
    });

    it('should have the name of the form', function () {
        expect(scope.name).to.equal('searchForm');
    });

    it('should return false early if the form is invalid', function () {
        expect(scope.submit()).to.be.false;
        expect($state.go).to.have.not.been.called;
    });

    it('should emit the search event if valid and return true', function () {
        scope.values.term = 'Search Term';
        scope.$digest();
        scope.submit();
        expect($state.go).to.have.been.calledOnce;
        expect($state.go).to.have.been.calledWithExactly('base.search', { term: 'Search Term' });
    });

});
