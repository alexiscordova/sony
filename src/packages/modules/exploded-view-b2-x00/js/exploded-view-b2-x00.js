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

      if( !self.hasTouch ) {

        self.$el.on( 'mouseenter', 'a.cta', function( event ) {
          log( 'Teasing' );
          if( !self.isTeasing && !self.isExpanded ) {
            self.isTeasing = true;
            $( '.piece', self.$el ).addClass( 'quick' ).addClass( 'tease' );
          }
        });

        self.$el.on( 'mouseleave', 'a.cta', function( event ) {
          log( 'Leave Teasing' );
          if( self.isTeasing && !self.isExpanded ) {
            $( '.piece', self.$el ).removeClass( 'tease' );
            self.isTeasing = false;
          }
        });

      }

      // Probably set some variables here
      self.$el.on( 'click', 'a.cta', function( event ) {

        event.preventDefault();

        if( self.isExpanded ) {
          $( '.callout', self.$el ).removeClass( 'in' );
          $( '.detail', self.$el ).removeClass( 'in' );
          $( '.piece', self.$el ).removeClass( 'exploded' );
          $( '.cta', self.$el ).addClass( 'out' );
          setTimeout( function() {
            $( '.intro', self.$el ).removeClass( 'out' );
            $( '.cta', self.$el ).removeClass( 'open' ).removeClass( 'out' );
          }, 900);
          self.isExpanded = false;
        }
        else {
          $( '.cta', self.$el ).addClass( 'out' );
          setTimeout( function() {
            $( '.cta', self.$el ).addClass( 'open' ).removeClass( 'out' );
            $( '.detail', self.$el ).addClass( 'in' );
            $( '.callout', self.$el ).addClass( 'in' );
          }, 800);
          $( '.piece', self.$el ).removeClass( 'quick' ).addClass( 'exploded' ).removeClass( 'tease' );
          $( '.intro', self.$el ).addClass( 'out' );
          self.isExpanded = true;
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

      self.isExpanded = false;
      self.isTeasing = false;

      // Modernizr vars
      self.hasTouch = Modernizr.touch;

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
