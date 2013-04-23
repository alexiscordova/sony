
// Product Summary Module
// --------------------------------------------
//
// * **Class:** ProductSummary
// * **Version:** 0.1
// * **Modified:** 04/09/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, Modernizr, Enquire, sony-stickynav, simplescroll

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      Utilities = require('require/sony-global-utilities'),
      sonyStickyNav = require('secondary/index').sonyStickyNav,
      jquerySimpleScroll = require('secondary/index').jquerySimpleScroll;

  var module = {
    init: function() {
      var $psModule = $('.ps-module');

      if ( $psModule.length ) {
        new ProductSummary( $psModule[0] );
      }
    }
  };

  var ProductSummary = function( element ) {

    var self = this;

    self.isDesktop = false;
    self.isTablet = false;
    self.isMobile = false;

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
      self.$dropdown = self.$el.find('.dropdown-menu');
      self.$shareLink = self.$dropdown.find('input');
      self.$textSwaps = self.$el.find('[data-long-text]');
      self.$blockBtns = self.$el.find('.btn-block');
      self.$stickyTitle = self.$stickyNav.find('.sticky-nav-title');
      self.$stickyPriceText = self.$stickyNav.find('.price-text');
      self.$modal = self.$el.find('#share-tool');

      self.$span1AtTablet = self.$el.find('#span1-at-tablet');
      self.$span3AtTablet = self.$el.find('#span3-at-tablet');

      self.$favoriteBtn.on('click', $.proxy( self._onFavorite, self ));
      self.$shareBtn.on('click', $.proxy( self._onShare, self ));

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
        .register('(min-width: 48em) and (max-width: 61.1875em)', {
          match: function() {
            self._setupTablet();
          }
        })
        .register('(min-width: 61.25em)', {
          match: function() {
            self._teardownTablet();
          }
        })
        .register('(max-width: 47.9375em)', {
          match: function() {
            self._setupMobile();
          }
        });

      } else {
        self._setupDesktop();
      }

      self._onResize();

      // Setup that can be deferred
      setTimeout(function() {
        Utilities.autoSelectInputOnFocus( self.$shareLink );

        // Init sticky nav
        self.$stickyNav.stickyNav({
          $jumpLinks: self.$jumpLinks,
          offset: 0,
          offsetTarget: self.$el.find('.jump-links:not(.nav)')
        });

        iQ.update();
      }, 0);
    },

    _onResize : function() {
      var self = this;

      if ( !self.isMobile ) {
        self.$evenCols.evenHeights();
      }
    },

    _onFavorite : function( evt ) {
      var self = this;

      evt.preventDefault();
    },

    _onShare : function( evt ) {
      var self = this;

      // Uses a modal instead of dropdown
      if ( self.isMobile ) {
        evt.preventDefault();
        // Don't let the dropdown handler receive this event
        evt.stopImmediatePropagation();

        self.$modal.modal( {backdropClass: 'dark'} );
      }
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

    _swapDomElements : function( toDesktop ) {
      var self = this,
          $price,
          $msrp;

      self.$stickyPriceText.detach();
      $price = self.$stickyPriceText.find('.price');
      $msrp = self.$stickyPriceText.find('.msrp').detach();

      if ( toDesktop ) {
        $msrp.insertBefore( $price );
        self.$stickyNav.find('#desktop-sticky-price').append( self.$stickyPriceText );
      } else {
        $msrp.insertAfter( $price );
        self.$stickyTitle.after( self.$stickyPriceText );
      }

    },

    _hideShareDialog : function( toDesktop ) {
      var $closer = toDesktop ? $('.modal-backdrop') : Settings.$document;
      $closer.trigger('click');
    },

    _setupDesktop : function() {
      var self = this;

      self.isMobile = false;
      self.isDesktop = true;

      // Hide dropdown or modal if it's active
      self._hideShareDialog( true );

      self._swapTexts( true );
      self._swapDomElements( true );
    },

    _setupTablet : function() {
      var self = this;

      self.isTablet = true;

      self.$span1AtTablet.removeClass( 'span2' ).addClass( 'span1' );
      self.$span3AtTablet.removeClass( 'span2' ).addClass( 'span3' );
    },

    _teardownTablet : function() {
      var self = this;


      if ( self.isTablet ) {
        // Spans need to be reset
        self.$span1AtTablet
          .add( self.$span3AtTablet )
            .removeClass('span1 span3')
            .addClass('span2');
      }

      self.isTablet = false;

    },

    _setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      self.isMobile = true;
      self.isDesktop = false;

      // Hide dropdown or modal if it's active
      self._hideShareDialog( false );

      self._swapTexts( false );
      self._swapDomElements( false );

      if ( wasDesktop ) {
        // If this was originally setup desktop, there will be heights set on the columns
        self.$evenCols.css('height', '');
        self._teardownTablet();
      }
    }
  };

  return module;

});
