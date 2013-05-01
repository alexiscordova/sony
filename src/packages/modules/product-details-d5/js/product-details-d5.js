// Product Details (ProductDetails) Module
// ---------------------------------------
//
// * **Class:** ProductDetails
// * **Version:** 0.1
// * **Modified:** 04/10/2013
// * **Author:** Telly Koosis
// * **Dependencies:** jQuery 1.7+, Modernizr

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment');

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

    // GENERAL
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;
    self.debounceEvent = 'global:resizeDebounced-200ms.pd-module';
    self.onResizeFunc = $.proxy( self.resizeFunc, self );

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

    // LISTEN
    // register listener for global debounce to call method **after** debounce begins
    Environment.on(self.debounceEvent, self.onResizeFunc);

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
    },

    resizeFunc : function(){
      var self = this;
      self.buildMeasurements();
    },

    onImagesLoaded : function(){
      var self = this;
      self.showImages();
      self.buildMeasurements();
      self.showMeasurements();
    },

    buildMeasurements : function(){
      var self = this;
      self.getMImageDimensions();
      self.setMeasurementDimensions();
    },

    showImages : function(){
      var self = this,
          $images = self.$measurementImages;

      $images.each(function() {
        $(this).addClass('on');
      });
    },

    showMeasurements : function(){
      var self = this,
          $measurements = self.$measurements;

      $measurements.each(function() {
        $(this).addClass('on');
      });
    },

    getMImageDimensions : function(){
      var self = this,
          $images = self.$measurementImages;

      // get the w/h of each image
      $images.each(function(index, value) {
        self.mImageWidths[index] = $(this).outerWidth();
        self.mImageHeights[index] = $(this).outerHeight();
      });
    },

    setMeasurementDimensions : function(){
      var self = this,
          $measurements = self.$vertMeasurements.add(self.$horzMeasurements);

        $measurements.each(function(index) {
          var dir = $(this).hasClass("vertical-measurement") ? "v" : "h",
              imgIndex = self.$imageWrappers.index($(this).parent().find(".img-wrapper")),
              $mContainer = $(this).find(".measurements-container"),
              theWidth = dir === "v" ? $mContainer.outerWidth(true) : self.mImageWidths[imgIndex],
              theHeight = dir === "v" ? self.mImageHeights[imgIndex] : $mContainer.outerHeight(true),
              top = 50,
              theMarginTop, theMarginLeft;

             if(dir === "v") {

              // if the vertical measurement > image then split measurement height in half instead
              if($mContainer.innerHeight() > theHeight){
                theMarginTop = 0;
                top = 0;
              }else{
                theMarginTop = -($mContainer.innerHeight() / 2);
              }

              theMarginLeft = 0;

             } else if (dir === "h"){
                theMarginTop = 0;
                top = 0;
                theMarginLeft = -($mContainer.innerWidth() / 2);
             }

            $(this).css({
              "height":theHeight,
              "width":theWidth
            });

            $mContainer.css({
              "top" : top + '%',
              "marginTop" : theMarginTop,
              "marginLeft" : theMarginLeft
            });
        });
    }
  };

  return module;
});