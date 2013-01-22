
// ------ Sony UX Marketing Convergence (MarketingConvergence) Module ------
// Module: MarketingConvergence Module
// Version: 0.1
// Modified: 01/18/2013
// Dependencies: jQuery 1.7+
// -------------------------------------------------------------------------

(function($) {

  'use strict';

  var MarketingConvergenceModule = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.marketingConvergenceModule.defaults, options);

    self.$el = $element;

    self.init();
  };

  MarketingConvergenceModule.prototype = {

    'constructor': MarketingConvergenceModule,

    'init': function() {

      var self = this;

      self.buildPartnerCarousel();
    },

    'buildPartnerCarousel': function() {

      var self = this;

      self.currentPartnerProduct = -1;
      self.$partnerCarousel = self.$el.find('.partner-products');
      self.$partnerCarouselSlides = self.$partnerCarousel.find('li');

      self.$partnerCarouselSlides.detach();

      self.gotoNextPartnerProduct();
      self.setPartnerCarouselInterval();
      self.setupReloadButton();

    },

    'setupReloadButton': function() {

      var self = this;

      self.$el.find('.btn-reload').on('click', function(e){

        e.preventDefault();

        self.gotoNextPartnerProduct();
        self.setPartnerCarouselInterval();
      });

    },

    'setPartnerCarouselInterval': function() {

      var self = this;

      if ( self.partnerCarouselInterval ) {
        clearInterval(self.partnerCarouselInterval);
      }

      self.partnerCarouselInterval = setInterval(function(){
        self.gotoNextPartnerProduct();
      }, self.rotationSpeed);
    },

    'gotoNextPartnerProduct': function() {

      var self = this,
          $newSlide;

      if ( self.currentPartnerProduct === self.$partnerCarouselSlides.length - 1 ) {
        self.currentPartnerProduct = 0;
      } else {
        self.currentPartnerProduct++;
      }

      self.$partnerCarousel.children().each(function(){
        $(this).fadeOut(self.transitionTime, function(){
          $(this).remove();
        });
      });

      $newSlide = self.$partnerCarouselSlides.eq(self.currentPartnerProduct).clone();

      $newSlide.appendTo(self.$partnerCarousel);
      $newSlide.fadeOut(0).fadeIn(self.transitionTime);

      window.iQ.update();
    }
  };

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

  $.fn.marketingConvergenceModule.defaults = {
    'rotationSpeed': 5000,
    'transitionTime': 1000
  };

  $(function(){
   $('.uxmc-container').marketingConvergenceModule();
  });

})(jQuery);
