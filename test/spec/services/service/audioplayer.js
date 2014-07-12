'use strict';

describe('Service: AudioPlayer', function () {


    // instantiate service
    var soundManagerSetup,
        $rootScope;

    // load the service's module
    beforeEach(module('cloudcatcherSharedServices'));

    beforeEach(inject(function (_$rootScope_) {

        $rootScope = _$rootScope_;

        sinon.stub(soundManager, 'setup', function (args) {
            soundManagerSetup = args;
        });

        sinon.stub(soundManager, 'createSound', function (sound) {
            return sound;
        });

        sinon.spy($rootScope, '$emit');

    }));

    afterEach(function () {
        soundManager.setup.restore();
        soundManager.createSound.restore();
        $rootScope.$emit.restore();
    });

    function resolveService(AudioPlayer) {
        var resolved;
        AudioPlayer.then(function (audioPlayer) {
            resolved = audioPlayer;
        });
        soundManagerSetup.onready();
        $rootScope.$apply();
        return resolved;
    }

    describe('default options', function () {

        it('should $emit on $rootScope when a track starts playing', inject(function (AudioPlayer) {
            var sound = { media: { url: 'testurl.mp3' } };
            expect(soundManager.defaultOptions.onplay).to.be.a('function');
            soundManager.defaultOptions.onplay.call(sound);
            expect($rootScope.$emit).to.have.been.calledOnce.and.calledWithExactly('onPlay', sound);

        }));

        it('should $emit on $rootScope while a track is playing', inject(function (AudioPlayer) {
            expect(soundManager.defaultOptions.whileplaying).to.be.a('function');
        }));

        it('should automatically play a track when loaded', inject(function (AudioPlayer) {

            var sound = { play: function () {} };
            sinon.spy(sound, 'play');

            expect(soundManager.defaultOptions.autoLoad).to.be.true;
            expect(soundManager.defaultOptions.onload).to.be.a('function');

            soundManager.defaultOptions.onload.call(sound);
            expect(sound.play).to.have.been.calledOnce;

            sound.play.restore();

        }));

    });

    it('should resolve a promise when soundmanager2 is ready', inject(function (AudioPlayer) {
        soundManager.setup.should.have.been.calledOnce;
        expect(AudioPlayer.then).to.be.a('function');
        var resolved = resolveService(AudioPlayer);
        expect(resolved).to.be.an('object');
    }));

    it('should allow you to play an audio file and add the original episode data to it', inject(function (AudioPlayer) {
        var resolved = resolveService(AudioPlayer);
        var sound = { media: { url: 'testurl.mp3' } };
        var call;

        expect(resolved.play).to.be.a('function');
        resolved.play(sound);

        call = soundManager.createSound.getCall(0).args[0];

        expect(soundManager.createSound).to.have.been.calledOnce;
        expect(call.id).to.equal('testurl.mp3');
        expect(call.url).to.equal('testurl.mp3');
        expect(call.data).to.equal(sound).and.deep.equal(sound);

    }));


});
