// Demo Module
// --------------------------------------------
//
// * **Class:** ExplodedView
// * **Version:** 1.0
// * **Modified:** 08/01/2013
// * **Author:** Ryan Mauer
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
      self.setupCTA();

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

      // State variables
      self.isExpanded = false;
      self.isTeasing = false;

      // DOM elements
      self.$cta     = $( '.cta', self.$el );
      self.$pieces  = $( '.piece', self.$el );
      self.$intro   = $( '.intro', self.$el );
      self.$callout = $( '.callout', self.$el );
      self.$detail  = $( '.detail', self.$el );

      // Modernizr vars
      self.hasTouch = Modernizr.touch;

    },

    // Setup desktop.
    setupDesktop : function() {
      var self = this,
          wasMobile = self.isMobile;

      if ( wasMobile ) {

      }

      self.isDesktop = true;
      self.isMobile = false;
    },

    // Setup mobile.
    setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      if ( wasDesktop ) {

      }

      self.isDesktop = false;
      self.isMobile = true;
    },

    // Bind events on the CTA
    setupCTA : function() {
      var self = this;

      // Hovering the CTA on non-touch devices displays the exploded elements in a "tease" state
      // to entice the user to click
      if( !self.hasTouch ) {

        self.$el.on( 'mouseenter', 'a.cta', function( event ) {
          self.expandTease();
        });

        self.$el.on( 'mouseleave', 'a.cta', function( event ) {
          self.collapseTease();
        });
      }

      // Expand and collapse the exploded elements based on clicks on the CTA
      // and the current state
      self.$el.on( 'click', 'a.cta', function( event ) {
        event.preventDefault();
        if( self.isExpanded ) {
          self.collapse();
        }
        else {
          self.expand();
        }
      } );

    },

    // Expand the exploded elements and transition in the other expanded state elements
    expand : function() {
      var self = this;

      if( !self.isExpanded ) {
        // not already expanded so expand
        self.$cta.addClass( 'out' );
        setTimeout( function() {
          // wait before transitioning in the collapse CTA, detail box, and callout
          self.$cta
            .addClass( 'open' )
            .removeClass( 'out' );
          self.$detail.addClass( 'in' );
          self.$callout.addClass( 'in' );
        }, 800 );
        self.$pieces
          .removeClass( 'quick' )
          .addClass( 'exploded' )
          .removeClass( 'tease' );
        self.$intro.addClass( 'out' );
        self.isExpanded = true;
      }

    },

    // Collapse the exploded elements and transition in the other collapsed state elements
    collapse : function() {
      var self = this;
      // already expanded so collapse
      self.$callout.removeClass( 'in' );
      self.$detail.removeClass( 'in' );
      self.$pieces.removeClass( 'exploded' );
      self.$cta.addClass( 'out' );
      setTimeout( function() {
        // waith before transitioning in the intro and expand CTA
        self.$intro.removeClass( 'out' );
        self.$cta
          .removeClass( 'open' )
          .removeClass( 'out' );
      }, 900 );
      self.isExpanded = false;
    },

    // Expand the tease state if it is not already expanded and the module is not 
    // already in the expanded state
    expandTease : function() {
      var self = this;
      if( !self.isTeasing && !self.isExpanded ) {
        self.isTeasing = true;
        self.$pieces
          .addClass( 'quick' )
          .addClass( 'tease' );
      }
    },

    // Collapse the tease state if it is not already collapsed and the module
    // is not already in the expanded state
    collapseTease : function() {
      var self = this;
      if( self.isTeasing && !self.isExpanded ) {
        self.$pieces.removeClass( 'tease' );
        self.isTeasing = false;
      }
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
