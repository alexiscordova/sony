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

(function($, Modernizr, window, undefined) {

    'use strict';
    
    var PDPSlideShow = function(element, options){
      var self = this;
       
      //Extend
      $.extend( self, {}, $.fn.PDPSlideShow.defaults, options, $.fn.PDPSlideShow.settings );
      
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

      self.transitionDuration   = Modernizr.prefixed('transitionDuration');
      
      //Interaction vars
      self.startInteractionTime = -1;
      self.startTime            = -1;
      self.pageX                = -1;
      self.pageY                = -1;
      self.startDragX           = -1;
      self.hasMoved             = false;
      self.startPosition        = null;
      
      //Cache some jQuery objects we'll reference later
      self.$document = $(document);
      self.$window = $(window);
      self.$html = $('html');
      self.$slides = self.$el.find( self.SLIDE_CLASS );
      self.$slideContainer = self.$el.find( self.SLIDE_CONTAINER );
      
      //Init the module  
      self.init();

    };

    PDPSlideShow.prototype = {
      constructor: PDPSlideShow,

      //Initalize the module
      init : function( param ) {
        var self = this;
        
        self.setupEvents();
        
        self.$el.on( self.downEvent , $.proxy( self.dragStart , self ) );
      },

      //Checks for new breakpoints on debounced resize
      checkForBreakpoints: function(){
        var self = this;
        
    
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
       

        console.log('released');
      },

      //Debounced resize handler
      handleResize: function(){
        var self = this;

  
      }
      
      //end prototype object
    };

    // jQuery Plugin Definition
    // ------------------------

    $.fn.PDPSlideShow = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $( this ),
          pdpSlideShow = self.data( 'PDPSlideShow' );

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

    $.fn.PDPSlideShow.defaults = {

      // Description of this option.

      sampleOption: 0
    };

    // Non override-able settings
    // --------------------------

    $.fn.PDPSlideShow.settings = {
      isInitialized: false
    };
  
  $(function(){
    $( '.pdp-slideshow' ).PDPSlideShow({});
  });

 })( jQuery, Modernizr, window, undefined );