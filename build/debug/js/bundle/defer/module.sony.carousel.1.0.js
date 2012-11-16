// ------------ Sony Carousel Module ------------
// Module: Carousel
// Version: 1.0
// Modified: 2012-11-12 by Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr, jodo.timer.js
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------

/*global jQuery, Modernizr */
(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
})(window);

(function($, Modernizr, window, undefined) {

    "use strict"; // jshint ;

    var Carousel = sony.moudles.Carousel = function($el, opts) {
        $.extend(this, $.fn.carousel.defaults, opts, $.fn.carousel.settings);
    

        
        
    

    $.fn.carousel.settings = {
        isCSS: Modernizr.csstransitions,
        hasTransforms: Modernizr.csstransforms,
        hasTransforms3d: Modernizr.csstransforms3d,
        hasTouch: Modernizr.touch,
        Carousel: 'carousel',
        indexBtns: [],
        isCarousel: false,
        currIndex: 0,
        timer: null
    };

})(jQuery, Modernizr, window);