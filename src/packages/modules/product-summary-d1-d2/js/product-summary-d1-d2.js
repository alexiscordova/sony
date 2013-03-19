
// Product Summary Module
// --------------------------------------------
//
// * **Class:** ProductSummary
// * **Version:** 0.1
// * **Modified:** 03/15/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyStickyNav = require('secondary/index').sonyStickyNav,
      jquerySimpleScroll = require('secondary/index').jquerySimpleScroll;

  var module = {
    init: function() {
      new ProductSummary( $('.product-summary-module')[0] );
    }
  };

  var ProductSummary = function( element ) {

    var self = this;

    self.$el = $( element );
    self.init();

    log('SONY : ProductSummary : Initialized');
  };

  ProductSummary.prototype = {

    constructor: ProductSummary,

    init: function() {
      var self = this;

      self.$stickyNav = self.$el.find('.sticky-nav');
      self.$jumpLinks = self.$el.find('.jump-links a');
      self.$evenCols = self.$el.find('.js-even-cols').children();
      self.$favoriteBtn = self.$el.find('.js-favorite');
      self.$shareBtn = self.$el.find('.js-share');


      if ( Modernizr.mediaqueries ) {

        enquire.register('(min-width: 780px)', {
          match: function() {
            console.log('min-width: 780px');
          }
        })
        .register('(min-width: 480px) and (max-width: 779px)', {
          match: function() {
            console.log('(min-width: 480px) and (max-width: 779px)');
          }
        })
        .register('(max-width: 479px)', {
          match: function() {
            console.log('(max-width: 479px)');
          }
        });

      } else {
        console.log('desktoppy');
      }

      self.$favoriteBtn.on('click', $.proxy( self._onFavorite, self ));
      self.$shareBtn.on('click', $.proxy( self._onShare, self ));

      self._onResize();
      Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      setTimeout(function() {

        // Init sticky nav
        self.$stickyNav.stickyNav({
          $jumpLinks: self.$jumpLinks,
          offset: self.stickyNavHeight + 10,
          offsetTarget: self.$el.find('.jump-links:not(.nav)')
        });

        iQ.update();
      }, 0);
    },

    _onResize : function() {
      var self = this;

      self.$evenCols.evenHeights();
      self.stickyNavHeight = self.$stickyNav.height();
    },

    _onFavorite : function( evt ) {
      var self = this;

      evt.preventDefault();
    },

    _onShare : function( evt ) {
      var self = this;

      evt.preventDefault();
    }
  };

  return module;

});
