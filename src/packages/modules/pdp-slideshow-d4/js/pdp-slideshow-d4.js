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
      self.useCSS3              = Modernizr.csstransforms && Modernizr.csstransitions;
      
      //Interaction vars
      self.startInteractionTime = -1;
      self.startTime            = -1;
      self.pageX                = -1;
      self.pageY                = -1;
      self.startDragX           = -1;
      self.hasMoved             = false;
      self.startPosition        = null;
      self.currentId            = 0;
      self.previousId           = -1;
      self.transitionType       = 'slide';
      self.isTransitioning      = false;
      
      self.isDesktopMode        = true; //true by default
      self.isTabletMode         = false;
      self.isMobileMode         = false;
      
      //Cache some jQuery objects we'll reference later
      self.$ev                  = $({});
      self.$document            = $(document);
      self.$window              = $(window);
      self.$html                = $('html');
      self.$slides              = self.$el.find( self.SLIDE_CLASS );
      self.$currentSlide        = null;
      self.numSlides            = self.$slides.length;
      self.$slideContainer      = self.$el.find( self.SLIDE_CONTAINER );
      self.$thumbNav            = self.$el.find('.thumb-nav');
      self.$dotnav              = null;
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

        self.setupBreakpoints();
        
        
/*        self.$slideContainer.sonyDraggable({
          'axis': 'x',
          'unit': '%',
          'dragThreshold': 10,
          'containment': self.$el.find('.pdp-slideshow-outer'),
          'useCSS3': self.useCSS3,
          'drag': iQ.update
        });

        self.$slideContainer.on('sonyDraggable:dragStart',  $.proxy(self.dragStart, self));
        self.$slideContainer.on('sonyDraggable:dragEnd',  $.proxy(self.dragEnd, self));*/

      //self.$innerContainer.on(Settings.transEndEventName, function(){ iQ.update(true); });

        self.$slideContainer.css( 'opacity' , 1 );

      },

      // Stop animations that were ongoing when you started to drag.

      dragStart: function() {

        var self = this;

        self.startInteractionTime = new Date().getTime();
        self.$slideContainer.stop();
      },

      // Depending on how fast you were dragging, either proceed to an adjacent slide or
      // reset position to the nearest one.

      dragEnd: function(e, data) {

        var self = this,
            goToWhich;

        if ( data.acceleration.x > 150 ) {

          if ( self.currentSlide === 0 ) {
            self.gotoNearestSlide();
          } else {
            self.gotoSlide(self.currentSlide - 1);
          }
        } else if ( data.acceleration.x < -150 ) {

          if ( self.currentSlide === self.$slides.length - 1 ) {
            self.gotoNearestSlide();
          } else {
            self.gotoSlide(self.currentSlide + 1);
          }
        } else {
          self.gotoNearestSlide();
        }
      },

      // Find the nearest slide, and move the carousel to that.

      gotoNearestSlide: function(e, data) {

        var self = this,
            leftBounds = self.$el.get(0).getBoundingClientRect().left,
            positions = [];

        self.$slides.each(function(a){
          positions.push(Math.abs(leftBounds - this.getBoundingClientRect().left));
        });

        self.gotoSlide(positions.indexOf(Math.min.apply(Math, positions)));
      },

      setupBreakpoints: function(){
        var self = this;
        
        enquire.register("(min-width: 769px)", function() {
          console.log('Desktop Mode');
          self.isMobileMode = self.isTabletMode = false;
          self.isDesktopMode = true;
          self.showThumbNav();
          self.showPaddles();
          self.toggleDotNav( true );
        });

        enquire.register("(min-width: 569px) and (max-width: 768px)", function() {
          console.log('Tablet Mode');
          self.isMobileMode = self.isDesktopMode = false;
          self.isTabletMode = true;
          self.hideThumbNav();
          self.hidePaddles();
          self.toggleDotNav( true );
        });

        enquire.register("(max-width: 568px)", function() {
          console.log('Mobile Mode');
          self.isDesktopMode = self.isTabletMode = false;
          self.isMobileMode = true;
          self.hideThumbNav();
          self.hidePaddles();
          self.toggleDotNav( false );

          
        });

        console.log('Register with enquire');

      },

      setupDotNavigation: function(){
        var self = this,
        animDirection = '';

        if ( !self.$dotnav ) {

          self.$dotnav = $( '<div/>', { 'class' : 'navigation-container'  } );

          self.$el.append( self.$dotnav );

          self.$dotnav.sonyNavDots( {
            'buttonCount': self.numSlides
          });

          self.$dotnav.on('SonyNavDots:clicked', function( e, indx ){
            //self.currentId = indx;
            console.log('SonyNavDots:clicked',indx);

            if(indx < self.currentId){
              animDirection = 'right';
            }else{
              animDirection = 'left';
            }

            self.currentId = indx;
            self.gotoSlide( self.currentId , animDirection);

          });
          
          console.log( 'Creating Dot Navigation: ' , self.numSlides );
        }


      },

      toggleDotNav: function(hide){
        var self = this;

        // Make sure dot nav has been instantiated
        if(!self.$dotnav){
          self.setupDotNavigation();
        }

        if(hide){
          self.$dotnav.hide();
        }else{
          self.$dotnav.show();
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

      showPaddles: function(){
        var self = this;

        self.$el.find('.pagination-paddles').css( 'visibility' , 'visible' );

      },

      hidePaddles: function(){
        var self = this;

        self.$el.find('.pagination-paddles').css( 'visibility' , 'hidden' );

      },

      setupSlides: function(){
        var self = this;

/*        console.log( 'lol' );

        self.$slides.clone().appendTo(self.$slideContainer);
        self.$slides = self.$el.find( self.SLIDE_CLASS );
        self.numSlides = self.$slides.length;  */      

        //original
/*        self.$slideContainer.width( 100 * self.numSlides + '%' );
        self.$slides.width( 100 / self.numSlides + '%' );*/

        //nue
        self.$slideContainer.width( '100%' );
        self.$slides.width( '100%' );

        //get the first one to show up center screen
        self.$currentSlide = self.$slides.eq ( self.currentId ).css( 'left' , 0 );

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
        selectedIndx =  $el.parent().index(),
        animDirection = '';

        $anchors.removeClass('active');
        $el.addClass('active');

        if(selectedIndx === self.currentId){
          return; //already on this slide
        }

        if(selectedIndx < self.currentId){
          animDirection = 'right';
        }else{
          animDirection = 'left';
        }

        self.currentId = selectedIndx;
        
        self.gotoSlide( self.currentId , animDirection);


        console.log( 'anchors' , self.currentId );

      },

      setCurrentActiveThumb: function(){
        var self = this,
        $anchors = self.$thumbNav.find('a');
        $anchors.removeClass('active');
        $anchors.eq( self.currentId ).addClass('active');
      },

      gotoSlide: function( which, fromDirection ){
        
        var self = this,
            $destinationSlide = self.$slides.eq(which),
            destinationLeft, innerContainerWidth;

        if(self.isTransitioning) {
          return;
        }

        self.isTransitioning = true;
       
          console.log( 'Entering new territory here with queing up next slide, no longer moving the whole container' , (new Date).getTime() );
          console.log( 'goto this slide number',which  , fromDirection);

          //cue up next slide, get rid of current one out of view.

/*          if(self.previousId != -1){
            if( self.previousId < self.currentId ){
              fromDirection = 'right';
            }else{
              fromDirection = 'left';
            }
          }*/

          var completeFunction = function(){
            
            self.isTransitioning = false;
          };

          if( fromDirection === 'left'){
            self.$currentSlide.stop(true,true).animate( { left: '-100%' } , 500 , completeFunction );
            self.$currentSlide = self.$slides.eq( which );
            self.$currentSlide.css('left' , '100%');
            self.$currentSlide.stop(true,true).animate( { left : 0 } , 500 );            
          }else if( fromDirection === 'right' ){
            self.$currentSlide.stop(true,true).animate( { left: '100%' } , 500 , completeFunction);
            self.$currentSlide = self.$slides.eq( which );
            self.$currentSlide.css('left' , '-100%');
            self.$currentSlide.stop(true,true).animate( { left : 0 } , 500 );  
          }else{
            //default
            self.$currentSlide.stop(true,true).animate( { left: '-100%' } , 500 , completeFunction);
            self.$currentSlide = self.$slides.eq( which );
            self.$currentSlide.css('left' , '100%');
            self.$currentSlide.stop(true,true).animate( { left : 0 } , 500 );  
          }

          setTimeout(function(){
            iQ.update( true );
          } , 250);

          self.previousId = self.currentId;

          self.setCurrentActiveThumb();
        

//         if ( $destinationSlide.length === 0 ) { return; }

//         self.currentSlide = which;

//         destinationLeft = $destinationSlide.position().left;
//         innerContainerWidth = self.$slideContainer.width();

//         // If the browser doesn't properly support the getStyles API for auto margins, manually
//         // shift the destination back to compensate.

//         if ( !Modernizr.jsautomargins ) {
//           destinationLeft -= ( innerContainerWidth -  $destinationSlide.width() ) / 2;
//         }

//         if ( self.useCSS3 ) {

//           var newPosition = destinationLeft / innerContainerWidth;

//           // If you're on the last slide, only move over enough to show the last child.
//           // Prevents excess whitespace on the right.

//           if ( which === self.$slides.length - 1 ) {
//             var childrenWidth = 0;
// /*            $destinationSlide.find('.soc-item').each(function(){ childrenWidth += $(this).outerWidth(true); });
//             newPosition = (destinationLeft - ( $destinationSlide.width() - childrenWidth )) / innerContainerWidth;*/
//           }

//           self.$slideContainer.css(Modernizr.prefixed('transitionDuration'), '450ms');
//           self.$slideContainer.css(Modernizr.prefixed('transform'), 'translate(' + (-100 * newPosition + '%') + ',0)');

//         } else {

//           self.$slideContainer.animate({
//             'left': -100 * destinationLeft / Settings.$window.width() + '%'
//           }, {
//             'duration': 350,
//             'complete': function(){ iQ.update(true); }
//           });
//         }

        //self.$el.trigger('oneSonyCarousel:gotoSlide', self.currentSlide);

        //todo
        self.$ev.trigger('pdpOnUpdateNav');

      },

      onPaddleNavUpdate: function(){
        var self = this;

        self.$el.sonyPaddles('showPaddle', 'right');
        self.$el.sonyPaddles('showPaddle', 'left');

        //check for the left paddle compatibility
/*        if(self.currentId === 0){
          self.$el.sonyPaddles('hidePaddle', 'left');
        }

        //check for right paddle compatiblity
        if(self.currentId === self.numSlides - 1){
          self.$el.sonyPaddles('hidePaddle', 'right');
        }

        iQ.update();*/

        iQ.update();

      },      


      createPaddles: function(){

        var self = this;

        self.$el.find('.pdp-slideshow-outer').sonyPaddles();

        console.log('creating paddles...' , self.numSlides);

        self.$el.on('sonyPaddles:clickLeft', function(){
          self.currentId --;
          if(self.currentId < 0){
            self.currentId = self.numSlides- 1;
            console.log( 'New slide id#', self.currentId );
          }

          self.gotoSlide( self.currentId , 'right' );
          
        });

        self.$el.on('sonyPaddles:clickRight', function(){
          self.currentId ++;

          if(self.currentId >= self.$slides.length){
            self.currentId = self.$slides.length - 1;
            self.currentId = 0;
            console.log( 'New slide id#',self.currentId );
          }
           self.gotoSlide( self.currentId , 'left' );
          
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