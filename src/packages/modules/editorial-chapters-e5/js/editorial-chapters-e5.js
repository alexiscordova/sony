// Editorial SlideShow - E4
// ------------
//
// * **Module:** Editorial Slideshow - E4
// * **Version:** 1.0a
// * **Modified:** 04/4/2013
// * **Author:** Tyler Madison, George Pantazis
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      $('.editorial-chapters').EditorialChapters();

define(function(require){

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        bootstrap = require('bootstrap'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        enquire = require('enquire'),
        sonyCarousel = require('secondary/index').sonyCarousel;

    var self = {
      'init': function() {
        $('.editorial-chapters-container').editorialChapters();
      }
    };
    
    var EditorialChapters = function(element, options){
      var self = this;
       
      // Extend
      $.extend( self, {}, $.fn.editorialChapters.defaults, options, $.fn.editorialChapters.settings );
      
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
      
      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = $(document);
      self.$window              = $(window);
      self.$html                = $('html');
      self.$slides              = self.$el.find( '.editorial-carousel-slide' );
      self.$slideContainer      = self.$el.find( '.editorial-carousel' );
      self.$thumbNav            = self.$el.find('.thumb-nav');
      self.$pagination          = null;

      self.hasThumbs            = self.$thumbNav.length > 0;
      self.numSlides            = self.$slides.length;
      self.currentId            = 0;

      // Inits the module
      self.init();
    };

    EditorialChapters.prototype = {
      constructor: EditorialChapters,

      // Initalize the module
      init : function( param ) {
        var self = this;

        if(!window.console){
          window.console = {};
          window.console.log = function(){};
        }

        self.setupEvents();
        self.setupSlides();
        self.setupCarousel();
        if(self.hasThumbs){
          self.createThumbNav();
        }
        self.$slideContainer.css( 'opacity' , 1 );
      },

      // Handles global debounced resize event
      onDebouncedResize: function(){
        var self = this,
        wW = self.$window.width();
        
        (wW > 1199) ? self.$el.css('overflow' , 'hidden') : self.$el.css('overflow' , 'visible');
      },

      // Main setup method for the carousel
      setupCarousel: function(){
        var self = this;

        // Using Sony Carousel for this module
        self.$slideContainer.sonyCarousel({
          wrapper: '.editorial-carousel-wrapper',
          slides: '.editorial-carousel-slide',
          looped: false,
          jumping: false,
          axis: 'x',
          unit: '%',
          useCSS3: self.useCSS3,
          paddles: false,
          pagination: false,
          draggable: false
        });

        self.$slideContainer.on('SonyCarousel:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

        iQ.update();

      },

      // Listens for slide changes and updates the correct thumbnail
      onSlideUpdate: function(e , currIndx){
        var self = this;

        self.currentId = currIndx;
        self.setCurrentActiveThumb();

        iQ.update();
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

      },

      // Sets up slides to correct width based on how many there are
      setupSlides: function(){
        var self = this;

        self.$slideContainer.width( 100 * (self.numSlides + 2)+ '%' );
        self.$slides.width( 100 / (self.numSlides + 2) + '%' );
      },
      
      // Setup touch event types
      setupEvents: function(){
        var self = this;
        
        if( self.hasTouch ){
          self.upEvent = 'touchend.pdpss';
        }else {
          self.clickEvent = 'click.pdpss';
        }

        self.tapOrClick = function(){
          return self.hasTouch ? self.upEvent : self.clickEvent;
        };

      },
      
      // Bind events to the thumbnail navigation
      createThumbNav: function(){
        var self = this,
        $anchors = self.$thumbNav.find('li');
        
        $anchors.on( self.tapOrClick() , function(e){
          e.preventDefault();
          self.onThumbSelected($(this));
        });
       
        $anchors.eq(0).addClass('active');
      },

      // Handles when a thumbnail is chosen
      onThumbSelected: function($el){
        var self = this,
        $anchors = self.$thumbNav.find('li'),
        selectedIndex =  $el.index(),
        animDirection = '';

        self.currentId = selectedIndex;

        $anchors.removeClass('active');
        $el.addClass('active');

        self.$slideContainer.sonyCarousel( 'gotoSlide' , self.currentId );
      },

      // Sets the current active thumbnail
      setCurrentActiveThumb: function(){
        var self = this;
        self.$thumbNav.find('li').removeClass('active')
          .eq( self.currentId ).addClass('active');
      }

      //end prototype object
    };

    // jQuery Plugin Definition
    $.fn.editorialChapters = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $( this ),
          editorialChapters = self.data( 'editorialChapters' );

        // If we don't have a stored moduleName, make a new one and save it.
        if ( !editorialChapters ) {
            editorialChapters = new EditorialChapters( self, options );
            self.data( 'moduleName', editorialChapters );
        }

        if ( typeof options === 'string' ) {
          editorialChapters[ options ].apply( editorialChapters, args );
        }
      });
    };

    // Defaults
    // --------
    $.fn.editorialChapters.defaults = {};

    // Non override-able settings
    // --------------------------
    $.fn.editorialChapters.settings = {};
  
    return self;
 });