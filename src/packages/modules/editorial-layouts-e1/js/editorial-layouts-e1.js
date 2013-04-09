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
        iQ = require('iQ'),
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
      self.collapsableTout = self.$el.find('.m2up, .m3up');
      self.colspan = self.$el.find('.m3up').length >0 ? "span4" : "span6";
      self.colspan = self.collapsableTout.find('.horizontal').length >0 ? "span6" : "span5";
      self.col = self.collapsableTout.find('>div');
      self.useCSS3 = Modernizr.csstransforms && Modernizr.csstransitions;
      
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
        var self = this;      

        self.collapsableTout.sonyCarousel('destroy');
        self.collapsableTout.off(Settings.transEndEventName);
        self.collapsableTout.addClass('grid');
        self.collapsableTout.attr("style", "");
        self.col.addClass(self.colspan);
      },
      initMobile: function(){
        var self = this;
        
        self.collapsableTout.removeClass('grid');
        self.col.removeClass(self.colspan);
        self.collapsableTout.sonyCarousel({
          wrapper: '.editorial.tout .container',
          slides: '.horizontal',
          useCSS3: true,
          paddles: false, 
          pagination: true
        });
        self.collapsableTout.on(Settings.transEndEventName, function(){
          iQ.update(true);
        });
      },
      

      _init: function(){
        var self = this;
       
        //if its a 2 or 3up we want to start the carousel code
        if(self.collapsableTout.length > 0){
         
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
        }
        
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