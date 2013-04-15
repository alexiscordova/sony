
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

    self.spanClasses = 'span12 span8 span6 span4';
    self.contentWidthClasses = 'content-12 content-8 content-6 content-4';

    self.init();

    self.$images.on('iQ:imageLoaded', function(){
      $(this).closest('.st-item').addClass('on');
    });

    self.$images.addClass('iq-img');

    if ( !Settings.$html.hasClass('lt-ie10') ){

      enquire.register("(min-width: 768px)", function() {
        self.renderDesktop();
      });
      enquire.register("(max-width: 767px)", function() {
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

        var $this = $(this),
            matchedClasses = this.className.split(' ').filter(function(a){
              return a.search('span') === 0;
            });

        $this.data('contentWidthContainers', $this.find('.content-12, .content-8, .content-6, .content-4'));
        $this.data('originalWidth', matchedClasses[0].split('span')[1]);
      });
    },

    // Create or restore the default slide layout.

    renderDesktop: function(which) {

      var self = this;

      self.$items.each(function(){

        var $this = $(this),
            originalWidth = $this.data('originalWidth'),
            $headline = $this.find('h4');

        $this.removeClass(self.spanClasses).addClass('span' + originalWidth);

        if ( originalWidth === '12' || originalWidth === '8' ) {
          $headline.removeClass('t4').addClass('t3');
        }

        $this.data('contentWidthContainers')
             .add($this)
             .removeClass(self.contentWidthClasses)
             .addClass('content-' + originalWidth);
      });
    },

    renderEvenColumns: function(colPerItem) {

      var self = this;

      self.$items.each(function(){

        var $this = $(this),
            $headline = $this.find('h4');

        if ( $this.data('originalWidth') === '12' ) {
          return;
        }

        $this.removeClass(self.spanClasses).addClass('span' + colPerItem);

        $this.data('contentWidthContainers')
             .add($this)
             .removeClass(self.contentWidthClasses)
             .addClass('content-' + colPerItem);

        $headline.removeClass('t3').addClass('t4');
      });
    }
  };

  return module;

});
