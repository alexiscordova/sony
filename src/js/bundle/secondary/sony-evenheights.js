
(function($, undefined) {

  $.fn.evenHeights = function( options ) {
    var tallest = 0;
    options = $.extend({}, $.fn.evenHeights.options, options);
    return this
      .css('height', '')
      .each(function() {
        var $this = $(this),
            // Here we're using `.css()` instead of `height()` or `outerHeight()`
            // because Chrome is 100x slower calculating those values
            height = parseFloat( $this.css('height') );

        if ( options.padding ) {
          height += parseFloat( $this.css('paddingTop') ) + parseFloat( $this.css('paddingBottom') );
        }

        if ( options.margin ) {
          height += parseFloat( $this.css('marginTop') ) + parseFloat( $this.css('marginBottom') );
        }

        if ( height > tallest ) {
          tallest = height;
        }
      })
      .css('height', tallest);
  };

  $.fn.evenHeights.options = {
    padding: true,
    margin: false
  };

}(jQuery));