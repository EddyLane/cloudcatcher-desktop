'use strict';

describe('Router', function () {

    var $state, $rootScope, CloudcatcherAuth, $q, $injector, CloudcatcherUser, ItunesPodcastApi, GoogleFeedApi,
        podcastEpisodes = [
            { name: 'testEp1' },
            { name: 'testEp2' }
        ],
        userPodcasts = [
            { slug: 'testtwo' },
            { slug: 'test', feed: 'feedy' }
        ],
        checkResponse = {
            username: 'Eddy',
            getPodcasts: function () {
                return userPodcasts;
            }
        },
        user;

    beforeEach(function () {

        module('cloudcatcherDesktopApp');

        inject(function (_$rootScope_, _$state_, _ItunesPodcastApi_, _CloudcatcherAuth_, _$q_, _$injector_, _CloudcatcherUser_, _GoogleFeedApi_) {
            CloudcatcherAuth = _CloudcatcherAuth_;
            CloudcatcherUser = _CloudcatcherUser_;
            $rootScope = _$rootScope_;
            GoogleFeedApi = _GoogleFeedApi_;
            ItunesPodcastApi = _ItunesPodcastApi_;
            $state = _$state_;
            $q = _$q_;
            $injector = _$injector_;
        });

        sinon.stub(CloudcatcherAuth, 'check', function () {
            return checkResponse;
        });



        user = CloudcatcherUser(checkResponse);
        user.setPodcasts(userPodcasts);

    });

    afterEach(function () {
        CloudcatcherAuth.check.restore();
    });

    it('should set $state on $rootScope', function () {

        expect($rootScope.$state).to.equal($state);

    });

    describe('Set loading variables', function () {

        it('should listen for $stateChangeStart and set loading to true', function () {
            expect($rootScope.loading).to.be.undefined;
            $rootScope.$emit('$stateChangeStart');
            expect($rootScope.loading).to.be.true;
        });

        if('should listen for $stateChangeSuccess and set loading to false', function () {
            expect($rootScope.loading).to.be.undefined;
            $rootScope.$emit('$stateChangeSuccess');
            expect($rootScope.loading).to.be.false;
        });

    });

    describe('Listen for auth error', function () {
        it('should listen for authenticationErrors and transition to login state if there is one', function () {
            sinon.spy($state, 'transitionTo');
            $rootScope.$emit('authenticationError');
            expect($state.transitionTo).to.have.been.calledOnce;
            expect($state.transitionTo).to.have.been.calledWithExactly('login');
            $state.transitionTo.restore();
        });
    });

    describe('State: "base"', function () {

        it('should respond to URL', function () {
            expect($state.href('base')).to.equal('');
        });

        it('should resolve the user', function () {
            $state.go('base');
            $rootScope.$digest();
            expect($state.current.name).to.equal('base');
            expect($injector.invoke($state.current.resolve.user)).to.deep.equal(checkResponse);
        });

    });

    describe('State: "base.podcast"', function () {

        it('should respond to URL', function () {
            expect($state.href('base.podcast', { slug: 'test' })).to.equal('#/test');
        });

        it('should resolve the podcast specified', function () {
            $state.go('base.podcast', { slug: 'test' });
            $rootScope.$digest();
            expect($state.current.name).to.equal('base.podcast');
            expect($injector.invoke($state.current.resolve.podcast, null, { user: user })).to.deep.equal(userPodcasts[1]);
        });

    });

    describe('State: "base.podcast.episodes"', function () {


        it('should respond to URL', function () {
            expect($state.href('base.podcast.episodes', { slug: 'test' })).to.equal('#/test/episodes');
        });

        it('should resolve the episodes for the podcast', function () {
            var res;

            sinon.stub(GoogleFeedApi, 'one', function (thing) {
                return {
                    getList: function (thing, params) {
                        var defer = $q.defer();
                        defer.resolve(podcastEpisodes);
                        return defer.promise;
                    }
                };
            });

            $state.go('base.podcast.episodes', { slug: 'test' });
            $rootScope.$digest();
            expect($state.current.name).to.equal('base.podcast.episodes');
            $injector.invoke($state.current.resolve.episodes, null, { podcast: userPodcasts[1] }).then(function (_res_) {
                res = _res_;
            });
            $rootScope.$apply();
            expect(res).to.deep.equal(podcastEpisodes);
        })

    });

    describe('State: "base.podcasts"', function () {

        it('should respond to URL', function () {
            expect($state.href('base.podcasts')).to.equal('#/podcasts');
        });

        it('should resolve the podcasts', function () {
            $state.go('base.podcasts');
            $rootScope.$digest();
            expect($state.current.name).to.equal('base.podcasts');
            expect($injector.invoke($state.current.resolve.podcasts, null, { user: user })).to.deep.equal(userPodcasts);
        });

    });

    describe('State: "login"', function () {

        it('should respond to URL', function () {
            expect($state.href('login')).to.equal('#/login');
        });

    });

    describe('State: "base.search"', function () {

        it('should response to URL', function () {
            expect($state.href('base.search')).to.equal('#/search');
        });

        it('should resolve the search results', function () {

            var searchResults = [
                { title: 'Test Term Win'}
            ];

            sinon.stub(ItunesPodcastApi, 'all', function (thing) {
                expect(thing).to.equal('search');
                return {
                    getList: function (params) {
                        expect(params).to.deep.equal({ term: 'Test Term' });
                        return searchResults;
                    }
                };
            });

            $state.go('base.search', { term: 'Test Term'});
            $rootScope.$digest();
            expect($injector.invoke($state.current.resolve.results)).to.deep.equal(searchResults);
            ItunesPodcastApi.all.restore();
        });

        describe('State: "base.search.preview"', function () {

            it('should respond to URL', function () {
                expect($state.href('base.search.preview')).to.equal('#/search/');
            });

            it('should resolve the preview episodes', function () {

                var searchResults = [
                    { title: 'Test Term Win'}
                ],
                episodes = [
                    { url: 'testep.mp3' }
                ];

                sinon.stub(ItunesPodcastApi, 'all', function (thing) {
                    expect(thing).to.equal('search');
                    return {
                        getList: function (params) {
                            expect(params).to.deep.equal({ term: 'Test Term' });
                            return searchResults;
                        }
                    };
                });

                sinon.stub(GoogleFeedApi, 'one', function (thing) {
                    expect(thing).to.equal('load');
                    return {
                        getList: function (thing, params) {
                            expect(thing).to.be.null;
                            expect(params).to.deep.equal({ q: 'testurl.com' });
                            return episodes;
                        }
                    };
                });

                $state.go('base.search.preview', { term: 'Test Term', preview: 'testurl.com' });
                $rootScope.$digest();
                expect($injector.invoke($state.current.resolve.episodes)).to.deep.equal(episodes);
                GoogleFeedApi.one.restore();
                ItunesPodcastApi.all.restore();
            });

        });

    })

});