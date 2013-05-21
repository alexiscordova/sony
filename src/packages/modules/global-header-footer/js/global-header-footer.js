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
      formActions = require('secondary/form-actions');

  var module = {
    init: function() {
      $('#nav-wrapper').globalNav();
      // console.clear();
    }
  };

  // Start module
  var GlobalNav = function($container) {

    var self = this;
    self.usernameSpace = 40;
    self.minUsernameLength = 6;
    self.searchMenu = {};
    self.$html = Settings.$html;
    self.$window = Settings.$window;
    self.$container = $container;
    self.$activeNavBtns = self.$container.find('.nav-dropdown-toggle');
    self.$navbar = $('#navbar');
    self.$currentOpenNavBtn = false;
    self.$pageWrapOuter = $('#page-wrap-outer');
    self.$accountUsername = $('#nav-account-btn').find('.username');
    self.fullAccountUsername = self.$accountUsername.text();
    self.mobileNavIScroll = false;
    self.mobileNavVisible = false;
    self.mobileNavThreshold = 767;
    self.mobileFooterThreshold = 567;
    self.closeTimer = false;

    // A simple delay, in milliseconds, before the "out" function is called.
    // If the user mouses back over the element before the timeout has expired the
    // "out" function will not be called (nor will the "over" function be called).
    // This is primarily to protect against sloppy/human mousing trajectories that
    // temporarily (and unintentionally) take the user off of the target element... giving them time to return.
    self.closeDelay = 400;
    self.closeDelaySearch = 2000;

    // The number of milliseconds hoverIntent waits between reading/comparing
    // mouse coordinates. When the user's mouse first enters the element
    // its coordinates are recorded. The soonest the "over" function can be
    // called is after a single polling interval. Setting the polling interval
    // higher will increase the delay before the first possible "over" call,
    // but also increases the time to the next point of comparison.
    self.openDelay = 100;
    // self.openTimer = false;

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
          $thNavBtnTarget = $('.' + $thNavBtn.data('target'));
          // $thNavBtnAndTarget = $thNavBtn.add($thNavBtnTarget);

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

        // UPDATE
        //
        // On hover, add the 'selected' (or whatever) class to the button. set a 'justActivated' boolean to true,
        // and set a timer that so if you click before the timer is up, it doesn't toggle the menu back closed. This way
        // if the user goes to click the button, they won't get a double-toggle (hover followed by click)
        //
        // On click, check for the 'justActivated' boolean - if it's not true, toggle the menu state.
        // This will allow closing by way of clicking the button when the menu is open.
        // This may also mean we can just have 1 function for touch-or-click, since touch will
        // never trigger hover, it'll just be ready for the touch to toggle it.
        //
        // TODO: Why does search menu close
        // TODO: Clicking off the nav will close it.
        // TODO: Clicking the button while this navTarget is open will close it.
        //

        // $(this).on(self.tapOrClick + ' focus blur', function() {
        // $(this).on(self.tapOrClick, function() {
        // $(this).on('touchstart mouseenter', function() {



        // TOUCH DEVICES
        if (self.hasTouch) {
          // console.log('hasTouch = true');

          $thNavBtn.on( 'touchstart focus', $.proxy( self.onNavBtnTouchFocus ) ); // end touchstart

        // NOT touch device - set up HOVER triggers
        } else {

          // console.log('No Touch - Use Click Events');

          // mouseenter focus click

          // var thTrigger = 'mouseenter focus';

          // for the search button only, we want it to trigger on click. All others on mouseenter.
          // if ($thNavBtn.parent().hasClass('nav-li-search')) {
          //     thTrigger = 'click focus';
          // }


          // $thNavBtn.hoverIntent( $.proxy( self.onNavBtnMouseEnter, self ), $.proxy( self.onNavBtnMouseLeave, self ) );
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

          // Activate click for tab navigation
          // $thNavBtnTarget.find('a').on('focus', function() {
            // $thNavBtnTarget.data('hovering', true);
            // $thNavBtn.trigger('mouseenter');

            // if (!($thNavBtnTarget.hasClass('navtray-w-visible') || $thNavBtnTarget.hasClass('navmenu-w-visible'))) {
            //   $thNavBtn.focus();
            // }
          // });

        } // end NOT touch device
      });


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
        $('.nav .nav-li a.active').trigger('touchstart');
        self.resetActiveNavBtn($('.nav-dropdown-toggle.active'));
        $('#nav-search-input').blur();
      }
    },

    onNavBtnTouchFocus : function( e ) {
      var self = e.data,
          $thNavBtn = $( this );

      $('#nav-search-input').blur();

      // if this button is already activated,
      if ($thNavBtn.parent().hasClass('nav-li-selected')) {
        // just hide/reset it.
        self.resetActiveNavBtn(self.$currentOpenNavBtn);
        self.$currentOpenNavBtn = false;

      // if this button isn't already activated,
      } else {
        // See if any other buttons are activated. If there's NOT
        var otherIsActive = self.$currentOpenNavBtn !== false ? true : false;

        if (!otherIsActive) {
          // update the Nav button & open the new tray/menu immediately
          self.setActiveNavBtn($thNavBtn);

          // if there WAS already an active button,
        } else {
          // deactivate it first
          self.resetActiveNavBtn(self.$currentOpenNavBtn);
          var $oldNavTarget = $('.' + self.$currentOpenNavBtn.data('target'));

          // if the open target was a navtray,
          if ($oldNavTarget.hasClass('navtray-w')) {
            // delay opening the new one until the old tray has a chance to close.
            setTimeout(function() {
              self.setActiveNavBtn($thNavBtn);
            }, 350);
          } else {
            // update the Nav button & open the new tray after just a short delay for the old menu to fade out.
            setTimeout(function() {
              self.setActiveNavBtn($thNavBtn);
            }, 150);
          }
        }
      }
    },

    // This sometimes is not triggered if the mouse is moved fast enough between two dropdowns
    // Which therefore doesn't trigger its tray
    onNavBtnMouseEnter : function( e ) {
      var self = this,
          $navBtn = $( e.delegateTarget ),
          btnData = $navBtn.data(),
          isTargetSearchMenu = btnData.target === 'navmenu-w-search';

      // e.preventDefault();

      // search menu doesn't respond to hover; only click & focus.
      if ( isTargetSearchMenu ) {
        return false;
      }

      // Set hovering flag
      btnData.hovering = true;

      // Clear the mouse timer
      // console.log('%c[NAVBTN ENTER] ' + $navBtn[0].getAttribute('href'), 'font-size:16px;color:#9B59B6;');
      // self.resetMouseleaveTimer();

      // Check to see if it's the active button first.
      // Keep tray/menu open if it's the same button
      if ( $navBtn.hasClass('active') ) {
        return false;
      }

      // Set active nav button
      self.setActiveNavBtn( $navBtn );

      $('#nav-search-input').blur();
    },

    onNavBtnMouseLeave : function( e ) {
      var self = this,
          $navBtn = $( e.delegateTarget ),
          btnData = $navBtn.data(),
          $target = $( '.' + btnData.target );

      e.preventDefault();

      // console.log('%c[NAVBTN LEAVE] ' + $navBtn[0].getAttribute('href'), 'font-size:16px;color:#8E44AD;');
      // No longer hovering flag
      btnData.hovering = false;

      // In a timeout so that the mouse enter for the target
      // is called before this function
      setTimeout(function checkItOut() {
        var isTargetHovered = $target.data('hovering');
        // console.log('isTargetHovered:', isTargetHovered);
        // If the mouse didn't go to the tray that opened, close it
        if ( !isTargetHovered ) {
          self.resetActiveNavBtn( $navBtn );
        }
      }, 5);

      // Check to see if it was onto the navtray/navmenu.
      // Wait a few ticks to give it a chance for the hover to fire first.
      // setTimeout(function() {
      //   self.checkHoverStatus( $navBtn, $target );
      // }, 5);
    },

    onNavBtnTargetMouseEnter : function( e ) {
      var self = this,
          $navBtn = $( e.delegateTarget );

      e.preventDefault();
      $navBtn.data('hovering', true);
      // console.log('target enter, reset timer');
      self.resetMouseleaveTimer();
    },

    onNavBtnTargetMouseLeave : function( e ) {
      var self = this,
          // $navBtn = e.data.$thNavBtn,
          $target = $( e.delegateTarget ),
          $navBtn = $target.data('$navBtn'),
          isNavBtnHovered = $navBtn.data('hovering'),
          timeout;

      e.preventDefault();
      $target.data('hovering', false);

      // Remove focus from search input on mouse out in ie
      if (Settings.isLTIE10) {
        $('#nav-search-input').blur();
      }
      if (Settings.isLTIE9) {
        $('.navmenu-w-search, .navmenu-w-account').removeClass('navmenu-w-visible');
      }

      // Check to see if it was onto this target's button.
      timeout = self.closeDelay;

      // The search menu gets a longer timeout.
      if (this.id === 'navmenu-w-search') {
        timeout = self.closeDelaySearch;
      }

      // Close this tray/menu if its nav button isn't hovered
      if ( !isNavBtnHovered ) {
        // console.log('nav button is not hovered, expire timer and close tray/menu');
        self.mouseTimerExpired( $navBtn );
      }
    },

    // Checks what is hovered, and starts the timer or resets it
    checkHoverStatus : function( $btn, $target ) {
      var self = this,
          // The nav tray should close if neither its button, nor itself are currently hovered
          shouldClose = !( $btn.data('hovering') || $target.data('hovering') );

      // console.log('shouldClose:', shouldClose);
      // start the countdown to shut it down.
      if ( shouldClose ) {
        self.startMouseleaveTimer( $btn );

      // if you ARE hovering over the target, clear the mouseLeaveTimer.
      } else {
        self.resetMouseleaveTimer();
      }
    },

    resetActiveNavMenu : function() {
      var self = this;

      if (Settings.isLTIE10) {
        $('#nav-search-input').blur();
      }
      if (Settings.isLTIE9) {
        $('.navmenu-w-search, .navmenu-w-account').removeClass('navmenu-w-visible').attr('style', 'opacity:0');
        $('.nav-li-search a').blur();
      }

      $('.navmenu-w-visible').each(function() {
        $(this)
          .removeClass('navmenu-w-visible')
          .one(self.transitionEnd, function() {
            var $navmenu = $( this ),
                $transitionContainer = $navmenu.find('.reveal-transition-container');

            $transitionContainer.css( 'height', '' );
            $navmenu.css({ left: '', right: '' });

            // clear active class from THIS button!
            // $('.nav-li-search a').removeClass('active');

            // setTimeout(function() {
            //   var c = $transitionContainer.attr('class');
            //   var h = $transitionContainer.outerHeight();
            //   console.log("c: " + c + ", h: " + h);
            // },5);
        });
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


    startMouseleaveTimer : function( $navBtn ) {
      var self = this,
        delay = self.closeDelay + 25;

      // Clear the current timer if it exists
      // console.log('start timer (reset it first)');
      self.resetMouseleaveTimer();

      // console.log('TIMER +++ SET');
      // If this timer expires, the current nav button and tray/menu will be reset
      self.closeTimer = setTimeout(function closeTimer() {
        self.mouseTimerExpired( $navBtn );
      }, delay);
    },
    resetMouseleaveTimer : function() {
      if ( this.closeTimer ) {
        clearTimeout( this.closeTimer );
        // console.groupCollapsed('TIMER +++ CLEARED');
        // console.trace();
        // console.groupEnd();
      }
    },
    // Reset nav button and tray/menu
    mouseTimerExpired : function( $navBtn ) {
      var self = this;

      // console.log('TIMER +++ EXPIRED');
      self.resetActiveNavBtn( $navBtn );
      self.resetMouseleaveTimer();
      self.$currentOpenNavBtn = false;
    },


    // Save the currently open nav button
    setActiveNavBtn : function( $btn ) {
      // console.log('%c[SET]' + $btn[0].getAttribute('href'), 'font-weight:bold;font-size:16px;color:#3498DB;');
      var self = this;
          // $currentBtn = self.$currentOpenNavBtn,
          // isAnotherOpen = !( $currentBtn === false || ($currentBtn.jquery && $currentBtn.is( $btn )) ),
          // $activeBtn = self.$activeNavBtns.filter('.active'),
          // isAnotherOpen = $activeBtn.length > 0 && !$activeBtn.is( $btn ),
          // previousDeferred = self.dfdTrayMenu,
          // isPreviousDeferredPending = !!previousDeferred && previousDeferred.state() === 'pending';

      // What to do next
      // function complete() {
      //   self.activateNavBtn( $btn );
      //   self.$currentOpenNavBtn = $btn;
      // }
      // complete();
      self.activateNavBtn( $btn );
      self.$currentOpenNavBtn = $btn;

      // The previous deferred (tray hide/show) has been rejected
      // Caused by this function being called again before the other
      // was finished animating
      // function reject( globalNav, $currentBtn ) {
      //   // console.log('REJECTED');
      //   if ( globalNav.$currentBtn.is( $currentBtn ) ) {
      //     // console.log('globalNav\'s current button is the one which was rejected');
      //   }
      // }

      // console.log( 'isAnotherOpen: ', isAnotherOpen, 'isPreviousDeferredPending: ', isPreviousDeferredPending );

      // if ( isPreviousDeferredPending ) {
      //   // ( content [, args] )
      //   if ( self.dfdTimerId ) {
      //     clearTimeout( self.dfdTimerId );
      //   }
      //   previousDeferred.reject();
      // }

      // Need to close the other first
      // Use a deferred object to wait for it to complete
      // if ( isAnotherOpen ) {
      //   // Save a reference to this dfd object and close $currentBtn
      //   // self.dfdTrayMenu = self.resetActiveNavBtn( $currentBtn );
      //   self.dfdTrayMenu = self.resetActiveNavBtn( $activeBtn );
      //   $.when( self.dfdTrayMenu )
      //     .done( complete )
      //     .fail( reject );
      // } else {
      //   complete();
      // }

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
          // timeout;

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
        // timeout = isTray ? 250 : 150;

        // Is a tray, slide it up
        if ( isTray ) {
          self.slideNavTray( $navTarget, false );

        // Otherwise it's a menu, reset it
        } else {
          self.resetActiveNavMenu();
        }

        // self.dfdTimerId = setTimeout(function() {
        //   // console.log('RESET ' + $oldNavBtn[0].getAttribute('href') + ' RESOLVED' );
        //   dfd.resolve();
        // }, timeout);

      // If there's no target, resolve the deferred right away
      }
      // else {
      //   dfd.resolve();
      // }

      // Don't return the promise here, so that it can be rejected elsewhere
      // return dfd;
    },


    slideNavTray : function($navTray, opening) {
      // var self = this,
      //     startHeight,
      //     endHeight,
      //     expandedHeight = $navTray.outerHeight();

      // $navTray.data('expandedHeight', expandedHeight);

      // if (opening) {
      //   startHeight = expandedHeight;
      //   endHeight = '1px';

      // } else {
      //   // if you're not opening, it's just initializing on page load
      //   startHeight = '1px';
      //   endHeight = expandedHeight;

      // }

      //$navTray.data('expandedHeight', startHeight).css('top', startHeight).find('.navtray').addClass('navtray-absolute').css('top', expandedHeight);

      // Wait just a moment to make sure the height is applied
      setTimeout(function() {
        // console.log( 'slideNavTray ::', 'navtray has class no-transition:', $navTray.hasClass('no-transition') );
        // Removing a class when it doesn't exist can cause style recalcs
        if ( $navTray.hasClass('no-transition') ) {
          $navTray.removeClass('no-transition');
        }

        // Wait just a moment to make sure the height is applied
        setTimeout(function() {
          // $navTray.css('height', endHeight).one(self.transitionEnd, onNavTrayComplete);
          // var elemHeight = $navTray.find('.navtray').height();
          if (opening) {
           $navTray.addClass('navtray-w-visible');
          } else {
           $navTray.removeClass('navtray-w-visible');
          }

        }, 10);
      }, 10);

      // function onNavTrayComplete() {
      //   // prepare the tray for browser resize - even though it's offscreen, we still need to get its natural height next time we need to expand it.
      //   self.setNavTrayContentNaturalFlow($navTray);
      // }

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
      // $navTarget.one(self.transitionEnd, function() {
      //   iQ.update(true);
      // });

      if ( Modernizr.csstransitions ) {
        $target.one( self.transitionEnd, iQ.update );
      } else {
        iQ.update();
      }

      // first get the tray's natural height, which it should have offscreen.
      // expand the tray. When it's done, set it to position:relative and natural heights.
      if (Settings.isLTIE10) {
        // going to do something special for oldIE since it's not sliding anyway, and it can be set up to just use display:none.
        self.slideNavTray( $target, true );
      } else {
        self.slideNavTray( $target, true );
      }
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

      // wait a tick to make sure the height is set before adding the transition-height class, to make sure it doesn't animate
      setTimeout(function() {
        $revealContainer.addClass('transition-height');

        // wait a tick to make sure the transition-height is set before changing the height & animating.
        setTimeout(function() {
          $target.addClass('navmenu-w-visible');
          $revealContainer.height(expHeight);
          $revealContainer.one(self.transitionEnd, function() {
            // when it's done revealing, get rid of the height transition
            $revealContainer.removeClass('transition-height');
            // wait a tick to make sure the transition-height class is gone.
            setTimeout(function() {
              // reset to natural height
              $revealContainer.css('height', '');
              // setTimeout(function() {
              //   var expHeight = $revealContainer.height();
              //   console.log("expHeight: " + expHeight);
              // }, 1);

            }, 0);
          });
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

    // MOBILE NAV
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
      var $thInput = $('#nav-search-input');

      $thInput.on('focus', function() {
        if (self.$html.hasClass('bp-nav-mobile')) {
          module.initMobileNavIScroll();
        }
        $('.page-wrap-inner').addClass('show-mobile-search-results');
      }).on('blur', function() {

        // disable blur on mobile search input
        if (!self.$html.hasClass('bp-nav-mobile')) {
          $('.page-wrap-inner').removeClass('show-mobile-search-results');
        }
      }).closest('.input-group').find('.input-clear-btn').on(self.tapOrClick, function() {
        if (self.$html.hasClass('bp-nav-mobile')) {
          module.initMobileNavIScroll();
          $('.page-wrap-inner').removeClass('show-mobile-search-results');
          setTimeout(function() {
            $thInput.trigger('blur');
          }, 0);
        }
      });

    }, // end initMobileNav
    resetMobileNav : function() {

      var self = this;
      self.hideMobileNav();
      $('#btn-mobile-nav').off(self.tapOrClick);
      $('.mobile-screen-overlay').remove();
    },

    showMobileNav : function() {
      var self = this,
          pageHeight,
          $outer,
          $inner,
          innerHeight;

      self.showMobileBackdrop();

      // Since the page-wrap-inner is going to be fixed, the browser will see the page as having no height.
      // on iOS, this means the Safari nav will always be visible. And that's not cool. So, to give the
      // page some height, so the Safari nav will hide.
      // need tp compensate for Safari nav bar on iOS - MAY BE DIFFERENT ON ANDROID/OTHER.
      pageHeight = Settings.isIPhone || Settings.isAndroid ? window.innerHeight : self.$window.height();
      // pageHeight = parseInt(self.$window.height(), 10) + 'px';
      // pageHeight = parseInt( self.$window.height(),10 ) + 60 + 'px';

      if (!self.mobileNavIScroll) {
        $outer = $('#nav-outer-container');
        $inner = $outer.find('.nav-mobile-scroller');
        innerHeight = $inner.height();

        $outer.css( 'height', pageHeight );
        $inner.css( 'height', innerHeight );

        // make sure heights are already set before initializing iScroll.
        setTimeout(function() {
          module.initMobileNavIScroll();
        }, 0);
      }

      // Set this after `$outer` and `$inner` have been set so that all the setters are in order
      self.$pageWrapOuter.css( 'height', pageHeight );

      $('#page-wrap-inner').addClass('show-mobile-menu');
      self.mobileNavVisible = true;
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

        $(this).on(self.tapOrClick, function() {

          if ($thFootSection.hasClass('collapsed')) {
            // collapsed height - expand it.
            self.expandMobileFooterSec($thFootSection);
          } else {
            self.collapseMobileFooterSec($thFootSection);
          }
        });
      });
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

  // Overrideable options
  $.fn.globalNav.options = {
  };

  // Not overrideable
  $.fn.globalNav.settings = {
    hasTouch : Settings.hasTouchEvents || Settings.hasPointerEvents,
    isInitialized : false
  };

  module.initMobileNavIScroll = function() {
    var globalNav = $('.nav-wrapper').data('globalNav');

    // If there's alreaddy a mobileNavIScroll, refresh it.
    // THIS IS HAPPENING ON EVERY KEYSTROKE!
    if (!!globalNav.mobileNavIScroll) {
      var $scroller = $('.nav-mobile-scroller');
      $scroller.css('height', '');
      setTimeout(function() {
        var scrollerHeight = $scroller.outerHeight();
        $scroller.css('height', scrollerHeight);

        setTimeout(function() {
          globalNav.mobileNavIScroll.refresh();
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
          var target = e.target;

          while ( target.nodeType !== 1 ) {
            target = target.parentNode;
          }

          if (target.tagName !== 'SELECT' && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }

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
