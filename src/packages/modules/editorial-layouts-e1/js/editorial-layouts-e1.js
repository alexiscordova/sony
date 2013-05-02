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
      self.$collapsibleTout = self.$el.find('.m2up, .m3up');
      self.$touts = self.$el.find('.tout-grid .toutcopy');
      self.colspan = self.$el.find('.m3up').length ? 'span4' :
        self.$collapsibleTout.find('.horizontal').length ?
          'span6' :
          'span5';
      self.col = self.$collapsibleTout.find('>div');

      self.hasOffset1 = self.col.hasClass('offset1');
      self.hasCollapsibleTout = self.$collapsibleTout.length > 0;
      self.hasTout = self.$touts.length > 0;

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

        self.$collapsibleTout.sonyCarousel('destroy');
        self.$collapsibleTout.attr('style', '');
        self.col.addClass(self.colspan);
        if (self.hasOffset1) {
          self.col.first().addClass('offset1');
        }
      },

      initMobile: function() {
        var self = this;

        self.col.removeClass(self.colspan);
        self.col.removeClass('offset1');
        self.$collapsibleTout.sonyCarousel({
          wrapper: '.editorial.tout .container, .editorial.full-tout .container',
          slides: '>div',
          pagination: true
        });
      },

      initSubMobile: function() {
        this.$touts.each(function() {
          var $tout = $( this ),
              $p = $tout.find( 'p' ),
              p = $p[0],
              $link = $tout.find( 'a' ),
              link = $link[0];

          // Save current class name to re apply it when this breakpoint no longer matches
          $p.data( 'className', p.className );
          $link.data( 'className', link.className );

          // Switch class to `.p4`
          p.className = 'p4';
          link.className = 'lt4';
        });
      },

      teardownSubMobile: function() {
        this.$touts.each(function() {
          var $tout = $( this ),
              $p = $tout.find( 'p' ),
              p = $p[0],
              $link = $tout.find( 'a' ),
              link = $link[0],
              linkClassName = $link.data( 'className' ),
              pClassName = $p.data( 'className' );

          // Revert class name back to what it was before
          p.className = pClassName;
          link.className = linkClassName;
        });
      },

      _init: function() {
        var self = this;

        // If its a 2 or 3up we want to start the carousel code
        if ( self.hasCollapsibleTout ) {

          if ( !Settings.isLTIE10 ) {
            enquire
              .register('(min-width: 48em)', function() {
                self.initDesktop();
              })
              .register('(max-width: 47.9375em)', function() {
                self.initMobile();
              });
          } else {
            self.initDesktop();
          }

          self.resizeTouts();
          Environment.on('global:resizeDebounced', $.proxy(self.resizeTouts, self));
        }

        // Switch out p tag classes
        if ( self.hasTout && !Settings.isLTIE10 ) {
          enquire.register('(max-width: 29.9375em)', {
            match: function() {
              self.initSubMobile();
            },
            unmatch: function() {
              self.teardownSubMobile();
            }
          });
        }


        // If its mediaright or left fix heights on resize
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