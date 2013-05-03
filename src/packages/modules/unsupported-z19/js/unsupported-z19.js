define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      enquire = require('enquire');

  var module = {
    init: function() {
      var self = this;
      self.modalID = '#unsupported-browser-modal';
      self.$el = $('.modal-unsupported');
      self.bind();
    },
    bind: function(){
      var self = this;
      // temporary click event for modal demo
      $('.launch-modal').on('click', function(){
        self.launchModal(self.modalID);
      });

      $(window).resize($.proxy(self.measureModal, this));
    },
    launchModal: function(id){
      var self = this;
      $(id).modal();
      self.measureModal();
    },
    measureModal: function(){
      var self = this;
      var width = $(window).width();
      if (width > 767 && width < 980) {
        var bodyheight = self.$el.find('.modal-body').get(0).clientHeight;
        self.$el.addClass('tablet');
        self.$el.css({
          'max-height': '780px'
        });
        var modalheight = self.$el.height();
        var modalwidth = self.$el.width();
        var windowheight = $(window).height();
        self.positionModal(modalwidth, modalheight);
      } else {
        self.resetModal();
      }
    },
    positionModal: function(width, height){
      var self = this;
      self.$el.css({
        'margin-top': -height / 2,
        'margin-left': -width / 2
      });
    },
    resetModal: function(){
      var self = this;
      if (self.$el.hasClass('tablet')) {
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
