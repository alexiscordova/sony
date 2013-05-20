/*global define, Modernizr, log*/

// ------------ Sony Editorial Hotspots ------------
// Module: Editorial Hotspots E6
// Version: 0.9
// Modified: 05/12/2013
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
      Utilities = require( 'require/sony-global-utilities' ),
      // this keeps track of the last open hotspot globally
      openHotspot = null;

  var self = {
    'init': function() {

      // detect if there are any hotspot containers present
      $( '.hotspot-instance' ).each( function( index, el ) {
        // for each container, initialize an instance
        $( this ).hotspotsController({});
      });
    }
  };

  var HotspotsController = function( element, options ){

    var self = this;
    // SETUP DEFAULTS
    // ...

    // SELECTORS
    self.$window                        = Settings.$window;
    // container element holding the hotspots
    self.$container                     = $( element );
    // collection of hotspots we must initialize
    self.$els                           = self.$container.find( ".hspot-outer" );

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
    self.trackingState                   = 'off';
    self.trackOpacity                    = null;
    self.trackOpacityTimer               = null;
    self.canShowHotspots                 = false;
    self.curAnimationCount               = 0;
    self.inTransition                    = false;
    // MODAL
    self.$modal                          = self.$container.find( '.hotspot-modal' );
    self.$modalBody                      = self.$modal.find( '.modal-body' );
    self.isModalOpen                     = true;
    self.hasTouch                        = Settings.hasTouchEvents || Settings.hasPointerEvents;

    // EXTEND THIS OBJECT TO BE A JQUERY PLUGIN
    $.extend( self, {}, $.fn.hotspotsController.defaults, options, $.fn.hotspotsController.settings );
    self.init();
  };

  HotspotsController.prototype = {
    constructor: HotspotsController,
    init : function() {
      var self = this;

      $( self.$container ).on( 'cleanOpenHotspots', self.close );

      // inject the underlay node near the top of the dom tree
/*
      var underlayNode = $( '.hspot-underlay' ).get( 0 );
      $( '.hspot-underlay' ).detach();
      $( 'body' ).append( underlayNode );
*/

      // detect what type of tracking we need to bind the instance to
      var moduleHandle = self.$container.parent().find( '.image-module' );
      if( moduleHandle.hasClass( 'track-by-background' ) ) {
        self.trackingMode = 'background';
        self.trackingAsset = moduleHandle;
      } else {
        self.trackingMode = 'asset';
        self.trackingAsset = $( moduleHandle.children( '.iq-img' )[ 0 ] );
      }

      // when the tracking item changes it's opacity, we trigger the initial flyon animation for the hotspot
      self.trackOpacity = function() {
        switch( self.trackingAsset.css( 'opacity' ) ) {
          case undefined:
          case "undefined":
            clearInterval( self.trackOpacityTimer );
          break;
          case "1":
            clearInterval( self.trackOpacityTimer );
            self.canShowHotspots = true;
            triggerInitialPosition();
          break;
        }
      };

      // we've been polling for changes to the height of the background, once it is
      // injected into the DOM as a background image, we stop polling
      self.trackHeight = function() {
        if( "none" !== self.trackingAsset.css( 'background-image' ) ) {
          // bg detected, clearing
          clearInterval( self.trackOpacityTimer );
          self.canShowHotspots = true;
          triggerInitialPosition();
        }
      };

      // set up polling for two types if indicators, opacity for inline images with hotspots and
      // height changes for backgrounds with hotspots
      if( 'asset' === self.trackingMode ) {
        self.trackOpacityTimer = setInterval( self.trackOpacity, 50 );
      } else {
        self.trackOpacityTimer = setInterval( self.trackHeight, 1000 );
      }

      // closure used to trigger hotspots for images
      var triggerInitialPosition = function() {

        self.follow();
        // since we're ready to show it, show it!
        self.show();
      };

      // initialize hotspot(s)
      $( self.$els ).each(function( index, el ) {
        // subscribe to events
        self.bind( el );
        // initial placement
        self.place( el );
      });


      // BELOW THIS THRESHHOLD WE ARE FLAGGING THE STATE FOR OTHER FNS TO
      // REPARTENT OVERLAY NODES TO DISPLAY CENTER OF MODULE
      if( enquire ) {
        enquire.register( "(max-width: 767px)" , function() {
          self.showOverlayCentered = true;
          self.follow();
          if( self.$lastOpen ) {
            self.reanchor( self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2], true );
          }
        }).listen();

        enquire.register( "(min-width: 768px)" , function() {
          self.showOverlayCentered = false;
          self.follow();
          if( self.$lastOpen ) {
            self.reanchor( self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2], false );
          }
        }).listen();

      }

      // listen for modal events
      self.$modal.on( 'show', $.proxy( self.onModalShow, self ) );
      self.$modal.on( 'shown', $.proxy( self.onModalShown, self ) );
      self.$modal.on( 'hidden', $.proxy( self.onModalClosed, self ) );

      if ( Settings.isLTIE9 ) {
        self.$modalBody.removeClass( 'fade' );
      }

      // TODO: switch to global throttled scroll
      $( window ).scroll( function ( e ) {
          self.trackingState = 'fadein';
          self.follow();
      });

      // TODO: switch to global throttled resize
      // for inline image type
      $( window ).resize( function() {
        self.follow();
      });

      // finally, seed the hotspot to fly on 1/2 second after set conditions are met
      setTimeout(triggerInitialPosition, 500);

      log('SONY : Editorial Hotspots : Initialized');
    },

    onModalShow: function( event ) {
      var self         = this,
          windowHeight = self.getMaxModalHeights().maxBodyHeight,
          modalHeight  = self.$modal.height(),
          newOffset    = 0;
      newOffset = ( windowHeight / 2 ) - ( modalHeight / 2 );
      self.$modal.css( 'top', newOffset+'px' );
      return;
    },

    onModalShown : function( evt ) {
      var self = this;

      self.isModalOpen = true;

      evt.stopPropagation();

      // Update max height for modal body
      self.getMaxModalHeights();
    },

    onModalClosed : function( evt ) {
      var self = this;

      evt.stopPropagation();

      if ( true /* self.hasTouch */ ) {
        $( 'body' ).css({
          height: '',
          maxHeight: '',
          overflow: ''
        });
      }

      //self.$modal.css( 'height', '' );
      //self.$modalBody.removeClass('in'); // need this?

      self.isModalOpen = false;
      self.isFadedIn = false;

      if( true === self.showOverlayCentered ) {
        self.close( self.$lastOpen[ 0 ], self.$lastOpen[ 1 ], self.$lastOpen[ 2 ] );
      }

      $( 'body' ).find( '.modal-backdrop' ).remove();

    },

    getMaxModalHeights : function() {
      var self = this,
          screenHeight,
          maxModalHeight,
          modalHeaderHeight,
          maxBodyHeight;

      screenHeight = self.$window.height();

      // 90% of the available height
      maxModalHeight = 0.9 * screenHeight;

      // Lock it at 90% or 900px
      maxModalHeight = Math.min( maxModalHeight, 900 );

      // Get the combined height of the header and subheader
      /* modalHeaderHeight = self.$modalHeader.outerHeight() + self.$modalSubhead.outerHeight(); */

      // Get the max height of the body
      maxBodyHeight = maxModalHeight; // - modalHeaderHeight;

      // console.log('screenHeight: ' + screenHeight, ' maxModalHeight: ' + maxModalHeight, ' modalHeaderHeight: ' + modalHeaderHeight, ' maxBodyHeight: ' + maxBodyHeight);

      return {
        maxModalHeight: maxModalHeight,
        maxBodyHeight: maxBodyHeight
      };
    },


    follow: function( doShowAfterFollow ) {
      var self       = this,
          inViewport = null;

      if( 'asset' === self.trackingMode ) {
        self.$els.each( function( index, el) {
          var offsetX     = self.trackingAsset.position().left,
              offsetY     = self.trackingAsset.position().top,
              percX       = $( el ).data( "x" ).replace( '%', '' ),
              percY       = $( el ).data( "y" ).replace( '%', '' ),
              assetW      = self.trackingAsset.width(),
              assetH      = self.trackingAsset.innerHeight(),
              adjustedX   = null,
              adjustedY   = null,
              widthOffset = 0,
              heightOffset = 0;

              // compensate for centering in the parent node
              //if( $( window ).width() > 768 ) {
                widthOffset = ( self.trackingAsset.parent().width() - assetW ) / 2;
                heightOffset = parseInt( self.trackingAsset.parent().css( 'padding-top' ), 10 );
              //}
              // get x coordinate
              adjustedX = ( percX * assetW ) / 100 + widthOffset;
              adjustedY = ( percY * assetH ) / 100 + heightOffset;

              // lets stop animation
              /* $( el ).addClass( 'no-hs-transition' ); */
              $( el ).css( "left", adjustedX );
              $( el ).css( "top", adjustedY );
              /* $( el ).removeClass( 'no-hs-transition' ); */
        });
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

        // this places the hotspot absolutely (currently by % fed from data-x,-y attrib)
        var xAnchor = $( el ).data( "x" );
        var yAnchor = $( el ).data( "y" );
        $( el ).css( "left", xAnchor );
        $( el ).css( "top", yAnchor );
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
          self.reset();
        }
        self.open( container, hotspot, info );
      }
    },

    reanchor: function( container, hotspot, info, placeInModal ) {
      var self          = this,
          maxBodyHeight = null,
          screenHeight  = null,
          $modal        = self.$modal.find( '.modal-body' );

      if( placeInModal ) {
      
        // two open hotspots trying to go modal is not pretty, lets avoid that
        /* if( self.$container.is( openHotspot[0] ) ) { */
          // this is the last open hotspot and should go modal when reaching the breakpoint
          info.addClass( 'hidden' );
          // defer trigger modal
          setTimeout(function() {
  
            maxBodyHeight = 'none';
  
            if ( true /* self.hasTouch */ ) {
              screenHeight = Settings.isIPhone || Settings.isAndroid ? window.innerHeight : self.$window.height();
              // Stop the page from scrolling behind the modal
              $( 'body' ).css({
                height: screenHeight,
                maxHeight: screenHeight,
                overflow: 'hidden'
              });
            }
  
            // Set a maximum height on the modal body so that it will scroll
            // Sony tablet s is completely busted in the modal....
            if ( !Settings.isSonyTabletS ) {
              self.$modalBody.css( 'maxHeight', maxBodyHeight );
            }
  
            self.$modal.css( 'height', '' );
          }, 0);
  
          $modal.html( info.html() );
  
          $modal.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
  
          $modal.find( '.box-close' ).removeClass( 'hidden' );
  
          self.$modal.modal({
            backdrop: true,
            keyboard: true,
            show: true
          });

/*
        } else {
          // since this is a rare, responsive condition, keep it clean and close any open hotspots
          self.close( self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2] );
        }
*/

      } else {
        //self.close( container, hotspot, info );
        info.removeClass( 'hidden' );
        info.find( '.overlay-base' ).removeClass( 'hidden' );
        info.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        self.$modal.modal( 'hide' );
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
              if( $hotspot.hasClass( 'override-right' ) ) {
                // has override behavior
                // position overlay to the right of hotspot
                $overlay.addClass( 'to-right' );
                $overlay.parent().find( '.arrow-left' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );                
              } else {
                // position overlay to the left of hotspot
                $overlay.addClass( 'to-left' );
                $overlay.parent().find( '.arrow-right' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );                
              }
              quadrant === 1 ? $overlay.css( 'top', '-'+topOffsetHigh+'px' ) : $overlay.css( 'top', '-'+topOffsetLow+'px' );
            break;
            case 2:
            case 3:
              if( $hotspot.hasClass( 'override-left' ) ) {
                // has override behavior
                // position overlay to the left of hotspot
                $overlay.addClass( 'to-left' );
                $overlay.parent().find( '.arrow-right' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );               
              } else {
                // position overlay to the right of hotspot
                $overlay.addClass( 'to-right' );
                $overlay.parent().find( '.arrow-left' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
              }
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

    close: function( container, hotspot, info, fromReset ) {
        var self = this;
        
        self.inTransition = ( self.$lastOpen[1].is( hotspot ) && !fromReset )  ? true : false;
        
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
        self.transition([
                          info.parent().find('.arrow-left'),
                          info.parent().find('.arrow-right'),
                          info.find('.overlay-inner')
                        ], 'off' );

        // closure to hide overlays after they fade out
        var anon = function() {
          info.addClass( 'hidden' );
          self.inTransition = false;
        };

        // fire a timer that will set the display to none when the element is closed.
        self.$lastTimer = setTimeout( anon, self.$transitionSpeed );

        // set the open status to zilch
        self.$lastOpen = null;

/*
        // kill the underlay if we're in minified mode
        if( true === self.showOverlayCentered ) {
          $( '.hspot-underlay' ).addClass( 'hidden' );
        }
*/
    },

    catchAllClicks: function( event ) {
      var self = this;
/*

      if( $( event.currentTarget ).not( self.$lastOpen[2] ) ) {
        self.close( self.$lastOpen[0], self.$lastOpen[1], self.$lastOpen[2] );
      }
*/
    },
    
    open: function( container, hotspot, info ) {
      var self = this;
      
      if( !self.inTransition  ) {
        
        // add off-hotspot click to close
        // $(document).click(self.catchAllClicks);
        
        // we are setting display:none when the trasition is complete, and managing the timer here
        if( self.$lastOpen && container.is( self.$lastOpen[0] ) ) {
          self.cleanTimer();
        }

        // save last open state
        self.$lastOpen = openHotspot = new Array( container, hotspot, info );
        
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
        //self.reposition( container );
        self.repositionByQuadrant( container );
        

        // fade in info window
        if( true === self.showOverlayCentered ) {
          //$( '.hspot-global-details-overlay' ).find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
          self.reanchor( container, hotspot, info, true );
        } else {
          info.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        }
      }
    },

    reset: function( container ) {
      var self = this;
      self.close( self.$lastOpen[ 0 ], self.$lastOpen[ 1 ], self.$lastOpen[ 2 ], true );
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