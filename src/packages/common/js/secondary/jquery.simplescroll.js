/*!
 *
 * Smooth Scrolling plugin
 * @author Glen Cheney
 * @date 03.02.13
 * @version 1.2
 */
define(function(require){

  'use strict';

  var $ = require('jquery');

  var SimpleScroll = function( options, fn ) {
    var self = this;

    $.extend( self, $.simplescroll.options, options );

    self._init( fn );
  };

  SimpleScroll.prototype = {

    _init : function( fn ) {
      var self = this,
          selector = self.target.jquery ? '' : self.target.replace(/.*(?=#[^\s]*$)/, ''), // strip for ie7
          $target = self.target.jquery ? self.target : $(selector),
          targetOffset = $target.length ? $target.offset().top - self.offset : 0,
          totalHeight = $(document).height(),
          screenHeight = $(window).height();

      // Unable to find target
      if ( !$target.length ) {
        return;
      }

      if ( typeof fn === 'function' ) {
        self.callback = fn;
      }

      // Make sure we have room to scroll - basically choose an offset that we'll scroll to and have the entire window.
      // This keeps timing correct.
      // If amount below the target offset's is less than our screen height
      if ( totalHeight - targetOffset < screenHeight ) {
        targetOffset -= screenHeight - (totalHeight - targetOffset);
      }

      if ( self.showHash ) {
        self._showHash( self.target, $target );
      }

      self._animate(targetOffset, self.speed, self.easing, self.callback);
    },

    _animate : function( offset, speed, easing, complete ) {
      var called = false;
      // Scroll!
      $('html,body').animate({
        scrollTop: offset
      }, speed, easing, function( evt ) {
        if ( !called ) {
          complete.call( this, evt );
        }
        called = true;
      });
    },

    _showHash : function( hash, $target ) {
      var fake;

      hash = hash.replace(/^#/, '');

      if ( $target.length ) {
        $target.attr( 'id', '' );
        fake = $( '<div/>' ).css({
          position: 'absolute',
          visibility: 'hidden',
          top: $(window).scrollTop() + 'px'
        })
        .attr( 'id', hash )
        // Get the DOM node from jQuery
        [0];

        // Use native append over jQuery
        document.body.appendChild( fake );
      }

      window.location.hash = hash;

      if ( $target.length ) {
        document.body.removeChild( fake );
        $target.attr( 'id', hash );
      }
    }
  };

  $.simplescroll = function( options, fn ) {
    return new SimpleScroll( options, fn );
  };

  // If we load the page with a hash, scroll to it
  $.simplescroll.initial = function( options, fn ) {
    if ( window.location.hash ) {
      options = $.extend( options, {target: window.location.hash} );
      $.simplescroll( options, fn );
    }
  };

  // Convenience method which attaches a click event to the collection which scrolls to the
  // defined target (via a function) or the href attribute
  $.fn.simplescroll = function( options, fn ) {
    return this.each(function() {
      $(this).on('click', function( evt ) {
        evt.preventDefault();
        options = options || {};
        options.target = $.isFunction( options.target ) ?
          options.target.call( this ) :
          this.getAttribute('href');
        $.simplescroll( options, fn );
      });
    });
  };

  $.simplescroll.options = {
    target: 'body',
    speed: 400,
    easing: $.easing.easeOutQuad ? 'easeOutQuad' : 'swing',
    showHash: false,
    callback: $.noop,
    offset: 0
  };

});