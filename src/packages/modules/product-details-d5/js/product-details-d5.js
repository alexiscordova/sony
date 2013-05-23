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
    self.$dimensions = self.$horzMeasurements.add(self.$vertMeasurements);

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
      var self = this;

      self.$dimensions.each(function() {
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
          isSmallVImage, isSmallHImage,
          theMarginTop, theMarginLeft, top,
          dir, $theImage, $unitContainer, $measurementParent, $unitContainerHeight, $unitContainerWidth, theImageWidth, theImageHeight;

      isSmallVImage = isSmallHImage = false;
      theMarginTop = theMarginLeft = top = 0;
      dir = $theImage = $unitContainer = $measurementParent = $unitContainerHeight = $unitContainerWidth = theImageWidth = theImageHeight = undefined;

      self.$dimensions.each(function(index) {
            dir = $(this).hasClass("vertical-measurement") ? "v" : "h";
            $unitContainer = $(this).find(".units-container");
            $measurementParent = $unitContainer.closest("div.measurement");
            $theImage = $measurementParent.find(".img-wrapper img");
            // imgIndex = self.$imageWrappers.index($(this).parent().find(".img-wrapper"));
            // theImageWidth = dir === "v" ? $unitContainer.outerWidth(true) : self.mImageWidths[imgIndex];
            // theImageHeight = dir === "v" ? self.mImageHeights[imgIndex] : $unitContainer.outerHeight(true);
            //$unitContainerHeight = $unitContainer.outerHeight(true);//.innerHeight();
            $unitContainerHeight = $unitContainer.innerHeight();
            // $unitContainerWidth = $unitContainer.outerWidth(true);//.innerWidth();
            $unitContainerWidth = $unitContainer.innerWidth();
            theImageWidth = dir === "v" ? $unitContainerWidth : $theImage.outerWidth();
            theImageHeight = dir === "v" ? $theImage.outerHeight() : $unitContainerHeight;
            // top = 0;
            // isSmallHImage = false;
            // isSmallVImage = false;
            // theMarginTop = 0; // default
            // theMarginLeft = 0; // default

           if(dir === "v") {
              if(theImageHeight > $unitContainerHeight){
                // center vertically
                theMarginTop = -($unitContainerHeight / 2);
                top = "50%";
              }else{
                isSmallVImage = true;
                $measurementParent.addClass("small-v-image");
              }

              if(!isSmallVImage){
                $(this).css({
                  "height":theImageHeight,
                  "width":theImageWidth,
                  "min-height":theImageHeight,
                  "min-width":theImageWidth,
                });

                $unitContainer.css({
                  "top" : top,
                  "marginTop" : theMarginTop,
                  "marginLeft" : theMarginLeft
                });
              }

           } else if (dir === "h"){

            if(theImageWidth > $unitContainerWidth){
              // center horiz
              theMarginLeft = -($unitContainerWidth / 2);
            }else{
              // if the image is too small enforce 50px
              $measurementParent.addClass("small-h-image");
              isSmallHImage = true;
            }

            if(!isSmallHImage){
              $(this).css({
                "height":theImageHeight,
                "width":theImageWidth,
                "min-height":theImageHeight,
                "min-width":theImageWidth,
              });

              $unitContainer.css({
                "top" : top,
                "marginTop" : theMarginTop,
                "marginLeft" : theMarginLeft
              });
             }
           }
      });
    }
  };

  return module;
});