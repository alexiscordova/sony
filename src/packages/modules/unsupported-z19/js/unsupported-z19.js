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
      bootstrap = require('bootstrap');

  var module = {
    'init': function() {
      var self = this,
          element = $('.modal-unsupported');

      if ( element ) {
        new UnsupportedBrowsers(element);
      }
    }
  };

  var UnsupportedBrowsers = function(element) {
    var self = this;
    self.$el = $(element);
  };

  UnsupportedBrowsers.prototype = {
    init: function() {
      var self = this;
      self.$win = $(window);
      self.modalID = '#unsupported-browser-modal';

      self.bind();
    },

    bind: function() {
      var self = this;
      // temporary click event for modal demo
      $('.launch-modal').on('click', function() {
        self.launchModal(self.modalID);
      });

      self.$win.resize($.proxy(self.measureModal, this));
    },

    launchModal: function(id) {
      var self = this;
      $(id).modal();
      self.measureModal();
    },

    measureModal: function() {
      var self = this,
          width = self.$win.width();

      if ( width > 767 && width < 980 ) {
        var bodyheight = self.$el.find('.modal-body').get(0).clientHeight;
        self.$el.addClass('tablet');
        self.$el.css({
          'max-height': '780px'
        });
        var modalheight = self.$el.height(),
            modalwidth = self.$el.width(),
            windowheight = self.$win.height();

        self.positionModal(modalwidth, modalheight);
      } else {
        self.resetModal();
      }
    },

    positionModal: function(width, height) {
      var self = this;
      self.$el.css({
        'margin-top': -height / 2,
        'margin-left': -width / 2
      });
    },

    resetModal: function() {
      var self = this;
      if ( self.$el.hasClass('tablet') ) {
        self.$el.removeClass('tablet');
      }

      self.$el.css({
        'margin-top': '',
        'margin-left': ''
      });
    }
  };

  return module;
});
