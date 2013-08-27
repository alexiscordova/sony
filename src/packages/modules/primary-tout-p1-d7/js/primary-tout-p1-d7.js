// Primary Tout Module
// --------------------------------------------
//
// * **Class:** PrimaryTout
// * **Version:** 1.0
// * **Modified:** 08/06/2013
// * **Author:** Thisispete
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

define(function(require){

  'use strict';

  var $ = require('jquery'),
      enquire = require('enquire'),
      iQ = require('iQ'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment');

  var module = {
    init: function() {
      var $primaryTout = $('.primary-tout');
      if ( $primaryTout.length > 0 ) {
        $primaryTout.primaryTout();
      }
    }
  };

  // Start module
  var PrimaryTout = function(element, options){
    var self = this;
    self.$el = $(element);
    $.extend(self, {}, $.fn.primaryTout.defaults, options, $.fn.primaryTout.settings);
    self._init();
  };

  PrimaryTout.prototype = {
    constructor: PrimaryTout,

    fixTitleHeight: function(){
       var self = this, minh,
       hero = self.$imageModule;
       hero.css('height', '');

       minh = Math.max(hero.innerHeight(), self.$el.find('.inner .box').innerHeight());

       hero.css('height', minh);
    },

    resize: function() {
      var self = this,
          w = Settings.$window.width();

      // This makes the header grow 1px taller for every 20px over 980w.. but only up to 75% of window height
      if (w > 980) {
        var h = Settings.$window.height(),
        imageModuleHeight = self.getImageHeight( w, h, self.isProductIntroPlate );

        // Set
        self.$imageModule.css('height', imageModuleHeight);

      // This removes the dynamic css so it will reset back to responsive styles
      } else {
        self.$imageModule.css('height', '');
      }

      //make sure legal div is either on top or bottom of the panel
      if(w > 767){
        self.$el.find('.legal-div').closest('.table-center').find('.box').css('margin-top' , '');
        $('.legal-div').appendTo(self.$el.find('.legal-div').closest('.table-center'));
        self.$el.find('.legal-icon').removeClass('small');
       // console.log('appending to table-center');
      }else{
        self.$el.find('.legal-div').closest('.table-center').find('.box').css('margin-top' , '0px');
        self.$el.find('.legal-div').prependTo(self.$el.find('.legal-div').closest('.table-center'));
        self.$el.find('.legal-icon').addClass('small');
        //console.log('prepending to table-center');
      }

      // If a secondary box exists, the primary one needs to be adjusted
      if ( self.hasSecondaryBox ) {
        self.centerPrimaryBox();
      }
    },

    getImageHeight : function( windowWidth, windowHeight, isProductIntroPlate ) {
      var seventyFivePercentHeight = windowHeight * 0.75,
          increment = (windowWidth - 980) / 5,
          imageModuleHeight = 0;

      // Product intro plate
      if ( isProductIntroPlate ) {
        imageModuleHeight = Math.min(
          720,
          Math.min(seventyFivePercentHeight, 560 + increment)
        );

      // Homagepage or default
      } else {
        imageModuleHeight = Math.min(
          640,
          Math.min(seventyFivePercentHeight, 520 + increment)
        );
      }

      return Math.round( imageModuleHeight );
    },

    // Centers primary box vertically above secondary box if secondary box is found
    centerPrimaryBox : function() {
      var self = this,
          $el = self.$el.find('.inner .table-center-wrap'),
          $outer = self.$el,
          $secondary = self.$secondary,
          elementHeight = false,
          secondaryHeight,
          outerHeight;

      if ( self.hasSecondaryBox ) {
        outerHeight = $outer.height();
        secondaryHeight = $secondary.outerHeight();
        elementHeight = outerHeight - secondaryHeight;
        $el.height( elementHeight );
      }
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

    setVars : function() {
      var self = this;

      // Set the mode
      self.isTitlePlate = self.$el.hasClass('title-plate');
      self.isProductIntroPlate = self.$el.hasClass('product-intro-plate');
      self.isHomepage = self.$el.hasClass('homepage');
      self.isDefault = self.$el.hasClass('default');

      // Cache some jQuery lookups
      self.$secondary = self.$el.find('.secondary');
      self.$imageModule = self.$el.find('.image-module');
      self.$btn = self.$el.find('.inner .box a.video, .inner .box a.carousel, .mobile-buttons a.video, .mobile-buttons a.carousel');

      // What does this module have?
      self.hasSecondaryBox = self.$secondary.length > 0;
      self.hasBtn = self.$btn.length > 0;
      self.hasAddonSubmodule = self.$el.find('.submodule').length > 0;
    },

    _init: function() {
      var self = this;

      self.setVars();

      // Need a resize listener on all modes except title plate
      if ( !self.isTitlePlate ) {
        self.resize();
        Environment.on('global:resizeDebounced', $.proxy(self.resize, self));
      }

      if ( self.isTitlePlate ) {
        self.fixTitleHeight();
        Environment.on('global:resizeDebounced', $.proxy(self.fixTitleHeight, self));
      }

      // Adds event listeners for the addons
      if ( self.hasAddonSubmodule && self.isDefault ) {
        self.setupSubmodules();
      }

      // Adds event listeners for hidden submodules like the pdp slideshow
      // and the video submodule
      if ( self.hasBtn ) {
        self.setupButtons( self.$btn );
      }

      log('SONY : PrimaryTout : Initialized');
    },

    setupButtons : function( $btn ) {
      var self = this;
      var $submodule = self.$el.find('.submodule');
      var $close = $submodule.find('.box-close');

      $btn.on( 'click', $.proxy( self.onSubmoduleBtnClick, self ) );
      $close.on( 'click', $.proxy( self.onSubmoduleCloseClick, self ) );

      if ( !Settings.hasTouchEvents ) {
        //show hide close button on hover over module
        $submodule.on('mouseenter.submodule', function(){
          self.isHovered = true;
          $close.removeClass('close-hide');
        });

        $submodule.on('mouseleave.submodule', function(){
          self.isHovered = false;
          $close.addClass('close-hide');
        });
      }
    },

    onSubmoduleBtnClick : function( e ) {
      var self = this,
          btn = e.delegateTarget,
          $btn = $( btn ),
          sonyVideo = self.$el.find('.sony-video').data('sonyVideo');

      e.preventDefault();

      if ( !Settings.isIPhone || $btn.hasClass('carousel') ) {

        self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').addClass('off-screen visuallyhidden');

        self.$el.find('.submodule')
          .eq($btn.data('submodule'))
            .removeClass('off-screen visuallyhidden')
            .trigger('PrimaryTout:submoduleActivated');
      }

      // Update for slideshow coming into view
      iQ.update();

      // Play video if its a video button
      if ( sonyVideo && $btn.hasClass('video') ) {
        sonyVideo.api().play();
      }
    },


    onSubmoduleCloseClick : function( e ) {
      var self = this;
      var $submodule = self.$el.find('.submodule');
      var sonyVideo = self.$el.find('.sony-video').data('sonyVideo');

      e.preventDefault();

      // Video must be preset to pause it
      if ( sonyVideo ) {
        sonyVideo.api().fullscreen(false);
        sonyVideo.api().pause();
      }

      self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').removeClass('off-screen visuallyhidden');

      $submodule.addClass('off-screen visuallyhidden').trigger('PrimaryTout:submoduleActivated');
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
