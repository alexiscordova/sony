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

      // LISTEN FOR RESIZE
      $(window).resize(function() {
        if(self.$lastOpen) {
          try {
            self.reposition(self.$lastOpen[0]);
          } catch(e) {}
        }
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
    
    
   /*
    * AN ISSUE WHERE THE BREAKPOINT TEXT IS SHRINKING NEEDS TO BE ADJUSTED. WHEN THE TEXT SHRINKS THE 
    * TOPS ARE OFF, NEED TO INVESTIGATE
    * 
    * TODO: RE-INTRODUCE TOP OR BOTTOM NODES IF THEY ARE ON BY DEFAULT, IF THERE IS ROOM
    */
    
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
          overlayFooterHeight = overlay.find( '.footer' ).height(),
          hotspotPosition     = overlay.parent().position(),
          rows                = (overlayHeaderHeight>0) ? 'three' : 'two';
      log(' ');
      log('/* POSITIONING */');
      log(' ');
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
          collides              = null, // assume there is a problem to start the loop, and break the loop
          topOverlayPosition    = null,
          leftOverlayPosition   = null,
          bottomOverlayPosition = null,
          rightOverlayPosition  = null,
          passes                = 0;

      /*
       * INITIAL CALCULATIONS TO SEE IF WE'RE COLLIDING AT THE DEFAULT POSITIONING (TOP RIGHT)
       * THIS SHOULD LOOP 4 TIMES. IF IT'S STILL COLLIDING WE HAVE TO FIGURE THAT OUT...heh...
       **/
       
/*
      log('pre:');
      log(overlay.position().top);
      log(overlay.position().left);
*/

      for( var i=0; i<4 && ( true === collides || null === collides ); i++ ) { 
        // resample coordinates
        overlayHeight       = overlay.height(),
        overlayPosition     = overlay.position(),
        overlayHeaderHeight = overlay.find( '.top' ).height(),
        overlayFooterHeight = overlay.find( '.footer' ).height(),
        hotspotPosition     = overlay.parent().position();
        
        // check if the hotspot's offset plus the negative margin of the overlay is at or less than "top:0" with resepct to it's container
        topOverlayPosition = hotspotPosition.top - Math.abs( overlayPosition.top );
        // check if overlays' width plus position offset is overlapping the rightmost boundary of it's container
        rightOverlayPosition = hotspotPosition.left + overlayPosition.left + overlay.width();
        
        bottomOverlayPosition = ( hotspotPosition.top - Math.abs( overlayPosition.top ) ) + overlay.height();
        
        leftOverlayPosition = hotspotPosition.left + overlayPosition.left;
                
        if( topOverlayPosition <= 0 ) {
          // it is colliding with the top of the parent container
          collidesTop = true;
          self.clearPositionStyles(overlay);
          overlay.addClass( rows + '-stack-right-top-justified' );
          overlay.find( '.arrow-left-top' ).removeClass( 'hidden' );
          log('::overlay hits container top::');
        } else {
          collidesTop = false;
        }
        
        if( rightOverlayPosition >= parentRight ) {
          collidesRight = true;
          self.clearPositionStyles(overlay);
          overlay.addClass( rows + '-stack-left-top-justified' );
          overlay.find( '.arrow-right-top' ).removeClass( 'hidden' );
          log('::overlay hits container right::');
        } else {
          collidesRight = false;
        }
        
        
        if( bottomOverlayPosition >= parentFloor ) {
          collidesFloor = true;
          self.clearPositionStyles(overlay);
          overlay.addClass( rows + '-stack-left-bottom-justified' );
          overlay.find( '.arrow-right-bottom' ).removeClass( 'hidden' );
          log('::overlay hits container floor::');
        } else {
          collidesFloor = false;
        }
        

        if( leftOverlayPosition <= 0 ) {
          collidesLeft = true;
          self.clearPositionStyles(overlay);
          overlay.addClass( rows + '-stack-right-bottom-justified' );
          overlay.find( '.arrow-left-bottom' ).removeClass( 'hidden' );
          log('::overlay hits container left::');
        } else {
          collidesLeft = false;
        }
        
        log(collidesTop , collidesRight , collidesFloor , collidesLeft);
        
        if( collidesTop || collidesRight || collidesFloor || collidesLeft ) {
          collides = true;
        } else {
          collides = false;
          /* 
           * No collisions, good stuff, this is also a good spot to turn on default pieces if they fit
           * !!!! This may have a bug due to the use of abs on some side calculations and, keep an eye
           */
          /*
          if( overlay.find( '.top' ).hasClass( 'is-default-on' ) && overlay.find( '.top' ).hasClass( 'hidden' ) ) {
            // does adding this reintroduce collision?
            topOverlayPosition = hotspotPosition.top - Math.abs( overlayPosition.top ) - overlayHeaderHeight;
            if( topOverlayPosition >= 0 ) {
              // add it back!       
              overlay.find( '.top' ).removeClass( 'hidden' );
            }            
          }

          if( overlay.find( '.footer' ).hasClass( 'is-default-on' ) && overlay.find( '.footer' ).hasClass( 'hidden' ) ) {
            // does adding this reintroduce collision?
            bottomOverlayPosition = ( hotspotPosition.top - Math.abs( overlayPosition.top ) ) + overlay.height() + overlayFooterHeight;
            if( bottomOverlayPosition > parentFloor ) {
              // add it back!
              overlay.find( '.footer' ).removeClass( 'hidden' );
            }
          }
          */
          
        }

        /*
        log('rightOverlayPosition '+rightOverlayPosition);
        log('topOverlayPosition '+topOverlayPosition);
        log('bottomOverlayPosition '+bottomOverlayPosition);
        log('leftOverlayPosition '+leftOverlayPosition);
        */

        log('collides '+collides);   
        
        // if we're in the last iteration of the loop, and no position has been found,
        // we need to attempt to turn off the the top or bottom section to make room
        // since we're tracking collisions by side, we can easily do this prescriptively,
        if( true === collides && i == 3 ) {
        
          /* log('Reposition did not work. '); */
          
          var top = overlay.find( '.top' );
          var footer = overlay.find( '.footer' );
          
          if( collidesTop && ( top.height() > 0 ) ) {
            /* log('turning off top section and restting loop'); */
            top.addClass( 'hidden' );
            rows = 'two';
            self.downstepStacks( el );
            i=-1;
          }
          if( collidesFloor && ( footer.height() > 0 ) ) {
            /* log('turning off bottom section and resetting loop'); */
            footer.addClass( 'hidden' );            
            rows = 'two';
            self.downstepStacks( el );
            i=-1;
          }
          // two passes, and no dice; lets turn off top and bottom in an attempt to 
          // make room one last time
          if(passes==1) {
            top.addClass( 'hidden' );
            footer.addClass( 'hidden' );
            i=-1;
          } else if(passes>1) {
            i=99; // leave loop
          }
          /* log('finished '+passes+' passes' ); */
          passes++;

        }
      } // END COLLISION DETECTION

    },
    clearPositionStyles: function(el) {
      el.removeClass( 'three-stack-left-top-justified' );
      el.removeClass( 'three-stack-left-bottom-justified' );
      el.removeClass( 'three-stack-right-top-justified' ); 
      el.removeClass( 'three-stack-right-bottom-justified' );
      el.removeClass( 'two-stack-left-top-justified' );
      el.removeClass( 'two-stack-left-bottom-justified' );
      el.removeClass( 'two-stack-right-top-justified' );
      el.removeClass( 'two-stack-right-bottom-justified' );
      el.find( '.arrow-left-top' ).addClass( 'hidden' );
      el.find( '.arrow-right-top' ).addClass( 'hidden' );
      el.find( '.arrow-left-bottom' ).addClass( 'hidden' );
      el.find( '.arrow-right-bottom' ).addClass( 'hidden' );
    },
    downstepStacks: function(el) {
      log('swapping stack class');
      el = el.find( '.overlay-base' );
      log(el);
      if( el.hasClass( 'three-stack-left-top-justified' )) { 
        el.removeClass( 'three-stack-left-top-justified' ).addClass( 'two-stack-left-top-justified' );
      }
      if(el.hasClass( 'three-stack-left-bottom-justified' )) { 
        el.removeClass( 'three-stack-left-bottom-justified' ).addClass( 'two-stack-left-bottom-justified' );
      }
      if(el.hasClass( 'three-stack-right-top-justified' )) { 
        el.removeClass( 'three-stack-right-top-justified' ).addClass( 'two-stack-right-top-justified' );
      }
      if(el.hasClass( 'three-stack-right-bottom-justified' )) { 
        el.removeClass( 'three-stack-right-bottom-justified' ).addClass( 'two-stack-right-bottom-justified' );
      }
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