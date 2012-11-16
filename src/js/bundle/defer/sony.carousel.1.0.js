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

    var SonyCarousel = sony.modules.SonyCarousel = function($el, opts) {
        //$.extend(this, $.fn.sonyCarousel.defaults, opts, $.fn.carousel.settings);
        

    };
        
        
    $.fn.sonyCarousel = function(options) {
        var args = arguments;
        return this.each(function(){
            var self = $(this);
            if (typeof options === "object" ||  !options) {
                if( !self.data('sonyCarousel') ) {
                    self.data('sonyCarousel', new SonyCarousel(self, options));
                }
            } else {
                var sonyCarousel = self.data('sonyCarousel');
                if (sonyCarousel && sonyCarousel[options]) {
                    return sonyCarousel[options].apply(sonyCarousel, Array.prototype.slice.call(args, 1));
                }
            }

            console.log('I have been instantiated as a [' , self.data('sonyCarousel') , ']');
        });        
    };

    $.fn.sonyCarousel.settings = {
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


/*

    $.fn.sonyCarousel = function(options) {      
        var args = arguments;
        return this.each(function(){
            var self = $(this);
            if (typeof options === "object" ||  !options) {
                if( !self.data('royalSlider') ) {
                    self.data('royalSlider', new RoyalSlider(self, options));
                }
            } else {
                var royalSlider = self.data('royalSlider');
                if (royalSlider && royalSlider[options]) {
                    return royalSlider[options].apply(royalSlider, Array.prototype.slice.call(args, 1));
                }
            }
        });
    };

*/