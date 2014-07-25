'use strict';

describe('Directive: ccPodcastList', function () {

  // load the directive's module
  beforeEach(module('cloudcatcherDesktopApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cc-podcast-list></cc-podcast-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ccPodcastList directive');
  }));
});
