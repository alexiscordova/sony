
// Product Summary Module
// --------------------------------------------
//
// * **Class:** ProductSummary
// * **Version:** 0.1
// * **Modified:** 03/15/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment');

  var module = {
    init: function() {
      new ProductSummary( $('.product-summary-module')[0] );
    }
  };

  var ProductSummary = function( element ) {

    var self = this;

    self.$el = $( element );
    self.init();

    log('SONY : ProductSummary : Initialized');
  };

  ProductSummary.prototype = {

    constructor: ProductSummary,

    init: function() {
      var self = this;

      if ( Modernizr.mediaqueries ){

        enquire.register('(min-width: 780px)', {
          match: function() {
            console.log('min-width: 780px');
          }
        })
        .register('(min-width: 480px) and (max-width: 779px)', {
          match: function() {
            console.log('(min-width: 480px) and (max-width: 779px)');
          }
        })
        .register('(max-width: 479px)', {
          match: function() {
            console.log('(max-width: 479px)');
          }
        });

      } else {
        console.log('desktoppy');
      }
    }
  };

  return module;

});
