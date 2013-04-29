// Editorial Module
// --------------------------------------------
//
// * **Class:** Editorial
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Thisispete
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

define(function(require) {

    'use strict';

    var $ = require('jquery'),
        enquire = require('enquire'),
        Modernizr = require('modernizr'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        SonyCarousel = require('secondary/sony-carousel'),
        EvenHeights = require('secondary/sony-evenheights');

    var module = {
      init: function() {
        if ( $('.editorial').length ) {
          $('.editorial').editorial();
        }
      }
    };

    // Start module
    var Editorial = function(element/*, options*/) {
      var self = this;

      self.$el = $(element);
      self.collapsableTout = self.$el.find('.m2up, .m3up');
      self.colspan = self.$el.find('.m3up').length ? 'span4' :
        self.collapsableTout.find('.horizontal').length ?
          'span6' :
          'span5';
      self.col = self.collapsableTout.find('>div');
      self.hasOffset1 = self.col.hasClass('offset1');

      self._init();
    };

    Editorial.prototype = {
      constructor: Editorial,

      // Fixes the min height of medialeft and mediaright on resize
      fixMediaHeights: function() {
        var self = this, minh;

        if ($(window).outerWidth() <= 767) {
          minh = 'auto';
        } else {
          minh = Math.max(
            self.$el.find('.grid').css('min-height').replace(/[^-\d\.]/g, ''),
            self.$el.find('.media-element .table-center').children().first().height()
          );
          minh += 'px';
        }

        self.$el.find('.grid, .grid > div').css('height', minh);
      },

      resizeTouts: function() {
        var self = this;

        // Fixes horizontal 2 up layout wraping
        var tc = $('.editorial.tout .m2up .horizontal .table-center-wrap').parent();
        if (tc.length) {
          tc.css('width', tc.parent().width() - tc.prev().width() -2);
        }

        // Fixes heights of tout copy across 2up 3up
        var heightGroup = self.col.find('.copy');

        if (heightGroup.length) {
          if ( Modernizr.mq( '(min-width: 48em)' ) ) {
            heightGroup.evenHeights();
          } else {
            heightGroup.css( 'height', '' );
          }
        }
      },

      initDesktop: function() {
        var self = this;

        self.collapsableTout.sonyCarousel('destroy');
        self.collapsableTout.attr('style', '');
        self.col.addClass(self.colspan);
        if (self.hasOffset1) {
          self.col.first().addClass('offset1');
        }
      },

      initMobile: function() {
        var self = this;

        self.col.removeClass(self.colspan);
        self.col.removeClass('offset1');
        self.collapsableTout.sonyCarousel({
          wrapper: '.editorial.tout .container, .editorial.full-tout .container',
          slides: '>div',
          pagination: true
        });
      },

      _init: function() {
        var self = this;

        //if its a 2 or 3up we want to start the carousel code
        if (self.collapsableTout.length) {

          if ( !Settings.isLTIE10 ) {
            enquire.register('(min-width: 48em)', function() {
              self.initDesktop();
            });
            enquire.register('(max-width: 47.9375em)', function() {
              self.initMobile();
            });
          } else {
            self.initDesktop();
          }
          self.resizeTouts();
          Environment.on('global:resizeDebounced', $.proxy(self.resizeTouts, self));
        }


        //if its mediaright or left fix heights on resize
        if (self.$el.hasClass('mediaright') || self.$el.hasClass('medialeft')) {
          self.fixMediaHeights();
          Environment.on('global:resizeDebounced', $.proxy(self.fixMediaHeights, self));
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