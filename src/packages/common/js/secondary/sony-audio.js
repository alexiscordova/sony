
// Sony Audio (SonyAudio) Component
// --------------------------------------------
//
// * **Class:** SonyAudio
// * **Version:** 0.1
// * **Author:** George Pantazis
//
// Documentation to come.
//
// *Example Usage:*
//
//      var Audio = require('secondary/index').sonyAudio;

define(function(require){

  'use strict';

  var $ = require('jquery');

  var SonyAudio = function(){

    var self = this;
    self.init();
  };

  // Private methods
  // ---------------

  SonyAudio.prototype = {

    constructor: SonyAudio,

    init: function() {

      var self = this;

      return self;
    },

    destroy: function() {

      var self = this;

      return self;
    }
  };

  var sonyAudio = new SonyAudio();

  // Public methods
  // --------------

  var module = {

  };

  return module;
});
