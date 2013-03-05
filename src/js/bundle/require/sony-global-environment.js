
// Sony Environment Class
// ----------------------
//
// * **Class:** SONY.Environment

var SONY = SONY || {};

SONY.Environment = (function(window, document) {

  'use strict';

  var self = {

    'init': function() {
      self.fixModernizrFalsePositives();
      self.createPubSub();
      self.createGlobalEvents();
      self.normalizeLogs();
      self.appendModernizrTests();
    },

    'appendModernizrTests': function() {

      // Before IE 9, the getStyles API would not return the pixel values of the margin if set to 'auto'.
      // Also, Firefox has a longstanding issue where the pixel value of 'auto' is always zero.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=381328

      Modernizr.addTest('JSAutoMargins', function() {

        var x = document.createElement('div'),
            y = document.createElement('div');

        x.appendChild(y);
        x.style.width = '100px';
        y.style.width = '50px';
        y.style.margin = '0 auto';

        document.body.appendChild(x);

        if ( parseInt($(y).css('marginLeft'), 10) === 25) {
          $(x).remove();
          return true;
        } else {
          $(x).remove();
          return false;
        }

      });
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
    },

    fixModernizrFalsePositives : function() {

      // The sony tablet s gets a false negative on generated content (pseudo elements)
      if ( SONY.Settings.isSonyTabletS ) {
        Modernizr.generatedcontent = true;
        SONY.$html.removeClass('no-generatedcontent').addClass('generatedcontent sonytablets');
      }
    }

  };

  self.init();

  return self;

})(this, this.document);

// Need to find a better place for this to live.

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/) {

    var len = this.length >>> 0,
        from = Number(arguments[1]) || 0;

    from = (from < 0) ? Math.ceil(from) : Math.floor(from);

    if ( from < 0 ) { from += len; }

    for (; from < len; from++) {
      if (from in this && this[from] === elt) {
        return from;
      }
    }
    return -1;
  };
}
