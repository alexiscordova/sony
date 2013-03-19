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
        sonyScroller = require('secondary/index').sonyScroller,
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
      
      //Modernizr vars
      self.hasTouch = Modernizr.touch;
      self.cssTransitions = Modernizr.transitions;
      
      //CLASS CONSTANTS
      self.SLIDE_CLASS          = '.pdp-slideshow-slide';
      self.SLIDE_CONTAINER      = '.pdp-slideshow-inner';
      
      //Event vars
      self.downEvent            = null;
      self.downEvent            = null;
      self.moveEventPoint       = null;
      self.upEvent              = null;
      self.cancelEvent          = null;
      self.clickEvent           = null;
      self.isDragging           = false;

      self.hasTouch             = Modernizr.touch;

      self.transitionDuration   = Modernizr.prefixed('transitionDuration');
      
      //Interaction vars
      self.startInteractionTime = -1;
      self.startTime            = -1;
      self.pageX                = -1;
      self.pageY                = -1;
      self.startDragX           = -1;
      self.hasMoved             = false;
      self.startPosition        = null;
      self.currentId            = 0;
      self.transitionType       = 'slide';
      
      //Cache some jQuery objects we'll reference later
      self.$ev = $({});
      self.$document = $(document);
      self.$window = $(window);
      self.$html = $('html');
      self.$slides = self.$el.find( self.SLIDE_CLASS );
      self.numSlides = self.$slides.length;
      self.$slideContainer = self.$el.find( self.SLIDE_CONTAINER );
      self.$thumbNav            = self.$el.find('.thumb-nav');
      self.hasThumbs            = self.$thumbNav.length > 0;

      //Init the module
      self.init();

    };

    PDPSlideShow.prototype = {
      constructor: PDPSlideShow,

      //Initalize the module
      init : function( param ) {
        var self = this;
        
        self.setupEvents();

        if( !self.hasTouch ){
          self.createPaddles();
        }

        if(self.hasThumbs){
          self.createThumbNav();
        }

        self.setupSlides();
        
        self.enableDrag();

        self.$slideContainer.css( 'opacity' , 1 );

      },

      enableDrag: function(){
        var self = this;
        self.$slideContainer.on( self.downEvent , $.proxy( self.dragStart , self ) );

      },

      disableDrag: function(){
        var self = this;
        self.$slideContainer.off( self.downEvent , $.proxy( self.dragStart , self ) );
      },

      //Checks for new breakpoints on debounced resize
      checkForBreakpoints: function(){
        var self = this;
        
    
      },

      setupSlides: function(){
        var self = this;

        self.$slideContainer.width( 100 * self.numSlides + '%' );
        self.$slides.width( 100 / self.numSlides + '%' );

      },


      
      setupEvents: function(){
        var self = this;
        
        if( self.hasTouch ){
         self.downEvent        = 'touchstart.pdpss';
         self.moveEvent        = 'touchmove.pdpss';
         self.upEvent          = 'touchend.pdpss';
         self.cancelEvent      = 'touchcancel.pdpss';
        }else {
          self.downEvent       = 'mousedown.pdpss';
          self.moveEvent       = 'mousemove.pdpss';
          self.upEvent         = 'mouseup.pdpss';
          self.cancelEvent     = 'mouseup.pdpss';
          self.clickEvent      = 'click.pdpss';
        }

        self.tapOrClick = function(){
          return self.hasTouch ? self.upEvent : self.clickEvent;
        };

      },
      
      dragStart: function( e ){
        var self = this,
            point;
        
        console.log('starting drag');
        
        if(self.hasTouch){
          var touches = e.originalEvent.touches;
          if( touches && touches.length > 0 ){
            point = touches[0];
          }else{
            return;
          }
        }else{
          point = e;
          e.preventDefault();

          if(e.which !== 1){
            return; // make sure it was left mouse click!
          }
        }
        
        self.isDragging         = true;
        self.pageX              = self.startDragX = self.accelerationPos = point.pageX;
        self.pageY              = point.pageY;
        self.startTime          = self.startInteractionTime = ( new Date().getTime() );
        self.startPosition      = self.getPagePosition(e);
        self.currRenderPosition = self.pageX;
        
        //Setup listener for drag finish
        self.$document.on( self.moveEvent , $.proxy( self.dragMove , self ) )
                      .on( self.upEvent , $.proxy( self.dragRelease , self ) );
        
        console.log('setting up listens again');

      },
      
      dragMove: function(e){
        var self = this,
            point = null;
        
         console.log('drag move');
        
        if(self.hasTouch) {
          var touches = e.originalEvent.touches;
          if(touches) {
              if(touches.length > 1) {
                return;
              } else {
                point = touches[0];
              }
          } else {
            return;
          }
        } else {
          point = e;
        }
        
        self.dragPosition = point.pageX;
        self.moveEventPoint = point;

        (function animloop(){
          if(self.isDragging){
            self.animationFrame = window.requestAnimationFrame(animloop);
            if(self.moveEventPoint){
              self.move(self.moveEventPoint);
            }
          }      
        })();
        
      },
      
      //Move function on animationFrame loop 
      move: function(point) {
        var self     = this,
            deltaX   = point.pageX - self.pageX,
            newX     = self.pageX + deltaX;

        self.pageX   = newX;

        self.$slideContainer.css({
          'left' : newX
        });

        console.log( self.pageX , deltaX );

      },
      
      getPagePosition: function(e) {

        var self = this;

        if ( !e.pageX && !e.originalEvent ) {
          return;
        }

        self.lastTouch = self.lastTouch || {};

        // Cache position for touchmove/touchstart, as touchend doesn't provide it.
        if ( e.type === 'touchmove' || e.type === 'touchstart' ) {
          self.lastTouch = e.originalEvent.touches[0];
        }

        return {
          'x': (e.pageX || self.lastTouch.pageX),
          'y': (e.pageY || self.lastTouch.pageY)
        };
      },
      
      dragRelease: function(e){
        var self = this,
            point = self.hasTouch ? e.originalEvent.changedTouches[0] : e,
            totalMoveDist = Math.abs( point.pageX - self.startDragX );
        
        console.log( 'Animation Frame: ' , totalMoveDist  , self.moveEvent);
        
        //cancel animation frame
        self.$document.off( self.moveEvent )
                 .off( self.upEvent );
        
        self.isDragging = false;

        window.cancelAnimationFrame( self.animationFrame );

        self.pageX = self.currRenderPosition = point.pageX;

        iQ.update();
       

        console.log('released');
      },

      //Debounced resize handler
      handleResize: function(){
        var self = this;

  
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
        selectedIndx =  $el.parent().index();

        $anchors.removeClass('active');
        $el.addClass('active');

        self.currentId = selectedIndx;
        
        self.goToSlide( self.currentId );


        console.log( 'anchors' , self.currentId );

      },

      goToSlide: function(indx){
        var self = this;

        self.$slideContainer.css({
          'left' : - indx * 100 + '%'
        });

        //todo
        self.$ev.trigger('pdpOnUpdateNav');

      },

      onPaddleNavUpdate: function(){
        var self = this;

        self.$el.sonyPaddles('showPaddle', 'right');
        self.$el.sonyPaddles('showPaddle', 'left');

        //check for the left paddle compatibility
        if(self.currentId === 0){
          self.$el.sonyPaddles('hidePaddle', 'left');
        }

        //check for right paddle compatiblity
        if(self.currentId === self.numSlides - 1){
          self.$el.sonyPaddles('hidePaddle', 'right');
        }

        iQ.update();

      },      


      createPaddles: function(){

        var self = this;

        self.$el.find('.pdp-slideshow-outer').sonyPaddles();

        console.log('creating paddles...');

        self.$el.on('sonyPaddles:clickLeft', function(){
          self.currentId --;
          if(self.currentId < 0){
            self.currentId = 0;
          }

          self.goToSlide(self.currentId);
          
        });

        self.$el.on('sonyPaddles:clickRight', function(){
          self.currentId ++;

          if(self.currentId >= self.$slides.length){
            self.currentId = self.$slides.length - 1;
          }
           self.goToSlide(self.currentId);
          
        });

        self.onPaddleNavUpdate();
        self.$ev.on('pdpOnUpdateNav' , $.proxy(self.onPaddleNavUpdate , self));

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