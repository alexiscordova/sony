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
    init: function() {
      $('.pd-module').each(function(){
        new ProductDetails(this);
      });
    }
  };

  var ProductDetails = function(element){

    var self = this;

    // GENERAL
    self.debounceEvent = 'global:resizeDebounced-200ms.pd-module';
    self.onResizeFunc = $.proxy( self.resizeFunc, self );

    // CACHE
    self.$el = $(element);
    self.$imageWrappers = self.$el.find('.measurement .img-wrapper');
    self.$measurementImages = self.$imageWrappers.find('.pd-image');
    self.$horzMeasurements = self.$el.find('.horizontal-measurement');
    self.$vertMeasurements = self.$el.find('.vertical-measurement');
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
      $images.each(function(index) {
        self.mImageWidths[index] = $(this).outerWidth();
        self.mImageHeights[index] = $(this).outerHeight();
      });
    },

    getDimesionDataList : function() {
      var self = this,
          dataList = [];

      // for each image, calculate its dimensions and margins
      self.$dimensions.each(function() {
        var parentClass = '',
        data = {},
        $el = $(this),
        isVerticalMeasurement = $el.hasClass('vertical-measurement'),
        $unitContainer = $el.find('.units-container'),
        $measurementParent = $unitContainer.closest('div.measurement'),
        $theImage = $measurementParent.find('.img-wrapper img'),
        unitContainerHeight = $unitContainer.innerHeight(),
        unitContainerWidth = $unitContainer.innerWidth(),
        theImageWidth = isVerticalMeasurement ? unitContainerWidth : $theImage.outerWidth(),
        theImageHeight = isVerticalMeasurement ? $theImage.outerHeight() : unitContainerHeight,

        // if image is thin, don't add pad/margins
        isThinImage = $el.closest('div.top-wrapper').hasClass('is-thin'),
        isSmallVImage = false,
        isSmallHImage = false,

        top = 0,
        theMarginLeft = 0,
        theMarginTop = 0;


        // for a vertical measurement
        if ( isVerticalMeasurement ) {
          if ( theImageHeight >= unitContainerHeight ) {
            // center vertically
            theMarginTop = -(unitContainerHeight / 2);
            top = '50%';
          } else {
            isSmallVImage = true;
            parentClass = 'small-v-image';
          }

          theMarginLeft = isThinImage ? 0 : theMarginLeft;

        } else {
          // for a horizontal measurement

          if ( theImageWidth >= unitContainerWidth ) {
            // center horiz
            theMarginLeft = -(unitContainerWidth / 2);
          } else {
            // if the image is too small enforce 50px
            parentClass = 'small-h-image';
            isSmallHImage = true;
          }
        }

        // Save data so that the DOM isn't manipulated between loops
        if ( parentClass ) {
          data.parentClass = parentClass;
          data.$measurementParent = $measurementParent;
        }

        // More data!
        if ( !isSmallHImage || !isSmallVImage ) {
          data.dimensions = {
            $el: $el,
            theImageWidth: theImageWidth,
            theImageHeight: theImageHeight
          };

          data.margins = {
            $el: $unitContainer,
            top: top,
            theMarginTop: theMarginTop,
            theMarginLeft: theMarginLeft
          };
        }

        dataList.push( data );
      });

      return dataList;
    },

    applyDimensionDataList : function( dataList ) {
      var self = this;

      // Process the saved data so the DOM is changed all at once
      self.$dimensions.each(function( i ) {
        var data = dataList[ i ];

        if ( data.parentClass ) {
          data.$measurementParent.addClass( data.parentClass );
        }

        if ( data.dimensions ) {
          self.setHeightWidth( data.dimensions.$el, data.dimensions.theImageWidth, data.dimensions.theImageHeight );
          self.setMarginsTop( data.margins.$el, data.margins.top, data.margins.theMarginTop, data.margins.theMarginLeft );
        }
      });
    },

    resetDimensions : function() {
      var self = this;

      // Reset
      self.$dimensions.each(function() {
        $( this ).
          find('.units-container').
          closest('div.measurement').
          removeClass('small-v-image small-h-image');
      });
    },

    // determine and set the height/widths of the measurement elements
    setMeasurementDimensions : function() {
      var self = this,
          dataList;

      self.resetDimensions();
      dataList = self.getDimesionDataList();
      self.applyDimensionDataList( dataList );
    },

    // set the height and width of the ele
    setHeightWidth : function( $el, w, h ){
      $el.css({
        'height':h,
        'width':w,
        'min-height':h,
        'min-width':w
      });
    },

  // set the left right margins and top position of the ele
    setMarginsTop : function($el, top, mTop, mLeft){
      $el.css({
        'top' : top,
        'marginTop' : mTop,
        'marginLeft' : mLeft
      });
    }
  };

  return module;
});
