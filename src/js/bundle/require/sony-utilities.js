
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
