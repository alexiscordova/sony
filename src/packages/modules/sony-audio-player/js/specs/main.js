
// Sony Audio Player (SonyAudioPlayer) Main Spec
// ---------------------------------------------

define(function(require){

  'use strict';

  var Jasmine = require('jasmine'),
      JasmineHTML = require('jasmine-html'),
      SonyAudioPlayer = require('modules/sony-audio-player/sony-audio-player'),
      SonyAudio = require('secondary/index').sonyAudio,
      SoundManager = require('soundManager');

  var $sap = $('.sony-audio-player').first().detach();

  $('.sony-audio-player').remove();

  describe("The SonyAudioPlayer module", function() {

    var SAP,
        $tester;

    beforeEach(function() {
      $tester = $sap.clone().appendTo('body');
    });

    afterEach(function() {
      $('.sony-audio-player').remove();
      SAP = null;
      soundManager.pauseAll();
    });

    it("Initializes the module and sets the player to the first track.", function() {

      spyOn(SonyAudioPlayer.prototype, 'setTrack');

      SAP = new SonyAudioPlayer($tester);

      expect(SAP.constructor).toBe(SonyAudioPlayer);
      expect(SonyAudioPlayer.prototype.setTrack).toHaveBeenCalled();
      expect(SonyAudioPlayer.prototype.setTrack).toHaveBeenCalledWith(0);
    });

    it("Returns an array of instances of itself, given multiple elements.", function() {

      $sap.clone().appendTo('body');
      $sap.clone().appendTo('body');
      $sap.clone().appendTo('body');

      SAP = new SonyAudioPlayer($('.sony-audio-player'));

      expect(SAP.length).toBe(4);
      expect(SAP[0].constructor).toBe(SonyAudioPlayer);
      expect(SAP[1].constructor).toBe(SonyAudioPlayer);
      expect(SAP[2].constructor).toBe(SonyAudioPlayer);
      expect(SAP[3].constructor).toBe(SonyAudioPlayer);
    });

    // I need to refactor SonyAudio to be more open to testing; the module/api pattern I used
    // is hiding most of the functionality. This prevents testing that the track was initialized,
    // and that a track object was passed to the binding functions.

    describe("The setTrack method", function() {

      it("Gets track at 0-based position `which`, and initializes the audio for that track.", function() {

        SAP = new SonyAudioPlayer($tester);

        SAP.setTrack(0);

      });

      it("Binds track to the nav and the API, and updates album art.", function() {

        SAP = new SonyAudioPlayer($tester);

        spyOn(SonyAudioPlayer.prototype, 'bindNav');
        spyOn(SonyAudioPlayer.prototype, 'bindModuleAPI');
        spyOn(SonyAudioPlayer.prototype, 'setAlbumArt');

        var testResult = SAP.setTrack(0);

        expect(SonyAudioPlayer.prototype.bindNav).toHaveBeenCalled();
        expect(SonyAudioPlayer.prototype.bindModuleAPI).toHaveBeenCalled();
        expect(SonyAudioPlayer.prototype.setAlbumArt).toHaveBeenCalled();
        expect(SonyAudioPlayer.prototype.setAlbumArt).toHaveBeenCalledWith(0);

        expect(testResult).toBe(SAP);
      });

    });

    describe("The getSourceList method", function() {

      it("Returns a source list object from a provided set of `$sources`.", function() {

        var $source1 = $('<div><a href="#foo1">bar1</a></div>'),
            $source2 = $('<div><a href="#foo2">bar2</a></div>'),
            $sources = $source1.add($source2),
            testResult,
            expectedResult;

        SAP = new SonyAudioPlayer($tester);

        testResult = SAP.getSourceList($sources);

        expectedResult = {
          'bar1': '#foo1',
          'bar2': '#foo2'
        };

        expect(testResult).toEqual(expectedResult);
      });

    });

    describe("The bindNav method", function() {


      it("Binds the <nav> elements to the `track` object's API.", function() {

        SAP = new SonyAudioPlayer($tester);

        var boundEvents = $._data($tester[0], "events");

        var playEventCount = 0,
            pauseEventCount = 0;

        for ( var i in boundEvents.click ) {
          if ( boundEvents.click[i].selector === '.play' ) {
            playEventCount++;
          }
          if ( boundEvents.click[i].selector === '.pause' ) {
            pauseEventCount++;
          }
        }

        expect(playEventCount).toBe(1);
        expect(pauseEventCount).toBe(1);

      });

    });

    describe("The bindModuleAPI method", function() {

      it("Create an Event-driven API of custom events that can be triggered by modules that are using `SonyAudioPlayer` as a submodule.", function() {

        SAP = new SonyAudioPlayer($tester);

        var boundEvents = $._data($tester[0], "events");

        expect(boundEvents['SonyAudioPlayer:play']).toBeDefined();

      });

    });

    describe("The setAlbumArt method", function() {

      it("Gets track at 0-based position `which`, and sets the active album art to the corresponding data object.", function() {

        SAP = new SonyAudioPlayer($tester);

        var expectedResult = $tester.find('.track').first().data('album-art');

        SAP.setAlbumArt(0);

        var testResult = $tester.css('backgroundImage');

        expect(testResult).toMatch(expectedResult);

      });

    });

  });

});
