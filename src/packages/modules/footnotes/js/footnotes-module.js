
// Footnotes Module
// ---------------------------------------
//
// * **Class:** Footnotes Module
// * **Version:** 0.1
// * **Modified:** 03/27/2013
// * **Author:** Steve Davis
// * **Maintainer:** George Pantazis
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Router = require('require/sony-global-router');

  var module = {
    'init': function() {
      $('.footnotes-wrapper').each(function(){
        new Footnotes(this);
      });
    }
  };

  var Footnotes = function(element){

    var self = this;

    self.$el = $(element);

    self.init();

    log('SONY : Footnotes : Initialized');
  };

  Footnotes.prototype = {

    constructor: Footnotes,

    init: function() {

      var self = this;
      self.renderDesktop();

      Router.on('footnotes(/:a)', $.proxy(self.onRouteMatch, self));
    },

    renderDesktop: function() {

      var self = this;

      self.$el.on('click', 'h2', function(){
        if ( self.$el.hasClass('open') ) {
          self.closeNav();
        } else {
          self.openNav();
        }
      });
    },

    openNav: function() {

      var self = this;

      self.$el.addClass('open').find('.list').slideDown(200);
    },

    closeNav: function() {

      var self = this;

      self.$el.removeClass('open').find('.list').slideUp(200);
    },

    onRouteMatch: function(which) {

      var self = this;

      self.openNav();

      if ( !which ) {
        which = 1;
      }

      $(window).scrollTop(self.$el.find('li').eq(which-1).offset().top - 200);
    }
  };

  return module;

});
