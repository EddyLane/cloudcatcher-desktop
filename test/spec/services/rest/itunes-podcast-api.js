'use strict';

describe('Service: ItunesPodcastApi', function () {

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    // instantiate service
    var Restangular,
        callback,
        interceptorCallback,
        configurer;

    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('ITUNES_URL', 'itunes_url');
        })
    });

    beforeEach(inject(function (_Restangular_) {

        Restangular = _Restangular_;

        sinon.stub(Restangular, 'withConfig', function (cb) {
            callback = cb;
            return true;
        });

        configurer = {
            setJsonp: sinon.spy(),
            setDefaultRequestParams: sinon.spy(),
            setBaseUrl: sinon.spy(),
            setResponseInterceptor: function () {
            }
        };

        sinon.stub(configurer, 'setResponseInterceptor', function (cb) {
            interceptorCallback = cb;
            return true;
        })

    }));

    afterEach(function () {
        Restangular.withConfig.restore();
    });

    it('should exist', inject(function (ItunesPodcastApi) {
        expect(ItunesPodcastApi).to.exist;
    }));

    describe('Basic configuration', function () {

        it('should return Restangular with config', inject(function (ItunesPodcastApi) {
            expect(Restangular.withConfig).to.have.been.called;
        }));

        it('should set Jsonp to true', inject(function (ItunesPodcastApi) {
            callback(configurer);
            expect(configurer.setJsonp).to.have.been.calledWithExactly(true);
        }));

        it('should set the default request params', inject(function (ItunesPodcastApi) {
            callback(configurer);
            expect(configurer.setDefaultRequestParams).to.have.been.calledWithExactly('jsonp', { callback: 'JSON_CALLBACK', media: 'podcast' });
        }));

        it('should set the base url to that specified in a constant', inject(function (ItunesPodcastApi) {
            callback(configurer);
            expect(configurer.setBaseUrl).to.have.been.calledWithExactly('itunes_url');
        }));

    });

    describe('Interceptors and formatters', function () {

        var formattedSkeleton;

        beforeEach(function () {
            formattedSkeleton = {
                episodes: {},
                name: undefined,
                slug: undefined,
                artist: undefined,
                itunesId: undefined,
                feed: undefined,
                artwork: {
                    30: undefined,
                    60: undefined,
                    100: undefined,
                    600: undefined
                },
                latest: undefined,
                explicit: true,
                amount: undefined,
                country: undefined,
                genres: []
            };
        });

        it('should set add one response interceptor', inject(function (ItunesPodcastApi) {
            callback(configurer);
            expect(configurer.setResponseInterceptor).to.have.been.calledOnce;
        }));

        it('should set the name and slug from the collectionName', inject(function (ItunesPodcastApi) {
            var response, expected;

            response = {
                results: [
                    {
                        collectionName: 'Eddys Fab Podcast'
                    }
                ]
            };

            callback(configurer);
            expected = _.cloneDeep(formattedSkeleton);
            _.assign(expected, {
                name: 'Eddys Fab Podcast',
                slug: 'eddys-fab-podcast'
            });

            expect(interceptorCallback(response)).to.deep.equal([expected]);
        }));

        it('should strip the genre "Podcasts" from the genres returned by the API',inject(function (ItunesPodcastApi) {
            var response, expected;

            response = {
                results: [
                    {
                        genres: ['Speech', 'Podcasts']
                    }
                ]
            };

            callback(configurer);
            expected = _.cloneDeep(formattedSkeleton);
            _.assign(expected, {
                genres: ['Speech']
            });

            expect(interceptorCallback(response)).to.deep.equal([expected]);
        }));

        it('should strip the genre "Podcasts" from the genres returned by the API',inject(function (ItunesPodcastApi) {
            var response, expected;

            response = {
                results: [
                    {
                        artistName: 'Eddy Lane',
                        collectionId: 12345,
                        feedUrl: 'eddylane.co.uk/feed',
                        artworkUrl30: 'http://imgur.com/30.jpeg',
                        artworkUrl50: 'http://imgur.com/60.jpeg',
                        artworkUrl100: 'http://imgur.com/100.jpeg',
                        artworkurl600: 'http://imgur.com/600.jpeg',
                        releaseDate: '01/01/2014',
                        collectionExplicitness: 'notExplicit',
                        trackCount: 100,
                        country: 'UK'
                    }
                ]
            };

            callback(configurer);
            expected = _.cloneDeep(formattedSkeleton);
            _.assign(expected, {
                artist: 'Eddy Lane',
                itunesId: 12345,
                feed: 'eddylane.co.uk/feed',
                artwork: {
                    30: 'http://imgur.com/30.jpeg',
                    60: 'http://imgur.com/60.jpeg',
                    100: 'http://imgur.com/100.jpeg',
                    600: 'http://imgur.com/600.jpeg'
                },
                latest: '01/01/2014',
                explicit: false,
                amount: 100,
                country: 'UK'
            });

            expect(interceptorCallback(response)).to.deep.equal([expected]);
        }));


    });

});
