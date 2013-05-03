// Editorial Video - E3
// ------------
//
// * **Module:** Editorial Video - E3
// * **Version:** 1.0a
// * **Modified:** 05/02/2013
// * **Author:** Tyler Madison, George Pantazis
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      $('.editorial-video').editorialVideo();

define(function(require){

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        bootstrap = require('bootstrap'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        enquire = require('enquire'),
        sonyVideo = require('secondary/index').sonyVideo;

    var self = {
      'init': function() {
        $('.editorial-video-container').editorialVideo();
      }
    };
    
    var EditorialVideo = function(element, options){
      var self = this;
       
      // Extend
      $.extend( self, {}, $.fn.editorialVideo.defaults, options, $.fn.editorialVideo.settings );
      
      // Set base element
      self.$el = $( element );
      
      // Modernizr vars
      self.hasTouch             = Modernizr.touch;
      self.cssTransitions       = Modernizr.transitions;
      
      // Modernizr vars
      self.hasTouch             = Modernizr.touch;
      self.transitionDuration   = Modernizr.prefixed('transitionDuration');
      self.useCSS3              = Modernizr.csstransforms && Modernizr.csstransitions;

      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;

      self.variation            = self.$el.data('variation');
      
      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = Settings.$document;
      self.$window              = Settings.$window;
      self.$html                = Settings.$html;

      // Inits the module
      self.init();

    };

    EditorialVideo.prototype = {
      constructor: EditorialVideo,

      // Initalize the module
      init : function( param ) {
        var self = this;

        //initialize videos
        sonyVideo.initVideos( self.$el.find('.player') );


        //log( self.variation );

      },

      // Handles global debounced resize event
      onDebouncedResize: function(){
        var self = this;

      },

      // Registers with Enquire JS for breakpoint firing
      setupBreakpoints: function(){
        var self = this;
        
        if( !self.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 769px)", function() {
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
        });

        enquire.register("(min-width: 569px) and (max-width: 768px)", function() {
          self.isMobileMode = self.isDesktopMode = false;
          self.isTabletMode = true;
        });

        enquire.register("(max-width: 568px)", function() {
          self.isDesktopMode = self.isTabletMode = false;
          self.isMobileMode = true;
        });

      }

        if( self.$html.hasClass('lt-ie10') ){
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;

        }

      }

      //end prototype object
    };

    // jQuery Plugin Definition
    $.fn.editorialVideo = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $( this ),
          editorialVideo = self.data( 'editorialVideo' );

        // If we don't have a stored moduleName, make a new one and save it.
        if ( !editorialVideo ) {
            editorialVideo = new EditorialVideo( self, options );
            self.data( 'moduleName', editorialVideo );
        }

        if ( typeof options === 'string' ) {
          editorialVideo[ options ].apply( editorialVideo, args );
        }
      });
    };

    // Defaults
    // --------
    $.fn.editorialVideo.defaults = {};

    // Non override-able settings
    // --------------------------
    $.fn.editorialVideo.settings = {};
  
    return self;
 });