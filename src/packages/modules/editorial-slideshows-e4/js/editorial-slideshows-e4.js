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
//      $('.editorial-slideshow').EditorialSlideshow();

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
        $('.editorial-slidshow-container').editorialSlideshow();
      }
    };
    
    var EditorialSlideshow = function(element, options){
      var self = this;
       
      // Extend
      $.extend( self, {}, $.fn.editorialSlideshow.defaults, options, $.fn.editorialSlideshow.settings );
      
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
      self.$thumbNav            = self.$el.find( '' );
      self.$pagination          = null;

      self.hasThumbs            = self.$thumbNav.length > 0;
      self.numSlides            = self.$slides.length;
      self.currentId            = 0;


      // Inits the module
      self.init();

    };

    EditorialSlideshow.prototype = {
      constructor: EditorialSlideshow,

      // Initalize the module
      init : function( param ) {
        var self = this;

        if(!window.console){
          window.console = {};
          window.console.log = function(){};
        }

        window.console.log(' new carousel... ');

        self.setupEvents();
        self.setupSlides();

        self.setupCarousel();

        self.$slideContainer.css( 'opacity' , 1 );

         /*
        self.setupCarousel();
        self.setupBreakpoints();
        
        if(self.hasThumbs){
          self.createThumbNav();
        }

        self.$slideContainer.css( 'opacity' , 1 );


        // Listen for debounced resize event
        Environment.on('global:resizeDebounced' , $.proxy( self.onDebouncedResize , self ) );*/

      },

      // Handles global debounced resize event
      onDebouncedResize: function(){
        var self = this,
        wW = self.$window.width();
        
        if(wW > 1199){
          self.$el.css('overflow' , 'hidden');
        }else{
          self.$el.css('overflow' , 'visible');
        }

      },

      // Main setup method for the carousel
      setupCarousel: function(){
        var self = this;

        // Using Sony Carousel for this module
        self.$slideContainer.sonyCarousel({
          wrapper: '.editorial-carousel-wrapper',
          slides: '.editorial-carousel-slide',
          looped: true,
          jumping: true,
          axis: 'x',
          unit: '%',
          dragThreshold: 2,
          useCSS3: self.useCSS3,
          paddles: true,
          pagination: true/*,
          $paddleWrapper: self.$el.find('.editorial-carousel-wrapper')*/
        });

        self.$pagination = self.$el.find('.pagination-bullets');

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
          self.showThumbNav();
          self.toggleDotNav(true); //hide
        });

        enquire.register("(min-width: 569px) and (max-width: 768px)", function() {
          self.isMobileMode = self.isDesktopMode = false;
          self.isTabletMode = true;
          self.hideThumbNav();
          self.toggleDotNav(true); //hide
        });

        enquire.register("(max-width: 568px)", function() {
          self.isDesktopMode = self.isTabletMode = false;
          self.isMobileMode = true;
          self.hideThumbNav();
          self.toggleDotNav(false); //show
        });

      }

        if( self.$html.hasClass('lt-ie10') ){
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
          self.showThumbNav();
          self.toggleDotNav(true); //hide
          
        }

      },

      // Toggles dot nav based on breakpoints
      toggleDotNav: function(hide){
        var self = this;

        if(hide){
          self.$pagination.hide();
        }else{
          self.$pagination.show();
        }

      },

      // Toggles thumb nav based on breakpoints
      hideThumbNav: function(){
        var self = this;
        if(self.$thumbNav.length > 0){
          self.$thumbNav.hide();
        }
      },

      // Toggles thumb nav based on breakpoints
      showThumbNav: function(){
        var self = this;
        if(self.$thumbNav.length > 0){
          self.$thumbNav.show();
        }
      },

      // Sets up slides to correct width based on how many there are
      setupSlides: function(){
        var self = this;

        self.$slideContainer.width( 100 * (self.numSlides + 2)+ '%' );
        self.$slides.width( 100 / (self.numSlides + 2) + '%' );

        console.log( 'Setup slides: ' , 1 );

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
        $anchors = self.$thumbNav.find('a');
        
        $anchors.on( self.tapOrClick() , function(e){
          e.preventDefault();
          self.onThumbSelected($(this));
        });
       
        $anchors.eq(0).addClass('active');
      },


      // Handles when a thumbnail is chosen
      onThumbSelected: function($el){
        var self = this,
        $anchors = self.$thumbNav.find('a'),
        selectedIndx =  $el.parent().index(),
        animDirection = '';

        self.currentId = selectedIndx;

        $anchors.removeClass('active');
        $el.addClass('active');

        self.$slideContainer.sonyCarousel( 'gotoSlide' , self.currentId );

      },

      // Sets the current active thumbnail
      setCurrentActiveThumb: function(){
        var self = this,
        $anchors = self.$thumbNav.find('a');
        $anchors.removeClass('active');
        $anchors.eq( self.currentId ).addClass('active');
      }

      //end prototype object
    };

    // jQuery Plugin Definition
    $.fn.editorialSlideshow = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $( this ),
          editorialSlideshow = self.data( 'editorialSlideshow' );

        // If we don't have a stored moduleName, make a new one and save it.
        if ( !editorialSlideshow ) {
            editorialSlideshow = new EditorialSlideshow( self, options );
            self.data( 'moduleName', editorialSlideshow );
        }

        if ( typeof options === 'string' ) {
          editorialSlideshow[ options ].apply( editorialSlideshow, args );
        }
      });
    };

    // Defaults
    // --------
    $.fn.editorialSlideshow.defaults = {};

    // Non override-able settings
    // --------------------------
    $.fn.editorialSlideshow.settings = {};
  
    return self;
 });