// D5 - Product Details Module
// ---------------------------------------
//
// * **Class:** ProductDetails
// * **Version:** 0.1
// * **Modified:** 06/11/2013
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

      // when images are loaded, show
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

    // handle browser/device resize
    resizeFunc : function(){
      var self = this;
      self.buildMeasurements();
    },

    // once image have loaded perform these
    onImagesLoaded : function(){
      var self = this;
      self.showImages();
      self.buildMeasurements();
      self.showMeasurements();
    },

    // determine the right height/widths for product measurement
    buildMeasurements : function(){
      var self = this;
      self.setMImageDimensions();
      self.setMeasurementDimensions();
    },

    // add 'on' class to images
    showImages : function(){
      var self = this,
          $images = self.$measurementImages;

      $images.each(function() {
        $(this).addClass('on');
      });
    },

    // add 'on' class to measurements once they are built
    showMeasurements : function(){
      var self = this;

      self.$dimensions.each(function() {
        $(this).addClass('on');
      });
    },

    // store the dimensions of each measurement image
    setMImageDimensions : function(){
      var self = this,
          $images = self.$measurementImages;

      // get the w/h of each image
      $images.each(function(index, value) {
        self.mImageWidths[index] = $(this).outerWidth();
        self.mImageHeights[index] = $(this).outerHeight();
      });
    },

    // determine and set the height/widths of the measurement elements
    setMeasurementDimensions : function(){
      var self = this,
          isSmallVImage, isSmallHImage,
          theMarginTop, theMarginLeft, top,
          $el, dir, $theImage, $unitContainer, $measurementParent, $unitContainerHeight, $unitContainerWidth, theImageWidth, theImageHeight, isThinImage;

      // if image is thin, don't add pad/margins
      isThinImage = isSmallVImage = isSmallHImage = false;

      // defaults
      theMarginTop = theMarginLeft = top = 0;
      $el = dir = $theImage = $unitContainer = $measurementParent = $unitContainerHeight = $unitContainerWidth = theImageWidth = theImageHeight = undefined;

      // for each image
      self.$dimensions.each(function(index) {
        $el = $(this);
        dir = $el.hasClass("vertical-measurement") ? "v" : "h";
        $unitContainer = $el.find(".units-container");
        $measurementParent = $unitContainer.closest("div.measurement");
        $theImage = $measurementParent.find(".img-wrapper img");
        $unitContainerHeight = $unitContainer.innerHeight();
        $unitContainerWidth = $unitContainer.innerWidth();
        theImageWidth = dir === "v" ? $unitContainerWidth : $theImage.outerWidth();
        theImageHeight = dir === "v" ? $theImage.outerHeight() : $unitContainerHeight;


        if($el.closest("div.top-wrapper").hasClass("is-thin")){
          isThinImage = true;
        }

        // for a vertical measurement
        if(dir === "v") {
          if(theImageHeight >= $unitContainerHeight){
            // center vertically
            theMarginTop = -($unitContainerHeight / 2);
            top = "50%";
          }else{
            isSmallVImage = true;
            $measurementParent.addClass("small-v-image");
          }

          theMarginLeft = isThinImage ? 0 : theMarginLeft;

        }else if (dir === "h"){
          // for a horizontal measurement

          if(theImageWidth >= $unitContainerWidth){
            // center horiz
            theMarginLeft = -($unitContainerWidth / 2);
          }else{
            // if the image is too small enforce 50px
            $measurementParent.addClass("small-h-image");
            isSmallHImage = true;
          }
        }


        if((!isSmallHImage) || (!isSmallVImage)){
          self.setHeightWidth( $el, theImageWidth, theImageHeight );
          self.setMarginsTop( $unitContainer, top, theMarginTop, theMarginLeft );
        }
      });
    },

    // set the height and width of the ele
    setHeightWidth : function( $el, w, h ){
      var self = this;
      $el.css({
        "height":h,
        "width":w,
        "min-height":h,
        "min-width":w,
      });
    },

  // set the left right margins and top position of the ele
    setMarginsTop : function($el, top, mTop, mLeft){
      var self = this;
      $el.css({
        "top" : top,
        "marginTop" : mTop,
        "marginLeft" : mLeft
      });
    }
  };

  return module;
});