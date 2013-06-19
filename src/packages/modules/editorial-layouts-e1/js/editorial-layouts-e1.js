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
        Settings.editorialModuleInitialzied = $.Deferred();

    var module = {
      init: function() {
        if ( $('.editorial').length ) {
          $('.editorial').each(function() {
            new Editorial( this );
          });
        }
      }
    };

    // Start module
    var Editorial = function( element ) {
      var self = this;

      self.$el = $(element);

      self.init();
    };

    Editorial.prototype = {
      constructor: Editorial,

      init: function() {
        var self = this,
            spanRegex = /span\d+/;

        self.$collapsibleTout = self.$el.find('.m2up, .m3up');
        self.$touts = self.$el.find('.tout-grid .toutcopy');

        self.col = self.$collapsibleTout.find('>div');
        self.hasOffset1 = self.col.hasClass('offset1');

        self.isMediaLeft = self.$el.hasClass('medialeft');
        self.hasCollapsibleTout = self.$collapsibleTout.length > 0;
        self.hasTout = self.$touts.length > 0;

        // Build an array of the col spans
        self.colSpans = [];
        self.col.each(function() {
          var result = spanRegex.exec( this.className ),
              span = result[0];
          self.colSpans.push( span );
        });

        self.setupBreakpoints();
        
      },


      setupBreakpoints: function() {
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


        // Media left elements need the text to be on top all the time
        if ( self.isMediaLeft && !Settings.isLTIE10 ) {
          self.$textBlock = self.$el.find('.media-element').siblings();
          enquire.register('(max-width: 47.9375em)', {
            match: function() {
              self.swapMediaPositions( true );
            },
            unmatch: function() {
              self.swapMediaPositions( false );
            }
          });
        }


        // If its mediaright or left fix heights on resize
        if (self.$el.hasClass('mediaright') || self.$el.hasClass('medialeft')) {
          self.fixMediaHeights();
          Environment.on('global:resizeDebounced', $.proxy(self.fixMediaHeights, self));
        }

        log('SONY : Editorial - E : Initialized');

        Settings.editorialModuleInitialzied.resolve();
      },

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
        self.col.each(function( i ) {
          $( this ).addClass( self.colSpans[ i ] );
        });
        if (self.hasOffset1) {
          self.col.first().addClass('offset1');
        }
      },

      initMobile: function() {
        var self = this;

        self.col.each(function( i ) {
          $( this ).removeClass( self.colSpans[ i ] );
        });
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

      swapMediaPositions: function( toMobile ) {
        var self = this,
            $grid = self.$textBlock.parent(),
            method = toMobile ? 'prepend' : 'append';

        self.$textBlock.detach();
        $grid[ method ]( self.$textBlock );
      }

    };


    return module;

});
