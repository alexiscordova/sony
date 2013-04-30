define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      enquire = require('enquire');

  var module = {
    init: function() {
      this.modalID = '#unsupported-browser-modal';
      this.$modal = $('.modal-unsupported');
      this.bind();
    },
    bind: function(){
      var self = this;
      // temporary click event for modal demo
      $('.launch-modal').on('click', function(){
        self.launchModal(self.modalID);
      });

      $(window).resize($.proxy(this.measureModal, this));
    },
    launchModal: function(id){
      $(id).modal();
      this.measureModal();
    },
    measureModal: function(){
      var width = $(window).width();
      if (width > 767 && width < 980) {
        var bodyheight = $('.modal-body').get(0).clientHeight;
        this.$modal.addClass('tablet');
        $('.tablet').css({
          'max-height': '780px'
        });
        var modalheight = this.$modal.height();
        var modalwidth = this.$modal.width();
        var windowheight = $(window).height();
        console.log(bodyheight);
        this.positionModal(modalwidth, modalheight);
      } else {
        this.resetModal();
      }
    },
    positionModal: function(width, height){
      this.$modal.css({
        'margin-top': -height / 2,
        'margin-left': -width / 2
      });
    },
    resetModal: function(){
      if (this.$modal.hasClass('tablet')) {
        this.$modal.removeClass('tablet');
      }
      this.$modal.css({
        'margin-top': '',
        'margin-left': ''
      });
    }
  };

  return module;

});
