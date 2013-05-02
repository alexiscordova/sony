// Sony Video
// -----------------------------
//
// * **Module:** Sony Video
// * **Version:** 1.0a
// * **Modified:** 04/4/2013
// * **Author:** Tyler Madison, George Pantazis
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      $('.sony-video').sonyVideo();

define(function(require){

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        bootstrap = require('bootstrap'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        enquire = require('enquire');

    var self = {
      'init': function() {
        $('.sony-video').sonyVideo();
      }
    };
    
    var SonyVideo = function(element, options){
      var self = this;
       
      // Extend
      $.extend( self, {}, $.fn.sonyVideo.defaults, options, $.fn.sonyVideo.settings );
      
      // Set base element
      self.$el = $( element );
      
      // Modernizr vars
      self.hasTouch             = Modernizr.touch;
      self.cssTransitions       = Modernizr.transitions;
      
      // Modernizr vars
      self.hasTouch             = Modernizr.touch;
      self.transitionDuration   = Modernizr.prefixed('transitionDuration');
      self.useCSS3              = Modernizr.csstransforms && Modernizr.csstransitions;
      
      // Cache some jQuery objects we'll reference later
      self.$document            = SONY.Settings.$document;
      self.$window              = SONY.Settings.$window;
      self.$html                = SONY.Settings.$html;


      // Inits the module
      self.init();

    };

    SonyVideo.prototype = {
      constructor: SonyVideo,

      // Initalize the module
      init : function( param ) {
        var self = this;

      }

      //end prototype object
    };

    // jQuery Plugin Definition
    $.fn.sonyVideo = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $( this ),
          sonyVideo = self.data( 'sonyVideo' );

        // If we don't have a stored moduleName, make a new one and save it.
        if ( !sonyVideo ) {
            sonyVideo = new SonyVideo( self, options );
            self.data( 'moduleName', sonyVideo );
        }

        if ( typeof options === 'string' ) {
          sonyVideo[ options ].apply( sonyVideo, args );
        }
      });
    };

    // Defaults
    // --------
    $.fn.sonyVideo.defaults = {};

    // Non override-able settings
    // --------------------------
    $.fn.sonyVideo.settings = {};
  
    return self;
 });