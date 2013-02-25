
// Sony Utilities Class
// --------------------
//
// * **Class:** SONY.Utilities

var SONY = SONY || {};

SONY.Utilities = (function(window, document) {

  'use strict';

  var self = {

    // Return calculated column if width is above 568px/35.5em

    'masonryColumns': function(containerWidth) {
      var column = containerWidth;

      if ( !Modernizr || !SONY.Settings ) {
        return;
      }

      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
        column = SONY.Settings.COLUMN_WIDTH_SLIM * containerWidth;
      }

      return column;
    },

    // Return calculated gutter if width is above 568px/35.5em

    'masonryGutters': function(containerWidth) {
      var gutter = 0;

      if ( !Modernizr || !SONY.Settings ) {
        return;
      }

      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
        gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;
      }

      return gutter;
    },

    // Parses a 2D CSS transform matrix and returns key/val pairings

    'parseMatrix': function( str ) {
      var modified;

      // We have a matrix like: "matrix(1, 0, 0, 1, -120, 0)"

      // firstly replace one or more (+) word characters (\w) followed by `(` at the start (^) with a `[`
      // then replace the `)` at the end with `]`
      modified = str.replace( /^\w+\(/, '[' ).replace( /\)$/, ']');
      // this will leave you with a string: "[0.312321, -0.949977, 0.949977, 0.312321, 0, 0]"

      // then parse the new string (in the JSON encoded form of an array) as JSON into a variable
      try {
        modified = JSON.parse(modified);
      } catch (e) {
        modified = [null,null,null,null,null,null];
      }

      // THE FIRST FOUR VALUE NAMES ARE PROBABLY WRONG. I ONLY KNOW THE LAST TWO (translates) FOR SURE.
      return {
        val1 : modified[0],
        val2 : modified[1],
        val3 : modified[2],
        val4 : modified[3],
        translateX : modified[4],
        translateY : modified[5]
      };
    },

    // Constrains a value between a min and max value

    'constrain': function(value, min, max) {
      value = parseFloat(value);

      return value < min ? min :
        value > max ? max :
        value;
    },

    // Normalizes the console.log method.
    // use "`" key to display logs in production mode.
    // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/

    'normalizeLogs': function () {

      window.log = function () {
        /*@cc_on
          return;
        @*/
        window.log.history = window.log.history || [];
        window.log.history.push(arguments);

        if (window.isDebugMode) {
          if (window.console) {
            window.console.log(Array.prototype.slice.call(arguments));
          }
        }
      };

      /*@cc_on
        return;
      @*/
      if (!window.isDebugMode) {
        $(document).keyup(function (e) {

          var i, len;

          if ( e.keyCode === 192 || e.keyCode === 19 ) {
            if (window.console) {
              window.log.history = window.log.history || []; // store logs to an array for reference
              for (i = 0, len = window.log.history.length; i < len; i++) {
                window.console.log(Array.prototype.slice.call(window.log.history[i]));
              }
            }
          }
          window.log.history = [];
        });
      }
    },

    // This is a modified version of jQuery Tiny PubSub by Ben Alman
    // https://github.com/cowboy/jquery-tiny-pubsub

    'createPubSub': function() {

      var o = $({});

      SONY.on = function() {
        o.on.apply(o, arguments);
      };

      SONY.off = function() {
        o.off.apply(o, arguments);
      };

      SONY.trigger = function() {
        o.trigger.apply(o, arguments);
      };
    },

    // Create global events.

    'createGlobalEvents': function() {

      var cachedFunctions = {},
          resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';

      // Figure out if the window actually resized, or if IE is faking us out.
      // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer

      cachedFunctions.IEResizeCheck = function(cb) {

        // If you aren't IE7/8, you may pass.

        if ( !SONY.$html.hasClass('lt-ie9') ) {
          return cb();
        }

        var windowWidth = SONY.$window.width(),
            windowHeight = SONY.$window.height();

        if ( windowWidth !== SONY.Settings.windowWidth || windowHeight !== SONY.Settings.windowHeight ) {
          SONY.Settings.windowWidth = windowWidth;
          SONY.Settings.windowHeight = windowHeight;
          cb();
        }
      };

      // Throttle and Debounce variations
      // --------------------------------
      // * Any new version should be added here, then referenced in cachedFunctions.baseThrottle();

      // Default Settings.

      cachedFunctions.throttledResize = $.throttle(500, function(){
        SONY.trigger('global:resizeThrottled');
      });

      cachedFunctions.debouncedResize = $.debounce(500, function(){
        SONY.trigger('global:resizeDebounced');
      });

      // Specific Events.

      cachedFunctions.throttledResize200 = $.throttle(200, function(){
        SONY.trigger('global:resizeThrottled-200ms');
      });

      cachedFunctions.debouncedResize200 = $.debounce(200, function(){
        SONY.trigger('global:resizeDebounced-200ms');
      });

      cachedFunctions.debouncedResizeAtBegin200 = $.debounce(200, true, function(){
        SONY.trigger('global:resizeDebouncedAtBegin-200ms');
      });

      // Base Throttle
      // -------------
      // * Used to contain all of the various speeds and configurations of
      //   throttle and debounce, so they aren't all constantly being called by
      //   window.resize.

      cachedFunctions.baseThrottle = $.throttle(100, function(){
        cachedFunctions.IEResizeCheck(function(){
          cachedFunctions.throttledResize();
          cachedFunctions.debouncedResize();
          cachedFunctions.throttledResize200();
          cachedFunctions.debouncedResize200();
          cachedFunctions.debouncedResizeAtBegin200();
        });
      });

      SONY.$window.on(resizeEvent, function(){
        cachedFunctions.baseThrottle();
      });
    }
  };

  self.createPubSub();
  self.createGlobalEvents();
  self.normalizeLogs();

  return self;

})(this, this.document);
