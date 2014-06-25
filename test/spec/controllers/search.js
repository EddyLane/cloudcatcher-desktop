'use strict';

describe('Controller: SearchCtrl', function () {

    // load the controller's module
    beforeEach(module('cloudcatcherDesktopApp'));

    var SearchCtrl,
        scope,
        results,
        user;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, CloudcatcherUser) {

        results = [
            { title: 'Banter', thing: true }
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

});
