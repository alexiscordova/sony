/*!
 * Smooth Scrolling plugin (https://github.com/Vestride/simplescroll)
 * @date 04.01.13
 * @version 1.3
 * Copyright (c) 2013 Glen Cheney
 * Licensed under the MIT license.
 */
define(function(require){

  'use strict';

  var $ = require('jquery');

  var SimpleScroll = function( options, fn ) {
    var self = this;

    $.extend( self, $.simplescroll.options, options );
    self.$window = $(window);
    self._init( fn );
  };

  SimpleScroll.prototype = {

    _init : function( fn ) {
      var self = this,
          target = $.isFunction( self.target ) ? self.target() : self.target,
          selector = target.jquery ? '#' + target.attr('id') : target.replace(/.*(?=#[^\s]*$)/, ''), // strip for ie7
          $target = target.jquery ? target : $(selector),
          targetOffset = $target.length ? $target.offset().top - self.offset : 0,
          totalHeight = $(document).height(),
          screenHeight = self.$window.height();

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

      // It's possible to get decimals for offsets; to make sure the window scrolls to the target,
      // It needs to be rounded up
      targetOffset = Math.ceil( targetOffset );

      if ( self.showHash ) {
        self._showHash( selector, $target );
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
      var self = this,
          fake;

      // the hash should already be cleaned up for ie7 here, we're just removing the `#`
      // to make it an id of a new element
      hash = hash.replace(/^#/, '');

      // Create a new, fake element which will have the id of the target,
      // position it absolutely with the current window's scrollTop,
      // and append it to the DOM
      if ( $target.length ) {
        $target.attr( 'id', '' );
        fake = $( '<div/>' ).css({
          position: 'absolute',
          visibility: 'hidden',
          top: self.$window.scrollTop() + 'px'
        })
        .attr( 'id', hash )
        // Get the DOM node from jQuery
        [0];

        // Use native append over jQuery (http://jsperf.com/native-appendchild-vs-jquery-append/4)
        document.body.appendChild( fake );
      }

      // Set the hash
      window.location.hash = hash;

      // Remove the fake element and put the id back on the real one
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
      $(this).on('click.simplescroll', function( evt ) {
        evt.preventDefault();
        var opts = $.extend({}, options);

        // If the target option is a function, use its return value, else try the href attribute
        opts.target = $.isFunction( opts.target ) ?
          opts.target.call( this ) :
          this.getAttribute('href');

        // If the offset option is a function, use its return value, else use the given value or zero
        opts.offset = $.isFunction( opts.offset ) ?
          opts.offset.call( this ) :
          opts.offset || 0;

        $.simplescroll( opts, fn );
      });
    });
  };

  $.simplescroll.options = {
    target: 'body', // can be a selector or jQuery object or a function that returns one of those
    speed: 400, // duration of the animation
    easing: $.easing.easeOutQuad ? 'easeOutQuad' : 'swing', // easing function to use. Defaults to easeOutQuad if it's available
    showHash: false, // if showHash is true, and your target has an ID, this will add that id to the browser's hash
    callback: $.noop, // called after the animation is finished. Default is an empty function
    offset: 0 // distance from the target to scroll to. Positive numbers will result in the window being above your target, negative and it will be below
  };

});