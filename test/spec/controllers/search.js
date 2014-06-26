'use strict';

describe('Controller: SearchCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var SearchCtrl,
        scope,
        results,
        $state,
        user;

    describe('base state', function () {
        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope, CloudcatcherUser, _$state_) {

            $state = _$state_;

            results = [
                { title: 'Banter', thing: true, feed: 'http://feed.com' }
            ];

            user = CloudcatcherUser({});

            scope = $rootScope.$new();
            SearchCtrl = $controller('SearchCtrl', {
                $scope: scope,
                results: results,
                user: user
            });
        }));

        it('should set the results on scope', function () {
            expect(scope.results).to.equal(results);
            expect(scope.results).to.deep.equal(results);
        });

        it('should have a toggle subscription function on scope', function () {
            expect(scope.toggleSubscription).to.be.a('function');
        });

        it('should subscribe to the podcast if user doesnt have it', function () {
            sinon.stub(user, 'addPodcast', function () {
                return true;
            });
            sinon.stub(user, 'findPodcast', function () {
                return undefined;
            });

            scope.toggleSubscription(results[0]);

            expect(user.addPodcast).to.have.been.calledOnce;
            expect(user.addPodcast).to.have.been.calledWithExactly(results[0]);

            user.findPodcast.restore();
            user.addPodcast.restore();
        });

        it('should unsubscribe to the podcast if the user does have it', function () {

            sinon.stub(user, 'removePodcast', function () {
                return true;
            });
            sinon.stub(user, 'findPodcast', function () {
                return results[0];
            });

            scope.toggleSubscription(results[0]);

            expect(user.removePodcast).to.have.been.calledOnce;
            expect(user.removePodcast).to.have.been.calledWithExactly(results[0]);

            user.removePodcast.restore();
            user.findPodcast.restore();

        });

        it('should have an isSubscribed function on scope', function () {
            expect(scope.isSubscribed).to.be.a('function');
            expect(scope.isSubscribed).to.equal(user.findPodcast);
        });

        it('should have a select function on scope to change the currently previewing podcast', function () {
            expect(scope.select).to.be.a('function');
            scope.select(results[0]);
            expect(scope.selected).to.equal(results[0]);
        });

        it('should nullify the selected podcast if the same one is selected again', function () {
            scope.select(results[0]);
            scope.select(results[0]);
            expect(scope.selected).to.be.null;
        });

        it('should transition to the preview state when selecting a podcast', function () {
            sinon.stub($state, 'go', function () {
            });
            scope.select(results[0]);
            expect($state.go).to.have.been.calledOnce;
            expect($state.go).to.have.been.calledWithExactly('base.search.preview', { preview: results[0].feed });
            $state.go.restore();
        });

    });

    describe('preview state', function () {

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope, CloudcatcherUser, _$state_, $location) {

            $state = _$state_;

            results = [
                { title: 'Banter', thing: true, feed: 'http://feed.com' }
            ];

            user = CloudcatcherUser({});

            sinon.stub($location, 'search', function () {
                return {
                    preview: results[0].feed
                };
            });

            scope = $rootScope.$new();
            SearchCtrl = $controller('SearchCtrl', {
                $scope: scope,
                results: results,
                user: user
            });
        }));

        it('when instantiated it should select the result in $location.search if there is one', function () {

            expect(scope.selected).to.equal(results[0]);

        });

    });

});
