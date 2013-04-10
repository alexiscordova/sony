
// Footnotes Module
// ---------------------------------------
//
// * **Class:** Footnotes Module
// * **Version:** 0.1
// * **Modified:** 03/27/2013
// * **Author:** Steve Davis
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery');

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

    },

    renderDesktop: function() {

      var self = this;

      //On header click, slide toggle the footnotes list
      self.$el.on('click', 'h2', function(){
        self.$el.toggleClass('open')
          .find('.list').slideToggle(200);
      });

    }
  };

  return module;

});
