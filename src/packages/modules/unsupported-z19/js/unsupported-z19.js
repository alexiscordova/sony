// Unsupported Browsers (UnsupportedBrowsers) Module.
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 05/05/2013
// * **Author:** Mark Ernst
// * **Dependencies:** jQuery 1.7+, Bootstrap

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      bootstrap = require('bootstrap');

  var module = {
    init: function() {
      var element = $('.modal-unsupported');

      if ( element ) {
        new UnsupportedBrowsers(element);
      }

      // temporary click event for modal demo
      $('.launch-modal').on('click', function( evt ) {
        evt.preventDefault();
        Environment.trigger('unsupportedbrowser');
      });
    }
  };

  var UnsupportedBrowsers = function(element) {
    var self = this;
    self.$el = element;

    self.init();

    log('SONY : UnsupportedBrowsers : Initialized');
  };

  UnsupportedBrowsers.prototype = {

    constructor: UnsupportedBrowsers,

    init: function() {
      var self = this;
      self.$modal = self.$el;
      self.bind();
    },

    bind: function() {
      var self = this;

      // Close buttons
      self.$el.find('.close-modal').on('click', function( evt ) {
        evt.preventDefault();
        self.closeModal();
      });

      // When `unsupportedbrowser` is triggered, launch the modal
      Environment.on('unsupportedbrowser', $.proxy( self.launchModal, self ) );

      // Listen for global resize
      Environment.on('global:resizeDebounced', $.proxy( self.measureModal, self ));
    },

    isModalOpen : function() {
      return Settings.$body.hasClass('modal-open');
    },

    launchModal: function() {
      var self = this;
      self.$modal.modal();
      self.measureModal();
    },

    measureModal: function() {
      // If the modal isn't open, don't calculate anything!
      if ( !this.isModalOpen() ) {
        return;
      }

      var self = this,
          isTablet = Modernizr.mq( '(min-width: 48em) and (max-width: 61.1875em)' ),
          modalHeight,
          modalWidth;

      if ( isTablet ) {
        modalHeight = self.$modal.height();
        modalWidth = self.$modal.width();
        self.positionModal( modalWidth, modalHeight );

      } else {
        self.resetModal();
      }
    },

    positionModal: function(width, height) {
      this.$modal.css({
        'margin-top': -height / 2,
        'margin-left': -width / 2
      });
    },

    closeModal: function() {
      this.$modal.modal('hide');
    },

    resetModal: function() {
      this.$modal.css({
        'margin-top': '',
        'margin-left': ''
      });
    }
  };

  return module;
});
