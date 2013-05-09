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
      /* log('init editorial'); */
      var breakpoints = [ 360, 479, 567, 640, 767, 979, 1100 ];
      var breakpointReactor = function( e ) {
        iQ.update();
      };
      
      if( enquire ) {
        for( var i=0; i < breakpoints.length; i++ ) {
          if( 0 === i ) {
            enquire.register( "(max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
          } else {
            enquire.register( "(min-width: " + ( breakpoints[ i-1 ] + 1 ) + "px) and (max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
          }
        }
      }
      
      // detect if there are any hotspot containers present
      $( '.hotspot-instance' ).each( function( index, el ) {
        // for each container, initialize an instance
        /* log('hotspot container detected'); */
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
    self.lastHeight                      = null;    
    self.direction                       = null;
    self.directionV                      = null;
    self.variant1TopHeight               = 145;
    self.variant2TopHeight               = 119;
    self.variant1FloorHeight             = 100;
    self.variant2FloorHeight             = 108;
    self.variant1Differential            = 145;
    self.variant2Differential            = 120;
    self.showOverlayCentered             = ( $( window ).width() < 768 ) ? true : false;
    self.lastOverlayFadein               = null;
    self.lastOverlayFadeout              = null;
    self.lastCenteredOverlay             = null;
    self.trackingMode                    = null;
    self.trackingState                   = 'off',
    self.trackOpacity                    = null,
    self.trackOpacityTimer               = null;
    self.canShowHotspots                 = false;
    self.curAnimationCount               = 0;
    
    // EXTEND THIS OBJECT TO BE A JQUERY PLUGIN
    $.extend( self, {}, $.fn.hotspotsController.defaults, options, $.fn.hotspotsController.settings );
    self.init();
  };

  HotspotsController.prototype = {
    constructor: HotspotsController,
    init : function() {
      var self = this;
      
      
/* GET ORIGINAL IMAGE RATIO METHOD
      // from container, find the image module class, which contains the images original size we need to audit
      var coreElement = self.$container.find( '.image-module' );
      // detect if it's a div with a background or an image nested as a child node
      var coreNodeType = coreElement[0].tagName;
      // get path to image, and make a memory copy
      log('coreNodeType');
      log(coreNodeType);
      // get height and width of orignal image (images should be at native ratio when @ 1200px screen size) and 
      // store this for later use when the hotspots are resizing. The new % will have to be adjusted per resize to 
      // match this original ratio, rather than the size of the container. The two loose horizontal sync because of 
      // collapsing containers and the behavior of the browser image resizing
*/
      
      // inject the underlay node near the top of the dom tree
      var underlayNode = $( '.hspot-underlay' ).get( 0 );
      $( '.hspot-underlay' ).detach();
      $( 'body' ).append( underlayNode );

      // detect what type of tracking we need to bind the instance to
      var moduleHandle = self.$container.parent().find( '.image-module' );
      if( moduleHandle.hasClass( 'track-by-background' ) ) {
        self.trackingMode = 'background';
        self.trackingAsset = moduleHandle;
      } else {
        self.trackingMode = 'asset';
        self.trackingAsset = $( moduleHandle.children( '.iq-img' )[0] );
      }
      
      self.trackOpacity = function() {
        switch( self.trackingAsset.css( 'opacity' ) ) {
          case undefined:
          case "undefined":
            /* log( 'undefined' ); */
            clearInterval( self.trackOpacityTimer );
          break;
          case "1":
            /* log( 'clearing' ); */
            clearInterval( self.trackOpacityTimer );
            self.canShowHotspots = true;
            triggerInitialPosition();
          break;
        }
      };
      
      self.trackHeight = function() {
        if( "none" !== self.trackingAsset.css( 'background-image' ) ) {
          // bg detected, clearing
          clearInterval( self.trackOpacityTimer );
          self.canShowHotspots = true;
          triggerInitialPosition();
        }
      };
      
      if( 'asset' === self.trackingMode ) { 
        self.trackOpacityTimer = setInterval( self.trackOpacity, 50 );
      } else {
        self.trackOpacityTimer = setInterval( self.trackHeight, 1000 );
      }
      
      var triggerInitialPosition = function() {
        self.follow();
        self.show();
      };
      
      // initialize hotspot(s)
      $( self.$els ).each(function( index, el ) {
        // bind the click, place it based on the data-x and -y coordinates, and fade em in
        // lets hide everything first, and initialize the hotspot window right top justified
/*
        var base = $( el ).find( '.overlay-base' );
        var hasTop = base.find( '.top.is-default-on').length;
        var threeOrTwo = ( hasTop > 0 ) ? 'three' : 'two';
        self.moveTo( $( base ), 'right-top', threeOrTwo );
*/
        self.bind( el );
        self.place( el );
      });


      // BELOW THIS THRESHHOLD WE ARE FLAGGING THE STATE FOR OTHER FNS TO 
      // REPARTENT OVERLAY NODES TO DISPLAY CENTER OF MODULE
      if( enquire ) {
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
      }

      setTimeout(triggerInitialPosition, 500);      
    
      $( window ).scroll( function ( e ) {
        //log( 'self.trackingAsset.height()' );
        //log( self.trackingAsset.height() );
        //if( self.trackingAsset.height() < 50 ) {
          //log('now loading from scroll');
          self.trackingState = 'fadein';
          self.follow();
        //}
      });
      
      // LISTEN FOR RESIZE
      $( window ).resize( function() {
        
        self.follow();
      
        if( self.$lastOpen ) {
          if( true === self.showOverlayCentered ) {
            self.reanchor( el, true );
          } else {
            self.reanchor(el, false);
          }
        }

      });

      log('SONY : Editorial Hotspots : Initialized');
    },
    
    isElementInViewport: function ( el ) {
    
    
      // get hotspots actual scroll offset and position to window scope!!!
      // curX + parentX + scrollOffsetX
    
    // this will optimize the bajesus out of the function once it is working.
    // it should only be calculating vectors if an object is on screen, otherwise its a 
    // waste of cycles
      var rect    = {};
      rect.top    = $( el ).position().top;
      rect.left   = $( el ).position().left;
      rect.bottom = $( el ).position().top + $( el ).height();
      rect.right  = $( el ).position().left + $( el ).width();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= $( window ).height() &&
          rect.right <= $( window ).width()
          );
    },
    
    follow: function( el ) {
      var self       = this,
          inViewport = null;
          
      if( true ) {
        if( el ) {
          var offsetX     = self.trackingAsset.position().left,
              offsetY     = self.trackingAsset.position().top, 
              percX       = $( el ).data( "x" ).replace( '%', '' ),
              percY       = $( el ).data( "y" ).replace( '%', '' ),
              assetW      = self.trackingAsset.width(),
              assetH      = self.trackingAsset.height(),
              adjustedX   = null,
              adjustedY   = null,
              widthOffset = 0;
           
              if( $( window ).width() < 768 ) {
                widthOffset = ( self.trackingAsset.parent().width() - assetW ) / 2;
              }
           
              // get x coordinate
              adjustedX = ( percX * assetW ) / 100 + widthOffset;
              adjustedY = ( percY * assetH ) / 100;
           
              $( el ).css( "left", adjustedX );
              $( el ).css( "top", adjustedY );        
        } else {
          if( 'asset' === self.trackingMode ) {
            self.$els.each( function( index, el) {
              var offsetX     = self.trackingAsset.position().left,
                  offsetY     = self.trackingAsset.position().top,
                  percX       = $( el ).data( "x" ).replace( '%', '' ),
                  percY       = $( el ).data( "y" ).replace( '%', '' ),
                  assetW      = self.trackingAsset.width(),
                  assetH      = self.trackingAsset.height(),
                  adjustedX   = null,
                  adjustedY   = null,
                  widthOffset = 0;
               
                  // compensate for centering in the parent node
                  //if( $( window ).width() > 768 ) {
                    widthOffset = ( self.trackingAsset.parent().width() - assetW ) / 2;
                  //}
                  // get x coordinate
                  adjustedX = ( percX * assetW ) / 100 + widthOffset;
                  adjustedY = ( percY * assetH ) / 100;
               
                  $( el ).css( "left", adjustedX );
                  $( el ).css( "top", adjustedY );
            });
          }
        }
      }
    },
    
    disableScroll: function( flag ) {
      if( flag ) {
        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = "no"; // ie only        
      } else {
        document.documentElement.style.overflow = 'auto';  // firefox, chrome
        document.body.scroll = "yes"; // ie only
      }
    },
    
    hover: function( el, self, flag ) {
      switch(flag) {
        case true:
          $( el ).find( '.hspot-core, .hspot-core-on' ).removeClass( 'hspot-hover-off' ).addClass( 'hspot-hover-on' );
        break;
        case false:
          $( el ).find( '.hspot-core, .hspot-core-on' ).removeClass( 'hspot-hover-on' ).addClass( 'hspot-hover-off' );
        break;
      }
    },
    
    bind: function( el ) {
      var self = this;
      // hotspot clicks
      $( $( el ).find( '.hspot-core' ) ).bind( 'click', function( event ) {
        self.click( event, self );
      });
      
      $( $( el ).find( '.hspot-core' ) ).bind( 'mouseover', function( event ) {
        self.hover( el, self, true );
      });
      
      $( $( el ).find( '.hspot-core' ) ).bind( 'mouseout', function( event ) {
        self.hover( el, self, false );
      });
      
    },
    
    place: function( el ) {
    
      var self = this;
      if( 'background' === self.trackingMode ) {
        
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
        
      } else {
        
        self.follow( el );
        
      }

    },
    
    show: function( el ) {
      var self        = this,
          offsetTime  = 400; 

      if( true === self.canShowHotspots ) {
        $( self.$els ).each(function( index, el ) {
          if( $( el ).hasClass( 'eh-transparent' ) ) { 
            var stagger = function() { 
              log('stagger');
              $( el ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
            };
            setTimeout( stagger, ( self.curAnimationCount * offsetTime ) );
            self.curAnimationCount++;
          }
        });
      }
    },
    
    find: function( currentTarget ) {
      var self = this;
      self.$els.each( function( index, el ) {
        if( $( el ).is( currentTarget ) ) {
          return el;
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
/*           log('resetting:::::'); */
          self.reset();
        }
         self.open( container, hotspot, info );
      }
    },

    reanchor: function( el, toCenter ) {
      var self          = this,
          //overlayBase   = $( el ).parent().find( '.hspot-global-details-overlay' ),
          overlayBase   = $( document ).find( '.hspot-global-details-main' ),
          underlayBase  = $( '.hspot-underlay, .hspot-underlay-on' ); 

      // copy the overlay into the mobile, center overlay
      if( toCenter ) {
        
        clearTimeout( self.lastOverlayFadein );
        clearTimeout( self.lastOverlayFadeout ); 
        
        // tag last el as the one copied, so we can turn it on when required
        el.addClass( 'lastMoved' );

        // find and hide the currently open overlay, just tagged as 'lastMoved'
        el.find( '.overlay-base' ).addClass( 'hidden' );

        if( false === $( el ).is( self.lastCenteredOverlay ) ) {
          // copy HTML over to the overlay container
          overlayBase.html( el.find( '.overlay-base' ).html() );

          var hspotClose = function( event ) {
            event.preventDefault();
            // save pointer for one more operation
            var lastOpen = el;
            // close overlay 
            overlayBase.find( '.hspot-close' ).first().unbind( 'click', hspotClose);
            self.close( self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2] );
            self.reanchor( el, false );
          };

          // bind close button for this instance
          overlayBase.find( '.hspot-close' ).first().bind( 'click', hspotClose);

          self.lastCenteredOverlay = el;
        }
        
        // show the opaque underlay to dim the background
        if( self.$lastOpen ) {
          clearTimeout( self.lastOverlayTimeout );
          self.lastOverlayTimeout = null;
          underlayBase.removeClass( 'hidden' );
          underlayBase.removeClass( 'hspot-underlay' ).addClass( 'hspot-underlay-on' );
        }

        // turn on overlay container
        overlayBase.find( '.top' ).removeClass( 'hidden' );
        overlayBase.find( '.middle' ).removeClass( 'hidden' );
        overlayBase.find( '.footer' ).removeClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-left-top' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-left-bottom' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-right-top' ).addClass( 'hidden' );
        overlayBase.find( '.middle' ).find( '.arrow-right-bottom' ).addClass( 'hidden' );
        overlayBase.find( '.hspot-close' ).removeClass( 'hidden' );
        
        setTimeout( function() {          
          // finally show the overlay
          overlayBase.removeClass( 'hidden' );
          // position the overlay vertical center
          var topPos = null,
              outerHeight = $( window ).height() / 2,
              innerHeight = overlayBase.height() / 2;
          topPos = outerHeight - innerHeight;
          overlayBase.css( 'margin-top', topPos+'px' );

          self.lastOverlayFadein = setTimeout( function() {
            overlayBase.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
          }, 10 );
        }, 200);
        // stop scroll
        self.disableScroll( true );
        
        var catchAll = function( event ) {
          event.preventDefault();
          $( '.hspot-underlay-on' ).unbind( 'click', catchAll);
          overlayBase.find( '.hspot-close' ).click();
        };
        
        $( '.hspot-underlay-on' ).bind( 'click', catchAll);

      } else {
        // cleanup
        clearTimeout( self.lastOverlayFadeout );
        clearTimeout( self.lastOverlayFadein );

        // untag last overlay
        el.removeClass( 'lastMoved' );


        // close mobile overlay
        overlayBase.find( '.overlay-inner' ).removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
        self.lastOverlayFadeout = setTimeout( function() {
          overlayBase.addClass( 'hidden' );
          if( !underlayBase.hasClass( 'hidden' ) ) {
            // close underlay
            var anon = function() {
              underlayBase.addClass( 'hidden' );
            };
            underlayBase.removeClass( 'hspot-underlay-on' ).addClass( 'hspot-underlay' );
            self.lastOverlayTimeout = setTimeout( anon, 500 );
          }
        }, 500 );

        if( false === self.showOverlayCentered ) {
          // reopen normal overlay
          el.find( '.overlay-base' ).removeClass( 'hidden' ).find( '.overlay-inner' ).removeClass( 'eh-hidden' ).addClass( 'eh-visible' );
        }
       
        // reenable scrolling
        self.disableScroll( false );
        
      }
    },
    moveTo: function( overlay, position, rows ) {
      var self = this;
      self.clearPositionStyles(overlay);
      switch( position ) {
        case 'right-top':
          overlay.addClass( rows + '-stack-right-top-justified' );
          overlay.find( '.arrow-left-top' ).removeClass( 'hidden' );
/*           log('::overlay hits container top::'); */
        break;
        case 'right-bottom':
          overlay.addClass( rows + '-stack-right-bottom-justified' );
          overlay.find( '.arrow-left-bottom' ).removeClass( 'hidden' );
/*           log('::overlay hits container left::'); */
        break;
        case 'left-top':
          overlay.addClass( rows + '-stack-left-top-justified' );
          overlay.find( '.arrow-right-top' ).removeClass( 'hidden' );
/*           log('::overlay hits container right::'); */
        break;
        case 'left-bottom':
          overlay.addClass( rows + '-stack-left-bottom-justified' );
          overlay.find( '.arrow-right-bottom' ).removeClass( 'hidden' );
/*           log('::overlay hits container floor::'); */
        break;
      }
    },
    repositionByQuadrant: function( el, fromResize ) {
      // this function will reposition the hotspots in a simple way: by calculating what quadrant the hotspot is nested, and open the 
      // hotspot overlay in the most likely ideal position, i.e. quadrant 1 should have a hotspot appear left of it, 
      var self                  = this,
          $parentContainer       = el.parent(),
          parentWidth            = $parentContainer.width(),
          parentHeight           = $parentContainer.height(),
          $hotspot               = el,
          hotspotPosition        = $hotspot.position(),
          $overlay               = el.find( '.overlay-base' ),
          variantSmall           = $overlay.hasClass( 'variant2' ) ? true : false,
          $top                   = $overlay.find( '.top' ),
          topHeight              = $top.height(),
          hasTop                 = topHeight > 0 ? true : false,
          $bottom                = $overlay.find( '.footer' ),
          hasBottom              = $bottom.html() === "" ? false : true,
          $middle                = $overlay.find( '.middle' ),
          middleHeight           = ( false === hasTop && false === hasBottom ) ? $middle.outerHeight() - $middle.css( 'padding-bottom' ).replace( 'px', '' ) : $middle.outerHeight(),
          topOffsetLowLg         = ( ( middleHeight * 73.26102088 ) / 100 ) + topHeight,
          topOffsetHighLg        = ( ( middleHeight * 11.11111111 ) / 100 ) + topHeight,
          topOffsetLowSm         = ( ( middleHeight * 74.50000000 ) / 100 ) + topHeight,
          topOffsetHighSm        = ( ( middleHeight * 10.71428571 ) / 100 ) + topHeight,
          topOffsetLow           = variantSmall ? topOffsetLowSm : topOffsetLowLg,
          topOffsetHigh          = variantSmall ? topOffsetHighSm : topOffsetHighLg,
          side                   = [],
          quadrant               = 0;
          
          // what horizontal half are we in?
          if( hotspotPosition.left < ( parentWidth / 2 ) ) {
            side[0] = 2;
          } else {
            side[0] = 4;
          }
          
          // what vertical half are we in?
          if( hotspotPosition.top < ( parentHeight / 2 ) ) {
            side[1] = 6;
          } else {
            side[1] = 7;
          }
          
          // sum up the answer, just chose 4 weights that would never sum up the same
          switch( ( side[ 0 ] + side[ 1 ] ) ) {
            case 8:
              quadrant = 2;
            break;
            case 10:
              quadrant = 1;              
            break;
            case 9:
              quadrant = 3;
            break;
            case 11:
              quadrant = 4;
            break;
          }
          
          // adjust layout classes per quadrant 
          switch( quadrant ) {
            case 1:
            case 4:
              // position overlay to the left of hotspot
              $overlay.addClass( 'to-left' );
              $overlay.parent().find( '.arrow-right' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
              quadrant === 1 ? $overlay.css( 'top', '-'+topOffsetHigh+'px' ) : $overlay.css( 'top', '-'+topOffsetLow+'px' );
            break;
            case 2:
            case 3:
              // add to-right
              $overlay.addClass( 'to-right' );
              $overlay.parent().find( '.arrow-left' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
              quadrant === 2 ? $overlay.css( 'top', '-'+topOffsetHigh+'px' ) : $overlay.css( 'top', '-'+topOffsetLow+'px' );
            break;
          }
          
    },
    
    transition: function( collection, direction ) {
      $( collection ).each( function( index, _el ) {
        switch(direction) {
          case "on":
            $( _el ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );  
          break;
          case "off":
            $( _el ).removeClass( 'eh-visible' ).addClass( 'eh-transparent' );
          break;
        }
      });
    },
    
    close: function( container, hotspot, info ) {
        var self = this;
        // we are setting display:none when the trasition is complete, and managing the timer here
        self.cleanTimer();
        
        // save last close state
        container.data( 'state', 'closed' ).removeClass( 'info-jump-to-top' );
        
        // perform CSS transitions
        hotspot.removeClass( 'hspot-core-on' ).addClass( 'hspot-core' );
        
        if( Settings.isLTIE8 || Settings.isLTIE9 ) {
          hotspot.parent().removeClass( 'ie-on' );  
        }
        
        // begin fade out
        self.transition( [
                          info.parent().find('.arrow-left'), 
                          info.parent().find('.arrow-right'),
                          info.find('.overlay-inner') 
                         ], 'off' );
        
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

        if( Settings.isLTIE8 || Settings.isLTIE9 ) {
          hotspot.parent().addClass( 'ie-on' );  
        }
        
        // we have to set display: block to allow DOM to calculate dimension
        info.removeClass( 'hidden' );
        
        // reposition window per it's collision detection result
        self.repositionByQuadrant( container );
        //self.reposition( container );
        
        // fade in info window
        if( true === self.showOverlayCentered ) {
          $( '.hspot-global-details-overlay' ).find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );  
        } else {
          info.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        }       
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