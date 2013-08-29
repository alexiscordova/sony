
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
      Favorites = require('secondary/index').sonyFavorites,
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

      self.setVars();

      Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      self.setupBreakpoints();

      self._onResize();

      // Setup that can be deferred
      setTimeout(function() {
        self.lazyInit();
      }, 0);
    },

    setVars : function() {
      var self = this;

      self.$stickyNav = self.$el.find('.sticky-nav');
      self.$jumpLinks = self.$el.find('.jump-links a');
      self.$evenCols = self.$el.find('.js-even-cols').children();
      self.$shareBtn = self.$el.find('.js-share');
      self.$dropdown = self.$el.find('.dropdown-menu');
      self.$shareLink = self.$dropdown.find('input');
      self.$blockBtns = self.$el.find('.btn-block');
      self.$stickyTitle = self.$stickyNav.find('.sticky-nav-title');
      self.$stickyPriceText = self.$stickyNav.find('.price-text');
      self.$modal = self.$el.find('#share-tool');

      self.$span1AtTablet = self.$el.find('#span1-at-tablet');
      self.$span3AtTablet = self.$el.find('#span3-at-tablet');

      self.$shareBtn.on('click', $.proxy( self._onShare, self ));
    },

    setupBreakpoints : function() {
      var self = this;

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
    },

    lazyInit : function() {
      var self = this,
          $stickyImg = self.$stickyNav.find('.iq-img');

      function stickyNavImgLoaded() {
        // Throw it in a timeout to be sure the image has loaded,
        // and the sticky nav has a new height
        setTimeout(function() {
          Utilities.forceWebkitRedraw();
          self.$stickyNav.stickyNav('refreshOffset');
        }, 0);
      }

      Utilities.autoSelectInputOnFocus( self.$shareLink );

      // Init sticky nav
      self.$stickyNav.stickyNav({
        $jumpLinks: self.$jumpLinks,
        offset: 0,
        offsetTarget: $.proxy( self.getStickyNavTriggerMark, self ),
        scrollToTopOnClick: true
      });

      if ( $stickyImg.length ) {
        if ( $stickyImg.data('hasLoaded') ) {
          stickyNavImgLoaded();
        } else {
          $stickyImg.on( 'imageLoaded', stickyNavImgLoaded );
        }
      }

      // Scroll to a hash if it's present
      $.simplescroll.initial();

      // Prevent default on .js-prevent-default
      self.$el.find('.js-prevent-default').on( 'click', false );

      self._initFavorites();

      iQ.update();

      // Hack due to some environments not knowing what to do with the iQ image
      // in this `StickyNav`. Waits three seconds after the nav opens and force-loads
      // the image in if iQ won't. Obviously not ideal, but trying to avoid
      // deconstructing this module / the `StickyNav` component.

      self.$stickyNav.on('SonyStickyNav:open', function(){
        setTimeout(function(){
          if ( !$stickyImg.attr('src') ) {
            var $newImage = $('<img/>');
            $newImage.attr('src', $stickyImg.data('src-phone'));
            $stickyImg.parent().append($newImage);
            $stickyImg.remove();
          }
        }, 3000);
      });
    },

    getStickyNavTriggerMark : function() {
      return this.$el.next().offset().top - this.$stickyNav.outerHeight();
    },

    _onResize : function() {
      var self = this;

      if ( !self.isMobile ) {
        self.$evenCols.evenHeights();
      }
    },

    _initFavorites : function() {
      this.favorites = new Favorites( this.$el, {
        itemSelector: '[itemscope]',
        tooltip: false
      });
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
        $price.addClass('p1').removeClass('p2');
        self.$stickyTitle.addClass('t6').removeClass('t7');
      } else {
        $msrp.insertAfter( $price );
        self.$stickyTitle.after( self.$stickyPriceText );
        $price.addClass('p2').removeClass('p1');
        self.$stickyTitle.addClass('t7').removeClass('t6');
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
