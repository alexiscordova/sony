
// Sony Audio Player (SonyAudioPlayer) Main Spec
// ---------------------------------------------

define(function(require){

  'use strict';

  var Jasmine = require('jasmine'),
      JasmineHTML = require('jasmine-html'),
      SonyAudioPlayer = require('modules/sony-audio-player/sony-audio-player');

  var SAP = new SonyAudioPlayer($('.sony-audio-player'));

  describe("A suite", function() {
    it("contains spec with an expectation", function() {
      expect(true).toBe(true);
    });
  });

});
