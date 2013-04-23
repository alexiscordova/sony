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
        sonyCarouselFade = require('secondary/index').sonyCarouselFade,
        sonyScroller = require('secondary/index').sonyScroller;

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
      
      // Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = $(document);
      self.$window              = $(window);
      self.$html                = $('html');
      self.$slides              = self.$el.find('.editorial-carousel-slide');
      self.$slideContainer      = self.$el.find('.editorial-carousel');
      self.$thumbNav            = self.$el.find('.thumb-nav');
      self.$thumbItems          = self.$thumbNav.find('li');
      self.$thumbLabels         = self.$thumbNav.find('span');

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

        // Re-center thumb spans if window resizes
        Environment.on('global:resizeThrottled', function(){
          self.centerThumbText();
        });
      },

      // Main setup method for the carousel
      setupCarousel: function(){
        var self = this;

        // Using Sony Carousel for this module
        self.$slideContainer.sonyCarouselFade({
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

        self.$slideContainer.on('SonyCarouselFade:gotoSlide' , $.proxy( self.onSlideUpdate , self ) );

        iQ.update();

      },

      // Listens for slide changes and updates the correct thumbnail
      onSlideUpdate: function(e , currIndx){
        var self = this;

        self.currentId = currIndx;
        self.setCurrentActiveThumb();

        iQ.update();
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

        self.centerThumbText();
        if (self.$el.hasClass('text-mode')) {
          self.initScroller();
        }
      },

      // Vertically center thumb text based on height
      centerThumbText: function(){
        var self = this;

        self.$thumbLabels.each(function(){
          var $span = $(this),
            height = $span.height();

          // Loop through each label, detect height, and offset top as needed
          if (height <= 31) {
            $span.removeClass().addClass('oneLine');
          } else if (height >= 32 && height <= 47) {
            $span.removeClass().addClass('twoLine');
          } else if (height >= 48) {
            $span.removeClass();
          }
        });
      },

      initScroller: function(){
        self = this;

        self.$thumbNav.scrollerModule({
          contentSelector: '.slider',
          iscrollProps: {
            hScrollbar: false,
            isOverflowHidden: false
          }
        });
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

        self.$slideContainer.sonyCarouselFade( 'gotoSlide' , self.currentId );
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