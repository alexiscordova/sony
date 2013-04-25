// Module Title
// ------------
//
// * **Module:** Editorial 360 Viewer
// * **Version:** 0.1
// * **Modified:** 04/19/2013
// * **Author:** Brian Kenny
// * **Dependencies:** jQuery 1.7+, Modernizr
//
// *Example Usage:*
//
//      require('path/to/global/module') // self instantiation

define(function(require){

  'use strict';

  // provisions
  var $ = require( 'jquery' ),
      iQ = require( 'iQ' ),
      bootstrap   = require( 'bootstrap' ),
      enquire     = require( 'enquire' ),
      Settings    = require( 'require/sony-global-settings' ),
      Environment = require( 'require/sony-global-environment' ),
      Utilities   = require( 'require/sony-global-utilities' ),
      hammer      = require( 'plugins/index' ).hammer;

  var self = {
    'init': function() {
      // setup breakpoints
      var breakpoints = [ 360, 479, 567, 640, 767, 979, 1100 ];
      var breakpointReactor = function( e ) {
        iQ.update();
      };
      
      // bind IQ to update at every breakpoint
      for( var i=0; i < breakpoints.length; i++ ) {
        if( 0 === i ) {
          enquire.register( "(max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
        } else {
          enquire.register( "(min-width: " + ( breakpoints[ i-1 ] + 1 ) + "px) and (max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
        }
      }
      
      // detect if there are 360 viewer constructs on the DOM
      $( '.e360' ).each( function( index, el ) {
        // for each instance, initialize
        $( this ).editorial360Viewer({});
      });
    }
  };

  var Editorial360Viewer = function( element, options ) {
    
    var self = this;
    
    // defaults
    self.$container     = $( element );
    self.$sequence      = ( self.$container.find( '.outer div' ).length ) > 0 ? self.$container.find( '.outer div' ) : self.$container.find( '.outer img' );
    self.$controls      = self.$container.find( '.controls' );
    self.$controlCenter = self.$controls.find( '.instructions' );
    self.$leftArrow     = self.$controls.find( '.left-arrow' );
    self.$rightArrow    = self.$controls.find( '.right-arrow' );
    self.isImage        = $( self.$sequence[0] ).is( 'img' ) ? true : false;
    self.sequenceLength = self.$sequence.length;
    self.dynamicBuffer  = Math.floor( ( self.$container.width() / self.$sequence.length ) / 3 );
    self.curIndex       = 0;
    self.movingLeft     = false;
    self.movingRight    = false;
    self.clicked        = false;
    self.lastX          = null;
    self.lastTriggerX   = null;
    self.inMotion       = false;
    
    $.extend(self, {}, $.fn.editorial360Viewer.defaults, options, $.fn.editorial360Viewer.settings);
    self.init();
    
  };

  Editorial360Viewer.prototype = {
    constructor: Editorial360Viewer,

    init : function( param ) {
      var self = this;

      // bind scroll event to fire animation on the dragger
      // 1. movement on desktop and 2. viewport on mobile
      
      // initial animation, hey why not.
      setTimeout(function() {
        self.animateDragger();
      }, 500);
      
      // trigger UI indication (Desktop)
      $( window ).bind( 'scroll', function( event ) {
        self.onScroll( event );
      });
      
      // reset the step buffer when the window changes size
      $( window ).bind( 'resize', function( event ) {
        self.onResize( event );
      });
      
      // setup controller interactions
      self.$controls.bind( 'mousedown', function( event ) {
        self.mouseDown( event );
      });

      self.$controls.bind( 'mouseup', function( event ) {
        self.mouseUp( event );      
      });
      
      // track mousemove
      $( self.$controls ).bind( 'mousemove', function( event ) {
        self.mouseMove( event );
      });
      
      // adjust controls to center if type is image
      if( true === self.isImage ) {
        self.syncControlLayout();
      }
      
      log('SONY : Editorial 360 Viewer : Initialized');
    },
    
    syncControlLayout: function() {
      var self = this;
      var _assetWidth = $( self.$sequence[0] ).width();
      self.$controls.find( '.table-center' ).css( 'width', _assetWidth );
    },
    
    onResize: function( event ) {
      var self = this;
      self.dynamicBuffer = Math.floor( ( self.$container.width() / self.$sequence.length ) / 3 );
      if( true === self.isImage ) {
        self.syncControlLayout();
      }
    },
    
    onScroll: function( event ) {
      var self = this;
      if( false === self.inMotion) {
        self.inMotion = true;
        self.animateDragger();
      }
      if( true === self.isImage ) {
        self.syncControlLayout();
      }
    },
    
    mouseDown: function( event ) {
      var self = this;
      event.preventDefault();
      $( self.$controls ).addClass( 'is-dragging' );
      $(document.body).addClass('unselectable');
      self.clicked = true;
    },

    mouseUp: function( event ) {
      var self = this;
      event.preventDefault();
      $( self.$controls ).removeClass( 'is-dragging' );
      $(document.body).removeClass('unselectable');
      self.clicked = false;
    },
    
    mouseMove: function( event ) {
      var self    = this,
          doMove  = false;
        
      event.preventDefault();
      
      // set a default if not already set
      if( null === self.lastTriggerX ) {
        self.lastTriggerX = self.lastX = event.pageX;
      }
      
      if( event.pageX > ( self.lastTriggerX + self.dynamicBuffer ) ) {
        // moving right
        self.movingLeft   = false;
        self.movingRight  = true;
        doMove = true;
        self.lastTriggerX = event.pageX;
      } else if( event.pageX < ( self.lastTriggerX - self.dynamicBuffer ) ) {
        // moving left
        self.movingLeft   = true;
        self.movingRight  = false;
        doMove = true;
        self.lastTriggerX = event.pageX;
      }

      // shall we?
      if( self.clicked && doMove ) {
        var direction = self.movingLeft ? "left" : "right";
        self.move( direction );
      }

      self.lastX = event.pageX;
    },
    
    animateDragger: function( cycles ) {
      var self = this;
      
      $( self.$leftArrow ).animate({
        opacity: 0
      });
      
      $( self.$rightArrow ).animate({
        opacity: 0        
      });
      
      $( self.$controlCenter ).animate({
        marginLeft: "+26px",
        marginRight: "+26px"
      }, 499, function(event) {
        self.resetAnimation();
      });
      
    },
    
    resetAnimation: function() {
      var self = this;
      
      $( self.$leftArrow ).css( {
        opacity: 1
      });
      
      $( self.$rightArrow ).css( {
        opacity: 1
      });
      
      $( self.$controlCenter ).css( { 
        marginLeft : "18px", 
        marginRight : "18px" 
      });
      
      self.inMotion = false;
    },
    
    move: function( direction ) {
      var self      = this,
          lastIndex = self.curIndex;
      
      switch( direction ) {
        case "left":
          if( 0 === self.curIndex ) {
            self.curIndex = self.sequenceLength-1;
          } else {
            self.curIndex--;
          }
        break;
        
        case "right":
          if( self.curIndex == self.sequenceLength-1 ) {
            self.curIndex = 0;
          } else {
            self.curIndex++;
          }
        break;
      }

      self.pluck( lastIndex ).addClass( 'hidden' );
      self.pluck( self.curIndex ).removeClass( 'hidden' );
    },
    
    pluck: function( lastIndex ) {
      var self = this;
      
      // find by data index
      for( var i = 0; i < self.$sequence.length; i++ ) {
        if( lastIndex == $( self.$sequence[i] ).data( 'sequence-id' ) ) {
          return $( self.$sequence[i] );
        }
      }
      // not found
      return false;
    }
  };

  // jQuery Plugin Definition
  // ------------------------

  $.fn.editorial360Viewer = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          editorial360Viewer = self.data('editorial360Viewer');

      // If we don't have a stored moduleName, make a new one and save it.
      if ( !editorial360Viewer ) {
          editorial360Viewer = new Editorial360Viewer( self, options );
          self.data( 'editorial360Viewer', editorial360Viewer );
      }

      if ( typeof options === 'string' ) {
        editorial360Viewer[ options ].apply( editorial360Viewer, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.editorial360Viewer.defaults = {
    options: {}
  };

  // Non override-able settings
  // --------------------------

  $.fn.editorial360Viewer.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };
  
  return self;
  
});