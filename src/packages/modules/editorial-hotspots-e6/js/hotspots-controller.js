/*global define, Modernizr, log*/

// ------------ Sony Editorial Hotspots ------------
// Module: Editorial
// Version: 0.1
// Modified: 03/19/2013
// Dependencies: jQuery 1.7+, Modernizr
// Author: Brian Kenny
// --------------------------------------

define(function(require) {
  
  'use strict';
  
  var $ = require( 'jquery' ),
      iQ = require( 'iQ' ),
      bootstrap = require( 'bootstrap' ),
      Settings = require( 'require/sony-global-settings' ),
      Environment = require( 'require/sony-global-environment' ),
      Utilities = require( 'require/sony-global-utilities' );

  var self = {
    'init': function() {
      log('init editorial');
      // detect if there are any hotspot containers present
      $( '.hotspot-instance' ).each( function( el ) {
        // for each container, initialize an instance
        log('hotspot container present');
        $( this ).hotspotsController({});
      });
    }
  };
  
  var HotspotsController = function( element, options ){

    var self = this;
    // SETUP DEFAULTS
    // ...
        
    // SELECTORS
    
    // container element holding the hotspots
    self.$container                     = $( element );
    // collection of hotspots we must initialize
    self.$els                           = self.$container.find( ".hspot-outer" );
    
    // COORDINATES AND HOTSPOT STATUS COLLECTION
    self.$hotspotData                    = [];
    
    // LAST OPEN
    self.$lastOpen                       = null;
    
    // TRANSITION VARIABLES
    self.$transitionSpeed                = 500;
    self.$lastTimer                      = null;
    
    // EXTEND THIS OBJECT TO BE A JQUERY PLUGIN
    $.extend( self, {}, $.fn.hotspotsController.defaults, options, $.fn.hotspotsController.settings );
    self.init();
  };

  HotspotsController.prototype = {
    constructor: HotspotsController,
    init : function() {
      var self = this;
      
      // initialize hotspot(s)
      $( self.$els ).each(function( index, el ) {
        // bind the click, place it based on the data-x and -y coordinates, and fade em in
        self.bind( el );
        self.place( el );
        self.show( el );
      });

      log('SONY : Editorial Hotspots : Initialized');
    },
    
    bind: function( el ) {
      var self = this;
      $($( el ).find( '.hspot-core' ) ).bind( 'click', function( event ) {
        self.click( event, self );
      });
    },
    place: function( el ) {
      var self = this;
      // this places the hotspot absolutely, but we need to track each of these locations so on resize
      var xAnchor = $( el ).data( "x" );
      var yAnchor = $( el ).data( "y" );
      $( el ).css( "left", xAnchor );
      $( el ).css( "top", yAnchor );
      self.$hotspotData.push({
        el: el,
        xAnchor: xAnchor,
        yAnchor: yAnchor,
        open: false
      });
    },
    show: function( el ) {
      
    },
    find: function( currentTarget ) {
      var self = this;
      self.$els.each( function( index, el ) {
        log('searching');
        if( $( el ).is( currentTarget ) ) {
          return el;
        } else {
          log('no match');
        }
      });
    },
    click: function( event, self ) {
      var container = $( event.currentTarget ).parent(),
          hotspot   = container.find( '.hspot-core, .hspot-core-on' ),
          info      = container.find( '.overlay-base' );
      
      if( container.data( 'state' ) == 'open' ) {
        self.close( container, hotspot, info );
      } else {
        if( self.$lastOpen && !container.is( self.$lastOpen ) ) {
          log('resetting:::::');
          self.reset();
        }
         self.open( container, hotspot, info );
      }
      
    },
    reposition: function(el) {
      var self                = this,
          parentContainer     = el.parent(),
          parentLeft          = 0,
          parentTop           = 0,
          parentRight         = parentContainer.width(),
          parentFloor         = parentContainer.height(),
          overlay             = el.find( '.overlay-base' ),
          overlayHeight       = overlay.height(),
          overlayPosition     = overlay.position(),
          overlayHeaderHeight = overlay.find( '.top' ).height(),
          hotspotPosition     = overlay.parent().position(),
          rows                = (overlayHeaderHeight>0) ? 'three' : 'two';
      
      log('/****POSITION STUFFS****/');
/*
      log(parentContainer);
      log(parentContainer.height());
      log(parentContainer.width());
      log('overlayHeight '+overlayHeight);
      log('---');
      log('overlayPosition ');
      log('top '+overlayPosition.top);
      log('left '+overlayPosition.left);
      log('---');
      log('overlayHeaderHeight ');
      log(overlayHeaderHeight);
      log('---');
      log('hotspotPosition ');
      log('top '+hotspotPosition.top);
      log('left '+hotspotPosition.left);
*/
      
      var collidesTop           = false,
          collidesRight         = false,
          collidesFloor         = false,
          collidesLeft          = false,
          collides              = true, // assume there is a problem to start the loop, and break the loop
          topOverlayPosition    = null,
          leftOverlayPosition   = null,
          bottomOverlayPosition = null,
          rightOverlayPosition  = null;

      /*
       * INITIAL CALCULATIONS TO SEE IF WE'RE COLLIDING AT THE DEFAULT POSITIONING (TOP RIGHT)
       * THIS SHOULD LOOP 4 TIMES. IF IT'S STILL COLLIDING WE HAVE TO FIGURE THAT OUT...heh...
       **/

      for( var i=0; i<4 && collides === true; i++ ) {
        
        // check if the hotspot's offset plus the negative margin of the overlay is at or less than "top:0" with resepct to it's container
        topOverlayPosition = hotspotPosition.top - Math.abs( overlayPosition.top );
        if( topOverlayPosition <= 0 ) {
          // it is colliding with the top of the parent container
          collidesTop = collides = true;
          log('::overlay hits container top::');
        }
        
        // check if overlays' width plus position offset is overlapping the rightmost boundary of it's container
        rightOverlayPosition = hotspotPosition.left + overlayPosition.left + overlay.width();
        if( rightOverlayPosition >= parentRight ) {
          collidesRight = collides = true;
          log('::overlay hits container right::');
        }
        
        bottomOverlayPosition = ( hotspotPosition.top - Math.abs( overlayPosition.top ) ) + overlay.height();
        if( bottomOverlayPosition >= parentFloor ) {
          collidesFloor = collides = true;
          log('::overlay hits container floor::');
        }
        
        leftOverlayPosition = hotspotPosition.left + overlayPosition.left;
        if( leftOverlayPosition <= 0 ) {
          collidesLeft = collides = true;
          log('::overlay hits container left::');
        }
        
/*
        log('rightOverlayPosition '+rightOverlayPosition);
        log('topOverlayPosition '+topOverlayPosition);
        log('bottomOverlayPosition '+bottomOverlayPosition);
        log('leftOverlayPosition '+leftOverlayPosition);
*/
        
        
        // IF WE NEED TO, CLEAR ALL PREVIOUS POSITIONS
        if( collidesLeft || collidesRight || collidesTop || collidesFloor ) {
          self.clearPositionStyles(overlay);
        }
        
        
        /*
         * START CLOCKWISE AT HIGH NOON AND ROLL THROUGH ONCE
         * AND MAKE ADJUSTMENTS
         **/
        
        if(collidesTop) {
          overlay.addClass( rows + '-stack-right-top-justified' );
          overlay.find( '.arrow-right-top' ).removeClass( 'hidden' );
        } else if(collidesRight) {
          overlay.addClass( rows + '-stack-left-top-justified' );
          overlay.find( '.arrow-left-top' ).removeClass( 'hidden' );
        } else if(collidesFloor) {
          overlay.addClass( rows + '-stack-left-bottom-justified' );
          overlay.find( '.arrow-left-bottom' ).removeClass( 'hidden' );
        } else if(collidesLeft) {
          overlay.addClass( rows + '-stack-right-bottom-justified' );
          overlay.find( '.arrow-right-bottom' ).removeClass( 'hidden' );
        } else {
          collides = false;
        }
        
      }

      



      /*
       * RETEST THE HITS AROUND THE CLOCK
       * 
       **/


      /*
       * IF THERE IS STILL COLLISION, WE NEED TO ATTEMPT TO SHRINK THE OVERLAY (SHUT OFF TOP IMAGE, IF PRESENT, ETC)
       * AND RERUN THE TEST
       **/


       
      /*
       * IF TOP IMAGE ON, TURN IT OFF AND RETEST
       * 
       **/



      /*
       * IF TOP IMAGE OFF, BUT BOTTOM NODE IS ON, TURN IT OFF AND RETEST
       * 
       **/



      /*
       * IF THERE IS STILL COLLISION, WE HAVE A PRETTY SMALL SCREEN
       * ...
       **/
      
      
      

    },
    clearPositionStyles: function(el) {
      el.removeClass('three-stack-left-top-justified');
      el.removeClass('three-stack-left-bottom-justified');
      el.removeClass('three-stack-right-top-justified');
      el.removeClass('three-stack-right-bottom-justified');
      el.removeClass('two-stack-left-top-justified');
      el.removeClass('two-stack-left-bottom-justified');
      el.removeClass('two-stack-right-top-justified');
      el.removeClass('two-stack-right-bottom-justified');
      el.find('.arrow-left-top').addClass('hidden');
      el.find('.arrow-right-top').addClass('hidden');
      el.find('.arrow-left-bottom').addClass('hidden');
      el.find('.arrow-right-bottom').addClass('hidden');
    },
    close: function( container, hotspot, info ) {
        var self = this;
        // we are setting display:none when the trasition is complete, and managing the timer here
        self.cleanTimer();
        // save last close state
        container.data( 'state', 'closed' ).removeClass( 'info-jump-to-top' );
        // perform CSS transitions
        hotspot.removeClass( 'hspot-core-on' ).addClass( 'hspot-core' );
        // begin fade out
        info.find('.top').removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
        info.find('.middle').removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
        info.find('.footer').removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
        // closure to allow script to set display:none when transition is complete
        var anon = function() {
          info.addClass( 'hidden' );
        };
        // fire a timer that will set the display to none when the element is closed. 
        self.$lastTimer = setTimeout( anon, self.$transitionSpeed );
    },
    open: function( container, hotspot, info ) {
        var self = this;
        // we are setting display:none when the trasition is complete, and managing the timer here
        if(self.$lastOpen && container.is(self.$lastOpen[0])) {
          self.cleanTimer();
        }
        // save last open state
        self.$lastOpen = new Array( container, hotspot, info );
        // add data- info to this hotspot
        container.data( 'state', 'open' ).addClass( 'info-jump-to-top' );
        // perform CSS transitions
        hotspot.removeClass( 'hspot-core' ).addClass( 'hspot-core-on' );
        // we have to set display: block to allow DOM to calculate dimension
        info.removeClass( 'hidden' );
        // reposition window per it's collision detection
        self.reposition( container );
        // fade in info window
        info.find('.top').addClass( 'eh-visible' );
        info.find('.middle').addClass( 'eh-visible' );
        info.find('.footer').addClass( 'eh-visible' );
    },
    reset: function( container ) {
      var self = this;
      self.close( self.$lastOpen[ 0 ], self.$lastOpen[ 1 ], self.$lastOpen[ 2 ] );
    },
    cleanTimer: function() {
      /*
        BUG EXISTS WHEN YOU CLICK A DIFFERENT HOTSPOT. THE TIMEOUT FAILS TO SET 
        DISPLAY TO NONE ON THE LAST OPEN/CLOSING WINDOW.
      */
      var self = this;
      if( self.$lastTimer ) {
        clearTimeout( self.$lastTimer );
      }      
    } 
  };
  
  // Plugin definition
  $.fn.hotspotsController = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        hotspotsController = self.data('hotspotsController');
        // If we don't have a stored tertiaryModule, make a new one and save it
        if ( !hotspotsController ) {
            hotspotsController = new HotspotsController( self, options );
            self.data( 'hotspotsController', hotspotsController );
        }

        if ( typeof options === 'string' ) {
          hotspotsController[ options ].apply( hotspotsController, args );
        }
      });
  };

  // Defaults options for the module
  $.fn.hotspotsController.defaults = {
    options : {

    }
  };
  
  return self;
  
});