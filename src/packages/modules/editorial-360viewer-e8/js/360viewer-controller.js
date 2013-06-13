/*jshint debug:true */

// Module Title
// ------------
//
// * **Module:** Editorial 360 Viewer
// * **Version:** 0.1
// * **Modified:** 04/19/2013
// * **Author:** Brian Kenny
// * **Dependencies:** jQuery 1.7+, Boostrap, Modernizr, Enquire, hammerJS, viewport
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
      hammer      = require( 'plugins/index' ).hammer,
      viewport    = require( 'plugins/index' ).viewport;

  var self = {
    'init': function() {

      // IE 10 detection
      if ( window.atob || Settings.isLTIE10 ) {
        $( self.$controls ).find( '.table-center-wrap' ).addClass( 'ltie' );
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
    self.$sequence      = ( self.$container.find( '.outer div' ).not( '.load-indicator').length ) > 0 ? self.$container.find( '.outer div' ).not( '.load-indicator') : self.$container.find( '.outer img' ).not( '.load-indicator');
    self.sequenceLength = self.$sequence.length;
    self.curLoaded      = 0;
    self.$controls      = self.$container.find( '.controls' );
    self.$controlCenter = self.$controls.find( '.instructions' );
    self.$leftArrow     = self.$controls.find( '.left-arrow' );
    self.$rightArrow    = self.$controls.find( '.right-arrow' );
    self.isImage        = $( self.$sequence[0] ).is( 'img' ) ? true : false;
    self.dynamicBuffer  = Math.floor( ( self.$container.width() / self.$sequence.length ) / 3 );
    self.curIndex       = 0;
    self.movingLeft     = false;
    self.movingRight    = false;
    self.clicked        = false;
    self.lastX          = null;
    self.lastTriggerX   = null;
    self.inMotion       = false;
    self.throttle       = 3;
    self.inViewport     = false;
    self.moves          = 0;
    self.touchEvents    = 0;
    self.$win           = Settings.$window;

    $.extend(self, {}, $.fn.editorial360Viewer.defaults, options, $.fn.editorial360Viewer.settings);
    self.init();

  };

  Editorial360Viewer.prototype = {
    constructor: Editorial360Viewer,

    init : function( param ) {
      var self = this;
      // lets start by hiding the controllers until things are loaded and fading down the image
      // to give users a nicer set of visual queues
      self.$controls.addClass( 'hidden' );
      self.$container.addClass( 'dim-the-lights' );

      // if not, manage the payload by exposing a loader

      // since IE and iQ are not getting along we need to delay this a bit
      // heres the idea, we show the loading screen and then one by one with a
      // setTimeout and a $win.resize() we can fire iQ. ?? seems legit?

      self.loadSequence();

      log('SONY : Editorial 360 Viewer : Initialized');
    },

    lockAndLoaded: function() {
      var self = this;

      self.syncControlLayout();
      self.curLoaded++;
      self.checkLoaded();
    },

    // checks the payload against the loaded image
    checkLoaded: function() {
      var self = this;

      if( self.sequenceLength == self.curLoaded ) {
        log( 'all 360 assets loaded' );
        self.$container.removeClass( 'dim-the-lights' ).addClass( 'light-em-up' );
        self.$container.find( '.load-indicator' ).addClass( 'hidden' );
        self.syncControlLayout();
        self.initBehaviors();
      }
    },

    syncControlLayout: function() {
      var self = this;
      var _assetWidth = $( self.$sequence[self.curIndex] ).width();
      self.$controls.find( '.table-center' ).css( 'width', _assetWidth );
    },

    // this will load the sequence of images
    loadSequence: function() {
      var self = this;

      self.$sequence.addClass('visuallyhidden');

      self.$sequence.each(function( index ) {
        var el = $(this);

        // remove the hidden class
        self.$sequence.eq(index).removeClass('visuallyhidden');

        // so iQ can catch on
        self.$win.trigger('resize');

        //console.log(JSON.stringify(el.data()));
        //console.log('inside each sequence');
        $.inspect(el.data());

        // now we can hide the element again?
        self.$sequence.eq(index).addClass('visuallyhidden');

        // is the BG image loaded?
        if(  el.data('hasLoaded') ) {
          self.syncControlLayout();
          self.curLoaded++;
          self.checkLoaded();
        } else {
          // its not a preloaded background
          if( el.is( 'div' ) ) {
            el.on( 'iQ:imageLoaded', $.proxy(self.lockAndLoaded, self) );
          } else {
            // check if the inline images are cached
            if( false === this.complete ) {
              // not cached, listen for load event
              el.onload = self.lockAndLoaded;
            } else {
              // cached, count it against the payload
              self.syncControlLayout();
              self.curLoaded++;
              self.checkLoaded();
            }
          }
        }
      });

      // now show the first sequence again
      self.$sequence.eq(0).removeClass('visuallyhidden');

    },

    initBehaviors: function() {
      var self = this;

      if( true === Modernizr.touch ) {
        // extend with touch controls
        self.$controls.hammer();

        // animate dragger arrows when in viewport
        self.poller = setInterval( function(){
          self.syncControlLayout();
          var _$controlStatus   = $( self.$controls ).find( '.table-center :in-viewport' );
          var inViewport = _$controlStatus.length > 0 ? true : false;
          if( inViewport ) {
            if( !self.inViewport ) {
              self.inMotion = true;
              self.animateDragger();
              self.inViewport = true;
            }
          } else {
            self.inViewport = false;
          }
        }, 100);

        self.$controls.on( 'touch', function( event ) {
          self.touchDown( event );
        });

        self.$controls.on( 'release', function( event ) {
          self.touchUp( event );
        });

        self.$controls.on( 'drag', function( event ) {
          var direction = event.gesture.direction;
          if( 'left' == direction || 'right' == direction ) {
            self.touchMove( event );
          }
        });

        self.$controls.on( 'tap', function( event ) {
          self.touchMove( event );
        });


      } else {
        // trigger UI indication (Desktop)
        $( window ).bind( 'scroll', function( event ) {
          self.onScroll( event );
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
      }

      // bind scroll event to fire animation on the dragger
      // 1. movement on desktop and 2. viewport on mobile

      // initial animation, hey why not.
      setTimeout(function() {
        self.animateDragger();
      }, 500);

      // reset the step buffer when the window changes size
      $( window ).bind( 'resize', function( event ) {
        self.onResize( event );
      });

      // adjust controls to center if type is image
      if( true === self.isImage ) {
        self.syncControlLayout();
      }
      // finally show controlls
      self.$controls.removeClass( 'hidden' );

    },

    easeSwipe: function( event ) {
      var self = this;
      // is the swipe greater than one movement
      // where  (container.width / sequence.length-1) / 3 = one step
      var assetWidth      = $( self.$sequence[self.curIndex] ).width(),
          swipeDistance   = event.gesture.distance,
          sequenceLength  = sequence.length - 1,
          stepSize        = ( assetWidth / sequenceLength ) / self.throttle,
          shouldEase      = ( 0 < ( swipeDistance - stepSize ) ) ? ( swipeDistance - stepSize ) : false;
    },

    onResize: function( event ) {
      var self = this;
      self.dynamicBuffer = Math.floor( ( self.$container.width() / self.$sequence.length ) / self.throttle );
      self.syncControlLayout();
      if( true === self.isImage ) {

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

    touchDown: function( event ) {
      // Montana to Rice!
      var self = this;
      $(document.body).addClass('unselectable');
      self.clicked = true;
    },

    touchUp: function( event ) {
      var self = this;
      $(document.body).removeClass('unselectable');
      self.clicked = false;
    },

    touchMove: function( event ) {
      var self      = this,
          pageX     = event.gesture.distance,
          direction = event.gesture.direction ? event.gesture.direction : 'left',
          doMove    = false;

      event.preventDefault();
      event.gesture.preventDefault();

      self.mobileLog( 'direction ' + direction + '\n' + 'events fired: '+ self.touchEvents++ + '\n' + 'direction: ' + pageX );

      if( Settings.isIOS ) {
        if( 0 === self.moves % 2 ) {
          self.move( direction );
        }
      } else if( Settings.isAndroid ) {
        if( 0 === self.moves % 5 ) {
          self.move( direction );
        }
      } else {
        self.move( direction );
      }

      self.moves++;
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
        self.movingLeft   = true;
        self.movingRight  = false;
        doMove = true;
        self.lastTriggerX = event.pageX;
      } else if( event.pageX < ( self.lastTriggerX - self.dynamicBuffer ) ) {
        // moving left
        self.movingLeft   = false;
        self.movingRight  = true;
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

    mobileLog: function( data, append ) {
      //$( '.e360debug' ).html( data.toString() + '\n' );
    },

    animateDragger: function( cycles ) {
      if(Settings.isLTIE8){
        return;
      }
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

      self.pluck( lastIndex ).addClass( 'visuallyhidden' );
      self.pluck( self.curIndex ).removeClass( 'visuallyhidden' );
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
  $.extend({
    inspect: function (obj, n) {
      n = n || "this";
      for (var p in obj) {
        if ($.isPlainObject(obj[p])) {
          $.inspect(obj[p], n + "." + p);
          return;
        }
      }
    }
  });

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
