// Product Details (ProductDetails) Module
// ---------------------------------------
//
// * **Class:** ProductDetails
// * **Version:** 0.1
// * **Modified:** 04/5/2013
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

    // FROM GLOBALS
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    // CACHE
    self.$el = $(element);
    self.$imageWrappers = self.$el.find(".measurement .img-wrapper"); 
    self.$measurementImages = self.$imageWrappers.find(".pd-image"); 
    self.$horzMeasurements = self.$el.find(".horizontal-measurement");
    self.$vertMeasurements = self.$el.find(".vertical-measurement");
    self.$measurements = self.$horzMeasurements.add(self.$vertMeasurements);

    // DEFAULTS
    self.mImageWidths = [];
    self.mImageHeights = [];

    self.init();

    log('SONY : ProductDetails : Initialized');
  };

  // Private methods
  // ---------------

  ProductDetails.prototype = {

    constructor: ProductDetails,

    init: function() {
      var self = this,
          $images = self.$measurementImages,
          $readyImages = $images.filter(function(){return $(this).data('hasLoaded');});

      $images.on('imageLoaded iQ:imageLoaded', function(){
        $readyImages = $readyImages.add($(this));
       
        if ($readyImages.length === $images.length) {
          self.onImagesLoaded();
        }

      });

      if ($readyImages.length === $images.length) {
        self.onImagesLoaded();
      }

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

    onImagesLoaded : function(  ){
      var self = this;
    
      self.showImages();
      self.showMeasurements();
      self.getMImageDimensions();
      self.setMeasurementDimensions();
    },

    showImages : function(  ){
      // console.log( '««« showImages »»»' );
      var self = this,
          $images = self.$measurementImages;

      $images.each(function() {
        $(this).addClass('on');
      });
    },

    showMeasurements : function(  ){
      var self = this,
          $measurements = self.$measurements;

      //console.log( '$measurements »' , $measurements);    
      
      $measurements.each(function() {
        $(this).addClass('on');
      });  

    },

    getMImageDimensions : function(){
      // console.log( '««« getImageWidths »»»' );
      var self = this,
          $images = self.$measurementImages;
      
      // get the w/h of each image
      $images.each(function(index, value) { 
        self.mImageWidths[index] = $(this).outerWidth();
        self.mImageHeights[index] = $(this).outerHeight();
      });
    },

    setMeasurementDimensions : function(){
      // console.group( '««« setMeasurementDimensions »»»' );
      var self = this,
          $measurements = self.$vertMeasurements.add(self.$horzMeasurements);
      
        $measurements.each(function(index) { 
          var dir = $(this).hasClass("vertical-measurement") ? "v" : "h",
              imgIndex = self.$imageWrappers.index($(this).parent().find(".img-wrapper")),
              $mContainer = $(this).find(".measurements-container"),
              theWidth = dir === "v" ? $mContainer.outerWidth(true) : self.mImageWidths[imgIndex],
              theHeight = dir === "v" ? self.mImageHeights[imgIndex] : $mContainer.outerHeight(true),
              theMarginTop = dir === "v" ? -($mContainer.innerHeight() / 2) : 0,
              theMarginLeft = dir === "v" ? 0 : -($mContainer.innerWidth() / 2);

            $(this).css({
              "height":theHeight,
              "width":theWidth
            });

            $mContainer.css({
              "marginTop" : theMarginTop,
              "marginLeft" : theMarginLeft
            });

        });
      
    },

    resetMeasurements : function(){
      var self = this;
      self.showMeasurements();
      self.getMImageDimensions();
      self.setMeasurementDimensions();
      
    
    },

    renderDesktop: function() {
      var self = this;

      
      self.resetMeasurements();
      
      // console.log( 'renderDesktop »' );
    },

    renderMobile: function() {
      var self = this;
      // console.log( 'renderMobile »' );
    }
  };

  return module;
});