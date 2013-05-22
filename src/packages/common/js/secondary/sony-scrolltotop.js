// ScrollToTop
// -----------------
//
// * **Class:** ScrollToTop
// * **Version:** 0.1
// * **Adapted by:** Pete Schirmer
// * **Dependencies:** Tested with jQuery 1.9
//
define(function(require){

    'use strict';

    var $ = require('jquery'),
        Settings = require('require/sony-global-settings'),
        Utilities = require('require/sony-global-utilities'),
        Environment = require('require/sony-global-environment');

    var module = {
      init: function() {
        if ( $('.scroll-to-top').length > 0 ) {
          $('.scroll-to-top').scrollToTop();
        }
      }
    };

    // Start module
    var ScrollToTop = function(element, options){
      var self = this;
      $.extend(self, {}, $.fn.scrollToTop.defaults, options, $.fn.scrollToTop.settings);

      self.$el = $(element);
      self.$window = Settings.$window;
      self._init();
    };

    ScrollToTop.prototype = {
      constructor: ScrollToTop,

      update: function(){
        var self = this;
        var top = self.$window.scrollTop();

        console.log(top, self.$el);
        //if position of footer > scrolltop + viewport height //ie in view put it inline
        self.$el.toggleClass('fixed', self.$el.next().offset().top > top + Settings.windowHeight);

        //if scrolltop > 400 remove opacity0
        self.$el.toggleClass('opacity0', top < 400);
      },

      _init: function(){
        var self = this;
        if(Settings.isModern){
          self.update();
          Environment.on('global:resizeDebounced', $.proxy(self.update, self));
          self.$window.on('scroll', $.proxy( self.update, self ));
        }else{
          self.$el.removeClass('opacity0');
        }

        self.$el.find('a').on('click', function(e){
          e.preventDefault();
          Utilities.scrollToTop();
        });

        log('SONY : ScrollToTop : Initialized');
      }
    };

    // Plugin definition
    $.fn.scrollToTop = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          scrollToTop = self.data('scrollToTop');

        // If we don't have a stored moduleName, make a new one and save it
        if ( !scrollToTop ) {
            scrollToTop = new ScrollToTop( self, options );
            self.data( 'scrollToTop', scrollToTop );
        }

        if ( typeof options === 'string' ) {
          scrollToTop[ options ].apply( scrollToTop, args );
        }
      });
    };

    module.init();

    return module;

});
