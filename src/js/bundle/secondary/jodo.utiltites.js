 /*
 * Simple event attachment/detachment
 * Since we attach listeners to the window scroll, resize and 
 * orientationchange events, native functions are 6x faster than jQuery's
 * event handling system.
 */
function addEvent(elem, type, fn) {
    elem[add](pre + type, fn, false);
}

function removeEvent(elem, type, fn) {
    elem[rem](pre + type, fn, false);
}

/* 
 * Thanks to underscore.js and lodash.js
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time.
 */
function throttle(func, wait) {
    var args, 
    	result,
    	thisArg,
    	timeoutId,
    	lastCalled = 0;

    function trailingCall() {
        lastCalled = new Date;
        timeoutId = null;
        func.apply(thisArg, args);
    };

    return function() {
        var now = new Date, 
        remain = wait - (now - lastCalled);

        args = arguments;
        thisArg = this;

        if (remain <= 0) {
            lastCalled = now;
            result = func.apply(thisArg, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(trailingCall, remain);
        }
        return result;
    };
};

/* 
 * Thanks to underscore.js and lodash.js
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */

function debounce(func, wait, immediate) {
    var args,
    	result,
    	thisArg,
    	timeoutId;

    function delayed() {
        timeoutId = null;
        if (!immediate) {
            func.apply(thisArg, args);
        }
    };

    return function() {
        var isImmediate = immediate && !timeoutId;
        args = arguments;
        thisArg = this;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(delayed, wait);

        if (isImmediate) {
            result = func.apply(thisArg, args);
        }
        return result;	
    };
};



// ALT THROTTLE
// (function($, window){
//     $.throttle = function(a,b){
//         var ctx = this;
//         ctx.delay = 200;
//         ctx.delay = (typeof a == 'function') ? ctx.delay : (typeof a == 'number') ? a : ctx.delay;
//         ctx.cb = (typeof a == 'function') ? a : (typeof b == 'function') ? b : function(){};
//         if($.throttle.timeout !== false)
//             clearTimeout($.throttle.timeout);
//         $.throttle.timeout = setTimeout(function(){ 
//             $.throttle.timeout = false;
//             ctx.cb();
//         }, ctx.delay);    
//     };
//     $.throttle.timeout = false;    
// })(jQuery, window);