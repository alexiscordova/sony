// Light Compare Module.
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 05/07/2013
// * **Author:** Mark Ernst
// * **Dependencies:** jQuery 1.7+, Bootstrap

define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      sonyStickyTabs = require('secondary/index').sonyStickyTabs;

  var module = {
    'init': function() {
      var self = this,
          element = $('.modal-light-compare');

      if ( element ) {
        new LightCompare(element);
      }
    }
  };

  var LightCompare = function(element) {
    var self = this;
    self.$el = $(element);
    self.init();

    log('SONY : LightCompare : Initialized');
  };

  LightCompare.prototype = {
    constructor: LightCompare,

    init: function() {
      var self = this;
      self.$win = $(window);
      self.modalID = '#light-compare-modal';
      self.bind();
    },

    bind: function() {
      var self = this;

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

      if ( width > 767 ) {
        var bodyheight = self.$el.find('.modal-body').get(0).clientHeight;

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

      self.$el.css({
        'margin-top': '',
        'margin-left': ''
      });
    }
  };

  return module;
});
