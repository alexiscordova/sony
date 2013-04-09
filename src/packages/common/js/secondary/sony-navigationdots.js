
// Sony Navigation Dots (SonyNavDots) Module
// --------------------------------------------
//
// * **Class:** SonyNavDots
// * **Version:** 0.1
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// *Notes:*
//
// This plugin creates a dot-based navigation, and exposes basic click events
// to let you program your module against the user's interaction.
//
// *Example - Create new instance with ten buttons, first button active:*
//
//      $('#foo').sonyNavDots({
//        'buttonCount': 10,
//        'activeButton': 0
//      });
//
// *Example - Reset the nav to only have five buttons:*
//
//      $('#foo').sonyNavDots('reset', {
//        'buttonCount': 5,
//      });
//
// *Example - Subscribe to a click inside the nav:*
//
//      $('#foo').on('SonyNavDots:clicked', function(e, whichWasClicked){
//        // Do something with whichWasClicked (0-based index).
//      });

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr');

  var SonyNavDots = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.sonyNavDots.defaults, options);

    self.$el = $element;
    self.init();
    return self;
  };

  SonyNavDots.prototype = {

    'constructor': SonyNavDots,

    'init': function() {

      var self = this;

      self.$navContainer = $('<div/>').addClass('pagination-bullets on');
      self.$buttonTemplate = $('<div/>').addClass('pagination-bullet');
      self.$buttonIcon = $('<i/>').addClass('fonticon-10-dot');

      self.$buttonTemplate.append(self.$buttonIcon);

      self.reset(self);
    },

    // If certain options were set or changed, go to the appropriate method.

    'reset': function(options) {

      var self = this;

      if (!options) {
        return;
      }

      $.extend(self, options);

      if ( typeof options.buttonCount !== 'undefined' ) {
        self.createButtons();
      }

      if ( typeof options.activeButton !== 'undefined' ) {
        self.setActiveButton();
      }
    },

    // Destroys the buttons if present, and replaces them with a fresh set using
    // the current self.buttonCount setting.

    'createButtons': function() {

      var self = this;

      if ( self.$buttons ) {
        self.$buttons.remove();
      }

      for ( var i = 0; i < self.buttonCount; i++ ) {
        self.$navContainer.append(self.$buttonTemplate.clone());
      }

      self.$buttons = self.$navContainer.children();
      self.$el.append( self.$navContainer );
      self.$buttons.on( Modernizr.touch ? 'touchend' : 'click', $.proxy(self.clickButton, self));
    },

    // On click, determine the index of the button, update the activeButton,
    // and broadcast the click to subscribers.

    'clickButton': function(e) {

      var self = this,
          $item = $(e.target).closest('.pagination-bullet');

      if ( $item.length ) {
        self.activeButton = $item.index();
        self.setActiveButton();
        e.preventDefault();
        self.$el.trigger('SonyNavDots:clicked', self.activeButton);
      }
    },

    // Set CSS classes for the new active button.

    'setActiveButton': function() {

      var self = this;

      self.$buttons.removeClass('bullet-selected');
      self.$buttons.eq(self.activeButton).addClass('bullet-selected');
    },

    destroy: function() {

      var self = this;

      self.$navContainer.remove();
    }
  };

  $.fn.sonyNavDots = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyNavDots = self.data('sonyNavDots');

      if ( !sonyNavDots ) {
          sonyNavDots = new SonyNavDots( self, options );
          self.data( 'sonyNavDots', sonyNavDots );
      }

      if ( typeof options === 'string' ) {
        sonyNavDots[ options ].apply( sonyNavDots, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyNavDots.defaults = {
    // How many buttons are in the navigation
    'buttonCount': 0,
    // Which button should be active by default
    'activeButton': 0
  };

});
