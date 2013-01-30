var sony = sony || {};


window.iQ = {
  options: {
    speedTestExpireMinutes: 30,
    asyncDistance: 500,
    updateOnResize: true
  }
};

// Make console logs do nothing for unsupported browsers
(function(window, undefined) {

    if ( typeof window.console === undefined ) {
        var noop = function(){};
        window.console = {
            log : noop,
            group: noop,
            groupEnd: noop,
            warn: noop,
            error: noop
        };
    }
}(window));
