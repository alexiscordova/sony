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
          //this makes the header grow 1px taller for every 20px over 980w..
          $('.primary-tout.product-intro-plate .image-module').css('height', Math.round(Math.min(720, 560 + ((w - 980) / 5))));
          $('.primary-tout.default .image-module, .primary-tout.homepage .image-module').css('height', Math.round(Math.min(640, 520 + ((w - 980) / 5))));
        }else{
          //this removes the dynamic css so it will reset back to responsive styles
          $('.primary-tout .image-module').css('height', '');
        }

        //centers homepage primary box vertically above secondary box
        $.each ($('.primary-tout.homepage .inner .table-center-wrap'), function(i,e){
          var self = $(e);
          var outer = self.closest('.primary-tout.homepage');
          self.height(outer.height() - outer.find('.secondary').outerHeight());
        });
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

            self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').removeClass('off-screen visuallyhidden');

            submodule.addClass('off-screen visuallyhidden')
                .trigger('PrimaryTout:submoduleActivated');

            self.$el.find('.sony-video').data('sonyVideo').api().pause();
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
