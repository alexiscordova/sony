// Editorial Feature List
// ------------
//
// * **Module:** Editorial Feature List
// * **Version:** 1.0
// * **Modified:** 07/02/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.9.1+
//
// *Example Usage:*
//
//      new EditorialFeatureList( $('.efl-module')[0] );

define(function(require) {

  'use strict';

  var $ = require('jquery');
      // Modernizr = require('modernizr'),
      // iQ = require('iQ'),
      // Settings = require('require/sony-global-settings'),
      // Environment = require('require/sony-global-environment'),
      // sonyCarousel = require('secondary/index').sonyCarousel,
      // Viewport = require('secondary/index').sonyViewport;

  var EditorialFeatureList = function( element ) {
    var self = this;

    // Set base element
    self.element = element;
    self.$el = $( element );

    // Inits the module
    self.init();

    self.$el.data( 'editorialFeatureList', self );

    log('SONY : EditorialFeatureList : Initialized');
  };

  EditorialFeatureList.prototype = {

    init : function() {
      var self = this;


    }
  };

  return EditorialFeatureList;
 });
