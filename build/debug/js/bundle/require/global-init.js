var sony = sony || {};


window.iQ = {
  options: {
    speedTestExpireMinutes: 30,
    asyncDistance: 500,
    throttleSpeed: 300,
    updateOnResize: true
  }
};

if ( window.enquire ){
    window.enquire.listen(100);
}

// Taken from H5BP
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method,
        noop = function () {},
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
