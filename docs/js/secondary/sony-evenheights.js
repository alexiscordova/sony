
define(function(require){

  'use strict';

  var $ = require('jquery');

  $.fn.evenHeights = function( options ) {
    var tallest = 0;
    options = $.extend({}, $.fn.evenHeights.options, options);
    return this
      .css('height', '')
      .each(function() {
        var $this = $(this),
            height;

        if ( options.useOuterWidth ) {
          height = $this.outerHeight( options.margin );

        } else {
          // Here we're using `.css()` instead of `height()` or `outerHeight()`
          // Chrome used to be 100x slower calculating these values
          height = parseFloat( $this.css('height') );

          if ( options.padding ) {
            height += parseFloat( $this.css('paddingTop') ) + parseFloat( $this.css('paddingBottom') );
          }

          if ( options.margin ) {
            height += parseFloat( $this.css('marginTop') ) + parseFloat( $this.css('marginBottom') );
          }
        }

        if ( height > tallest ) {
          tallest = height;
        }
      })
      .css('height', tallest);
  };

  $.fn.evenHeights.options = {
    useOuterWidth: true,
    padding: true,
    margin: false
  };

});