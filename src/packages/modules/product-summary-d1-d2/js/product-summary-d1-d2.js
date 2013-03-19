
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
      self.$shareLink = self.$el.find('.dropdown-menu input');
      self.$textSwaps = self.$el.find('[data-long-text]');
      self.$blockBtns = self.$el.find('.btn-block');

      self.$favoriteBtn.on('click', $.proxy( self._onFavorite, self ));

      self._onResize();
      Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      // Save the short text value
      self.$textSwaps.each(function() {
        var $this = $(this),
            data = $this.data();

        data.shortText = $this.text();
        data.currentKey = 'shortText';
      });

      if ( Modernizr.mediaqueries ) {

        enquire.register('(min-width: 48em)', {
          match: function() {
            self._setupDesktop();
          }
        })
        // .register('(min-width: 480px) and (max-width: 779px)', {
        //   match: function() {
        //     console.log('(min-width: 480px) and (max-width: 779px)');
        //   }
        // })
        .register('(max-width: 47.9375em)', {
          match: function() {
            self._setupMobile();
          }
        });

      } else {
        self._setupDesktop();
      }

      // Setup that can be deferred
      setTimeout(function() {

        self.$shareLink.on('focus', function() {
          var input = this;

          // We use a timeout here because .select() will select everything,
          // then the default browser action will deselect our selection
          setTimeout(function() {
            input.select();
          }, 0);
        });

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

    _swapTexts : function( toLong ) {
      var self = this,
          key = (toLong ? 'long' : 'short') + 'Text';

      self.$textSwaps.each(function() {
        var $this = $(this),
            data = $this.data();

        if ( key !== data.currentKey ) {
          $this.text( data[ key ] );
          data.currentKey = key;
        }
      });
    },

    _swapBlockBtns : function( toBlock ) {
      var self = this,
          blockClass = 'btn-block';

      self.$blockBtns.each(function() {
        var $btn = $(this);

        // Has .btn-block class
        if ( $btn.hasClass( blockClass ) ) {
          if ( !toBlock ) {
            $btn.removeClass( blockClass );
          }

        // Doesn't have .btn-block
        } else {
          if ( toBlock ) {
            $btn.addClass( blockClass );
          }
        }
      });
    },

    _setupDesktop : function() {
      var self = this;

      self._swapTexts( true );
      self._swapBlockBtns( false );
    },

    _setupMobile : function() {
      var self = this;

      self._swapTexts( false );
      self._swapBlockBtns( true );
    }
  };

  return module;

});
