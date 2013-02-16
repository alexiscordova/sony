
// Sony Utilities Class
// --------------------
//
// * **Class:** SONY.Utilities

var SONY = SONY || {};

SONY.Utilities = (function(window, document) {

  'use strict';

  var self = {

    init: function () {
      self.normalizeLogs();
    },

    parseMatrix: function( str ) {
      var pxValue = parseInt( str, 10 ),
          modified;

      // parseInt can handle 270px
      if ( !isNaN( pxValue ) ) {
        return pxValue;
      }

      // Otherwise we have a matrix like: "matrix(1, 0, 0, 1, -120, 0)"

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
        skewX : modified[0],
        skewY : modified[1],
        scaleX : modified[2],
        scaleY : modified[3],
        translateX : modified[4],
        translateY : modified[5]
      };
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
    }
  };

  return self;

})(this, this.document);
