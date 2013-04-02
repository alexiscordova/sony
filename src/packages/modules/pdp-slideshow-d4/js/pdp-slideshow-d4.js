// PDP SlideShow - D4
// ------------
//
// * **Module:** PDP Slideshow - D4
// * **Version:** 1.0a
// * **Modified:** 03/06/2013
// * **Author:** Joe 'Tyler Madison' Developer
// * **Dependencies:** jQuery 1.9.1+, Modernizr
//
// *Example Usage:*
//
//      $('.pdp-slideshow').PDPSlideShow();

define(function(require){

    'use strict';

    var $ = require('jquery'),
        Modernizr = require('modernizr'),
        iQ = require('iQ'),
        bootstrap = require('bootstrap'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        enquire = require('enquire'),
        sonyScroller = require('secondary/index').sonyScroller,
        sonyDraggable = require('secondary/index').sonyDraggable,
        sonyNavDots = require('secondary/index').sonyNavDots,
        sonyPaddles = require('secondary/index').sonyPaddles;

    var self = {
      'init': function() {
        $('.pdp-slideshow').pdpSlideShow();
      }
    };
    
    var PDPSlideShow = function(element, options){
      var self = this;
       
      //Extend
      $.extend( self, {}, $.fn.pdpSlideShow.defaults, options, $.fn.pdpSlideShow.settings );
      
      //Set base element
      self.$el = $( element );


      //Debug mode
      self.DEBUG                = false;
      
      //Modernizr vars
      self.hasTouch             = Modernizr.touch;
      self.cssTransitions       = Modernizr.transitions;
      
      //CLASS CONSTANTS
      self.SLIDE_CLASS          = '.pdp-slideshow-slide';
      self.SLIDE_CONTAINER      = '.pdp-slideshow-inner';

      self.hasTouch             = Modernizr.touch;
      self.transitionDuration   = Modernizr.prefixed('transitionDuration');
      self.useCSS3              = Modernizr.csstransforms && Modernizr.csstransitions;
      self.currentId            = 0;

      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;
      
      //Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = $(document);
      self.$window              = $(window);
      self.$html                = $('html');
      self.$slides              = self.$el.find( self.SLIDE_CLASS );
      self.numSlides            = self.$slides.length;
      self.$slideContainer      = self.$el.find( self.SLIDE_CONTAINER );
      self.$thumbNav            = self.$el.find('.thumb-nav');
      self.hasThumbs            = self.$thumbNav.length > 0;

      self.$pagination = null;

      //Init the module
      self.init();

    };

    PDPSlideShow.prototype = {
      constructor: PDPSlideShow,

      //Initalize the module
      init : function( param ) {
        var self = this;

        if(self.DEBUG === true){
          self.$slides.each(function(i){
            var htag = $('<h2 class="debug_header" />').appendTo( $(this) );
            htag.html('SLIDE ' + ( i + 1 ) );
          });
        }

        self.setupEvents();
        self.setupSlides();
        self.setupCarousel();
        self.setupBreakpoints();
        
        if(self.hasThumbs){
          self.createThumbNav();
        }

        self.$slideContainer.css( 'opacity' , 1 );

      },

      setupCarousel: function(){
        var self = this;

        self.$slideContainer.sonyCarousel({
          wrapper: '.pdp-slideshow-outer',
          slides: '.pdp-slideshow-slide',
          looped: true,
          jumping: true,
          axis: 'x',
          unit: '%',
          dragThreshold: 2,
          useCSS3: self.useCSS3,
          paddles: true,
          pagination: true
        });

        self.$pagination = self.$el.find('.pagination-bullets');

        self.$slideContainer.on('SonyCarousel:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

        iQ.update();

      },

      onSlideUpdate: function(e , currIndx){
        var self = this;

        self.currentId = currIndx;
        self.setCurrentActiveThumb();

        iQ.update();
      },

      setupBreakpoints: function(){
        var self = this;
        
        enquire.register("(min-width: 769px)", function() {
          console.log('Desktop Mode');
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
          self.showThumbNav();
          self.toggleDotNav(true); //hide
        });

        enquire.register("(min-width: 569px) and (max-width: 768px)", function() {
          console.log('Tablet Mode');
          self.isMobileMode = self.isDesktopMode = false;
          self.isTabletMode = true;
          self.hideThumbNav();
          self.toggleDotNav(true); //hide

        });

        enquire.register("(max-width: 568px)", function() {
          console.log('Mobile Mode');
          self.isDesktopMode = self.isTabletMode = false;
          self.isMobileMode = true;
          self.hideThumbNav();
          self.toggleDotNav(false); //show
          
        });

        console.log('Register with enquire');

      }, 

      toggleDotNav: function(hide){
        var self = this;

        if(hide){
          self.$pagination.hide();
        }else{
          self.$pagination.show();
        }

      },

      hideThumbNav: function(){
        var self = this;
        if(self.$thumbNav.length > 0){
          self.$thumbNav.hide();
        }
      },

      showThumbNav: function(){
        var self = this;
        if(self.$thumbNav.length > 0){
          self.$thumbNav.show();
        }
      },

      setupSlides: function(){
        var self = this;

        self.$slideContainer.width( 100 * (self.numSlides + 2)+ '%' );
        self.$slides.width( 100 / (self.numSlides + 2) + '%' );

      },
      
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
      
      createThumbNav: function(){
        var self = this,
        $anchors = self.$thumbNav.find('a');
        
        $anchors.on( self.tapOrClick() , function(e){
          e.preventDefault();
          self.onThumbSelected($(this));
        });
       
        $anchors.eq(0).addClass('active');
      },

      onThumbSelected: function($el){
        var self = this,
        $anchors = self.$thumbNav.find('a'),
        selectedIndx =  $el.parent().index(),
        animDirection = '';

        self.currentId = selectedIndx;

        $anchors.removeClass('active');
        $el.addClass('active');

        self.$slideContainer.sonyCarousel( 'gotoSlide' , self.currentId );

        console.log( 'anchors' , self.currentId );

      },

      setCurrentActiveThumb: function(){
        var self = this,
        $anchors = self.$thumbNav.find('a');
        $anchors.removeClass('active');
        $anchors.eq( self.currentId ).addClass('active');
      }

      //end prototype object
    };

    // jQuery Plugin Definition
    // ------------------------

    $.fn.pdpSlideShow = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $( this ),
          pdpSlideShow = self.data( 'pdpSlideShow' );

        // If we don't have a stored moduleName, make a new one and save it.
        if ( !pdpSlideShow ) {
            pdpSlideShow = new PDPSlideShow( self, options );
            self.data( 'moduleName', pdpSlideShow );
        }

        if ( typeof options === 'string' ) {
          pdpSlideShow[ options ].apply( pdpSlideShow, args );
        }
      });
    };

    // Defaults
    // --------
    $.fn.pdpSlideShow.defaults = {

      // Description of this option.
      transitionType: 'slide', //could add more , like fade in out etc
      sampleOption: 0
    };

    // Non override-able settings
    // --------------------------
    $.fn.pdpSlideShow.settings = {
      isInitialized: false
    };
  
    return self;
 });