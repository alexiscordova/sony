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
    self.$el = $( element );
    self.$horzMeasurements = $(".horizontal-measurement");
    self.$images = self.$el.find(".pd-image"); //$(".measurement-image");


    self.init();

    log('SONY : ProductDetails : Initialized');
  };

  // Private methods
  // ---------------

  ProductDetails.prototype = {

    constructor: ProductDetails,

    init: function() {
      var self = this,
          $images = self.$images,
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

      // TODO: put this in listener 
      //self.onImagesLoaded();

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
      self.setMeasurementWidths();
      self.drawLines();
      
    },

    showImages : function(  ){
      console.log( '««« showImages »»»' );
      var self = this,
          $images = self.$images;

      $images.each(function() {
        $(this).addClass('on');
      });
    },

    setMeasurementWidths : function(  ){
      console.log( '««« setMeasurementWidths »»»' );
      var self = this,
          mImgWidths = [],
          $images = self.$images,
          $measures = self.$horzMeasurements;
      
      // get the height / widths
      $images.each(function(index, value) { 
        mImgWidths[index] = $(this).outerWidth();
      });

      // set the widths
      $measures.each(function(index) { 
        $(this).width(mImgWidths[index]);
      });      

    },

    drawLines : function(  ){
      console.log( '««« drawLines »»»' );



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