// Editorial Module
// --------------------------------------------
//
// * **Class:** Editorial
// * **Version:** 1.0
// * **Modified:** 06/27/2013
// * **Author:** Pete Schirmer, Glen Cheney
// * **Dependencies:** jQuery 1.7+ , sony-global-environment,
// [sony-carousel](../secondary/sony-carousel.html), [sony-evenheights](../secondary/sony-evenheights.html),
// [sony-modal](../secondary/sony-modal.html)
//
define(function(require) {

    'use strict';

    var $ = require('jquery'),
        iQ = require('iQ'),
        enquire = require('enquire'),
        Modernizr = require('modernizr'),
        Settings = require('require/sony-global-settings'),
        Environment = require('require/sony-global-environment'),
        SonyCarousel = require('secondary/index').sonyCarousel,
        EvenHeights = require('secondary/index').sonyEvenHeights,
        Modals = require('secondary/index').sonyModal,
        jquerySimpleScroll = require('secondary/index').jquerySimpleScroll;

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
        var self = this;

        self.setVars();
        self.setupBreakpoints();

        if ( self.hasAddonSubmodule ) {
          self.setupSubmodules();
        }
      },

      setVars : function() {
        var self = this,
            spanRegex = /span\d+/;

        self.$collapsibleTout = self.$el.find('.m2up, .m3up');
        self.$touts = self.$el.find('.tout-grid .toutcopy');

        self.col = self.$collapsibleTout.find('>div');
        self.hasOffset1 = self.col.hasClass('offset1');

        self.isMediaLeft = self.$el.hasClass('medialeft');
        self.hasCollapsibleTout = self.$collapsibleTout.length > 0;
        self.hasTout = self.$touts.length > 0;
        self.hasAddonSubmodule = self.$el.find('.submodule').length > 0;
        self.$window = Settings.$window;

        // Build an array of the col spans
        self.colSpans = [];
        self.col.each(function() {
          var result = spanRegex.exec( this.className ),
              span = result[0];
          self.colSpans.push( span );
        });

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
        if ( self.isMediaLeft || self.$el.hasClass('mediaright') ) {
          self.fixMediaHeights();
          Environment.on('global:resizeDebounced', $.proxy(self.fixMediaHeights, self));
        }

        log('SONY : Editorial - E : Initialized');

        Settings.editorialModuleInitialzied.resolve();
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
      // videoAPI : function() {
      //   return this.$video.data('sonyVideo').api();
      // },

      setupSubmoduleEvents : function() {
        var self = this;

        self.$addonTrigger.on('click', $.proxy( self.onAddonClick, self ) );
        self.$closeBtn.on('click', $.proxy( self.onCloseClick, self ) );
        self.$window.on('e5-slide-change', $.proxy( self.onCloseClick, self ) );


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

        iQ.update();

        // Video player needs to open a modal while the the slideshow is inline
        if ( self.isVideoAddon ) {

          // The video is already initialized by its submodule, which is kind of a hack
          // and breaks the AMD/module pattern

          Modals.create({
            content: self.$video,
            closed: $.proxy( self.onCloseClick, self )
          });

          Modals.center();

        // Inline content. Hide current submodule and show the next submodule.
        } else {

          self.$submodule
            .add( self.$content )
            .addClass( hiddenClass );

          self.$addonModule.removeClass( hiddenClass );

          // Scroll to the top of the module
          // This is especially needed on mobile where the addon is far lower
          // than the slideshow that comes in and it also has a different height
          setTimeout(function() {
            $.simplescroll({
              target: self.$el
            });
          }, 0);
        }

        self.isSubmoduleOpen = true;
      },

      onCloseClick : function( evt ) {
        var self = this,
            hiddenClass = 'off-screen visuallyhidden';

        if ( evt ) {
          evt.preventDefault();
          evt.stopPropagation();
        }

        // If it's a video, the modal closes itself
        if ( !self.isVideoAddon ) {
          self.$submodule
            .add( self.$content )
            .removeClass( hiddenClass );

          self.$addonModule.addClass( hiddenClass );
        }

        self.isSubmoduleOpen = false;
      },

      // Fixes the min height of medialeft and mediaright on resize
      fixMediaHeights: function() {
        var self = this,
            minh,
            isSmallerThanTablet = Modernizr.mq('(max-width: 47.9375em)'),
            gridMinHeight,
            mediaElementFirstHeight;

        if ( isSmallerThanTablet ) {
          minh = 'auto';
        } else {
          gridMinHeight = parseInt( self.$el.find('.grid').css('minHeight'), 10 );
          mediaElementFirstHeight = self.$el.find('.media-element .table-center').children().first().height();
          minh = Math.max( gridMinHeight, mediaElementFirstHeight );
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
