// Primary Tout Module
// --------------------------------------------
//
// * **Class:** PrimaryTout
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Thisispete
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

// *REFACTOR NOTES:* We need to be smarter about how we search with jQuery. Class-based searches are
// very slow, particularly in older browsers, and add extra scripting when caching is easy to do.
// `.primary-tout` in particular is accessed over and over.

// Also `init()` is doing far too much, and isn't understandable at a glance. It should be broken out
// in to separate methods, with comments to describe each.

define(function(require){

    'use strict';

    var $ = require('jquery'),
        // enquire = require('enquire'),
        iQ = require('iQ'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment');

    var module = {
      init: function() {
        var self = this;
        if ( $('.primary-tout').length > 0 ) {
          $('.primary-tout').primaryTout();
        }
      }
    };

    // Start module
    var PrimaryTout = function(element, options){
      var self = this;
      self.$el = $(element);
      $.extend(self, {}, $.fn.primaryTout.defaults, options, $.fn.primaryTout.settings);
      self.hasAddonSubmodule = self.$el.find('.submodule').length > 0;
      self._init();

    };

    PrimaryTout.prototype = {
      constructor: PrimaryTout,

      fixTitleHeight: function(){
         var self = this, minh,
         hero = self.$el.find('.hero-image .image-module');
         hero.css('height', '');

         minh = Math.max(hero.innerHeight(), self.$el.find('.inner .box').innerHeight());

         self.$el.find('.hero-image .image-module').css('height', minh);
      },

      resize: function(){

        var w = $(window).outerWidth();
        if(w > 980){
          //this makes the header grow 1px taller for every 20px over 980w.. but only up to 75% of window height

          $('.primary-tout.product-intro-plate .image-module').css('height', Math.round(Math.min(720, Math.min(Settings.$window.height() * 0.75, 560 + ((w - 980) / 5)))));

          $('.primary-tout.default .image-module, .primary-tout.homepage .image-module').css('height', Math.round(Math.min(640, Math.min(Settings.$window.height() * 0.75, 520 + ((w - 980) / 5)))));
        }else{
          //this removes the dynamic css so it will reset back to responsive styles
          $('.primary-tout .image-module').css('height', '');
        }

        //centers primary box vertically above secondary box if secondary box is found
        $.each ($('.primary-tout .inner .table-center-wrap'), function(i,e){
          var self = $(e);
          var outer = self.closest('.primary-tout');
          if (outer.find('.secondary').outerHeight()){
            self.height(outer.height() - outer.find('.secondary').outerHeight());
          }
        });
      },

      setupSubmodules : function() {
        var self = this,
            $video;

        self.$addonTrigger = self.$el.find('.addon-media');
        // The addon submodule will be off screen when this module is initialized
        self.$addonModule = self.$el.find('.submodule.off-screen');
        self.$closeBtn = self.$addonModule.find('.box-close');

        // The submodule that will be hidden while the addon is visible
        self.$submodule = self.$addonModule.siblings();

        // .editorial.full-inner <- $el
          // .container <- submodules
            // .submodule <- visible submodule ( $submodule )
            // .submodule.off-screen.visuallyhidden
          // .container <- text content
        if ( self.$el.hasClass('full-inner') ) {
          // If this is a full-inner editorial, the content needs to be hidden too
          self.$content = self.$submodule.parent().siblings();
        } else {
          // Empty jQuery object so it doesn't throw errors
          self.$content = $();
        }

        // Playing and pausing needs to happen if the submodule is a video
        $video = self.$addonModule.find('.sony-video');
        self.isVideoAddon = $video.length > 0;

        // Save the api
        if ( self.isVideoAddon ) {
          self.$video = $video;
        }

        self.isSubmoduleOpen = false;

        // Bind to necessary events
        self.setupSubmoduleEvents();
      },


      // A reference to the API cannot be saved when this module is
      // initialized because the video might not be initialized yet
      videoAPI : function() {
        return this.$video.data('sonyVideo').api();
      },

      setupSubmoduleEvents : function() {
        var self = this;

        self.$addonTrigger.on('click', $.proxy( self.onAddonClick, self ) );
        self.$closeBtn.on('click', $.proxy( self.onCloseClick, self ) );
        Settings.$window.on('e5-slide-change', $.proxy( self.onCloseClick, self ) );


        // Mouse events for close button
        if ( !Settings.hasTouchEvents ) {
          //show hide close button on hover over module
          self.$addonModule.on('mouseenter.submodule', function(){
            self.isHovered = true;
            self.$closeBtn.removeClass('close-hide');
          });

          self.$addonModule.on('mouseleave.submodule', function(){
            self.isHovered = false;
            self.$closeBtn.addClass('close-hide');
          });
        }
      },

      onAddonClick : function( evt ) {
        var self = this,
            hiddenClass = 'off-screen visuallyhidden';

        evt.preventDefault();
        evt.stopPropagation();

        // Don't do anything if the submodule is already open
        if ( self.isSubmoduleOpen ) {
          return;
        }

        self.$submodule
          .add( self.$content )
          .addClass( hiddenClass );

        self.$addonModule.removeClass( hiddenClass );

        iQ.update();

        // Automatically play the video
        if ( self.isVideoAddon ) {
          self.videoAPI().play();
        }

        self.isSubmoduleOpen = true;
      },

      onCloseClick : function( evt ) {
        var self = this,
            hiddenClass = 'off-screen visuallyhidden';

        evt.preventDefault();
        evt.stopPropagation();

        // Pause the video
        if ( self.isVideoAddon ) {
          self.videoAPI().pause();
        }

        self.$submodule
          .add( self.$content )
          .removeClass( hiddenClass );

        self.$addonModule.addClass( hiddenClass );

        self.isSubmoduleOpen = false;
      },

      _init: function(){
        var self = this;

        if($(".primary-tout.homepage, .primary-tout.default, .primary-tout.product-intro-plate").length > 0){
          self.resize();
          Environment.on('global:resizeDebounced', $.proxy(self.resize, self));
        }

        if (self.$el.hasClass('title-plate')) {
          self.fixTitleHeight();
          Environment.on('global:resizeDebounced', $.proxy(self.fixTitleHeight, self));
        }

        if ( self.hasAddonSubmodule && self.$el.hasClass('default')) {
          self.setupSubmodules();
        }

        var btn = self.$el.find(".inner .box a.video, .inner .box a.carousel, .mobile-buttons a.video, .mobile-buttons a.carousel");

        if(btn.length > 0){
          btn.on('click', function(e){
            e.preventDefault();
            if(!Settings.isIPhone || $(this).hasClass('carousel')){

              self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').addClass('off-screen visuallyhidden');

              self.$el.find('.submodule').eq($(this).data('submodule')).removeClass('off-screen visuallyhidden')
                  .trigger('PrimaryTout:submoduleActivated');
            }
            //update for slideshow coming into view
            iQ.update();
            //play video if its a video button
            if($(this).hasClass('video')){
              self.$el.find('.sony-video').data('sonyVideo').api().play();

            }
          });

          var submodule = self.$el.find('.submodule');
          var close = submodule.find('.box-close');

          submodule.find('.box-close').on('click', function(e){
            e.preventDefault();

            self.$el.find('.sony-video').data('sonyVideo').api().fullscreen(false);
            self.$el.find('.sony-video').data('sonyVideo').api().pause();

            self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').removeClass('off-screen visuallyhidden');

            submodule.addClass('off-screen visuallyhidden').trigger('PrimaryTout:submoduleActivated');
          });

          if(!Settings.hasTouchEvents){
            //show hide close button on hover over module
            submodule.on('mouseenter.submodule', function(){
              self.isHovered = true;
              close.removeClass('close-hide');
            });

            submodule.on('mouseleave.submodule', function(){
              self.isHovered = false;
              close.addClass('close-hide');
            });
          }

        }



        log('SONY : PrimaryTout : Initialized');
      }
    };

    // Plugin definition
    $.fn.primaryTout = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          primaryTout = self.data('primaryTout');

        // If we don't have a stored moduleName, make a new one and save it
        if ( !primaryTout ) {
            primaryTout = new PrimaryTout( self, options );
            self.data( 'primaryTout', primaryTout );
        }

        if ( typeof options === 'string' ) {
          primaryTout[ options ].apply( primaryTout, args );
        }
      });
    };

    return module;

});
