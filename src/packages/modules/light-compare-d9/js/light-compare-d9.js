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
      Settings = require('require/sony-global-settings'),
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
      self.modalID = 'light-compare-modal';
      self.hasTouch = Settings.hasTouchEvents || Settings.hasPointerEvents;
      self.useIScroll = self.hasTouch;
      if (self.useIScroll) {
        self.initiScroll();
      }

      var supportsOrientationChange = "onorientationchange" in window,
      orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
      if (window.addEventListener) {
        window.addEventListener(orientationEvent, function() {
          self.measureModal();
        }, false);
      }

      self.bind();
    },

    bind: function() {
      var self = this;

      $('.launch-modal').on('click', $.proxy(self.launchModal, self));
      self.$win.resize($.proxy(self.measureModal, this));

      if (self.useIScroll) {
        $('#' + self.modalID).on('shown', $.proxy(self.updateiScroll, self));
      }
    },

    launchModal: function() {
      var self = this;
      $('#' + self.modalID).modal();
      self.measureModal();
    },

    initiScroll: function() {
      var self = this;
      self.iscroll =  new IScroll(self.modalID);
      window.iscroll = self.iscroll;
    },

    updateiScroll: function(){
      var self = this;
      self.iscroll.refresh();
      self.iscroll.scrollTo();
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
