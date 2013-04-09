// Editorial Module
// --------------------------------------------
//
// * **Class:** Editorial
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Thisispete
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

define(function(require){

    'use strict';

    var $ = require('jquery'),
        enquire = require('enquire'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        SonyCarousel = require('secondary/sony-carousel');

    var module = {
      init: function() {
        if ( $('.editorial').length > 0 ) {
          $('.editorial').editorial();
        }
      }
    };

    // Start module
    var Editorial = function(element, options){
      var self = this;
      
      self.$el = $(element);
      self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;
      self.carouselEnabled = false;

      self._init();
    };

    Editorial.prototype = {
      constructor: Editorial,

      resize: function(){
        var self = this;

        //fixes horizontal 2 up layout wraping
        var tc = $('.editorial.tout .m2up .horizontal .table-center-wrap');
        if(tc){
          tc.width(tc.parent().width() - tc.prev().width() - 81);
        }
      },
      
      initDesktop: function(){
        $('.editorial.tout .m2up').addClass('grid');
        $('.editorial.tout .m2up').css("");
        $('.editorial.tout .m2up .horizontal').addClass('span6');
      },
      initMobile: function(){
        $('.editorial.tout .m2up').removeClass('grid');
        $('.editorial.tout .m2up .horizontal').removeClass('span6');
        $('.editorial.tout .m2up').sonyCarousel({
          wrapper: '.editorial.tout .container',
          slides: '.horizontal',
          useCSS3: true,
          paddles: false, 
          pagination: true
        });
      },
      

      _init: function(){
        var self = this;
        
        if ( !Settings.$html.hasClass('lt-ie10') ){
          enquire.register("(min-width: 768px)", function() {
            self.initDesktop();
          });
          enquire.register("(max-width: 767px)", function() {
            self.initMobile();
          });
        } else {
          self.initDesktop();
        }
        
        self.resize();
        Environment.on('global:resizeDebounced', $.proxy(self.resize, self));
        
        log('SONY : Editorial : Initialized');
      }
    };

    // Plugin definition
    $.fn.editorial = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          editorial = self.data('editorial');

        // If we don't have a stored moduleName, make a new one and save it
        if ( !editorial ) {
            editorial = new Editorial( self, options );
            self.data( 'editorial', editorial );
        }

        if ( typeof options === 'string' ) {
          editorial[ options ].apply( editorial, args );
        }
      });
    };

    return module;

});