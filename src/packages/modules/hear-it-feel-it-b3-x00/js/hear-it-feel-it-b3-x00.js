// Hear It / Feel It Module
// --------------------------------------------
//
// * **Class:** HearItFeelIt
// * **Version:** 1.0
// * **Modified:** 08/19/2013
// * **Author:** Ryan Mauer
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      new HearItFeelIt( $('.hear-it-feel-it')[0] )
//
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      Environment = require('require/sony-global-environment');

  var module = {
    init: function() {
      var $module = $( '.hear-it-feel-it' );

      if ( $module.length ) {
        $module.each( function() {
          new HearItFeelIt( this );
        });
      }
    }
  };

  var HearItFeelIt = function( element, options ) {
    var self = this;

    $.extend( self, HearItFeelIt.options, options, HearItFeelIt.settings );

    self.$el = $( element );
    self.init();

    log('SONY : HearItFeelIt : Initialized');
  };

  HearItFeelIt.prototype = {

    constructor: HearItFeelIt,

    init: function() {
      var self = this;

      setVars();

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

    setVars : function() {

    },

    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {

      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      if ( wasDesktop ) {

      }

      self.isDesktop = false;
      self.isMobile = true;
    },

    onResize : function() {
      var self = this;
    }
  };

  // Options that could be customized per module instance
  HearItFeelIt.options = {};

  // These are not overridable when instantiating the module
  HearItFeelIt.settings = {
    isDesktop: false,
    isMobile: false
  };

  return module;
});
