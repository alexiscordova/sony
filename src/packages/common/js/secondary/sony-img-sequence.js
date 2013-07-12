/*jshint debug:true*/

// ------------ Sony Image Sequencer ------------
// * **Module:** Cloned from the E360 jQuery plugin
// * **Version:** 0.0.1
// * **Modified:** 04/19/2013
// * **Author:** Kaleb White, Brian Kenny
// * **Dependencies:** jQuery 1.7+, Boostrap, Modernizr, Enquire, hammerJS, viewport
//
// *Example Usage:*
//
//      require('path/to/global/module') // self instantiation
//
//
// *Refacting/improvement/performance Notes:*
//
// * pluck() would be faster if the image IDs were cached in an object instead of iterated through each time
// * loadSequence() needs to be slightly refactored so as not to cause so many style recalcs.
// * Use the `.grab` and `.grabbing` utilitiy classes for cursors (the gmail cursor could be added as a fallback to that too)

define(function(require) {

  'use strict';

  // provisions
  var $ = require( 'jquery' ),
      iQ = require( 'iQ' ),
      Settings     = require( 'require/sony-global-settings' ),
      hammer       = require( 'plugins/index' ).hammer,
      Viewport     = require( 'secondary/sony-viewport' );


  var SonySequence = function( element, options ) {

    var self = this;

    self.options = $.extend({}, SonySequence.defaults, options);

    // defaults
    self.$container     = $( element );
    self.$sequence      = self.$container.find('[data-sequence-id]');
    self.sequenceLength = self.$sequence.length;
    self.curLoaded      = 0;
    self.$controls      = self.$container.find( '.controls' );
    self.$controlCenter = self.$controls.find( '.instructions' );
    self.$leftArrow     = self.$controls.find( '.left-arrow' );
    self.$rightArrow    = self.$controls.find( '.right-arrow' );
    self.isImage        = self.$sequence.eq(0).is( 'img' ) ? true : false;
    self.dynamicBuffer  = Math.floor( ( self.$container.width() / self.sequenceLength ) / 3 );
    self.showFallback   = ( Settings.hasTouchEvents || Settings.isVita || Settings.isPS3 );
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
    self.$body          = Settings.$body;
    self.is360          = self.$container.hasClass('e360');

    self.init();

  };

  SonySequence.prototype = {
    constructor: SonySequence,

    init : function() {
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

      log('SONY : Editorial SonySequence Module : Initialized');
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

      if ( self.sequenceLength === self.curLoaded ) {
        log( 'all 360 assets loaded' );
        self.$container.removeClass( 'dim-the-lights' ).addClass( 'light-em-up' );
        self.$container.find( '.load-indicator' ).addClass( 'hidden' );
        self.syncControlLayout();

        // if we have setup to autoplay
        if ( self.options.autoplay ) {
          self.startAnimation('left');
        } else {
          self.initBehaviors();
        }

        // if the user wants bar controls we need to populate the dom
        if ( self.options.barcontrols && !self.options.autoplay ) {
          self.createBarControl();
        }

      }
    },

    syncControlLayout: function() {
      var self = this;
      var _assetWidth = $( self.$sequence[self.curIndex] ).width();
      self.$controls.find( '.table-center' ).css( 'width', _assetWidth );
    },


    getSliderRange: function() {
      var self = this,
          range = {};

      range.min = 0;
      range.max = 1;

      return range;
    },

    sliderNearestValidValue: function(rawValue) {
      var self = this,
          closest,
          maxSteps,
          range,
          steps;

      range = self.getSliderRange();
      rawValue = Math.min(range.max, rawValue);
      rawValue = Math.max(range.min, rawValue);

      if (self.options.steps) {
        return;
      } else {
        return rawValue;
      }
    },

    sliderGotoFrame: function(positon) {
      var self = this,
          minWidth = 0,
          maxWidth = self.sliderControlWidth,
          sequenceLength = self.sequenceLength - 1,
          sequenceDepth = 0,
          lastIndex = self.currIndex;

      sequenceDepth = ( positon / maxWidth );
      // we need to determine if it's the 360 module or image sequence
      // why? Because an image sequence needs to go from start to finish with no loop,
      // a 360 module needs to loop back to the first index.
      if (self.is360) {
        self.currIndex = (Math.floor(sequenceLength * sequenceDepth) !== sequenceLength) ? Math.floor(sequenceLength * sequenceDepth) : 0;
      } else {
        self.currIndex = (Math.floor(sequenceLength * sequenceDepth) !== sequenceLength) ? Math.floor(sequenceLength * sequenceDepth) : (self.sequenceLength - 1);
      }

      if (self.currIndex < 0) { self.currIndex = 0; }
      if (!self.pluck( lastIndex )) { return; }

      self.$sequence.addClass( 'visuallyhidden' );
      self.pluck( self.currIndex ).removeClass( 'visuallyhidden' );
    },

    sliderRatioToValue: function(ratio) {
      var self = this,
          idx,
          range,
          rawValue,
          step,
          steps;

        range = self.getSliderRange();
        rawValue = ratio * (range.max - range.min) + range.min;

        return self.sliderNearestValidValue(rawValue);
    },

    setSliderPosition: function(position, isMin) {
       var self = this;

       self.$slideHandle.css({
          left: position
       });
    },

    // get the demensions, will need to recalculate on resize
    sliderGetDimensions: function() {
      var self = this;
      self.sliderControlWidth = (self.$sliderControl.width() - 20);
      return (self.sliderControlWidth);
    },

    dragSlider: function(event, position) {
      var self = this,
          pagePos,
          ratio,
          value,
          data = {},
          page = event.gesture.center,
          direction = event.gesture.direction ? event.gesture.direction : 'left',
          eventX = page.pageX ? page.pageX : 0;


      // get the sldie value positions
      pagePos = eventX - self.$sliderControl.offset().left;
      pagePos = Math.min(self.sliderControlWidth, pagePos);
      pagePos = Math.max(-20, pagePos);

      if (self.pagePos !== pagePos) {
        self.pagePos = pagePos;
        ratio = pagePos / self.sliderControlWidth;
        value = self.sliderRatioToValue(ratio);

        //set the slider positon
        if (self.options.barcontrols) { self.setSliderPosition(pagePos); }

        //if ( pagePos <= 0 ) { pagePos = 0; }
        self.sliderGotoFrame(pagePos);
      }

      self.dragged = true;

    },

    setupBarBindings: function() {
      var self = this,
          $slideHandle;

      self.pagePos = 0;
      // find the handle so we can setup bindings
      self.$slideHandle = self.$sliderControl.find('.handle');
      self.$slideHandle.hammer();

      // get slider dimensions
      self.sliderGetDimensions();

      self.$slideHandle.on({
        touch : function( event ) {
          self.touchDown( event );
        },
        release : function( event ) {
          self.touchUp( event );
        },
        drag : function( event ) {
          var direction = event.gesture.direction;

          if ( 'left' === direction || 'right' === direction ) {
            self.dragSlider( event );
          }
        },
        tap : function( event ) {
          self.touchMove( event );
        }
      });


    },

    appendLabels: function(fallback, tmpl) {

    },

    createBarControl: function( cb ) {
      var self = this,
          controlTmpl,
          fallback,
          $sliderControl;

      controlTmpl = {};

      controlTmpl.slider = [
        '<div class="control-bar-container">',
          '<div class="control-bar slider range-control">',
            '<div class="handle">',
              '<span class="inner">',
                '<span class="icons">',
                  '<i class="fonticon-10-chevron-reverse"/>',
                  '<i class="fonticon-10-chevron"/>',
                '</span>',
              '</span>',
            '</div>',
          '</div>',
        '</div>'
      ].join('\n');

      controlTmpl.fallback = [
        '<div class="control-bar-container fallback">',
        '</div>'
      ].join('\n');

      // do we need to display the fallback experience?
      if (self.showFallback) {
        self.$container.append(controlTmpl.fallback);
        self.$sliderControlContainer = self.$container.find('.control-bar-container');

        // the label container needs to be different if were a fallback
        if (self.options.labelLeft && self.options.labelRight) {

          controlTmpl.labelLeft = [
            '<li class="slider-label label-left l3" data-direction="left">',
              '<span class="label-container">',
                '<span class="nav-label">',
                  self.options.labelLeft,
                '</span>',
              '</span>',
            '</li>'
          ].join('\n');

          controlTmpl.labelRight = [
            '<li class="slider-label label-right l3" data-direction="right">',
              '<span class="label-container">',
                '<span class="nav-label">',
                  self.options.labelRight,
                '</span>',
              '</span>',
            '</li>'
          ].join('\n');

        }
      } else {
        // add our new controls to the container
        self.$container.append(controlTmpl.slider);
        self.$sliderControlContainer = self.$container.find('.control-bar-container');
        self.$sliderControl = self.$container.find('.range-control');

        // the label container needs to be different if were a fallback
        if (self.options.labelLeft && self.options.labelRight) {
          controlTmpl.labelLeft = '<span class="slider-label label-left l3" data-direction="left">' + self.options.labelLeft + '</span>';
          controlTmpl.labelRight = '<span class="slider-label label-right l3" data-direction="right">' + self.options.labelRight + '</span>';
        }
      }

      // do we have labels that we can show?
      if (self.options.labelLeft && self.options.labelRight) {
        self.$sliderControlContainer.append(controlTmpl.labelRight)
          .prepend(controlTmpl.labelLeft);
      }

      // setup the bindings for the control slider
      if (self.$sliderControl) {
        self.setupBarBindings();
      }

      // we should get rid of the other controls
      self.$controls.remove();

      // intiialize slider bindings
      self.initSliderBindings();
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
        //self.$win.trigger('resize');

        // now we can hide the element again?
        self.$sequence.eq(index).addClass('visuallyhidden');

        // is the BG image loaded?
        if (  el.data('hasLoaded') ) {
          self.syncControlLayout();
          self.curLoaded++;
          self.checkLoaded();
        } else {
          // its not a preloaded background
          if ( el.is( 'div' ) ) {
            el.on( 'iQ:imageLoaded', $.proxy(self.lockAndLoaded, self) );
          } else {
            // check if the inline images are cached
            if ( false === this.complete ) {
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

    startAnimation: function(direction) {
      var self = this;

      self.animationInterval = setInterval(function() {
        self.move( direction );
      }, self.options.animationspeed);

    },

    initBehaviors: function() {
      var self = this;

      if ( true === Modernizr.touch ) {
        // extend with touch controls
        self.$controls.hammer();
        var $viewportel = self.$container;

        Viewport.add({
          element : $viewportel,
          threshold : '50%',
          enter : function() {
            if ( !self.inViewport ) {
              self.inMotion = true;
              self.animateDragger();
              self.inViewport = true;
            } else {
              self.inViewport = false;
            }
          }
        });

        if (self.options.viewcontrols) {

          self.$controls.on({
            touch : function( event ) {
              self.touchDown( event );
            },
            release : function( event ) {
              self.touchUp( event );
            },
            drag : function( event ) {
              var direction = event.gesture.direction;

              if ( 'left' === direction || 'right' === direction ) {
                self.touchMove( event );
              }
            },
            tap : function( event ) {
              self.touchMove( event );
            }
          });

        } else if (self.options.barcontrols) {


        }
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
      if ( true === self.isImage ) {
        self.syncControlLayout();
      }

      if (self.options.viewcontrols) {
        // finally show controlls
        self.$controls.removeClass( 'hidden' );
      }

    },

    // easeSwipe: function( event ) {
    //   var self = this;
    //   // is the swipe greater than one movement
    //   // where  (container.width / sequence.length-1) / 3 = one step
    //   var assetWidth      = $( self.$sequence[self.curIndex] ).width(),
    //       swipeDistance   = event.gesture.distance,
    //       sequenceLength  = self.sequenceLength - 1,
    //       stepSize        = ( assetWidth / sequenceLength ) / self.throttle,
    //       shouldEase      = ( 0 < ( swipeDistance - stepSize ) ) ? ( swipeDistance - stepSize ) : false;
    // },

    onResize: function() {
      var self = this;
      self.dynamicBuffer = Math.floor( ( self.$container.width() / self.$sequence.length ) / self.throttle );
      self.syncControlLayout();
      // if ( true === self.isImage ) {

      // }
    },

    onScroll: function() {
      var self = this;
      if ( false === self.inMotion) {
        self.inMotion = true;
        self.animateDragger();
      }
      if ( true === self.isImage ) {
        self.syncControlLayout();
      }
    },

    touchDown: function() {
      // Montana to Rice!
      var self = this;
      self.$body.addClass('unselectable');
      self.clicked = true;
    },

    touchUp: function() {
      var self = this;
      self.$body.removeClass('unselectable');
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

      if ( Settings.isIOS ) {
        if ( 0 === self.moves % 2 ) {
          self.move( direction );
        }
      } else if ( Settings.isAndroid ) {
        if ( 0 === self.moves % 5 ) {
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
      self.$controls.addClass( 'is-dragging' );
      self.$body.addClass('unselectable');
      self.clicked = true;
    },

    mouseUp: function( event ) {
      var self = this;
      event.preventDefault();
      self.$controls.removeClass( 'is-dragging' );
      self.$body.removeClass('unselectable');
      self.clicked = false;
    },

    mouseMove: function( event ) {
      var self    = this,
          doMove  = false;

      event.preventDefault();

      // set a default if not already set
      if ( null === self.lastTriggerX ) {
        self.lastTriggerX = self.lastX = event.pageX;
      }

      if ( event.pageX > ( self.lastTriggerX + self.dynamicBuffer ) ) {
        // moving right
        self.movingLeft   = true;
        self.movingRight  = false;
        doMove = true;
        self.lastTriggerX = event.pageX;
      } else if ( event.pageX < ( self.lastTriggerX - self.dynamicBuffer ) ) {
        // moving left
        self.movingLeft   = false;
        self.movingRight  = true;
        doMove = true;
        self.lastTriggerX = event.pageX;
      }

      // shall we?
      if ( self.clicked && doMove ) {
        var direction = self.movingLeft ? 'left' : 'right';
        self.move( direction );
      }

      self.lastX = event.pageX;
    },

    mobileLog: function( data, append ) {
      //$( '.e360debug' ).html( data.toString() + '\n' );
    },

    animateDragger: function( cycles ) {
      if (Settings.isLTIE8) {
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
        marginLeft: '+26px',
        marginRight: '+26px'
      }, 499, function() {
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
        marginLeft : '18px',
        marginRight : '18px'
      });

      self.inMotion = false;
    },

    initSliderBindings: function() {
      var self = this;

      // bind our click event handlers for labels
      self.$sliderControlContainer.on('click.label-click', '.slider-label', function(e) {
        var $el = $(e.target).closest('.slider-label'),
            $labels = self.$sliderControlContainer.find('.slider-label'),
            data = $el.data(),
            direction = data.direction;

        // if its autoplaying we dont want to reset everything -- crazy
        if (self.options.autoplay) {
          return false;
        }

        // set it back to autoplay
        self.options.autoplay = true;
        self.animationLooped = false;

        // set the label to have an active class if clicked
        $el.addClass('active');
        setTimeout(function() {
          $el.siblings().removeClass('active');
        }, 250);

        // start the animation
        self.startAnimation(direction);
      });

      self.sliderLabelInitialized = true;
    },

    move: function( direction ) {
      var self      = this,
          lastIndex = self.curIndex,
          slidePos,
          pagePos;

      // gets the number of slide notches for the slider
      slidePos = (self.curIndex * (self.sliderControlWidth / (self.sequenceLength - 1)));

      switch( direction ) {
        case 'left':
          if ( self.curIndex === 0 ) {

            if (self.options.autoplay && self.animationLooped && !self.options.loop) {
              self.initBehaviors();
              clearInterval(self.animationInterval);

              // if we have bar controls
              if (self.options.barcontrols && !self.sliderLabelInitialized) {
                self.createBarControl();
              }

              if (self.options.barcontrols && !self.showFallback) { self.setSliderPosition(slidePos); }

              // set auto play to false since current index is now 0
              self.options.autoplay = false;
              // close the method
              return;
            }

            // if we aren't looping or if were arent autoplaying set the curIndex to the lenght - 1 ??
            self.curIndex = self.sequenceLength - 1;

          } else {
            // keep iterating the curIndex down since were moving left
            self.curIndex--;

            // once the curIndex is 1 that means weve done a full loop (started from the sequence length)
            if (self.curIndex === 1) { self.animationLooped = true; }

            // if were animating we need to get the current slide index and compare it to the slider width, to get the position.
            if (self.options.barcontrols && self.sliderLabelInitialized && !self.showFallback) { self.setSliderPosition(slidePos); }
          }
        break;

        case 'right':
          // we can assume we've done a loop
          if ( self.curIndex === self.sequenceLength - 1 ) {
            self.animationLooped = true;

            if (self.options.autoplay && self.animationLooped && !self.options.loop) {
              clearInterval(self.animationInterval);
            }

            self.animationLooped = true;
            self.options.autoplay = false;

            self.curIndex = ( self.sequenceLength -1 );

            // if its 360 or were looping set it back to original
            if (self.is360 || self.options.loop) { self.curIndex = 0; }

            return;
          } else {
            self.curIndex++;
            // we can assume we've done a loop
            if (self.options.barcontrols && !self.showFallback) { self.setSliderPosition(slidePos); }
          }
        break;
      }

      self.$sequence.addClass( 'visuallyhidden' );
      self.pluck( self.curIndex ).removeClass( 'visuallyhidden' );
    },

    pluck: function( lastIndex ) {
      var self = this;

      // find by data index
      for( var i = 0; i < self.$sequence.length; i++ ) {
        if ( lastIndex === self.$sequence.eq(i).data( 'sequence-id' ) ) {
          return self.$sequence.eq(i);
        }
      }
      // not found
      return false;
    }
  };

  // Defaults
  // --------
  SonySequence.defaults = {
    autoplay: false,
    viewcontrols: true,
    barcontrols: false,
    loop: true,
    speed: 100,
    labelLeft: 'Left',
    labelRight: 'Right'
  };

  // Non override-able settings
  // --------------------------
  SonySequence.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };

  return SonySequence;

});
