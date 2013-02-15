
var Sony = Sony || {};

Sony.Global = (function(window, document) {

    Sony.$window = $(window);
    Sony.$html = $(document.documentElement);
    Sony.$body = $(document.body);

    var self = {

        'init': function(config) {

            Sony.Utilities.init();

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
