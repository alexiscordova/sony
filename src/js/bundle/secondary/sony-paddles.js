
// Sony Paddles (SonyPaddles) Module
// --------------------------------------------
//
// * **Class:** SonyPaddles
// * **Version:** 0.1
// * **Modified:** 02/20/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+
//
// *Notes:*
//
// This plugin adds a left and right paddle, exposing basic click events
// that the calling modules may subscribe to. It does not assume to know
// how you want to show or hide the paddles, so it defers that logic to
// your module via exposed methods (showPaddle/hidePaddle).
//
// *Example - Create new instance of sonyPaddles:*
//
//      $('#foo').sonyPaddles();
//
// *Example - Show the left paddle, hide the right:*
//
//      $('#foo').sonyPaddles('showPaddle', 'left');
//      $('#foo').sonyPaddles('hidePaddle', 'right');
//
// *Example - Subscribe to a click on the left paddle:*
//
//      $('#foo').on('sonyPaddles:clickLeft', function(e){
//        // Do something
//      });
//
// *Example - Subscribe to a click on the right paddle:*
//
//      $('#foo').on('sonyPaddles:clickRight', function(e){
//        // Do something
//      });

(function($) {

  'use strict';

  var SonyPaddles = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.sonyPaddles.defaults, options);

    self.$el = $element;

    self.init();
  };

  SonyPaddles.prototype = {

    'constructor': SonyPaddles,

    'init': function() {

      var self = this;

      self.setupPaddles();
    },

    'setupPaddles': function(){

      var self = this,
          itemHTML = '<div class="paddle"><i class=fonticon-10-chevron></i></div>',
          out = '<div class="soc-nav soc-paddles">';

      if ( Modernizr.touch ) {
        return;
      }

      for ( var i = 0; i < 2; i++ ) {
        out += itemHTML;
      }

      out += '</div>';
      out = $(out);

      self.$el.append(out);

      self.$paddles     = self.$el.find('.paddle');
      self.$leftPaddle  = self.$paddles.eq(0).addClass('left');
      self.$rightPaddle = self.$paddles.eq(1).addClass('right');

      self.$paddles.css('opacity', 0);

      self.$paddles.on('click', function(){
        if ( $(this).hasClass('left') ){
          self.$el.trigger('sonyPaddles:clickLeft');
        } else {
          self.$el.trigger('sonyPaddles:clickRight');
        }
      });
    },

    'showPaddle': function(which) {
      this.paddleVisibility(which, true);
    },

    'hidePaddle': function(which) {
      this.paddleVisibility(which, false);
    },

    'paddleVisibility': function(which, visible){

      var self = this;

      if ( which === 'left' ) {

        if ( visible ) {
          self.$leftPaddle.css('opacity', 1);
        } else {
          self.$leftPaddle.css('opacity', 0);
        }
      } else if ( which === 'right' ) {

        if ( visible ) {
          self.$rightPaddle.css('opacity', 1);
        } else {
          self.$rightPaddle.css('opacity', 0);
        }
      }
    }
  };

  $.fn.sonyPaddles = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyPaddles = self.data('sonyPaddles');

      if ( !sonyPaddles ) {
          sonyPaddles = new SonyPaddles( self, options );
          self.data( 'sonyPaddles', sonyPaddles );
      }

      if ( typeof options === 'string' ) {
        sonyPaddles[ options ].apply( sonyPaddles, args );
      }
    });
  };

  // Defaults
  // --------

  $.fn.sonyPaddles.defaults = {
  };

})(jQuery);
