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
//      $('.editorial-video').sonyVideo();

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

      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;

      self.isFullEditorial      = self.$el.hasClass('full-bleed');

      self.variation            = self.$el.data('variation');
      
      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = Settings.$document;
      self.$window              = Settings.$window;
      self.$html                = Settings.$html;

      self.videoAPI             = null;

      // Inits the module
      self.init();

    };

    SonyVideo.prototype = {
      constructor: SonyVideo,

      // Initalize the module
      init : function( param ) {
        var self = this;

        //initialize videos
        self.videoAPI = sonyVideo.initVideos( self.$el.find('.player') );

        self.videoAPI.bind('resume' , function(){
          if(self.isFullEditorial){
            self.onDebouncedResize();
          }
        });

        if(self.isFullEditorial){
          Environment.on('global:resizeDebounced' , $.proxy( self.onDebouncedResize , self ) );
          self.onDebouncedResize(); //call once to set size
        }
        

      },

      // Handles global debounced resize event
      onDebouncedResize: function(){
        var self = this,
        wW = self.$window.width();

        if(wW > 980){
          //this makes the header grow 1px taller for every 20px over 980w..
          self.$el.css('height', Math.round(Math.min(720, 560 + ((wW - 980) / 5))));
          //$('.primary-tout.default .image-module, .primary-tout.homepage .image-module').css('height', Math.round(Math.min(640, 520 + ((w - 980) / 5))));
        }else{
          //this removes the dynamic css so it will reset back to responsive styles
          self.$el.css('height', '');
        }

        var heightDiff = Math.abs( self.$el.height() - self.$el.find('.fp-engine').height() );

        if(heightDiff > 0){
          self.$el.find('.fp-engine').css('top' , -heightDiff / 2 + 'px');
        }

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