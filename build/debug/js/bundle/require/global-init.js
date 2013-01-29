var sony = sony || {};


window.iQ = {
  options: {
    speedTestExpireMinutes: 30,
    asyncDistance: 500,
    updateOnResize: true
  }
};

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
