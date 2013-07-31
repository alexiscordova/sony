// Demo Module
// --------------------------------------------
//
// * **Class:** RecentlyViewed
// * **Version:** 1.0
// * **Modified:** 04/18/2013
// * **Author:** Your Name
// * **Dependencies:** jQuery 1.7+ , Modernizr
//
// *Notes:*
//
// *Example Usage:*
//
//      new ExplodedView( $('.exploded-view')[0] )
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
      var $module = $('.exploded-view');

      if ( $module.length ) {
        new ExplodedView( $module[0] );
      }
    }
  };

  var ExplodedView = function( element, options ) {
    var self = this;

    $.extend( self, ExplodedView.options, options, ExplodedView.settings );

    self.$el = $( element );
    self.init();

    log('SONY : ExplodedView : Initialized');
  };

  ExplodedView.prototype = {

    constructor: ExplodedView,

    init: function() {
      var self = this;

      self.setVars();

      self.$el.on('mouseenter', 'a.explode', function( event ) {
        log('Teasing');
        if(!self.teasing && !self.expanded) {
          self.teasing = true;
          $('.piece', self.$el).addClass('tease');
        }
      });

      self.$el.on('mouseleave', 'a.explode', function( event ) {
        log('Leave Teasing');
        if(self.teasing && !self.expanded) {
          $('.piece', self.$el).removeClass('tease');
          self.teasing = false;
        }
      });

      // Probably set some variables here
      self.$el.on( 'click', 'a.explode', function( event ) {
        event.preventDefault();
        log('Exploding');
        if(self.expanded) {
          $('.piece', self.$el).removeClass('exploded');
          $('.explode', self.$el).removeClass('open');
          //$('.intro', self.$el).show();
          $('.intro', self.$el).removeClass('out');
          self.expanded = false;
        }
        else {
          $('.explode', self.$el).addClass('open');
          $('.piece', self.$el).addClass('exploded').removeClass('tease');
          //$('.intro', self.$el).hide();
          $('.intro', self.$el).addClass('out');

          self.expanded = true;
        }
      } );

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
      var self = this;
      self.expanded = false;
      self.teasing = false;
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
  ExplodedView.options = {};

  // These are not overridable when instantiating the module
  ExplodedView.settings = {
    isDesktop: false,
    isMobile: false
  };

  return module;
});
