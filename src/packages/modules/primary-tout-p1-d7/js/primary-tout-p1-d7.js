// Primary Tout Module
// --------------------------------------------
//
// * **Class:** PrimaryTout
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Thisispete
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

define(function(require){

    'use strict';

    var $ = require('jquery'),
        // enquire = require('enquire'),
        // iQ = require('iQ'),
        // Settings = require('require/sony-global-settings'),
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
        
        var btn = self.$el.find(".inner .box a, .mobile-buttons a");

        if(btn.length > 0){
          btn.on('click', function(e){
            e.preventDefault();
            self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').addClass('hidden');
            self.$el.find('.submodule').eq($(this).data('submodule')).removeClass('hidden');
            //play video?
          });
          self.$el.find('.submodule .box-close').on('click', function(e){
            e.preventDefault();
            self.$el.find('.hero-image, .inner, .mobile-buttons-wrap').removeClass('hidden');
            self.$el.find('.submodule').addClass('hidden');
          });
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
