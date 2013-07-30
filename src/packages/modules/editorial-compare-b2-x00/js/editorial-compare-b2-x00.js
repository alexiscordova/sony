// EditorialCompare Module
// --------------------------------------------
//
// * **Class:** EditorialCompare
// * **Version:** 1.0
// * **Modified:** 07/25/2013
// * **Author:** Adam Van Ornum
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      new EditorialCompare( $('.demo-module')[0] )
//
//


// Look through here for global variables first: `sony-global-settings.js`
// Some utilities functions that might save you time: `sony-global-utilities.js`


define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Environment = require('require/sony-global-environment');

  var module = {
    init: function() {
      var $module = $('.demo-module');

      if ( $module.length ) {
        new Demo( $module[0] );
      }
    }
  };

  var EditorialCompare = function( element, options ) {
    var self = this;

    $.extend( self, EditorialCompare.options, options, EditorialCompare.settings );

    self.$el = $( element );
    self.init();

    log('SONY : EditorialCompare : Initialized');
  };

  EditorialCompare.prototype = {

    constructor: EditorialCompare,

    init: function() {
      var self = this;

      // Probably set some variables here


      if ( Modernizr.mediaqueries ) {
        // These can be chained, like below
        // Use `em`s for your breakpoints ( px value / 16 )
        enquire
          .register('(min-width: 48em)', {
            match: function() {
              self.setupDesktop();
            }
          })
          .register('(max-width: 47.9375em)', {
            match: function() {
              self.setupMobile();
            }
          });

      } else {
        self.setupDesktop();
      }

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.onResize, self ));

    },

    // Stubbed method. You don't have to use this
    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {

      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    // Stubbed method. You don't have to use this
    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      if ( wasDesktop ) {

      }

      self.isDesktop = false;
      self.isMobile = true;
    },

    // Stubbed method. You don't have to use this
    onResize : function() {
      var self = this;
    }
  };

  // Options that could be customized per module instance
  EditorialCompare.options = {};

  // These are not overridable when instantiating the module
  EditorialCompare.settings = {
    isDesktop: false,
    isMobile: false
  };

  return module;
});
