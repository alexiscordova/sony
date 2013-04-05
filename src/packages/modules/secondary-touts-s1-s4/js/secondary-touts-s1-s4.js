
// Secondary Touts (SecondaryTouts) Module
// --------------------------------------------
//
// * **Class:** SecondaryTouts
// * **Version:** 0.1
// * **Modified:** 04/04/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ');

  var module = {
    'init': function() {
      $('.secondary-tout').each(function(){
        new SecondaryTouts(this);
      });
    }
  };

  var SecondaryTouts = function(element){

    var self = this;

    self.$el = $(element);
    self.$images = self.$el.find('.st-image');
    self.init();

    self.$images.on('iQ:imageLoaded', function(){
      $(this).closest('.st-item').addClass('on');
    });

    self.$images.addClass('iq-img');
  };

  SecondaryTouts.prototype = {

    constructor: SecondaryTouts,

    init: function() {
      var self = this;
    }

  };

  return module;

});
