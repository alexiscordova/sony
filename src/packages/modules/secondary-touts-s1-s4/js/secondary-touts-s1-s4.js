
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
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings');

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
    self.$items = self.$el.find('.st-item');

    self.init();

    self.$images.on('iQ:imageLoaded', function(){
      $(this).closest('.st-item').addClass('on');
    });

    self.$images.addClass('iq-img');

    if ( !Settings.$html.hasClass('lt-ie10') ){

      enquire.register("(min-width: 780px)", function() {
        self.renderDesktop();
      });
      enquire.register("(max-width: 779px)", function() {
        self.renderEvenColumns(6);
      });

    } else {
      self.renderDesktop();
    }
  };

  SecondaryTouts.prototype = {

    constructor: SecondaryTouts,

    init: function() {
      var self = this;

      self.$items.each(function(){

        var matchedClasses = this.className.split(' ').filter(function(a){
          return a.search('span') === 0;
        });

        $(this).data('originalWidth', matchedClasses[0]);
      });
    },

    // Create or restore the default slide layout.

    renderDesktop: function(which) {

      var self = this;

      self.$items.each(function(){

        var $this = $(this);

        $this.removeClass('span12 span8 span6 span4').addClass($this.data('originalWidth'));
      });
    },

    renderEvenColumns: function(colPerItem) {

      var self = this;

      self.$items.each(function(){

        var $this = $(this);

        if ( $this.data('originalWidth') === 'span12' ) {
          return;
        }

        $this.removeClass('span12 span8 span6 span4').addClass('span' + colPerItem);
      });
    }
  };

  return module;

});
