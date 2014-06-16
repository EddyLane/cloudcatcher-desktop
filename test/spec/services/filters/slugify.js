'use strict';

describe('Filter: slugify', function () {

    // load the filter's module
    beforeEach(module('cloudcatcherSharedServices'));

    // initialize a new instance of the filter before each test
    var slugify;
    beforeEach(inject(function ($filter) {
        slugify = $filter('slugify');
    }));

    it('should replace spaces with hiphens', function () {
        var text = 'angular js';
        expect(slugify(text)).to.equal('angular-js');
    });

    it('should remove special characters', function () {
        var text = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
        expect(slugify(text)).to.equal('aaaaaeeeeeiiiiooooouuuunc-');
    });

    it('should make input lowercase', function () {
        var text = 'AABBCC'
        expect(slugify(text)).to.equal('aabbcc');
    });



});
