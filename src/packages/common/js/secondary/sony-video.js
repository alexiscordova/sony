
// Sony Video Module
// --------------------------------------------
//
// * **Class:** Sony Video
// * **Version:** 0.1
// * **Modified:** 04/30/2013
// * **Author:** Tyler Madison
// * **Dependencies:** jQuery 1.7+


define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment');

  var SonyVideo = function($element, options){
    var self = this;

    $.extend(self, {}, $.fn.sonyVideo.defaults, options, $.fn.sonyVideo.settings);

    self.init();
  };

  SonyVideo.prototype = {

    constructor: SonyVideo,

    init: function() {
      var self = this;

    }

  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.sonyVideo = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          sonyVideo = self.data('sonyVideo');

      if ( !sonyVideo ) {

        if ( typeof options === 'string' ) {
          return;
        }

        sonyVideo = new SonyVideo( self, options );
        self.data( 'sonyVideo', sonyVideo );
      }

      if ( typeof options === 'string' ) {
        sonyVideo[ options ].apply( sonyVideo, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyVideo.defaults = { };

});