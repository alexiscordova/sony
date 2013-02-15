
// Sony Global Class
// -----------------
//
// * **Class:** SONY.Global

var SONY = SONY || {};

SONY.Global = (function(window, document) {

  SONY.$window = $(window);
  SONY.$html = $(document.documentElement);
  SONY.$body = $(document.body);

  var self = {

    'init': function(config) {

      SONY.Utilities.init();

      if ( window.enquire ){
        window.enquire.listen(100);
      }

      log('SONY : Global : Initialized');
    }
  };

  return self;

})(this, this.document);

// Because iQ is super-global, we need to leave this in the global area.
// We should refactor iQ to be more modular / event-driven.

window.iQ = {
  options: {
    speedTestExpireMinutes: 30,
    asyncDistance: 500,
    throttleSpeed: 300,
    updateOnResize: true
  }
};
