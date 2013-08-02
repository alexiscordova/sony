// Editorial Anchor Links
// --------------------------------------------
//
// * **Class:** EditorialAnchorLinks
// * **Version:** 1.0
// * **Modified:** 07/29/2013
// * **Author:** Christopher J Mischler
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

define(function(require){

  'use strict';

  var $ = require('jquery'),
    Modernizr = require('modernizr'),
    iQ = require('iQ'),
    enquire = require('enquire'),
    Settings = require('require/sony-global-settings'),
    Environment = require('require/sony-global-environment'),
    Utilities = require('require/sony-global-utilities'),
    sonyStickyNav = require('secondary/index').sonyStickyNav,
    sonyStickyTabs = require('secondary/index').sonyStickyTabs,
    jquerySimpleScroll = require('secondary/index').jquerySimpleScroll;

  var module = {
    init: function() {
      var $ealModule = $('.editorial-anchor-links-wrapper');
      if ( $ealModule.length > 0 ) {
        new EditorialAnchorLinks( $ealModule[0] );
      }
    }
  };

  // Start module
  var EditorialAnchorLinks = function(element){

    var self = this;

    self.isDesktop = false;
    self.isTablet = false;
    self.isMobile = false;
    self.iScrollActive = false;

    self.$el = $( element );
    console.log("self.$el: " , self.$el);
    self.init();

    log('SONY : EditorialAnchorLinks : Initialized');
  };

  EditorialAnchorLinks.prototype = {

    constructor: EditorialAnchorLinks,

    init: function(){
      var self = this;

      self.setVars();

      Environment.on('global:resizeDebounced', $.proxy( self._onResize, self ));

      self.setupBreakpoints();

      self._onResize();

      // Setup that can be deferred
      setTimeout(function() {
        self.lazyInit();
      }, 0);

      // self.$stickyNav = self.$el.find('.editorial-anchor-links-sticky-nav');
      // self.$jumpLinks = self.$stickyNav.find('.editorial-anchor-link-btn');

      // self.stickyNavHeight = self.$stickyNav.outerHeight();

      // console.log("self.stickyNavHeight: " + self.stickyNavHeight);

      // // var btn = self.$el.find('.editorial-anchor-links-btn');

      // // if ( btn.length > 0 ) {
      // //   self.setupButtons( btn );
      // // }
      // self._initStickyNav();
    },

    setVars : function() {
      var self = this;

      self.$stickyNav = self.$el.find('.sticky-nav');
      self.$jumpLinks = self.$el.find('.jump-links a');

      // console.log("self.$stickyNav: " , self.$stickyNav);
      // console.log("self.$jumpLinks: " , self.$jumpLinks);
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
        })
        .register('(max-width: 39.9375em)', {
          match: function() {
            self._setupMobileNav();
          }
        })
        .register('(min-width: 40em)', {
          match: function() {
            self._teardownMobileNav();
          }
        });

      } else {
        self._setupDesktop();
      }
    },

    lazyInit : function() {
      console.log("lazyInit");
      var self = this;

      // Init sticky nav
      self.$stickyNav.stickyNav({
        $jumpLinks: self.$jumpLinks,
        offset: 0,
        offsetTarget: $.proxy( self.getStickyNavTriggerMark, self ),
        scrollToTopOnClick: false
      });

      // Scroll to a hash if it's present
      $.simplescroll.initial();
    },

    getStickyNavTriggerMark : function() {
      var triggerMark = this.$el.next().offset().top - this.$stickyNav.outerHeight();
      // console.log("#getStickyNavTriggerMark - triggerMark: " + triggerMark);
      return triggerMark;
    },

    _onResize: function(){
      var self = this;
      console.log("#EditorialAnchorLinks ##RESIZE##");
      if (self.isMobileNav){
        setTimeout(function(){
          self._checkMobileNavWidth();
        },250);
      }
    },

    _setupDesktop : function() {
      var self = this;

      self.isMobile = false;
      self.isDesktop = true;
    },

    _setupTablet : function() {
      var self = this;

      self.isTablet = true;
    },

    _teardownTablet : function() {
      var self = this;

      self.isTablet = false;
    },

    _setupMobile : function() {
      var self = this,
          wasDesktop = self.isDesktop;

      self.isMobile = true;
      self.isDesktop = false;

      if ( wasDesktop ) {
        self._teardownTablet();
      }
    },

    _setupMobileNav : function() {
      var self = this;

      self.$el.addClass('editorial-anchor-links--mobile-nav');
      self.isMobileNav = true;

      console.log("_setupMobileNav");
    },

    _teardownMobileNav : function() {
      var self = this;

      self.$el.removeClass('editorial-anchor-links--mobile-nav');
      self.isMobileNav = false;

      self.$el.find('.grid.jump-links').parent().css({ 'width':'' , 'margin':'' });

      console.log("_teardownMobileNav");
    },

    _checkMobileNavWidth : function(){
      var self = this;

      // can prob move this to init
      // self.$el.find('.grid.jump-links').css({ 'width' : buttonsWidth + 1 + 'px'  ,  'margin' : '0 auto' });

      self.$el.find('.grid.jump-links').parent().css({ 'width':'' , 'margin':'' });

      // see if we need the stickyTabs, and if not, center the buttons.
      // First only grab the staticNav (not the stickyNav)
      var $staticNav = self.$el.find('.editorial-anchor-links').not('.sticky-nav');
      var buttonsWidth = 0;
      $staticNav.find('li').each(function(){
        buttonsWidth += $(this).outerWidth(true);
      });
      // if the buttons are less wide than the container, center them; otherwise activate stickyTabs if not already active.
      if ( buttonsWidth < self.$el.outerWidth()){
        // center the buttons, no iScroll
        // console.log("##CENTER BUTTONS");
        if (self.iScrollActive){
          self._destroyMobileNavIScroll();
        }
        self.$el.find('.grid.jump-links').parent().css({ 'width' : buttonsWidth + 1 + 'px'  ,  'margin' : '0 auto' });
      } else {
        // iScroll the buttons
        // console.log("##STICKY TABS");
        // self.$el.find('.grid.jump-links').css({ 'width':'' , 'margin':'' });
        self.$el.find('.grid.jump-links').parent().css({ 'width' : buttonsWidth + 1 + 'px'  ,  'margin' : '0 auto' });

        if (!self.iScrollActive){
          self.$el.find('.editorial-anchor-links').each(function(){
            self._initMobileNavIScroll($(this));
          });
        }
      }
    },


    _initMobileNavIScroll : function( $nav ) {
      var self = this;
      self.iScrollActive = true;

      // This needs to be split out, so that left is only shown if there is something scrolled off the left side of the screen, & vise versa.
      self.$el.addClass("iscroll-active iscroll-active-right");
      console.log("_initMobileNavIScroll");

      // var debounceUpdate = $.debounce( 280, $.proxy( self._updateIScrollShadows, self ) );

      self.mobileNavIScroll = new IScroll( 'editorial-anchor-links--static-nav', {
        vScroll : false,
        hScroll : true,
        hScrollbar : false,
        snap : false,
        momentum : true,
        fadeScrollbar: false,
        bounce : true,
        onScrollMove: function() {
          self._setOverflowClasses( this.x, this.maxScrollX + 3 );
        },
        onScrollStart: function() {
          self._setOverflowClasses( this.x, this.maxScrollX + 3 );
        }
      });
    },

    _setOverflowClasses : function( currentX, maxX ) {
      console.log("_setOverflowClasses");
      var self = this,
          overflowLeftClass = 'iscroll-active-left',
          overflowRightClass = 'iscroll-active-right',
          hadContentLeft = self.$el.hasClass( overflowLeftClass ),
          hadContentRight = self.$el.hasClass( overflowRightClass );

      // Overflow left
      if ( currentX < -3 && !hadContentLeft ) {
        self.$el.addClass( overflowLeftClass );
      } else if ( currentX >= -3 && hadContentLeft ) {
        self.$el.removeClass( overflowLeftClass );
      }

      // Overflow right
      if ( currentX >= maxX && !hadContentRight ) {
        self.$el.addClass( overflowRightClass );
      } else if ( currentX <= maxX && hadContentRight ) {
        self.$el.removeClass( overflowRightClass );
      }
    },

    _destroyMobileNavIScroll : function() {
      var self = this;
      console.log("_destroyMobileNavIScroll");

      if ( !!self.mobileNavIScroll ) {
        self.mobileNavIScroll.destroy();
      }

      self.$el.removeClass("iscroll-active iscroll-active-left iscroll-active-right");

      self.iScrollActive = false;

      // var globalNav = $('.nav-wrapper').data('globalNav');
      // if ( !!globalNav.mobileNavIScroll ) {
      //   globalNav.mobileNavIScroll.destroy();
      // }
      // globalNav.mobileNavIScroll = false;
      // globalNav.$pageWrapOuter.css('height', '');
    }

  };

  // Plugin definition
  $.fn.editorialAnchorLinks = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        editorialAnchorLinks = self.data('editorialAnchorLinks');

      // If we don't have a stored moduleName, make a new one and save it
      if ( !editorialAnchorLinks ) {
          editorialAnchorLinks = new EditorialAnchorLinks( self, options );
          self.data( 'editorialAnchorLinks', editorialAnchorLinks );
      }

      if ( typeof options === 'string' ) {
        editorialAnchorLinks[ options ].apply( editorialAnchorLinks, args );
      }
    });
  };

  return module;

});
