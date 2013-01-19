
// ------ Sony UX Marketing Convergence (MarketingConvergence) Module ------
// Module: MarketingConvergence Module
// Version: 0.1
// Modified: 01/16/2013
// Dependencies: jQuery 1.7+
// -------------------------------------------------------------------------

(function($) {

    'use strict';

    // Start module
    var MarketingConvergenceModule = function($element, options){

      var self = this;

      $.extend(self, {}, $.fn.marketingConvergenceModule.defaults, options, $.fn.marketingConvergenceModule.settings);

      self.$el                 = $element;
      self.$win                = $(window);
      self.$doc                = $(document);

      self.$cached             = self.$el.clone();

      self.init();

    };

    MarketingConvergenceModule.prototype = {

      constructor: MarketingConvergenceModule,

      'init': function() {

        var self = this;

        self.buildPartnerCarousel();

      },

      'reset': function(){

        var self = this,
            $newCopy = self.$cached.clone();

        self.$el.replaceWith($newCopy).remove();
        self.$el = $newCopy;

        self.init();

      },

      'buildPartnerCarousel': function() {

        var self = this,
            $firstSlide;

        self.currentPartnerProduct = 0;
        self.$partnerCarousel = self.$el.find('.partner-products');
        self.$partnerCarouselSlides = self.$partnerCarousel.find('li');

        self.$partnerCarouselSlides.detach();

        self.gotoNextPartnerProduct();

        self.partnerCarouselInterval = setInterval(function(){
          self.gotoNextPartnerProduct();
        }, self.rotationSpeed);

      },

      'gotoNextPartnerProduct': function() {

        var self = this,
            $newSlide;

        if ( !self.$partnerCarouselSlides ) return;

        if ( self.currentPartnerProduct === self.$partnerCarouselSlides.length - 1 ) {
          self.currentPartnerProduct = 0;
        } else {
          self.currentPartnerProduct++;
        }

        self.$partnerCarousel.empty();

        $newSlide = self.$partnerCarouselSlides.eq(self.currentPartnerProduct).clone();
        self.$partnerCarousel.append($newSlide);

        window.iQ.update();

      }

    };

    // Plugin definition
    $.fn.marketingConvergenceModule = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          marketingConvergenceModule = self.data('marketingConvergenceModule');

        // If we don't have a stored marketingConvergenceModule, make a new one and save it
        if ( !marketingConvergenceModule ) {
            marketingConvergenceModule = new MarketingConvergenceModule( self, options );
            self.data( 'marketingConvergenceModule', marketingConvergenceModule );
        }

        if ( typeof options === 'string' ) {
          marketingConvergenceModule[ options ].apply( marketingConvergenceModule, args );
        }
      });
    };

    // Defaults options for your module
    $.fn.marketingConvergenceModule.defaults = {
      'rotationSpeed': 5000
    };

    // Non override-able settings
    $.fn.marketingConvergenceModule.settings = {

    };

    $( function(){

     $('.uxmc-container').marketingConvergenceModule();

    } );

 })(jQuery);
