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
      Utilities = require( 'require/sony-global-utilities' );

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
    self.$els                           = self.$container.find( '.hspot-outer' );
    self.$el = $(element);

    // LAST OPEN
    self.lastOpen                       = null;

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
    self.showOverlayCentered             = self.$window.width() < 768;
    self.lastOverlayFadein               = null;
    self.lastOverlayFadeout              = null;
    self.lastCenteredOverlay             = null;
    self.trackingMode                    = null;
    self.trackingState                   = 'off';
    self.trackOpacity                    = null;
    self.trackOpacityTimer               = null;
    self.canShowHotspots                 = false;
    self.curAnimationCount               = 0;
    self.id                              = null;
    self.variant                         = null;
    // MODAL
    self.$modal                          = self.$container.find( '.hotspot-modal' );
    self.$modalBody                      = self.$modal.find( '.modal-body' );
    self.isModalOpen                     = true;
    self.hasTouch                        = Settings.hasTouchEvents;
    self.isChapter                       = (self.$container.closest('.editorial-chapters-container').length) ? true : false;
    self.isSmallChapter                  = (self.$container.closest('.editorial-chapters-container').parents('.media-element').length) ? true : false;

    self.isDesktop = false;
    self.isMobile = false;

    // EXTEND THIS OBJECT TO BE A JQUERY PLUGIN
    $.extend( self, {}, $.fn.hotspotsController.defaults, options, $.fn.hotspotsController.settings );
    self.init();
  };

  HotspotsController.prototype = {
    constructor: HotspotsController,
    init : function() {
      var self = this;

      // detect what type of tracking we need to bind the instance to
      var moduleHandle = self.$container.closest( '.image-module' );
      var isFullHotspot = self.$container.parents('.editorial').find('.container.inner').length;

      // The module event overlay is the container for the hotspots
      var moduleEventOverlay = isFullHotspot ? self.$container.parents('.editorial').find('.container.inner') : self.$container.closest( '.image-module' );

      if( moduleHandle.hasClass( 'track-by-background' ) ) {
        self.trackingMode   = 'background';
        self.trackingAsset  = moduleHandle;
        self.variant        = 'variant1';
      } else if ( moduleHandle.hasClass ( 'track-by-asset')) {
        self.trackingMode   = 'asset';
        self.trackingAsset  = $( moduleHandle.children( '.iq-img' )[0] );
        self.variant        = 'variant2';
      }
      else { //no background image at all -- where will width and height come from? not sure yet, what was driving them before?
        self.trackingMode = 'none';
        self.trackingAsset  = moduleHandle;
        self.variant        = 'variant1';
      }

      //click image to close
      moduleEventOverlay.on( 'click', function( event ) {
        var el = event.target,
            nodeName = el.nodeName;

        // Clicking the overlay shouldn't do anything on mobile
        if ( self.isMobile || nodeName === 'A' || nodeName === 'BUTTON' ) {
          return;
        }

        event.preventDefault();
        self.clickOutside( event, self );
      });

      self.id = self.trackingAsset.attr( 'id' );

      // IE7 zindex fix
      if( Settings.isLTIE9 ) {
        // address the joke that is stack order and zindexing in IE7
        self.hotspotId = self.id + '-hotspot';
        Settings.$body.append( '<div class="ltie8-hotspot '+self.variant+'" id="'+self.hotspotId+'" />' );
        Settings.$body.append( '<div class="ltie8-hotspot-arrow-left-'+self.variant+' hidden" id="'+self.hotspotId+'-arrow-left" />' );
        Settings.$body.append( '<div class="ltie8-hotspot-arrow-right-'+self.variant+' hidden" id="'+self.hotspotId+'-arrow-right" />' );
        // in the case of full-inner, reparent the hotspots globally in the case of this blend of editorials
        var $searchAnchor = self.$container.parent().parent(),
            hasInner      = $searchAnchor.hasClass( 'full-inner' ),
            $top          = $searchAnchor.find( '.container' ).not( '.inner' ).find( 'div.image-module' ),
            $temp         = $searchAnchor.find( '.container.inner' );
        if( true === hasInner ) {
          // reparent the full-inner html behind the hotspots, lets play nice kids...
          $top.prepend( $temp.remove() );
        }
      }

      // when the tracking item changes it's opacity, we trigger the initial flyon animation for the hotspot
      self.trackOpacity = function() {
        switch( self.trackingAsset.css( 'opacity' ) ) {
          case undefined:
          case 'undefined':
            clearInterval( self.trackOpacityTimer );
          break;
          case '1':
            clearInterval( self.trackOpacityTimer );
            self.canShowHotspots = true;
            triggerInitialPosition();
          break;
        }
      };

      // we've been polling for changes to the height of the background, once it is
      // injected into the DOM as a background image, we stop polling
      self.trackHeight = function() {
        if( 'none' !== self.trackingAsset.css( 'background-image' ) ) {
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
      } else if ( 'backround' === self.trackingMode ) {
        self.trackOpacityTimer = setInterval( self.trackHeight, 1000 );
      } else {
          self.canShowHotspots = true;
          self.follow();
          // since we're ready to show it, show it!
          self.show();
      }

      // closure used to trigger hotspots for images
      var triggerInitialPosition = function() {

        self.follow();
        // since we're ready to show it, show it!
        self.show();
      };

      // initialize hotspot(s)
      self.$els.each(function( index, el ) {
        // subscribe to events
        self.bind( el );
        // initial placement
        self.place( el );
      });

      self.setupBreakpoints();

      // listen for modal events
      self.$modal.on( 'show', $.proxy( self.onModalShow, self ) );
      self.$modal.on( 'shown', $.proxy( self.onModalShown, self ) );
      self.$modal.on( 'hidden', $.proxy( self.onModalClosed, self ) );

      if ( Settings.isLTIE9 ) {
        self.$modalBody.removeClass( 'fade' );
      }

      // TODO: switch to global throttled scroll
      self.$window.scroll( function () {
          self.trackingState = 'fadein';
          self.follow();
      });

      // Listen for global resize
      // for inline image type
      Environment.on('global:resizeDebounced', function() {
        self.follow();
        self.getCanvasCoordinates();
      });


      // finally, seed the hotspot to fly on 1/2 second after set conditions are met
      setTimeout(triggerInitialPosition, 500);

      self.$window.on('e5-slide-change', function(){
        //log('SONY : Editorial Hotspots : E5 Slide Update');
        Settings.isLTIE9 || self.isSmallChapter ? self.reset() : '';
      });
      self.bindAPI();

      //log('SONY : Editorial Hotspots : Initialized');
    },

    bindAPI: function() {

      var self = this;

      self.$el.on('HotspotsController:reset', function(e) {
        self.reset();
      });

      return self;
    },

    setupBreakpoints : function() {
      var self = this;

      if ( !enquire ) {
        return;
      }

      // BELOW THIS THRESHHOLD WE ARE FLAGGING THE STATE FOR OTHER FNS TO
      // REPARTENT OVERLAY NODES TO DISPLAY CENTER OF MODULE
      enquire.register( '(max-width: 767px)' , function() {
        self.isMobile = true;
        self.isDesktop = false;

        self.showOverlayCentered = true;
        self.follow();
        if( self.lastOpen ) {
          self.reanchor( self.lastOpen[0], self.lastOpen[1], self.lastOpen[2], true );
        }
      }).listen();

      enquire.register( '(min-width: 768px)' , function() {
        self.isMobile = false;
        self.isDesktop = true;

        self.showOverlayCentered = false;
        self.follow();
        if( self.lastOpen ) {
          self.reanchor( self.lastOpen[0], self.lastOpen[1], self.lastOpen[2], false );
        }
      }).listen();
    },

    onModalShow: function( event ) {
      var self         = this,
          windowHeight = self.getMaxModalHeights().maxBodyHeight,
          modalHeight  = self.$modal.height(),
          newOffset    = 0;

        //newOffset = ( windowHeight / 2 ) - ( modalHeight / 2 );
        //self.$modal.css( 'top', newOffset+'px' );

      self.$modal.css( 'top', '0px' );
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
        Settings.$body.css({
          height: '',
          maxHeight: '',
          overflow: ''
        });
      }

      self.isModalOpen = false;
      self.isFadedIn = false;

      if( self.lastOpen && self.showOverlayCentered ) {
        self.close( self.lastOpen[ 0 ], self.lastOpen[ 1 ], self.lastOpen[ 2 ] );
      }

      Settings.$body.find( '.modal-backdrop' ).remove();

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
              percX       = $( el ).data( 'x' ).replace( '%', '' ),
              percY       = $( el ).data( 'y' ).replace( '%', '' ),
              assetW      = self.trackingAsset.width(),
              assetH      = self.trackingAsset.innerHeight(),
              adjustedX   = null,
              adjustedY   = null,
              widthOffset = 0,
              heightOffset = 0;

              widthOffset = ( self.trackingAsset.parent().width() - assetW ) / 2;
              heightOffset = parseInt( self.trackingAsset.parent().css( 'padding-top' ), 10 );

              // get x coordinate
              adjustedX = ( percX * assetW ) / 100 + widthOffset;
              adjustedY = ( percY * assetH ) / 100 + heightOffset;

              // lets stop animation
              $( el ).css( 'left', adjustedX );
              $( el ).css( 'top', adjustedY );
        });
      }
    },

    disableScroll: function( flag ) {
      if( flag ) {
        document.documentElement.style.overflow = 'hidden';  // firefox, chrome
        document.body.scroll = 'no'; // ie only
      } else {
        document.documentElement.style.overflow = 'auto';  // firefox, chrome
        document.body.scroll = 'yes'; // ie only
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
      var self = this,
          $hotspotCore = $( el ).find( '.hspot-core' );

      // hotspot clicks
      $hotspotCore.on( 'click', function( event ) {
        event.stopPropagation();
        self.click( event, self );
      });

      $hotspotCore.on( 'mouseover', function() {
        self.hover( el, self, true );
      });

      $hotspotCore.on( 'mouseout', function() {
        self.hover( el, self, false );
      });
    },

    place: function( el ) {

      var self = this,
          $el = $( el ),
          data;

      if( 'background' === self.trackingMode ) {
        $el = $( el );
        data = $el.data();

        // this places the hotspot absolutely (currently by % fed from data-x,-y attrib)
        $el.css({
          left: data.x,
          top: data.y
        });
      } else {
        self.follow( el );
      }
    },

    show: function( el ) {
      var self        = this,
          offsetTime  = 400;

      if( true === self.canShowHotspots ) {
        self.$els.each(function( index, el ) {
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

      if( container.data( 'state' ) === 'open' ) {
        self.close( container, hotspot, info );
      } else {
        if( self.lastOpen && !container.is( self.lastOpen ) ) {
          self.reset();
        }
         self.open( container, hotspot, info );
      }
    },
    clickOutside: function( event, self ) {
      if( self.lastOpen ){
        self.reset();
      }
    },

    reanchor: function( container, hotspot, info, placeInModal ) {
      var self          = this,
          maxBodyHeight = null,
          screenHeight  = null,
          $modal        = self.$modal.find( '.modal-body' );

      if( placeInModal ) {
        info.addClass( 'hidden' );
        // defer trigger modal
        setTimeout(function() {

          maxBodyHeight = 'none';

          if ( true /* self.hasTouch */ ) {
            screenHeight = Settings.isIPhone || Settings.isAndroid ? window.innerHeight : self.$window.height();
            // Stop the page from scrolling behind the modal
            Settings.$body.css({
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
          parentObj              = { 'h' : parentHeight, 'w' : parentWidth, 'el' : $parentContainer },
          $hotspot               = el,
          hotspotPosition        = $hotspot.position(),
          $overlay               = el.find( '.overlay-base' ),
          overlayHeight          = $overlay.height(),
          overlayWidth           = $overlay.width(),
          overlayObj             = { 'h' : overlayHeight, 'w' : overlayWidth, 'el' : $overlay },
          variantSmall           = $overlay.hasClass( 'variant2' ) ? true : false,
          $top                   = $overlay.find( '.top' ),
          topHeight              = $top.height(),
          hasTop                 = topHeight > 0 ? true : false,
          $bottom                = $overlay.find( '.footer' ),
          hasBottom              = $bottom.html() === '' ? false : true,
          $middle                = $overlay.find( '.middle' ),
          middleHeight           = ( false === hasTop && false === hasBottom ) ? $middle.outerHeight() - $middle.css( 'padding-bottom' ).replace( 'px', '' ) : $middle.outerHeight(),
          topOffsetLowLg         = ( ( middleHeight * 73.26102088 ) / 100 ) + topHeight,
          topOffsetHighLg        = ( ( middleHeight * 11.11111111 ) / 100 ) + topHeight,
          topOffsetLowSm         = ( ( middleHeight * 74.50000000 ) / 100 ) + topHeight,
          topOffsetHighSm        = ( ( middleHeight * 10.71428571 ) / 100 ) + topHeight,
          topOffsetLow           = variantSmall ? topOffsetLowSm : topOffsetLowLg,
          topOffsetHigh          = variantSmall ? topOffsetHighSm : topOffsetHighLg,
          overlayOffset          = 0,
          side                   = [],
          quadrant               = 0;

      // what horizontal half are we in?
      if( hotspotPosition.left < ( parentWidth / 2 ) ) {
        side[0] = 2;
      } else {
        side[0] = 4;
      }

      //console.log('[[ HOTSPOT CONTROLLER -- repositionByQuadrant ]]',
                  //'\n OFFSET HIGH -> ', topOffsetHigh,
                  //'\n OFFSET LOW -> ', topOffsetLow,
                  //'\n hotspotPosition.top ->', hotspotPosition.top,
                  //'\n parentHeight ->', parentHeight,
                  //'\n overlayHeight ->', overlayHeight,
                  //'\n CRAZY MATH =>', ((hotspotPosition.top - parentHeight) + overlayHeight)
                 //);

      // what vertical half are we in?
      ( hotspotPosition.top < ( parentHeight / 2 ) ) ? side[1] = 6 : side[1] = 7;

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

      // will it fit?
      overlayOffset = ((hotspotPosition.top - parentHeight) + overlayHeight);

      // adjust layout classes per quadrant
      switch( quadrant ) {
        case 1:
        case 4:
          // position overlay to the left of hotspot
          $overlay.addClass( 'to-left' );
          $overlay.parent().find( '.arrow-right' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
          if (quadrant === 1) {
            (self.isSmallChapter) ? $overlay.css( 'top', '-'+topOffsetHigh+'px' ) : $overlay.css( 'top', '-'+topOffsetHigh+'px' );
          } else {
            // also check if it fits within the parentHeight
            (self.isSmallChapter) ? $overlay.css( 'top', '-'+topOffsetLow+'px' ) : $overlay.css( 'top', '-'+topOffsetLow+'px' );
          }
        break;
        case 5:
          // also check if it fits within the parentHeight
          (self.isSmallChapter) ? $overlay.css( 'top', '-'+topOffsetHigh+'px' ) : $overlay.css( 'top', '-'+topOffsetLow+'px' );
        break;
        case 2:
        case 3:
          // add to-right
          $overlay.addClass( 'to-right' );
          $overlay.parent().find( '.arrow-left' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );

          if (quadrant === 2) {
            (self.isSmallChapter) ? $overlay.css( 'top', '-'+(topOffsetHigh + 20 )+'px' ) : $overlay.css( 'top', '-'+topOffsetHigh+'px' );
          } else {
            (self.isSmallChapter) ? $overlay.css( 'top', '-'+(topOffsetHigh + 20 )+'px' ) : $overlay.css( 'top', '-'+topOffsetLow+'px' );
          }
        break;
      }

      //console.log('[[ HOTSPOT CONTROLLER -- repositionByQuadrant ]]', $parentContainer.get(0), $overlay.get(0));
    },

    // determine our container height and width
    getCanvasCoordinates: function() {
      var coordinates = {},
      $canvas = this.$container.closest('.editorial-carousel-slide.active .hotspot-module');

      coordinates.el = $canvas;
      coordinates.h = $canvas.height();
      coordinates.w = $canvas.width();
      coordinates.x = 0;
      coordinates.x2 = coordinates.w - 80;
      coordinates.y = 0;
      coordinates.y2 =  coordinates.h - 80;

      return coordinates;
    },

    getOverlayCoords: function($overlay) {
      var coordinates = {};

      coordinates.el = $overlay;
      coordinates.h = $overlay.height();
      coordinates.w = $overlay.width();
      coordinates.x = $overlay.offset().left;
      coordinates.x2 = (coordinates.x + coordinates.w);
      coordinates.y = $overlay.offset().top;
      coordinates.y2 = (coordinates.y + coordinates.h);

      return coordinates;
    },

    checkOverlap: function(canvas, overlay, count) {

      // does our overlay overlap our canvas?
      if (canvas.h - 100 < overlay.h) {

        var $overlay = overlay.el,
            $overlayTop = $overlay.find('.top'),
            $overlayBot = $overlay.find('.footer');

        // first check if it has a top
        if ($overlayTop && count === 1) { $overlayTop.addClass('hidden'); }

        // then if that fails check if it has a bottom
        if ($overlayBot && count > 1) { $overlayBot.addClass('hidden'); }

        // returns true because it does overlap
        return true;
      } else {
        // returns false doesnt overlap we should be good
        return false;
      }
    },

    // determines if the overlay fits within the parent or does not
    checkIfFits: function( el ) {
      var self                  = this,
          $parentContainer      = ( 'asset' === self.trackingMode ) ? el.parent().parent().parent() : el.parent(),
          $overlay              = el.find( '.overlay-base' ),
          count                 = 0,
          overlayCoords,
          canvasCoords,
          fits;

      do {
        canvasCoords = self.getCanvasCoordinates();
        overlayCoords = self.getOverlayCoords($overlay);
        count++;

        if (!self.checkOverlap(canvasCoords, overlayCoords, count)) {
          self.repositionByQuadrant( el );
          fits = true;
        } else if (count >= 5) {
          // there was no way of fitting the hotspot inside the container, it was a lost cause
          self.repositionByQuadrant( el );
          fits = true;
        }

      } while (!fits);

    },

    transition: function( collection, direction ) {
      $( collection ).each( function( index, _el ) {
        switch(direction) {
          case 'on':
            $( _el ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
          break;
          case 'off':
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


      if( Settings.isLTIE9 ) {
        Settings.$body.find( '#'+self.hotspotId ).html( '' );
        $( '#'+self.hotspotId+'-arrow-left' ).addClass( 'hidden' );
        $( '#'+self.hotspotId+'-arrow-right' ).addClass( 'hidden' );
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
      };

      // fire a timer that will set the display to none when the element is closed.
      self.$lastTimer = setTimeout( anon, self.$transitionSpeed );

      // set the open status to zilch
      self.lastOpen = null;

    },

    open: function( container, hotspot, info ) {
      info.removeClass('hidden'); // need to get the elements values

      var self = this,
          $parentContainer       = container.parent(),
          parentWidth            = $parentContainer.width(),
          parentHeight           = $parentContainer.height(),
          parentObj              = { 'h' : parentHeight, 'w' : parentWidth, 'el' : $parentContainer },
          $hotspot               = hotspot,
          hotspotPosition        = $hotspot.position(),
          overlayHeight          = info.height(),
          overlayWidth           = info.width(),
          overlayObj             = { 'h' : overlayHeight, 'w' : overlayWidth, 'el' : info };

      info.addClass('hidden'); // need to get the elements values

      // we are setting display:none when the trasition is complete, and managing the timer here
      if( self.lastOpen && container.is( self.lastOpen[0] ) ) {
        self.cleanTimer();
      }

      //console.log('[[HOTSPOTS CONTROLLER -- open]]');
      // save last open state
      self.lastOpen = [ container, hotspot, info ];

      // add data- info to this hotspot
      container.data( 'state', 'open' ).addClass( 'info-jump-to-top' );

      // perform CSS transitions
      hotspot.removeClass( 'hspot-core' ).addClass( 'hspot-core-on' );

      if( Settings.isLTIE8 || Settings.isLTIE9 ) {
        hotspot.parent().addClass( 'ie-on' );
      }

      // we have to set display: block to allow DOM to calculate dimension
      info.removeClass( 'hidden' );

      // if were running a chapters we need to check if it fits, otherwise the logic is there since they allow overflowing
      // overlays
      (self.isChapter || self.isSmallChapter) ? self.checkIfFits( container ) : self.repositionByQuadrant( container );

      // fade in info window
      if( self.showOverlayCentered ) {
        //$( '.hspot-global-details-overlay' ).find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        self.reanchor( container, hotspot, info, true );
      } else {
        if( Settings.isLTIE9 ) {
          // turn on the window
          info.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
          // get the global handle for iE7
          var $ieHackAttack = Settings.$body.find( '#'+self.hotspotId );
          // apply the offset window value
          $ieHackAttack.css({
            'left': info.offset().left,
            'top': info.offset().top
          });
          $ieHackAttack.html( info.html() );
          // orient the correct arrow and turn it on
          var $arrow, $arrow_global;
          if( info.hasClass( 'to-right' ) ) {
            $arrow_global = $( '#'+self.hotspotId+'-arrow-left' );
            $arrow = $( hotspot ).parent().find( '.arrow-left' );
          } else {
            $arrow_global = $( '#'+self.hotspotId+'-arrow-right' );
            $arrow = $( hotspot ).parent().find( '.arrow-right' );
          }
          $arrow_global.removeClass( 'hidden' ).css({
            'left': $arrow.offset().left,
            'top': $arrow.offset().top
          });
        } else {
          info.find( '.overlay-inner' ).removeClass( 'eh-transparent' ).addClass( 'eh-visible' );
        }
      }

    },

    reset: function( container ) {
      var self = this;
      if ( !self.lastOpen ) { return; }

      self.close( self.lastOpen[ 0 ], self.lastOpen[ 1 ], self.lastOpen[ 2 ] );
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
