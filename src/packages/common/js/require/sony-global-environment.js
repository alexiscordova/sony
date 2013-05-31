
// Sony Environment Class
// ----------------------
//
// * **Class:** SONY.Environment
//
// This class should be used to extend the global space with events, small polyfills, and extensions.
// Any callable methods should go into [SONY.Utilities](sony-global-utilities.html).

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      Settings = require('require/sony-global-settings'),
      throttleDebounce = require('plugins/index').throttleDebounce;

  var self = {

    init: function() {
      self.fixModernizrFalsePositives();
      self.createPubSub();
      self.createGlobalEvents();
      self.normalizeLogs();
      self.appendModernizrTests();
      self.addDeviceClasses();

      log('SONY : Global : Environment : Initialized');
    },

    appendModernizrTests: function() {

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

      // Test for `display: table` support.

      Modernizr.addTest('displayTable', function() {

        var rules = document.createElement('div').style;

        try {
          rules.display = 'table';
          return rules.display === 'table';
        } catch (e) {
          return false;
        }
      });

      // Does the browser support max/min widths on <table> elements? We use this extensively for
      // vertical centering via the `table-center` class, so we need to know where it fails.
      // As of writing, this occurs in Safari.

      Modernizr.addTest('widthBoundsOnTables', function() {

        var x = document.createElement('div'),
            y = document.createElement('div'),
            test;

        if ( !Modernizr.displaytable ) {
          return false;
        }

        x.appendChild(y);

        x.style.display = 'table';
        x.style.height = '200px';
        x.style.maxWidth = '100px';
        x.style.width = 'auto';

        y.style.display = 'table-cell';
        y.style.verticalAlign = 'middle';
        y.style.height = '100px';

        y.innerHTML = 'test test test test test test test test test test test';

        document.documentElement.appendChild(x);

        test = ( y.getBoundingClientRect().right - y.getBoundingClientRect().left === 100 );

        document.documentElement.removeChild(x);

        return test;
      });

      // Does the browser's implementation of <table> correctly support absolute positioning?

      Modernizr.addTest('absolutePositionOnTables', function() {

        var x = document.createElement('div'),
            y = document.createElement('div'),
            z = document.createElement('div'),
            test;

        if ( !Modernizr.displaytable ) {
          return false;
        }

        x.appendChild(y);
        y.appendChild(z);

        x.style.position = 'relative';

        y.style.position = 'absolute';
        y.style.width = '50%';

        z.style.position = 'absolute';
        z.style.display = 'table';
        z.style.right = '0';
        z.style.width = '25%';

        document.documentElement.appendChild(x);

        test = Math.abs(z.getBoundingClientRect().right - y.getBoundingClientRect().right) <= 1;

        document.documentElement.removeChild(x);

        return test;
      });
    },

    // Normalizes the console.log method.
    // use "`" key to display logs in production mode.
    // http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/

    normalizeLogs: function () {

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

    createPubSub: function() {

      var o = $({});

      self.on = function() {
        o.on.apply(o, arguments);
      };

      self.off = function() {
        o.off.apply(o, arguments);
      };

      self.trigger = function() {
        o.trigger.apply(o, arguments);
      };
    },

    // Create global events.

    createGlobalEvents: function() {

      var cachedFunctions = {},
          resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';

      // Figure out if the window actually resized, or if IE is faking us out.
      // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer

      cachedFunctions.IEResizeCheck = function(cb) {

        // If you aren't IE7/8, you may pass.

        if ( !Settings.isLTIE9 ) {
          return cb();
        }

        var windowWidth = Settings.$window.width(),
            windowHeight = Settings.$window.height();

        if ( windowWidth !== Settings.windowWidth || windowHeight !== Settings.windowHeight ) {
          Settings.windowWidth = windowWidth;
          Settings.windowHeight = windowHeight;
          cb();
        }
      };

      // Throttle and Debounce variations
      // --------------------------------
      // * Any new version should be added here, then referenced in cachedFunctions.baseThrottle();

      // Default Settings.

      cachedFunctions.throttledResize = $.throttle(500, function(){
        self.trigger('global:resizeThrottled');
      });

      cachedFunctions.debouncedResize = $.debounce(500, function(){
        self.trigger('global:resizeDebounced');
      });

      // Specific Events.

      cachedFunctions.throttledResize200 = $.throttle(200, function(){
        self.trigger('global:resizeThrottled-200ms');
      });

      cachedFunctions.debouncedResize200 = $.debounce(200, function(){
        self.trigger('global:resizeDebounced-200ms');
      });

      cachedFunctions.debouncedResizeAtBegin200 = $.debounce(200, true, function(){
        self.trigger('global:resizeDebouncedAtBegin-200ms');
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

      Settings.$window.on(resizeEvent, function(){
        cachedFunctions.baseThrottle();
      });
    },

    fixModernizrFalsePositives : function() {

      // Overwrite the Modernizr.mq function for IE < 10
      if ( Settings.isLTIE10 ) {
        Modernizr.mq = function() { return false; };
        Modernizr.mediaqueries = false;
      }

      // Sony Tablet P does not support box shadow nor inset box shadow
      // http://quirksmode.org/css/backgrounds-borders/boxshadow.html
      // http://www.elektronotdienst-nuernberg.de/bugs/box-shadow_inset.html
      if ( Settings.isSonyTabletP ) {
        Modernizr.boxshadow = false;
        Settings.$html.removeClass('boxshadow').addClass('no-boxshadow');
      }

      // The sony tablet s gets a false negative on generated content (pseudo elements)
      if ( !Modernizr.generatedcontent && Settings.isSonyTabletS ) {
        Modernizr.generatedcontent = true;
        Settings.$html.removeClass('no-generatedcontent').addClass('generatedcontent');
      }

      // IE7 getting false positive
      if ( Modernizr.generatedcontent && Settings.isLTIE8 ) {
        Modernizr.generatedcontent = false;
        Settings.$html.removeClass('generatedcontent').addClass('no-generatedcontent');
      }
    },

    addDeviceClasses : function() {

      if ( Settings.isSonyTabletS ) {
        Settings.$html.addClass('sonytablets');
      }

      if ( Settings.isSonyTabletP ) {
        Settings.$html.addClass('sonytabletp');
      }

      if ( Settings.isPS3 ) {
        Settings.$html.addClass('ps3');
      }

      if ( Settings.isVita ) {
        Settings.$html.addClass('vita');
      }
    }

  };

  self.init();

  return self;

});

// Need to find a better place for these to live.

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

if (!Array.prototype.filter) {
  Array.prototype.filter = function(a, //a function to test each value of the array against. Truthy values will be put into the new array and falsy values will be excluded from the new array
    b, // placeholder
    c, // placeholder
    d, // placeholder
    e // placeholder
  ) {
      c = this; // cache the array
      d = []; // array to hold the new values which match the expression
      for (e in c) {
        ~~e + '' == e && e >= 0 && // coerce the array position and if valid,
        a.call(b, c[e], +e, c) && // pass the current value into the expression and if truthy,
        d.push(c[e]); // add it to the new array
      }

      return d; // give back the new array
  };
}
