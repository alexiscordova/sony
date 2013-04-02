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

    // FROM GLOBALS
    self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;

    // CACHE
    self.$el = $(element);
    self.$imageWrappers = self.$el.find(".measurement .img-wrapper"); 
    self.$measurementImages = self.$imageWrappers.find(".pd-image"); 
    self.$horzMeasurements = $(".horizontal-measurement");
    self.$vertMeasurements = $(".vertical-measurement");

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
      self.getMImageDimensions();
      self.setMeasurementDimensions();
      //self.handleCanvases();
    },

    showImages : function(  ){
      console.log( '««« showImages »»»' );
      var self = this,
          $images = self.$measurementImages;

      $images.each(function() {
        $(this).addClass('on');
      });
    },

    getMImageDimensions : function(){
      console.log( '««« getImageWidths »»»' );
      var self = this,
          $images = self.$measurementImages;
      
      // get the w/h of each image
      $images.each(function(index, value) { 
        self.mImageWidths[index] = $(this).outerWidth();
        self.mImageHeights[index] = $(this).outerHeight();
      });
    },

    setMeasurementDimensions : function(){
      console.group( '««« setMeasurementDimensions »»»' );
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
      
      console.log( '« end »');
      console.groupEnd();
    },


    // handleCanvases : function(){
    //   console.log( '««« handleCanvases »»»' );
    //   var self = this;

    //   //  for each measurement dimension
    //   //  set height of stroke
    //   //  set width of stroke
    //   //  set x position of stroke
    //   //  set y position of stroke
    //   //  set weight of stroke

    //   self.setCanvasDimensions(self.$canvases);
    //   self.drawLines();
    
    // },


    // setCanvasDimensions : function($canvases){
    //   console.log( '««« setCanvasDimensions »»»' );
    //   var self = this;
        
    //   $canvases.each(function(index) { 
    //     console.log( 'this canvas »' , $(this));
    //   });

    //   // if vertical, width gets set to width of parent - 1
    //   // if horizontal, width gets set to width  self.$horzMeasurements[INDEX]
      
    //   // if vertical, height gets set to height of silbing image-wrapper > img
    //   // if horizontal, height gets set to height of parent - 1

    //   // $el.height();
    //   // $el.width(); 
      
    //   // 
    //   // vertical width
    //   // $("canvas:eq(0)").siblings('.measurements-container').outerWidth()
    //   // 
    //   // vertical height
    //   // GET FROM IMAGE HEIGHT
    //   // 
    //   // horizontal width
    //   // GET FROM IMAGE WIDTH
    //   // 
    //   // h height
    //   // $(".horizontal-measurement canvas:eq(0)").siblings('.measurements-container').outerHeight()
      
      
    //   // console.log( 'canvas parent »' , $canvas.parent());
    //   // console.log( 'canvas parent width»' , $canvas.parent().innerWidth());
    //   // $canvas.width($canvas.parent().innerWidth());
    //   // console.log( 'canvas sibling measurements width»' , $(".vertical-canvas + .measurements-container"));
    //   // $canvas.height($(".vertical-canvas + .measurements-container").innerHeight());
   
    // },

    // // TODO: animate growth
    // drawLines : function(){
    //   console.log( '««« drawLines »»»' );
    //   var self = this,
    //       context = self.$canvases.get(0).getContext("2d"),  // IN LOOP
    //       xStart = 10,
    //       xEnd = xStart, // do not want a diagonal
    //       yStart = 0, //top
    //       yEnd = 100; // height of canvas
    
    //   //self.resetCanvas($canvas); // for window resize... redraw 

    //   // styles
    //   context.lineWidth = self.lineWidth; //thickness
    //   context.strokeStyle = self.gray50; // color
      
    //   context.beginPath(); // Start the path
      
    //   context.moveTo(xStart, yStart); // Set the path origin
    //   context.lineTo(xEnd, yEnd); // Set the path destination
      
    //   context.closePath(); // Close the path
      
    //   context.stroke(); // Outline the path
    // },


    // resetCanvas : function(cnvs){
    //   console.log( '««« resetCanvas »»»' );
    //   var self = this;
    
    //   cnvs.attr("width", cnvs.width());
    //   cnvs.attr("height", cnvs.height());
    // },

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