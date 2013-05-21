
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
// *Example - Show the left paddle, hide the right (you can also pass `both`):*
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

define(function(require){

  'use strict';

  var $ = require('jquery');

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

      self.$el.on('mouseenter.sonyPaddles', function(){
        self.$nav.addClass('show-paddles');
      });

      self.$el.on('mouseleave.sonyPaddles', function(){
        self.$nav.removeClass('show-paddles');
      });

      self.$paddles.on('focus', function() {
        $(this).show().addClass('on');
      });

      self.$paddles.on('blur', function() {
        $(this).hide().removeClass('on');
      });
    },

    'setupPaddles': function(){

      var self = this,
          paddleClass = self.useSmallPaddles ? 'nav-paddle' : 'pagination-paddle',
          $navContainer = $('<div class="pagination-paddles">'),
          $prevPaddle = $('<a href="#" class="' + paddleClass + ' ' + self.paddlePosition + ' pagination-prev"><i class="fonticon-10-chevron-reverse"></i></a>'),
          $nextPaddle = $('<a href="#" class="' + paddleClass + ' ' + self.paddlePosition + ' pagination-next"><i class="fonticon-10-chevron"></i></a>');

      $navContainer.append( $prevPaddle, $nextPaddle );
      self.$el.append( $navContainer );
      self.$nav = $navContainer;

      self.$paddles = self.$nav.find('.' + paddleClass);
      self.$leftPaddle = self.$paddles.filter('.pagination-prev');
      self.$rightPaddle = self.$paddles.filter('.pagination-next');

      self.$leftPaddle.on('click', function(e) {
        e.preventDefault();
        self.$el.trigger('sonyPaddles:clickLeft');
      });

      self.$rightPaddle.on('click', function(e) {
        e.preventDefault();
        self.$el.trigger('sonyPaddles:clickRight');
      });
    },

    'showPaddle': function(which) {
      this.paddleVisibility(which, true);
    },

    'hidePaddle': function(which) {
      this.paddleVisibility(which, false);
    },

    'paddleVisibility': function(which, visible) {

      var self = this;

      if ( which === 'left' || which === 'both' ) {

        if ( visible ) {
          self.$leftPaddle.show().addClass('on');
        } else {
          self.$leftPaddle.hide().removeClass('on');
        }
      }

      if ( which === 'right' || which === 'both' ) {

        if ( visible ) {
          self.$rightPaddle.show().addClass('on');
        } else {
          self.$rightPaddle.hide().removeClass('on');
        }
      }
    },

    destroy: function() {

      var self = this;

      self.$nav.remove();

      self.$el.removeData('sonyPaddles');
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
    useSmallPaddles: false,

    paddlePosition: 'inset'
  };

});
