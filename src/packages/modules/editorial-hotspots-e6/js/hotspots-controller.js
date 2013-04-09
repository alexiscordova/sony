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
      enquire = require('enquire'),
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
    self.lastOverlayTimeout              = null;
    self.lastWidth                       = null;
    self.direction                       = null;
    self.variant1TopHeight               = 145;
    self.variant2TopHeight               = 119;
    self.variant1FloorHeight             = 100;
    self.variant2FloorHeight             = 108;
    self.variant1Differential            = 145;
    self.variant2Differential            = 120;
    self.showOverlayCentered             = ( $(window).width() < 768 ) ? true : false;
    self.lastOverlayFadein               = null;
    self.lastOverlayFadeout              = null;
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
            self.reposition(self.$lastOpen[0], true);
          } catch(e) {}
        }
      });

      // BELOW THIS THRESHHOLD WE ARE FLAGGING THE STATE FOR OTHER FNS TO 
      // REPARTENT OVERLAY NODES TO DISPLAY CENTER OF MODULE
      enquire.register("(max-width: 767px)", function() {
        self.showOverlayCentered = true;
        try { 
          self.reposition(self.$lastOpen[0]);
        } catch(e) {}
      }).listen();
      
      enquire.register("(min-width: 768px)", function() {
        self.showOverlayCentered = false;
        try { 
          self.reposition(self.$lastOpen[0]);
        } catch(e) {}
      }).listen();

      log('SONY : Editorial Hotspots : Initialized');
    },
    
    bind: function( el ) {
      var self = this;
      // hotspot clicks
      $($( el ).find( '.hspot-core' ) ).bind( 'click', function( event ) {
        self.click( event, self );
      });
    },
    
    place: function( el ) {
      var self = this;
      // this places the hotspot absolutely (currently by % fed from data-x,y attrib)
      var xAnchor = $( el ).data( "x" );
      var yAnchor = $( el ).data( "y" );
      $( el ).css( "left", xAnchor );
      $( el ).css( "top", yAnchor );
      
      // lets add some defaults
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

    reanchor: function( el, toCenter ) {
      var self          = this,
          overlayBase   = $( '.hspot-global-details-overlay' ),
          underlayBase  = $( '.hspot-underlay, .hspot-underlay-on' ); 

      // copy the overlay into the mobile, center overlay
      if( toCenter ) {
        
        clearTimeout( self.lastOverlayFadein );
        clearTimeout( self.lastOverlayFadeout ); 
        
        // tag last el as the one copied, so we can turn it on when required
        el.addClass( 'lastMoved' );
        
        // find and hide the currently open overlay, just tagged as 'lastMoved'
        el.find( '.overlay-base' ).addClass( 'hidden' );
        
        // copy HTML over to the overlay container
        overlayBase.html( el.find( '.overlay-base' ).html() );



        // bind close button for this instance
        overlayBase.find( '.hspot-close' ).bind( 'click', function( event ) {
          // save pointer for one more operation
          var lastOpen = el;
          // close overlay 
          self.close( self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2] );
          self.reanchor( el, false );
        });

        // show the opaque underlay to dim the background
        if( self.$lastOpen ) {
          clearTimeout( self.lastOverlayTimeout );
          self.lastOverlayTimeout = null;
          underlayBase.removeClass( 'hidden' );
          underlayBase.removeClass( 'hspot-underlay' ).addClass( 'hspot-underlay-on' );
        }
        
/*
        // finally show the overlay
        overlayBase.removeClass( 'hidden' );
        overlayBase.removeClass( 'eh-transparent' ).addClass( 'eh-visible' );

        // turn on overlay container
        overlayBase.find( '.top' ).removeClass( 'hidden' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        overlayBase.find( '.middle' ).removeClass( 'hidden' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        overlayBase.find( '.middle' ).find( '.arrow-left-top' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-left-bottom' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-right-top' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-right-bottom' ).addClass( 'hidden' );
        overlayBase.find( '.footer' ).removeClass( 'hidden' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        overlayBase.find( '.hspot-close' ).removeClass( 'hidden' );
*/



        // turn on overlay container
        overlayBase.find( '.top' ).removeClass( 'hidden' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        overlayBase.find( '.middle' ).removeClass( 'hidden' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        overlayBase.find( '.middle' ).find( '.arrow-left-top' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-left-bottom' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-right-top' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-right-bottom' ).addClass( 'hidden' );
        overlayBase.find( '.footer' ).removeClass( 'hidden' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        overlayBase.find( '.hspot-close' ).removeClass( 'hidden' );
        
        // finally show the overlay
        overlayBase.removeClass( 'hidden' );
        self.lastOverlayFadein = setTimeout( function() {
          overlayBase.removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        }, 10 );
        
      } else {
        // cleanup
        clearTimeout( self.lastOverlayFadeout );
        clearTimeout( self.lastOverlayFadein );
        
        // untag last overlay
        el.removeClass( 'lastMoved' );
        
        if(!underlayBase.hasClass('hidden')) {
          // close underlay
          var anon = function() {
            log('removing flag');
            underlayBase.addClass( 'hidden' );
          };
          underlayBase.removeClass( 'hspot-underlay-on' ).addClass( 'hspot-underlay' );
          self.lastOverlayTimeout = setTimeout( anon, 500 );
        }

        // close mobile overlay
        overlayBase.removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
        self.lastOverlayFadeout = setTimeout( function() {
          overlayBase.addClass( 'hidden' );
        }, 500 );
        
        // reopen normal overlay
        el.find( '.overlay-base' ).removeClass( 'hidden' );
      }
    },
    
    reposition: function( el, fromResize ) {
      
      var self                  = this,
          parentContainer       = el.parent(),
          parentLeft            = 0,
          parentTop             = 0,
          parentRight           = parentContainer.width(),
          parentFloor           = parentContainer.height(),
          overlay               = el.find( '.overlay-base' ),
          overlayHeight         = overlay.height(),
          overlayPosition       = overlay.position(),
          overlayHeaderHeight   = overlay.find( '.top' ).height(),
          overlayFooterHeight   = overlay.find( '.footer' ).height(),
          overlayTop            = overlay.find( '.top' ),
          overlayFooter         = overlay.find( '.footer' ),
          hotspotPosition       = overlay.parent().position(),
          rows                  = (overlayHeaderHeight>0) ? 'three' : 'two',  
          collidesTop           = false,
          collidesRight         = false,
          collidesFloor         = false,
          collidesLeft          = false,
          collides              = null, // assume there is a problem to start the loop, and break the loop
          topOverlayPosition    = null,
          leftOverlayPosition   = null,
          bottomOverlayPosition = null,
          rightOverlayPosition  = null,
          passes                = 0,
          top                   = null,
          footer                = null;

      
      // we need to put this element in the centered overlay, not free form next to it's hotspot button
      if( true === self.showOverlayCentered ) {
        
        /* log('need to reparen to overlay view'); */
        self.reanchor( el, true );
        
      } else {
        
        /* log('unabaited repositioning'); */
        self.reanchor(el, false);
        
        /*
         * INITIAL CALCULATIONS TO SEE IF WE'RE COLLIDING AT THE DEFAULT POSITIONING (TOP RIGHT)
         * THIS SHOULD LOOP 4 TIMES. IF IT'S STILL COLLIDING WE HAVE TO FIGURE THAT OUT...heh...
         **/
  
        // see if we're growing or shrinking
        try {
          if( parentRight > self.lastWidth ) {
            self.direction = 'grew';
          } else if( parentRight == self.lastWidth ) {
            self.direction = 'same';
          } else {
            self.direction = 'shrank';
          }
          self.lastWidth = parentRight;
        } catch(e) {}
  
        // The script will move the window into it's 4 potential orientations, until it finds a place it fits.
        // if the loop is completed and there are no matches, the script will turn off the top and footer nodes of
        // the overlay and reiterate through the loop, breaking when the overlay is at a safe zone.
        
        // TODO:: Apply restraints to Editorial types [as spec'd from comps] 
        
        for( var i=0; i<4 && ( true === collides || null === collides ); i++ ) { 
          // resample coordinates
          overlayHeight       = overlay.height(),
          overlayPosition     = overlay.position(),
          overlayHeaderHeight = overlayTop.height(),
          overlayFooterHeight = overlayFooter.height(),
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
            /* log('::overlay hits container top::'); */
          } else {
            collidesTop = false;
          }
          
          if( rightOverlayPosition >= parentRight ) {
            collidesRight = true;
            self.clearPositionStyles(overlay);
            overlay.addClass( rows + '-stack-left-top-justified' );
            overlay.find( '.arrow-right-top' ).removeClass( 'hidden' );
            /* log('::overlay hits container right::'); */
          } else {
            collidesRight = false;
          }
          
          
          if( bottomOverlayPosition >= parentFloor ) {
            collidesFloor = true;
            self.clearPositionStyles(overlay);
            overlay.addClass( rows + '-stack-left-bottom-justified' );
            overlay.find( '.arrow-right-bottom' ).removeClass( 'hidden' );
            /* log('::overlay hits container floor::'); */
          } else {
            collidesFloor = false;
          } 
          
  
          if( leftOverlayPosition <= 0 ) {
            collidesLeft = true;
            self.clearPositionStyles(overlay);
            overlay.addClass( rows + '-stack-right-bottom-justified' );
            overlay.find( '.arrow-left-bottom' ).removeClass( 'hidden' );
            /* log('::overlay hits container left::'); */
          } else {
            collidesLeft = false;
          }
          
          //log(collidesTop , collidesRight , collidesFloor , collidesLeft);
          
          if( collidesTop || collidesRight || collidesFloor || collidesLeft ) {
            
            collides = true;
            
          } else {
            
            collides = false;
            
            // element has a default image, and due to shiting around, can be turned on if there is
            // 1. room, and 2. the last resize was growing and not shrinking, implying there is more space now 
            // to potentially turn on the top section.
            if( overlayTop.hasClass( 'is-default-on' ) && 
                overlayTop.hasClass( 'hidden' ) &&
                fromResize && 'grew' === self.direction ) {
              
              var topHeight = null;
              
              if( overlay.parent().hasClass( 'variant1' )) {
                topHeight = self.variant1TopHeight;/*  + self.variant1Differential; */
              } else {
                topHeight = self.variant2TopHeight;/*  + self.variant2Differential; */
              }
              
              topOverlayPosition = hotspotPosition.top - Math.abs( overlayPosition.top ) - topHeight;
              
              if( topOverlayPosition > 0 ) {
                // it fits!
                overlayTop.removeClass( 'hidden' );
                // make sure the orientation is correct. In some cases it needs to be adjusted
                self.twoToThree(overlay);
              }
            }
  
            if( overlayFooter.hasClass( 'is-default-on' ) && 
                overlayFooter.hasClass( 'hidden' ) &&
                fromResize && 'grew' === self.direction ) {
         
              var floorHeight = null;
         
              if( overlay.parent().hasClass( 'variant1' )) {
                floorHeight = self.variant1FloorHeight;
              } else {
                floorHeight = self.variant2FloorHeight;
              }
  
              bottomOverlayPosition = ( hotspotPosition.top - Math.abs( overlayPosition.top ) ) + overlay.height() + floorHeight;
              
              if( bottomOverlayPosition < parentFloor ) {
                overlayFooter.removeClass( 'hidden' );
              }
            }
            
          }
          
          // if we're in the last iteration of the loop, and no position has been found,
          // we need to attempt to turn off the the top or bottom section to make room
          // since we're tracking collisions by side, we can easily do this prescriptively,
          if( true === collides && i == 3 ) {
          
            /* log('Reposition did not work. '); */
            
            top = overlayTop; // clean up redundant vars!!!!
            footer = overlayFooter; // clean up redundant vars!!!!
            
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
  
            /* log('finished '+passes+' passes' ); */
            passes++;
            
            // two passes, and no dice; lets turn off top and bottom in an attempt to 
            // make room one last time
            if(passes==1) {
              top.addClass( 'hidden' );
              footer.addClass( 'hidden' );
              i=-1;
            } else if(passes>1) {
              i=99; // leave loop
            }
  
  
          }
        } // END COLLISION DETECTION

      }
    },
    
    twoToThree: function( el ) {
      var classList =$( el ).attr( 'class' ).split( /\s+/ );
      $.each( classList, function( index, item ){
          console.log(item);
          if ( item.indexOf( 'two-' ) > -1 ) {
             el.removeClass( item );
             item = item.replace( 'two-', 'three-' );
             el.addClass( item );
          }
      });
    },
    
    clearPositionStyles: function( el ) {
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
    
    downstepStacks: function( el ) {
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
    transition: function( _el, direction ) {
      switch(direction) {
        case "on":
          _el.removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        break;
        case "off":
          _el.removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
        break;
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
        self.transition( info.find('.top'),     'off' );
        self.transition( info.find('.middle'),  'off' );
        self.transition( info.find('.footer'),  'off' );
        
        // closure to allow script to set display:none when transition is complete
        var anon = function() {
          info.addClass( 'hidden' );
        };
        
        // fire a timer that will set the display to none when the element is closed. 
        self.$lastTimer = setTimeout( anon, self.$transitionSpeed );
        
        // set the open status to zilch
        self.$lastOpen = null;
        
        // kill the underlay if we're in minified mode
        if( true === self.showOverlayCentered ) {
          log('clozilla');
          $( '.hspot-underlay' ).addClass( 'hidden' );          
        }
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
    
    defaultPositions: function() {
      for(var el in self.$els) {
        
      }
    },
    
    cleanTimer: function() {
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