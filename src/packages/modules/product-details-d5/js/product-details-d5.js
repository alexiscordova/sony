// Product Details (ProductDetails) Module
// ---------------------------------------
//
// * **Class:** ProductDetails
// * **Version:** 0.1
// * **Modified:** 03/26/2013
// * **Author:** Telly Koosis
// * **Dependencies:** jQuery 1.7+, Modernizr

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings');

  // Public methods
  // --------------

  var module = {
    'init': function() {
      $('.pd-module').each(function(){
        new ProductDetails(this);
      });
    }
  };

  var ProductDetails = function(element){

    var self = this;

    self.$el = $(element);
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    self.init();

    log('SONY : ProductDetails : Initialized');
  };

  // Private methods
  // ---------------

  ProductDetails.prototype = {

    constructor: ProductDetails,

    init: function() {
      var self = this;

      // TODO: put this in listener 
      self.onImageLoad();

      if ( !Settings.$html.hasClass('lt-ie10') ){
        enquire.register("(min-width: 480px)", function() {
          self.renderDesktop();
        });
        enquire.register("(max-width: 479px)", function() {
          self.renderMobile();
        });
      } else {
        self.renderDesktop();
      }
    },

    onImageLoad : function(  ){
      var self = this;
    
      self.setMeasurementWidths();
      self.animateDimensions();
      
    },

    setMeasurementWidths : function(  ){
      console.log( '««« setMeasurementWidths »»»' );
      var self = this,
          $mWidths = $(".measurement-width"),
          $mHeights = $(".measurement-height"),
          $imgs = $(".measurement-image"),
          widths = [],
          heights = [];
      
      // get the height / widths
      $.each($imgs, function(index, value) { 
        widths[index] = $(this).outerWidth();
        heights[index] = $(this).height();
      });

      // set the widths
      $.each($mWidths, function(index) { 
        $(this).width(widths[index]);
      });      

      // set the heights 
      $.each($mHeights, function(index) { 
        $(this).height(heights[index]);
      });

    },

    animateDimensions : function(  ){
      console.log( '««« animateDimensions »»»' );
      var self = this;
    },

    renderDesktop: function() {

      var self = this;

      console.log( 'renderDesktop »' );

    },

    renderMobile: function() {
      console.log( 'renderMobile »' );
    }
  };

  return module;
});