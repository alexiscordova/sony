// ------------ Sony Global Nav ------------
// Module: Global Nav
// Version: 1.0
// Modified: 2013-05-14 by Christopher Mischler
// Dependencies: jQuery 1.7+, Modernizr
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      Modernizr = require('modernizr'),
      enquire = require('enquire'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
      Hammer = require('plugins/index').hammer,
      formActions = require('secondary/form-actions');

  var module = {
    init: function() {
      $('#nav-wrapper').globalNav();
    }
  };

  // Start module
  var GlobalNav = function($container) {

    var self = this;
    self.usernameSpace = 40;
    self.minUsernameLength = 6;
    self.searchMenu = {};
    self.hasTouch = Settings.hasTouchEvents;
    self.$html = Settings.$html;
    self.$window = Settings.$window;
    self.$container = $container;
    self.$activeNavBtns = self.$container.find('.nav-dropdown-toggle');
    self.$searchBtn = self.$activeNavBtns.filter('[data-target="navmenu-w-search"]');
    self.$searchInput = $('#nav-search-input');
    self.$navbar = $('#navbar');
    self.$currentOpenNavBtn = false;
    self.$pageWrapOuter = $('#page-wrap-outer');
    self.$accountUsername = $('#nav-account-btn').find('.username');
    self.fullAccountUsername = self.$accountUsername.text();
    self.mobileNavIScroll = false;
    self.mobileNavVisible = false;
    self.mobileNavThreshold = 767;
    self.mobileFooterThreshold = 567;
    self.isSearchOpen = false;
    self.closeTimer = false;

    // A simple delay, in milliseconds, before the "out" function is called.
    // If the user mouses back over the element before the timeout has expired the
    // "out" function will not be called (nor will the "over" function be called).
    // This is primarily to protect against sloppy/human mousing trajectories that
    // temporarily (and unintentionally) take the user off of the target element...
    // giving them time to return.
    self.closeDelay = 200;
    self.closeDelaySearch = 2000;

    // The number of milliseconds hoverIntent waits between reading/comparing
    // mouse coordinates. When the user's mouse first enters the element
    // its coordinates are recorded. The soonest the "over" function can be
    // called is after a single polling interval. Setting the polling interval
    // higher will increase the delay before the first possible "over" call,
    // but also increases the time to the next point of comparison.
    self.openDelay = 30;

    // Get the right prefixed names e.g. WebkitTransitionDuration
    self.tapOrClick = self.hasTouch ? 'touchstart' : 'click';
    self.transformName = Modernizr.prefixed('transform');
    // css version
    self.transitionName = Modernizr.prefixed('transition');
    self.transitionProperty = Modernizr.prefixed('transitionProperty');
    self.transitionDuration = Modernizr.prefixed('transitionDuration');
    self.transitionEasing = Modernizr.prefixed('transitionTimingFunction');
    self.transitionEnd = Settings.transEndEventName;

    self.init();

  };

  GlobalNav.prototype = {

    constructor : GlobalNav,

    init : function() {
      var self = this;

      self.isInitialized = true;
      self.isDesktopNav = false;
      self.isMobileNav = false;

      // Setting up enquire listeners.
      self.initBreakpoints();
    },

    // These fire the first time they're hit (page-load), and if the breakpoint becomes active during browser resize.
    initBreakpoints : function() {
      var self = this;

      if ( !Settings.isLTIE10 ) {

        // switch to desktop nav
        enquire.register('(min-width: ' + (self.mobileNavThreshold + 1) + 'px)', {
          match : function() {
            self.initDesktopNav();
            self.resetMobileNav();
            self.$html.removeClass('bp-nav-mobile').addClass('bp-nav-desktop');
            self.isDesktopNav = true;
            self.isMobileNav = false;
          }

        });
        // switch to desktop footer
        enquire.register('(min-width: ' + (self.mobileFooterThreshold + 1) + 'px)', {
          match : function() {
            self.$html.removeClass('bp-footer-mobile').addClass('bp-footer-desktop');
            self.resetMobileFooter();
          }
        });

        // switch to mobile nav
        enquire.register('(max-width: ' + self.mobileNavThreshold + 'px)', {
          match : function() {
            self.initMobileNav();
            self.resetDesktopNav();
            self.$html.removeClass('bp-nav-desktop').addClass('bp-nav-mobile');
            self.isDesktopNav = false;
            self.isMobileNav = true;
          }

        });
        // switch to mobile footer
        enquire.register('(max-width: ' + self.mobileFooterThreshold + 'px)', {
          match : function() {
            self.$html.removeClass('bp-footer-desktop').addClass('bp-footer-mobile');
            self.initMobileFooter();
          }

        });
      } else {
        self.initDesktopNav();
        self.resetMobileNav();
        self.$html.removeClass('bp-nav-mobile').addClass('bp-nav-desktop');
        self.isDesktopNav = true;
        self.isMobileNav = false;
      }
    },

    initDesktopNav : function() {
      var self = this;

      // add a click event to close the currently open navmenu/navtray if you click outside of it.
      self.$pageWrapOuter.on( 'click touchstart focus', $.proxy( self.onPageWrapOuterPress, self ) );

      // Set up primary nav buttons (Electronics, Entertainment, Account & Search)
      self.$activeNavBtns.each(function() {
        var $thNavBtn = $(this),
            $thNavBtnTarget = $('.' + $thNavBtn.data('target')),
            isSearchMenu = $thNavBtnTarget.hasClass('navmenu-w-search');

        $thNavBtn.on('click touchstart mouseenter focus', function(e) {
          e.preventDefault();
        });

        // init
        self.resetActiveNavBtn( $thNavBtn );
        // Save a reference to its trigger
        $thNavBtn.data({
          hovering: false
        });
        $thNavBtnTarget.data({
          $navBtn: $thNavBtn,
          hovering: false
        });

        // TOUCH DEVICES
        if ( self.hasTouch ) {
          // console.log('init hammer');
          // Use hammer.js to detect taps
          $thNavBtn.hammer().on('tap', $.proxy( self.onNavBtnTap, self ) );

        // NOT touch device - set up HOVER triggers
        } else {
          // console.log('init hover intent');

          // Search menu appears on click instead of hover
          if ( isSearchMenu ) {
            $thNavBtn.on( 'mousedown', $.proxy( self.onSearchNavMouseDown, self ) );
            $thNavBtn.on( 'click', $.proxy( self.onSearchNavBtnClick, self ) );
          } else {
            $thNavBtn.hoverIntent({
              over: $.proxy( self.onNavBtnMouseEnter, self ),
              out: $.proxy( self.onNavBtnMouseLeave, self ),
              interval: self.openDelay,
              timeout: self.closeDelay
            });
            $thNavBtnTarget.hoverIntent({
              over: $.proxy( self.onNavBtnTargetMouseEnter, self ),
              out: $.proxy( self.onNavBtnTargetMouseLeave, self ),
              interval: self.openDelay,
              timeout: self.closeDelay
            });
          }

        } // end NOT touch device
      });

      // Event triggered when any anchor link inside the nav gets focus
      // Should this only be done for no-touch?
      self.setupFocusPath();

      self.preSetNavTrayImageHeights();

      self.resizeAccountUsername();
      Environment.on('global:resizeDebounced-200ms', function() {
        self.resizeAccountUsername();
      });
    }, // end initDesktopNav

    resetDesktopNav : function() {
      var self = this;

      self.$pageWrapOuter.off('click touchstart focus');

      self.$activeNavBtns.each(function() {

        var $thNavBtn = $(this);

        self.resetActiveNavBtn($thNavBtn);

        // reset the button
        $thNavBtn.removeClass('active').parent().removeClass('nav-li-selected');

        // if there's a navTray/navMenu, reset it
        if ($thNavBtn.data('target').length) {
          var $thNavTarget = $('.' + $thNavBtn.data('target'));

          if ($thNavTarget.hasClass('navtray-w')) {
            // self.setNavTrayContentNaturalFlow($thNavTarget, false);
            // WHICH ONE?
            self.slideNavTray($thNavTarget, false);
          } else {
            self.resetActiveNavMenu();
          }
          $thNavTarget.off('touchstart mouseenter mouseleave click');
        }
        // reset touch -- even if these aren't visible on mobile, it's still better to reset them, since they'll get re-inited if switch back
        $thNavBtn.off('touchstart mouseenter mouseleave click');
      });
    },

    onPageWrapOuterPress : function( e ) {
      // as long as the click wasn't on one of the nav-menu/trays,
      // or one of their children,
      // or one of the activeNavBtns, reset any active menus.
      var self = this,
          $target = $( e.target ),
          isClickOnNavItem = $target.hasClass('navtray-w') || $target.hasClass('navmenu-w') || $target.hasClass('nav-dropdown-toggle') || $target.parents('.navtray-w,.navmenu-w,nav-dropdown-toggle, .nav').length > 0;

      // console.log('onPageWrapOuterPress', 'isClickOnNavItem: ', isClickOnNavItem );

      if ( !isClickOnNavItem ) {
        self.closeActiveNavBtn();
        self.isSearchOpen = false;
        self.blurSearchInput();
      }
    },

    // Logic for what to do when links inside the nav receive focus
    // Firefox on mac only focuses inputs... http://stackoverflow.com/q/11704828/373422
    // Safari only focuses on inputs too: http://stackoverflow.com/a/1914496/373422
    setupFocusPath : function() {
      var self = this,
          $navBtns = self.$container.find('.nav-li-link');

      self.$container.on('focus', 'a', function() {
        var $focused = $( this ),
            $currentBtn = self.$currentOpenNavBtn,
            isNavBtn = $focused.is( $navBtns ),
            isNavBtnWithTarget = isNavBtn && $focused.is( self.$activeNavBtns ),
            isThisTrayMenuOpen = isNavBtnWithTarget && $focused.is( $currentBtn ),
            isATrayMenuOpen = $currentBtn !== false,
            $closestTarget, $closestTargetsBtn;

        // Mouse down causes focus, trigger the focus and click. Can't have that.
        if ( self.isMouseDown ) {
          // console.log('mouse down, exit');
          return;
        }

        // Is this a nav button?
        if ( isNavBtn ) {
          // Is it a nav button with a dropdown?
          if ( isNavBtnWithTarget ) {
            // console.log('is nav button with a tray/menu', 'isThisTrayMenuOpen:', isThisTrayMenuOpen, 'isATrayMenuOpen:', isATrayMenuOpen);

            // There is an open tray/menu and it's not this one, close it
            if ( isATrayMenuOpen && !isThisTrayMenuOpen ) {
              // console.log('tray is open and its not this one');
              self.closeActiveNavBtn();
            }

            // The focused nav button's tray/menu is not open, so open it
            if ( !isThisTrayMenuOpen ) {
              // console.log('this tray isn\'t open, open it');
              self.setActiveNavBtn( $focused );
            }

          // Is there an open tray?
          } else if ( isATrayMenuOpen ) {
            // Close it
            // console.log('close active nav button');
            self.closeActiveNavBtn();
          }
          // else {
          //   // console.log('is nav button, but nothing to do');
          // }

        // Not a nav button, is it inside a tray/menu?
        } else {
          $closestTarget = $focused.closest('.navtray-w, .navmenu-w');

          // Does this focused item have a parent which is a nav tray or menu
          if ( $closestTarget.length > 0 ) {
            // Get the tray/menu's nav button, and recheck if its tray/menu is open
            $closestTargetsBtn = $closestTarget.data('$navBtn');
            isThisTrayMenuOpen = isATrayMenuOpen && $currentBtn && $currentBtn.is( $closestTargetsBtn );
            // console.log('[NOT NAVBTN] isThisTrayMenuOpen:', isThisTrayMenuOpen, 'isATrayMenuOpen:', isATrayMenuOpen);

            // Is there a tray currently open?
            if ( isATrayMenuOpen && !isThisTrayMenuOpen ) {
              // console.log('a menu is open (and it\'s not this one), close it');
              // Close it
              self.closeActiveNavBtn();
              // Open the new one
              self.setActiveNavBtn( $closestTargetsBtn );

            // Open its parent tray/menu
            } else if ( !isThisTrayMenuOpen ) {
              // Open the new one
              self.setActiveNavBtn( $closestTargetsBtn );
            }
            // else {
            //   // console.log('should be focused on menu item inside tray which doesnt need any action');
            // }

          // Anchor isn't inside a tray/menu, nor is it a nav button
          }
          // else {
          //   // console.log( 'whatamidoing', this );
          // }
        }

      });
    },

    onSearchNavMouseDown : function() {
      this.isMouseDown = true;
    },

    onSearchNavBtnClick: function() {
      var self = this;

      self.isMouseDown = false;
      if ( self.isSearchOpen ) {
        self.closeSearch();
      } else {
        self.openSearch();
      }
    },

    openSearch : function() {
      if ( !this.isSearchOpen ) {
        this.setActiveNavBtn( this.$searchBtn );
        this.isSearchOpen = true;
      }
    },

    closeSearch : function() {
      if ( this.isSearchOpen ) {
        this.resetActiveNavBtn( this.$searchBtn );
        this.isSearchOpen = false;
      }
    },

    onNavBtnTap : function( evt ) {
      var self = this,
          $currentBtn = self.$currentOpenNavBtn,
          $navBtn = $( evt.delegateTarget ),
          isATrayMenuOpen = $currentBtn !== false,
          isThisTrayMenuOpen = isATrayMenuOpen && $navBtn.is( $currentBtn );

      // This tray/menu is open, close it
      if ( isThisTrayMenuOpen ) {
        // console.log( 'this tray menu is open already. Close it.' );
        self.closeActiveNavBtn();

      // A tray/menu is open, but it's not this one. Close the old, open the new.
      } else if ( isATrayMenuOpen && !isThisTrayMenuOpen ) {
        // console.log( 'A tray is open and its not this one. Close the old, open the new' );
        self.closeActiveNavBtn();
        self.setActiveNavBtn( $navBtn );

      // Nothing is open, do it!
      } else if ( !isATrayMenuOpen ) {
        // console.log('nothing is open, open it.');
        self.setActiveNavBtn( $navBtn );
      }

    },

    onNavBtnMouseEnter : function( e ) {
      // console.log("onNavBtnMouseEnter: ", e.target);
      var self = this,
          $navBtn = $( e.delegateTarget );

      if ( self.isSearchOpen ) {
        self.closeSearch();
      }

      // Set hovering flag
      $navBtn.data( 'hovering', true );

      // Clear the mouse timer
      // console.log('%c[NAVBTN ENTER] ' + $navBtn[0].getAttribute('href'), 'font-size:16px;color:#9B59B6;');

      // Check to see if it's the active button first.
      // Keep tray/menu open if it's the same button
      if ( $navBtn.hasClass('active') ) {
        return false;
      }

      // Set active nav button
      self.setActiveNavBtn( $navBtn );

      self.blurSearchInput();
    },

    onNavBtnMouseLeave : function( e ) {
      // console.log("onNavBtnMouseLeave: ", e.target);
      var self = this,
          $navBtn = $( e.delegateTarget ),
          btnData = $navBtn.data(),
          $target = $( '.' + btnData.target );

      // console.log('%c[NAVBTN LEAVE] ' + $navBtn[0].getAttribute('href'), 'font-size:16px;color:#8E44AD;');
      // No longer hovering flag
      btnData.hovering = false;

      // In a timeout so that the mouse enter for the target
      // is called before this function
      self.maybeResetActiveNavBtn( $navBtn, $target );
    },

    onNavBtnTargetMouseEnter : function( e ) {
      // console.log("onNavBtnTargetMouseEnter: ", e.target);
      var $target = $( e.delegateTarget );

      $target.data('hovering', true);
      // console.log('%c' + $target[0].id + ' [ENTER]', 'color:blue;');
      // console.log($target[0].id + ' [ENTER]');
    },

    onNavBtnTargetMouseLeave : function( e ) {
      // console.log("onNavBtnTargetMouseLeave: ", e.target);
      var self = this,
          $target = $( e.delegateTarget );

      $target.data('hovering', false);
      // console.log('%c' + $target[0].id + ' [LEAVE]', 'color:blue;');
      // console.log($target[0].id + ' [LEAVE]');

      // Remove focus from search input on mouse out in ie
      if (Settings.isLTIE10) {
        self.blurSearchInput();
      }
      if (Settings.isLTIE9) {
        $('.navmenu-w-search, .navmenu-w-account').removeClass('navmenu-w-visible');
      }

      // Close this tray/menu if its nav button isn't hovered
      self.maybeResetActiveNavBtn( $target.data('$navBtn'), $target );
    },

    resetActiveNavMenu : function() {
      var self = this;

      if ( Settings.isLTIE10 ) {
        self.blurSearchInput();
      }

      if ( Settings.isLTIE9 ) {
        $('.navmenu-w-search, .navmenu-w-account').removeClass('navmenu-w-visible').attr('style', 'opacity:0');
        $('.nav-li-search a').blur();
      }

      function next( $navmenu ) {
        var $transitionContainer = $navmenu.find('.reveal-transition-container');

        $transitionContainer.css( 'height', '' );
        $navmenu.css({ left: '', right: '' });
      }

      // Each visible nav menu
      $('.navmenu-w-visible').each(function() {
        var $navmenu = $( this );

        // Trigger transition
        $navmenu.removeClass('navmenu-w-visible');

        // If transitions, wait for the transition to end,
        if ( Modernizr.csstransitions ) {
          $navmenu.one(self.transitionEnd, function() {
            next( $( this ) );
          });

        // otherwise do it right away
        } else {
          next( $navmenu );
        }

        // Release for IE
        $navmenu = null;
      });
    },

    resizeAccountUsername : function() {
      var self = this;
      // reset it first so we measure off the full username.
      self.$accountUsername.text(self.fullAccountUsername);

      var $nbi = self.$navbar.children('.grid');

      function isTooLong() {
        var navbarWidth = $nbi.outerWidth();
        var navbarContentsWidth = 0;
        $nbi.children().each(function() {
          navbarContentsWidth += parseInt($(this).outerWidth(true),10);
        });
        return navbarWidth - navbarContentsWidth < self.usernameSpace ? true : false;
      }

      function shortenUsername() {
        var currentUsername = self.$accountUsername.text();
        // take 1 letter off the end of the username
        var shortUsername = currentUsername.substring(0,currentUsername.length-1);
        self.$accountUsername.html(shortUsername);
        // loop through, taking 1 letter off at a time, until it's either short enough, or down to just minUsernameLength letters.
        if (shortUsername.length > self.minUsernameLength && isTooLong()) {
          shortenUsername();
        } else {
          // only shorten it if it's cut off more than 2 letters; otherwise the ellipses makes it so it's not any shorter anyway.
          if ( shortUsername.length < (self.fullAccountUsername.length - 2) ) {
            self.$accountUsername.html(shortUsername + '&hellip;');
          } else {
            self.$accountUsername.html(self.fullAccountUsername);
          }
        }
      }

      if (isTooLong()) {
        shortenUsername();
      }

      // check to see if the Account Button still has enough room to display the entire username; and if not, cut it down.

      // get the width of the entire nav

      // for each child of $navbarInner, add its width to the total


      // var logoWidth = $nbi.find('.brand').outerWidth();
      // var primaryWidth = $nbi.find('.nav-primary').outerWidth();


      // self.$accountBtn
    },

    // If the mouse didn't go to the tray that opened, close it
    maybeResetActiveNavBtn : function( $navBtn, $target ) {
      var self = this;

      setTimeout(function maybeReset() {
        // If the nav button or the target is hovered, it shouldn't close
        var shouldClose = !( $navBtn.data('hovering') || $target.data('hovering') );

        if ( shouldClose ) {
          // console.log('%cneither ' + $target[0].id + ' nor ' + $navBtn[0].getAttribute('href') + ' hovered. RESETTING', 'font-weight:bold;color:red;');
          // console.log('neither ' + $target[0].id + ' nor ' + $navBtn[0].getAttribute('href') + ' hovered. RESETTING');
          self.resetActiveNavBtn( $navBtn );
        }
      }, self.closeDelay + 25);
    },

    // Checks for open navs and closes them
    closeActiveNavBtn : function( $exceptBtn ) {
      var self = this,
          $activeBtn,
          isAnotherOpen;

      // Close open navs if requested (eg search menu)
      $activeBtn = self.$activeNavBtns.filter('.active');
      isAnotherOpen = $activeBtn.length > 0 && !$activeBtn.is( $exceptBtn );

      // console.log('isAnotherOpen:', isAnotherOpen);
      if ( isAnotherOpen ) {
        // console.log('%c[CLOSE ACTTIVE]' + $activeBtn[0].getAttribute('href'), 'font-weight:bold;font-size:16px;color:rgb(0,172,238);');
        self.resetActiveNavBtn( $activeBtn );
        // self.clearMouseleaveTimer();
        self.$currentOpenNavBtn = false;
      }
    },

    // Save the currently open nav button
    setActiveNavBtn : function( $btn ) {
      var self = this;
      // console.log('%c[SET]' + $btn[0].getAttribute('href'), 'font-weight:bold;font-size:16px;color:#3498DB;');

      self.activateNavBtn( $btn );
      self.$currentOpenNavBtn = $btn;
    },

    // Blur this nav button, and remove the active class
    // Also reset the tray or menu if it has one
    resetActiveNavBtn : function( $oldNavBtn ) {
      var self = this,
          // dfd = new $.Deferred(),
          hasLength = $oldNavBtn.length > 0,
          navBtnTarget = $oldNavBtn.data('target'),
          hasTarget = !!navBtnTarget,
          isTray,
          $navTarget;

      // console.log('%c[RESET] ' + ($oldNavBtn.length > 0 && $oldNavBtn[0].getAttribute('href')), 'font-size:14px;color:#2ECC71;' );

      // reset this button
      if ( hasLength ) {
        $oldNavBtn
          .removeClass('active')
          .blur()
          .parent()
            .removeClass('nav-li-selected');
      }

      // if there's a navTray/navMenu, reset it
      if ( hasTarget ) {
        $navTarget = $( '.' + navBtnTarget );
        isTray = $navTarget.hasClass('navtray-w');

        // Is a tray, slide it up
        if ( isTray ) {
          self.slideNavTray( $navTarget, false );

        // Otherwise it's a menu, reset it
        } else {
          self.resetActiveNavMenu();
        }
      }
    },


    slideNavTray : function($navTray, opening) {
      // Wait just a moment to make sure the height is applied
      setTimeout(function() {
        // console.log( 'slideNavTray ::', 'navtray has class no-transition:', $navTray.hasClass('no-transition') );
        // Removing a class when it doesn't exist can cause style recalcs
        if ( $navTray.hasClass('no-transition') ) {
          $navTray.removeClass('no-transition');
        }

        // Wait just a moment to make sure the height is applied
        setTimeout(function() {
          if (opening) {
           $navTray.addClass('navtray-w-visible');
          } else {
           $navTray.removeClass('navtray-w-visible');
          }

        }, 10);
      }, 10);
    },

    resetNavTray : function( $navTray ) {
      $navTray
        .removeClass('navtray-w-visible')
        // .removeClass('no-transition')
        .css('height', '')
        .find('.navtray')
          .removeClass('navtray-absolute')
          .css('height', '');
    },

    setNavTrayContentNaturalFlow : function($navTray) {
      $navTray.css('height', '').find('.navtray').removeClass('navtray-absolute').css('height', '');
    },

    activateNavBtn : function( $newNavBtn ) {
      var self = this,
          navBtnTarget = $newNavBtn.data('target'),
          hasTarget = !!navBtnTarget,
          $navTarget,
          isTray;

      // console.log('%c[ACTIVATE] ' + $newNavBtn[0].getAttribute('href'), 'font-size:14px;color:#E74C3C;' );

      //.removeClass('no-transition')
      $newNavBtn
        .addClass('active')
        .parent()
          .addClass('nav-li-selected');

      // Exit if the button doesn't have a target
      if ( !hasTarget ) {
        return false;
      }

      // Get the buttons target
      $navTarget = $( '.' + navBtnTarget );
      isTray = $navTarget.hasClass('navtray-w');

      // figure out if this is a tray or menu.
      if ( isTray ) {
        self.showNavTray( $navTarget );

      // It's a nav-menu - show the menu.
      } else {
        self.showNavMenu( $navTarget, $newNavBtn );
      }
    },

    showNavTray : function( $target ) {
      var self = this;

      // Force an iQ check whenever the navs expand.
      if ( Modernizr.csstransitions ) {
        $target.one( self.transitionEnd, iQ.update );
      } else {
        iQ.update();
      }

      // first get the tray's natural height, which it should have offscreen.
      // expand the tray. When it's done, set it to position:relative and natural heights.
      self.slideNavTray( $target, true );
      // if (Settings.isLTIE10) {
      //   // going to do something special for oldIE since it's not sliding anyway, and it can be set up to just use display:none.
      //   self.slideNavTray( $target, true );
      // } else {
      //   self.slideNavTray( $target, true );
      // }
    },
    showNavMenu : function( $target, $navBtn ) {
      var self = this,
          isSearchMenu = $target.hasClass('navmenu-w-search'),
          isAccountMenu = $target.hasClass('navmenu-w-account'),
          $revealContainer = $target.find('.reveal-transition-container'),

          // Get css
          expHeight = $revealContainer.height();

      // set css
      $revealContainer.css('height', '1px');

      function next( $container ) {
        // when it's done revealing, get rid of the height transition
        $container.removeClass('transition-height');
        // wait a tick to make sure the transition-height class is gone.
        setTimeout(function() {
          // reset to natural height
          $container.css('height', '');
        }, 0);
      }

      // wait a tick to make sure the height is set before adding the transition-height class, to make sure it doesn't animate
      setTimeout(function() {
        $revealContainer.addClass('transition-height');

        // wait a tick to make sure the transition-height is set before changing the height & animating.
        setTimeout(function() {
          $target.addClass('navmenu-w-visible');

          if ( Modernizr.csstransitions ) {
            $revealContainer.height(expHeight);
            $revealContainer.one(self.transitionEnd, function() {
              next( $revealContainer );
            });

          } else {
            next( $revealContainer );
          }
        }, 0);
      }, 0);

      // the search menu, needs to be positioned with js. This way it can be in the flow at the top of the page, so it's in place for mobile.
      if ( isSearchMenu ) {
        // Line it up with the right edge of the search button.

        // Get css
        var searchBtnRightEdge = $navBtn.parent().position().left + parseInt($navBtn.css('marginLeft'), 10) + $navBtn.innerWidth();
        var searchLeftPos = searchBtnRightEdge - $target.innerWidth();

        // Set css
        $target.css({
          'right' : 'auto',
          'left' : searchLeftPos + 'px'
        });

      // Account menu
      } else if ( isAccountMenu ) {
        // Get css
        var accountLeftPos = parseInt($navBtn.css('marginLeft'), 10);

        // center the carrot under the button
        var $carrot = $target.find('.nav-indicator');
        // Get css
        var carrotLeftPos = (parseInt($navBtn.outerWidth(),10) - parseInt($carrot.outerWidth(),10) ) / 2;

        // Set css
        $target.css({
          'right' : 'auto',
          'left' : accountLeftPos + 'px'
        });
        // Set css
        $carrot.css('left',carrotLeftPos+'px');
      }
    },

    blurSearchInput : function() {
      this.$searchInput.trigger( 'blur' );
    },

    // MOBILE NAV

    prepMobileNav : function() {
      // console.log("prepMobileNav");
      var self = this;

      self.preSetNavTrayImageHeights();

      var $outer = $('#nav-outer-container'),
      $inner = $outer.find('.nav-mobile-scroller'),
      innerHeight = $inner.height(),
      pageHeight = Settings.isIPhone || Settings.isAndroid ? window.innerHeight : self.$window.height();

      $outer.css( 'height', pageHeight );
      $inner.css( 'height', innerHeight );

      // Set this after '$outer' and '$inner' have been set so that all the setters are in order
      self.$pageWrapOuter.css( 'height', pageHeight );
    },

    preSetNavTrayImageHeights : function() {

      var navTrayImgRato = 0.556;
      // if this is the first time opening the nav, the images aren't loaded yet. This means we don't know how tall the whole
      // nav is going to be, so we have to estimate / fake it.
      var $navTrayImageWraps = $('#navtrayElectronics').add($('#navtrayEntertainment')).find('.nav-img-w');
      // breaking this into 2 loops to avoid layout thrashing.
      var $navTrayImageWrapsNoSrc = $();
      $navTrayImageWraps.each(function(){
        var $thImg = $(this).find('img');
        if (!$thImg.attr('src')){

          // set its height based on its width & the target ratio, so the entire menu will be the correct height even before the images are loaded.
          var calcHeight = $thImg.width() * navTrayImgRato;
          $thImg.data('customHeight',calcHeight);
          $navTrayImageWrapsNoSrc = $navTrayImageWrapsNoSrc.add($thImg);
        }
      });
      $navTrayImageWrapsNoSrc.each(function(){
        var $thImg = $(this);
        $thImg.height($thImg.data('customHeight'));

        // then listen for when the image is loaded, and remove the custom height so it can flex on resize.
        $thImg.on('load', function() {
          $thImg.css('height', '');
        });
      });
    },

    initMobileNav : function() {
      var self = this;

      $('#btn-mobile-nav').on(self.tapOrClick, function(e) {
        e.preventDefault();
        if (!self.mobileNavVisible) {
          self.showMobileNav();
        } else {
          self.hideMobileNav();
        }
      });
      var $thInput = self.$searchInput;

      $thInput
        .on('focus', function() {
          if (self.$html.hasClass('bp-nav-mobile')) {
            module.initMobileNavIScroll();
          }
          $('.page-wrap-inner').addClass('show-mobile-search-results');
        })
        .on('blur', function() {

          // disable blur on mobile search input
          if (!self.$html.hasClass('bp-nav-mobile')) {
            $('.page-wrap-inner').removeClass('show-mobile-search-results');
          }
        })
        .closest('.input-group')
        .find('.input-clear-btn')
          .on(self.tapOrClick, function() {
            if (self.$html.hasClass('bp-nav-mobile')) {
              module.initMobileNavIScroll();
              $('.page-wrap-inner').removeClass('show-mobile-search-results');

              // Blur the search input
              setTimeout( $.proxy( self.blurSearchInput, self ), 0);
            }
          });

      Environment.on('global:resizeDebounced', $.proxy(self.resizeUpdateMobileNav,self));

    }, // end initMobileNav

    resizeUpdateMobileNav : function() {
      var self = this;
      // console.log("resizeUpdateMobileNav");
      // only call if the mobile nav is open. otherwise prep gets called and sets a height to the rest of the page.
      if ($('#page-wrap-inner').hasClass('show-mobile-menu')){
        self.prepMobileNav();

        // make sure heights are already set before initializing iScroll.
        setTimeout(function() {
          module.initMobileNavIScroll();
        },10);
      }
    },


    resetMobileNav : function() {

      var self = this;
      self.hideMobileNav();
      $('#btn-mobile-nav').off(self.tapOrClick);
      $('.mobile-screen-overlay').remove();
    },

    showMobileNav : function() {
      // console.log("showMobileNav");
      var self = this;

      self.showMobileBackdrop();

      if (!self.mobileNavIScroll) {
        $('#page-wrap-inner').addClass('show-mobile-menu');
        self.mobileNavVisible = true;

        self.prepMobileNav();

        // make sure heights are already set before initializing iScroll.
        setTimeout(function() {
          module.initMobileNavIScroll();
        },10);
      }
    },
    hideMobileNav : function() {
      var self = this;
      self.hideMobileBackdrop();

      if (self.mobileNavVisible) {
        $('#page-wrap-inner').one(self.transitionEnd, function() {
          // wait until the $('#page-wrap-inner') is done animating closed before destroying the iScroll.
          module.destroyMobileNavIScroll();
        });
      }
      $('#page-wrap-inner').removeClass('show-mobile-menu');
      self.mobileNavVisible = false;
    },

    showMobileBackdrop : function() {
      var self = this;

      self.$mobileScreenOverlay = $('<div class="modal-backdrop mobile-screen-overlay opacity0" />').appendTo($('#page-wrap-inner'));

      setTimeout(function() {
        self.$mobileScreenOverlay.removeClass('opacity0').addClass('opacity1');
        if ( Settings.isAndroid ) {
          Utilities.forceWebkitRedraw();
        }
      }, 1);
    },
    hideMobileBackdrop : function() {
      var self = this;

      if ( !!self.$mobileScreenOverlay ) {
        self.$mobileScreenOverlay.one(self.transitionEnd, function() {
          self.$mobileScreenOverlay.remove();
        });
      }

      if ( !!self.$mobileScreenOverlay ) {
       self.$mobileScreenOverlay.removeClass('opacity1').addClass('opacity0');
      }
    },

    // MOBILE FOOTER
    initMobileFooter : function() {
      var self = this;

      // init the country-selector popup menu -- disabled.
      // $('#country-selector').on('mouseenter mouseleave',function() {
      //   var pageContainerWidth = $(this).closest('.grid-footer').width();
      //   $(this).find('.dropdown-hover-menu-lists-w').width(pageContainerWidth);
      // });

      self.footerNavCollapseHeight = 49;
      // plus 1 for the border

      $('#footer-wrapper .footer-mobile-section h5').each(function() {

        var $thFootSection = $(this).parent();

        // on init, the footers should collapse.
        self.collapseMobileFooterSec($thFootSection, true);



        // TOUCH DEVICES
        if ( self.hasTouch ) {
          // console.log('init hammer');
          // Use hammer.js to detect taps
          $(this).hammer().on('tap', function() {
            self.toggleMobileFooterSec($thFootSection);
          });
        } else {
          // NO TOUCH
          $(this).on('click', function() {
            self.toggleMobileFooterSec($thFootSection);
          });
        }
      });
    },
    toggleMobileFooterSec : function($thFootSection) {
      var self = this;
      if ($thFootSection.hasClass('collapsed')) {
        self.expandMobileFooterSec($thFootSection);
      } else {
        self.collapseMobileFooterSec($thFootSection);
      }
    },
    resetMobileFooter : function() {
      var self = this;

      $('#footer-wrapper .footer-mobile-section h5').each(function() {
        var $thFootSection = $(this).parent();
        $thFootSection.css('height', '').removeClass('collapsed transition-height');
        $(this).off(self.tapOrClick);
      });
    }, // end resetMobileFooter


    collapseMobileFooterSec : function($thFootSection, isPageInit) {
      var self = this;

      isPageInit = typeof isPageInit !== 'undefined' ? isPageInit : false;

      // natural height - collapse it.
      var expHeight = $thFootSection.height();
      $thFootSection.data('expHeight', expHeight);

      if (isPageInit) {
        $thFootSection.height(self.footerNavCollapseHeight).addClass('collapsed');
        // after it's collapsed, add the transition-height class for animating later.
        setTimeout(function() {
          $thFootSection.addClass('transition-height');
          Environment.trigger('SONY:Footer:mobileFooterSecCollapsed');
        }, 1);
        // NOT on page init, collapse it normally.
      } else {
        // set initial height to its current / expanded height so there's something to animate from
        $thFootSection.height(expHeight);
        // wait a tick to make sure the height is set before adding the transition-height class, to make sure it doesn't animate
        setTimeout(function() {
          $thFootSection.addClass('transition-height');
          // wait a tick to make sure the transition-height is set before changing the height & animating.
          setTimeout(function() {
            $thFootSection.height(self.footerNavCollapseHeight).addClass('collapsed');
          }, 1);
        }, 1);

        if ( self.hasTouch && $thFootSection.hasClass('footer-store-locator') && $('#store-locator-search-input').is(':focus')) {
          $('#store-locator-search-input').blur();
        }
      }
    },
    expandMobileFooterSec : function($thFootSection) {
      var self = this;

      $thFootSection.height($thFootSection.data('expHeight')).removeClass('collapsed').one(self.transitionEnd, function() {
        // when the transition is complete, put the section back into natural height, in case the window was resized.
        $thFootSection.removeClass('transition-height');
        // ...after waiting a tick to make sure everything else is already set.
        setTimeout(function() {
          $thFootSection.css('height', '');
        }, 1);
      });
    } // end expandMobileFooterSec

  };
  // end GlobalNav.prototype

  // Plugin definition
  $.fn.globalNav = function(opts) {
    var args = Array.prototype.slice.apply(arguments);
    return this.each(function() {
      var self = $(this),
        globalNav = self.data('globalNav');

      // If we don't have a stored globalNav, make a new one and save it
      if (!globalNav) {
        globalNav = new GlobalNav(self);
        self.data('globalNav', globalNav);
      }

      if ( typeof opts === 'string') {
        globalNav[opts].apply(globalNav, args.slice(1));
      }
    });
  };
  // end $.fn.globalNav

  module.initMobileNavIScroll = function() {

    // console.log("initMobileNavIScroll");

    var globalNav = $('.nav-wrapper').data('globalNav');

    // If there's alreaddy a mobileNavIScroll, refresh it.
    // THIS IS HAPPENING ON EVERY KEYSTROKE! --??
    if (!!globalNav.mobileNavIScroll) {
      var $scroller = $('.nav-mobile-scroller');
      $scroller.css('height', '');
      setTimeout(function() {
        var scrollerHeight = $scroller.outerHeight();
        $scroller.css('height', scrollerHeight);

        setTimeout(function() {
          globalNav.mobileNavIScroll.refresh();
          globalNav.mobileNavIScroll.scrollTo();
        },50);
      },50);

    // No mobileNavIScroll, initialize it
    } else {
      globalNav.mobileNavIScroll = new IScroll('nav-outer-container', {
        vScroll : true,
        hScroll : false,
        hScrollbar : false,
        snap : false,
        momentum : true,
        bounce : false,
        onBeforeScrollStart: function(e) {
          var target = e.target,
              nodeName;

          while ( target.nodeType !== 1 ) {
            target = target.parentNode;
          }

          nodeName = target.nodeName;

          if (nodeName !== 'SELECT' && nodeName !== 'INPUT' && nodeName !== 'TEXTAREA') {
            e.preventDefault();
          }
        },
        // iQ throttles itself.
        onScrollMove: iQ.update
      });

      // Update images w/o scrolling
      iQ.update();
    }
  };

  module.destroyMobileNavIScroll = function() {
    var globalNav = $('.nav-wrapper').data('globalNav');
    if ( !!globalNav.mobileNavIScroll ) {
      globalNav.mobileNavIScroll.destroy();
    }
    globalNav.mobileNavIScroll = false;
    globalNav.$pageWrapOuter.css('height', '');
  };

  Environment.on('SONY:Navigation:initMobileNavIScroll', module.initMobileNavIScroll);
  Environment.on('SONY:Navigation:destroyMobileNavIScroll', module.destroyMobileNavIScroll);

  return module;

});
