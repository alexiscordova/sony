
/*!
 * jQuery Even Heights plugin
 * Author: Glen Cheney
 * Modified: 06/26/13
 * Dependencies: jQuery 1.2.6+
 * Sets a jQuery collection to all be the same height
 * If you need to set multiple collection, please use `$.evenHeights( collectionsArray )`
 * because it is much faster
 */

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
            height = $this.outerHeight( options.margin );

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

  // For groups of elements which should be the same height.
  // Using this method will create far less style recalculations and layouts
  // The first parameter should be an array of jQuery objects
  $.evenHeights = function( groups, options ) {
    if ( !groups.length ) {
      return;
    }

    var winners = [];
    options = $.extend({}, $.fn.evenHeights.options, options);

    // First, reset the height for every element.
    // This is done first, otherwise we dirty the DOM on each loop!
    $.each( groups, function( i, $elements ) {
      $elements.css('height', '');
    });

    // Now, measure heights in each group and save the tallest value
    // Instead of setting the height value for the entire group, we're going to save it
    // If it was set, the next iteration in the loop would have to recalculate styles in the DOM
    $.each( groups, function( i, $elements ) {
      var tallest = 0;
      $elements.each(function() {
        var height = $(this).outerHeight( options.margin );

        if ( height > tallest ) {
          tallest = height;
        }
      });

      // Keep track of the winner!
      winners.push( tallest );
    });

    // Lastly, we set them all
    $.each( groups, function( i, $elements ) {
      $elements.css( 'height', winners[ i ] );
    });
  };
});

