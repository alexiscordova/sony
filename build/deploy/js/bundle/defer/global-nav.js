// ------------ Sony Global Nav ------------
// Module: Global Nav
// Version: 1.0
// Modified: 2012-12-17 by Christopher Mischler
// Dependencies: jQuery 1.7+, Modernizr
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------

(function($, Modernizr, window, undefined) {

  'use strict';

  // Start module
  var GlobalNav = function( $container ) {

    var self = this;
    self.searchMenu = {};
    self.$container = $container;
    self.$activeNavBtns = self.$container.find('.nav-dropdown-toggle');
    self.$currentOpenNavBtn = false;
    self.$pageWrapOuter = $('#page-wrap-outer');
    self.mobileNavIScroll = false,
    self.mobileNavVisible = false;
    self.mobileNavThreshold = 767;
    self.mobileFooterThreshold = 567;
    self.mouseLeaveDelay = 1000; // delay in ms
    self.mouseleaveTimer = false;

    // we should make a bunch of this stuff global.
    self.transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd',
      'msTransition'     : 'MSTransitionEnd',
      'transition'       : 'transitionend'
    };

    // Get the right prefixed names e.g. WebkitTransitionDuration
    self.tapOrClick = self.hasTouch ? 'touchstart' : 'click';
    self.transformName = Modernizr.prefixed('transform'); // css version
    self.transitionName = Modernizr.prefixed('transition');
    self.transitionProperty = Modernizr.prefixed('transitionProperty');
    self.transitionDuration = Modernizr.prefixed('transitionDuration');
    self.transitionEasing = Modernizr.prefixed('transitionTimingFunction');
    self.transitionEnd = self.transEndEventNames[self.transitionName];

    // if ( $(window).width() <= self.mobileNavThreshold ) {
    //   self.initMobileNav();
    //   self.initMobileFooter();
    // } else {
    //   self.initDesktopNav();
    //   // self.initDesktopFooter();
    // }

    self.init();
  };

  GlobalNav.prototype = {

    constructor: GlobalNav,

    init : function () {
      var self = this;

      self.isInitialized = true;

      // Setting up enquire listeners.
      // These fire the first time they're hit (page-load), and if the breakpoint becomes active during browser resize.

      // this should be moved to somewhere global.
      // var bpLtValues = "bp-lt-1400 bp-lt-1200 bp-lt-1024 bp-lt-980 bp-lt-768 bp-lt-568 bp-lt-480",
      //   bpGteValues = "bp-gte-1400 bp-gte-1200 bp-gte-1024 bp-gte-980 bp-gte-768 bp-gte-568 bp-gte-480",
      //   bpLtValues = bpValues + " " + bpGteValues;
      // //
      // window.enquire.register("(min-width: 48em)", { // 768
      //   match : function() {
      //     $('html').removeClass(bpLtValues).addClass(bpGteValues.split(" bp-gte-568")[0] + bpGteValues.split(" bp-lt-568")[0]);
      //   }
      // });

      if ( window.enquire ){

        // switch to desktop nav
        window.enquire.register("(min-width: " + (self.mobileNavThreshold+1) + "px)", {
          match : function() {
            self.initDesktopNav();
            self.resetMobileNav();
            $('html').removeClass('bp-nav-mobile').addClass('bp-nav-desktop');
          }
        });
        // switch to desktop footer
        window.enquire.register("(min-width: " + (self.mobileFooterThreshold+1) + "px)", {
          match : function() {
            self.resetMobileFooter();
          }
        });

        // switch to mobile nav
        window.enquire.register("(max-width: " + self.mobileNavThreshold + "px)", {
          match : function() {
            self.initMobileNav();
            self.resetDesktopNav();
            $('html').removeClass('bp-nav-desktop').addClass('bp-nav-mobile');
          }
        });
        // switch to mobile footer
        window.enquire.register("(max-width: " + self.mobileFooterThreshold + "px)", {
          match : function() {
            self.initMobileFooter();
          }
        });
      } else {
        self.initDesktopNav();
        self.resetMobileNav();
        $('html').removeClass('bp-nav-mobile').addClass('bp-nav-desktop');
      }
    },

    initDesktopNav : function() {
      var self = this;

      // Set up primary nav buttons
      self.$activeNavBtns.each(function(){

        var $thNavBtn = $(this),
          $thNavBtnTarget = $('.' + $thNavBtn.data('target')),
          $thNavBtnAndTarget = $thNavBtn.add($thNavBtnTarget);


        $thNavBtn.on('click', function(e){
          e.preventDefault();
        });

        // init
        self.resetActiveNavBtn($thNavBtn);

        // $(this).on(self.tapOrClick + ' focus blur', function() {
        // $(this).on(self.tapOrClick, function() {
        // $(this).on('touchstart mouseenter', function() {

        // TOUCH DEVICES
        if ($('body').hasClass("touch")){

          $thNavBtn.on('touchstart', function() {
            // var $thNavBtn = $(this);

            // if this button is already activated,
            if ($thNavBtn.parent().hasClass('nav-li-selected')){
              // just hide/reset it.
              self.resetActiveNavBtn(self.$currentOpenNavBtn);
              self.$currentOpenNavBtn = false;

            // if this button isn't already activated,
            } else {

              // See if any other buttons are activated. If there's NOT
              var otherIsActive = self.$currentOpenNavBtn !== false ? true : false;
              if (!otherIsActive){
                // update the Nav button & open the new tray/menu immediately
                self.setActiveNavBtn($thNavBtn);

              // if there WAS already an active button,
              } else {
                // deactivate it first
                self.resetActiveNavBtn(self.$currentOpenNavBtn);
                var $oldNavTarget = $('.' + self.$currentOpenNavBtn.data('target'));

                // if the open target was a navtray,
                if ($oldNavTarget.hasClass('navtray-w')){
                  // delay opening the new one until the old tray has a chance to close.
                  setTimeout(function(){
                    self.setActiveNavBtn($thNavBtn);
                  },350);
                } else {
                  // update the Nav button & open the new tray after just a short delay for the old menu to fade out.
                  setTimeout(function(){
                    self.setActiveNavBtn($thNavBtn);
                  },150);
                }
              }
            }
          }); // end touchstart

        // NOT touch device - set up HOVER triggers
        } else {

          // for the search button only, we want it to trigger on click. All others on mouseenter.
          var thTrigger = 'mouseenter focus';
          if ($thNavBtn.parent().hasClass('nav-li-search')){
            thTrigger = 'click keypress';
          }

          $thNavBtn.on(thTrigger, function() {
            // var $thNavBtn = $(this);

            $(this).data('hovering',true);
            self.resetMouseleaveTimer();

            // if this button is NOT activated,
            if (!$thNavBtn.parent().hasClass('nav-li-selected')){

              // See if any other buttons are activated.
              var otherIsActive = self.$currentOpenNavBtn !== false ? true : false;
              // If there's NOT
              if (!otherIsActive){
                // update the Nav button & open this tray/menu immediately
                self.setActiveNavBtn($thNavBtn);

              // if there WAS already an active button,
              } else {
                // deactivate it first
                self.resetActiveNavBtn(self.$currentOpenNavBtn);
                var $oldNavTarget = $('.' + self.$currentOpenNavBtn.data('target'));

                // if the open target was a navtray,
                if ($oldNavTarget.hasClass('navtray-w')){
                  // delay opening the new one until the old tray has a chance to close.
                  setTimeout(function(){
                    self.setActiveNavBtn($thNavBtn);
                  },350);
                } else {
                  // update the Nav button & open the new tray after just a short delay for the old menu to fade out.
                  setTimeout(function(){
                    self.setActiveNavBtn($thNavBtn);
                  },150);
                }
              }
            }
          }); // end mouseenter

          // If you mouseOut of the nav button
          $thNavBtn.on('mouseleave', function() {
            $(this).data('hovering',false);
            // Check to see if it was onto the navtray/navmenu.
            // Wait a few ticks to give it a chance for the hover to fire first.
            setTimeout(function(){
              // if you're not hovering over the target,
              if (!$thNavBtnTarget.data('hovering')){
                // shut it down.
                self.startMouseleaveTimer( $thNavBtn );
              } else {
                self.resetMouseleaveTimer();
              }
            },25);
          });

          $thNavBtnTarget.on('mouseenter focus', function() {
            $(this).data('hovering',true);
            self.resetMouseleaveTimer();
          });

          // Activate click for tab navigation
         $thNavBtnTarget.find('a').on('focus', function() {
            
            var navTray = $(this).parents('.navtray-w,.navmenu-w'), 
                navTrayId = $(navTray).attr('id');
            
            $(this).parents('.navtray-w').data('hovering',true);
            $('a[data-target='+navTrayId+']').trigger('mouseenter');
            
            if (!($(navTray).hasClass('navtray-w-visible') || $(navTray).hasClass('navmenu-w-visible'))) {
              $('a[data-target='+navTrayId+']').focus();
            } 
          });

          // If you mouseOut of the target
          $thNavBtnTarget.on('mouseleave', function() {
            $(this).data('hovering',false);
            // Check to see if it was onto this target's button.
            // Wait a few ticks to give it a chance for the hover to fire first.
            setTimeout(function(){
              // if you're not hovering over the target's button
              if (!$thNavBtn.data('hovering')){
                // shut it down.
                self.startMouseleaveTimer( $thNavBtn );
              } else {
                self.resetMouseleaveTimer();
              }
            },25);
          });
        }

      });
    }, // end initDesktopNav
    resetDesktopNav : function() {
      var self = this;

      self.$activeNavBtns.each(function(){

        var $thNavBtn = $(this),
          $thNavBtnTarget = $('.' + $thNavBtn.data('target'));

        // reset the button
        $thNavBtn.removeClass('active').parent().removeClass('nav-li-selected');

        // if there's a navTray/navMenu, reset it
        if ($thNavBtn.data('target').length){
          var $thNavTarget = $('.' + $thNavBtn.data('target'));

          if ($thNavTarget.hasClass('navtray-w')){
            self.setNavTrayContentNaturalFlow($thNavTarget, false);
          } else {
            $('.navmenu-w-visible')
              .removeClass('navmenu-w-visible')
              .one(self.transitionEnd,function(){
              $(this)
                .css({'left':'','right':''})
                .find('.reveal-transition-container').css('height','');
            });
          }
        }

        // reset touch -- even if these aren't visible on mobile, it's still better to reset them, since they'll get re-inited if switch back
        $thNavBtn.off('touchstart mouseenter mouseleave click');
        $thNavBtnTarget.off('touchstart mouseenter mouseleave click');


      });

    },

    startMouseleaveTimer : function( $thNavBtn ) {
      var self = this;
      if ($('mouseleaveTimerActive').length){
        self.resetMouseleaveTimer();
      }
      $thNavBtn.addClass('mouseleaveTimerActive');
      self.mouseleaveTimer = setTimeout(function(){
        self.resetActiveNavBtn($thNavBtn);
        self.resetMouseleaveTimer();
      }, self.mouseLeaveDelay);
    },
    resetMouseleaveTimer : function () {
      var self = this;
      clearTimeout(self.mouseleaveTimer);
      $('.mouseleaveTimerActive').removeClass('mouseleaveTimerActive');
    },

    setActiveNavBtn : function( $btn ){
      var self = this;
      self.activateNavBtn($btn);
      self.$currentOpenNavBtn = $btn;
    },
    resetActiveNavBtn : function ( $oldNavBtn ) {
      var self = this;

      // reset this button
      !!$oldNavBtn && $oldNavBtn.removeClass('active').parent().removeClass('nav-li-selected');

      // if there's a navTray/navMenu, reset it
      if (!!$oldNavBtn.data('target')){
        var $thNavTarget = $('.' + $oldNavBtn.data('target'));

        if ($thNavTarget.hasClass('navtray-w')){
          self.slideNavTray($thNavTarget, false);
        } else {
          $('.navmenu-w-visible')
            .removeClass('navmenu-w-visible')
            .one(self.transitionEnd,function(){
              $(this)
                .css({'left':'','right':''})
                .find('.reveal-transition-container').css('height','');
            });
        }
      }
    },

    slideNavTray : function( $navTray, opening ){
      var self = this,
        startHeight,
        endHeight,
        expandedHeight = $navTray.outerHeight();

      $navTray.data('expandedHeight',expandedHeight);


      if (opening){
        startHeight = '1px';
        endHeight = expandedHeight;
      } else {
        // if you're not opening, it's just initializing on page load
        startHeight = expandedHeight;
        endHeight = '1px';
        
        // if it ie, we remove the animation
        // **TODO** add jquery animation for ie9+
        if ($('html').hasClass('lt-ie10')){
         endHeight = expandedHeight;
        }
      }

      $navTray
        .data('expandedHeight',startHeight)
        .css('height', startHeight)
        .find('.navtray')
          .addClass('navtray-absolute')
          .css('height',expandedHeight);

      setTimeout(function(){ // wait just a moment to make sure the height is applied
        $navTray
          .removeClass('no-transition');

        setTimeout(function(){ // wait just a moment to make sure the height is applied
          $navTray
            .css('height',endHeight)
            .one(self.transitionEnd, onNavTrayComplete);

            if (opening){
              $navTray.addClass('navtray-w-visible');
            } else {
              $navTray.removeClass('navtray-w-visible');
            }

        },10);
      },10);

      function onNavTrayComplete(){
        // prepare the tray for browser resize - even though it's offscreen, we still need to get its natural height next time we need to expand it.
        self.setNavTrayContentNaturalFlow($navTray);
      }
    },
    resetNavTray : function ($navTray ) {
      var self = this;

      $navTray
        .removeClass('navtray-w-visible')
        // .removeClass('no-transition')
        .css('height','')
        .find('.navtray')
          .removeClass('navtray-absolute')
          .css('height','');
    },

    setNavTrayContentNaturalFlow : function($navTray){
      $navTray
        .css('height','')
        .addClass('no-transition')
        .find('.navtray')
          .removeClass('navtray-absolute')
          .css('height','');
    },

    activateNavBtn : function ($newNavBtn) {
      var self = this;

      $newNavBtn.addClass('active').parent().addClass('nav-li-selected');

      // if there's a navTray/navMenu, reset it to get its height
      if ($newNavBtn.data('target').length){
        var $thNavTarget = $('.' + $newNavBtn.data('target'));


        // figure out if this is a tray or menu.
        if ($thNavTarget.hasClass('navtray-w')){
          // it's a nav-tray
          // first get the tray's natural height, which it should have offscreen.
          // expand the tray. When it's done, set it to position:relative and natural heights.
          if ($('html').hasClass('lt-ie10')){
            // going to do something special for oldIE since it's not sliding anyway, and it can be set up to just use display:none.
            self.slideNavTray($thNavTarget, true);
          } else {
            self.slideNavTray($thNavTarget, true);
          }
        } else {
          // it's a nav-menu - show the menu.
          var $revealContainer = $thNavTarget.find('.reveal-transition-container');
          var expHeight = $revealContainer.height();

          $revealContainer.css('height','0px');
          // wait a tick to make sure the height is set before adding the transition-height class, to make sure it doesn't animate
          setTimeout(function(){
            $revealContainer.addClass('transition-height');
            // wait a tick to make sure the transition-height is set before changing the height & animating.
            setTimeout(function(){
              $thNavTarget.addClass('navmenu-w-visible');
              $revealContainer.height(expHeight);
              $revealContainer.one(self.transitionEnd,function(){
                $revealContainer.removeClass('transition-height');
                setTimeout(function(){
                  $revealContainer.css('height','');
                },1);
              });
            },1);
          },1);

          // just the search menu, needs to be positioned with js. This way it can be in the flow at the top of the page, so it's in place for mobile.
          if ($thNavTarget.hasClass('navmenu-w-search')){
            // Line it up with the right edge of the search button.
            var btnRightEdge = $newNavBtn.parent().position().left + parseInt( $newNavBtn.css('marginLeft'),10 ) + $newNavBtn.innerWidth();
            var leftPos = btnRightEdge - $thNavTarget.innerWidth();
            $thNavTarget.css({'right':'auto','left':leftPos+'px'});
          }
        }
      }
    },

    // MOBILE NAV
    initMobileNav : function(){
      var self = this;
      $('#btn-mobile-nav').on(self.tapOrClick,function(){
        if (!self.mobileNavVisible){
          self.showMobileNav();
        } else {
          self.hideMobileNav();
        }
      });
      var $thInput = $('#nav-search-input');
      $thInput.on('focus', function(){
        if ($('html').hasClass('bp-nav-mobile')){
          self.initMobileNavIScroll();
        }
        $('.page-wrap-inner').addClass("show-mobile-search-results");
      }).on('blur',function(){

        // disable blur on mobile search input
        if (!$('html').hasClass('bp-nav-mobile')){
          $('.page-wrap-inner').removeClass("show-mobile-search-results");
        }
      }).closest('.input-group').find('.input-clear-btn').on(self.tapOrClick,function(){
        if ($('html').hasClass('bp-nav-mobile')){
          self.initMobileNavIScroll();
          $('.page-wrap-inner').removeClass("show-mobile-search-results");
          setTimeout(function(){
            $thInput.trigger('blur');
          },2);
        }
      });

    }, // end initMobileNav
    resetMobileNav : function(){
      var self = this;
      self.hideMobileNav();
      $('#btn-mobile-nav').off(self.tapOrClick);
      $('.mobile-screen-overlay').remove();
    },

    showMobileNav : function(){
      var self = this;

      self.showMobileBackdrop();

      // Since the page-wrap-inner is going to be fixed, the browser will see the page as having no height.
      // on iOS, this means the Safari nav will always be visible. And that's not cool. So, to give the
      // page some height, so the Safari nav will hide.
      // need tp compensate for Safari nav bar on iOS - MAY BE DIFFERENT ON ANDROID/OTHER.
      var pageHeight = parseInt( $(window).height(),10 ) + 'px';
      // var pageHeight = parseInt( $(window).height(),10 ) + 60 + 'px';
      self.$pageWrapOuter.height(pageHeight);

      if (!self.mobileNavIScroll){
        var $outer = $('#nav-outer-container'),
          $inner = $outer.find('.nav-mobile-scroller'),
          innerHeight = $inner.height();

        $outer.height(pageHeight);
        $inner.height(innerHeight);

        setTimeout(function(){ // make sure heights are already set before initializing iScroll.
          self.initMobileNavIScroll();
        },1);
      }

      $('#page-wrap-inner').addClass('show-mobile-menu');
      self.mobileNavVisible = true;
    },
    hideMobileNav : function(){
      var self = this;
      self.hideMobileBackdrop();

      $('#page-wrap-inner').one(self.transitionEnd, function(){
        // wait until the $('#page-wrap-inner') is done animating closed before destroying the iScroll.
        self.destroyMobileNavIScroll();
      });
      $('#page-wrap-inner').removeClass('show-mobile-menu');
      self.mobileNavVisible = false;
    },
    initMobileNavIScroll:  function() {
      var self = this;
      // if there's alreaddy a mobileNavIScroll, refresh it.
      if (!!self.mobileNavIScroll){
        $('.nav-mobile-scroller').css('height','100%');
        // self.mobileNavIScroll.refresh();
      // if not, init it.
      } else {
        self.mobileNavIScroll = new window.IScroll('nav-outer-container',{ vScroll: true, hScroll: false, hScrollbar: false, snap: false, momentum: true, bounce: false });
        self.mobileNavIScroll.options.onBeforeScrollStart = function(e) {
          var target = e.target;

          while (target.nodeType != 1) {
            target = target.parentNode;
          }

          if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'){
            e.preventDefault();
          }
        };
      }
    },
    destroyMobileNavIScroll : function() {
      var self = this;
      !!self.mobileNavIScroll && self.mobileNavIScroll.destroy();
      self.mobileNavIScroll = false;
      self.$pageWrapOuter.css('height','');
    },

    showMobileBackdrop : function(){
      var self = this;

      self.$mobileScreenOverlay = $('<div class="modal-backdrop mobile-screen-overlay opacity0" />')
        .appendTo($('#page-wrap-inner'));

      setTimeout(function(){
        self.$mobileScreenOverlay.removeClass('opacity0').addClass('opacity1');
      },1);
    },
    hideMobileBackdrop : function(){
      var self = this;

      !!self.$mobileScreenOverlay && self.$mobileScreenOverlay.one(self.transitionEnd, function(){
        self.$mobileScreenOverlay.remove();
      });

      !!self.$mobileScreenOverlay && self.$mobileScreenOverlay.removeClass('opacity1').addClass('opacity0');
    },

    // MOBILE FOOTER
    initMobileFooter : function() {
      var self = this;

      // init the country-selector popup menu -- disabled.
      // $('#country-selector').on('mouseenter mouseleave',function(){
      //   var pageContainerWidth = $(this).closest('.grid-footer').width();
      //   $(this).find('.dropdown-hover-menu-lists-w').width(pageContainerWidth);
      // });

      self.footerNavCollapseHeight = 49; // plus 1 for the border

      $('#footer-wrapper .footer-mobile-section h5').each(function(){

        var $thFootSection = $(this).parent();

        // on init, the footers should collapse.
        self.collapseMobileFooterSec($thFootSection, true);


        $(this).on(self.tapOrClick,function(){

          if ($thFootSection.hasClass('collapsed')){
            // collapsed height - expand it.
            self.expandMobileFooterSec($thFootSection);
          } else {
            self.collapseMobileFooterSec($thFootSection);
          }
        });
      });
    },
    resetMobileFooter : function(){
      var self = this;

      $('#footer-wrapper .footer-mobile-section h5').each(function(){
        var $thFootSection = $(this).parent();
        $thFootSection.css('height','').removeClass('collapsed transition-height');
        $(this).off(self.tapOrClick);
      });

    }, // end resetMobileFooter

    collapseMobileFooterSec : function ( $thFootSection, isPageInit ) {
      var self = this;

      isPageInit = typeof isPageInit !== 'undefined' ? isPageInit : false;

      // natural height - collapse it.
      var expHeight = $thFootSection.height();
      $thFootSection.data('expHeight',expHeight);

      if (isPageInit){
        $thFootSection
          .height(self.footerNavCollapseHeight)
          .addClass('collapsed');
        // after it's collapsed, add the transition-height class for animating later.
        setTimeout(function(){
          $thFootSection.addClass('transition-height');
        },1);
      // NOT on page init, collapse it normally.
      } else {
        // set initial height to its current / expanded height so there's something to animate from
        $thFootSection.height(expHeight);
        // wait a tick to make sure the height is set before adding the transition-height class, to make sure it doesn't animate
        setTimeout(function(){
          $thFootSection.addClass('transition-height');
          // wait a tick to make sure the transition-height is set before changing the height & animating.
          setTimeout(function(){
            $thFootSection
              .height(self.footerNavCollapseHeight)
              .addClass('collapsed');
          },1);
        },1);
      }
    },
    expandMobileFooterSec : function ( $thFootSection ) {
      var self = this;

      $thFootSection
        .height($thFootSection.data('expHeight'))
        .removeClass('collapsed')
        .one(self.transitionEnd, function(){
          // when the transition is complete, put the section back into natural height, in case the window was resized.
          $thFootSection.removeClass('transition-height');
          // ...after waiting a tick to make sure everything else is already set.
          setTimeout(function(){
            $thFootSection.css('height','');
          },1);
        });
    } // end expandMobileFooterSec
  }; // end GlobalNav.prototype

  // Plugin definition
  $.fn.globalNav = function( opts ) {
    var args = Array.prototype.slice.apply( arguments );
    return this.each(function() {
      var self = $(this),
        globalNav = self.data('globalNav');

      // If we don't have a stored globalNav, make a new one and save it
      if ( !globalNav ) {
        globalNav = new GlobalNav( self );
        self.data( 'globalNav', globalNav );
      }

      if ( typeof opts === 'string' ) {
        globalNav[ opts ].apply( globalNav, args.slice(1) );
      }
    });
  }; // end $.fn.globalNav


  // Overrideable options
  $.fn.globalNav.options = {
    sampleOption: 0
  };

  // Not overrideable
  $.fn.globalNav.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };

})(jQuery, Modernizr, window);


$(function() {
  $(document).ready(function() {
    $('.nav-wrapper').globalNav();
  });


});


