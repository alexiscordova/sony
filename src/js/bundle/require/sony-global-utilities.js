
// Sony Utilities Class
// --------------------
//
// * **Class:** SONY.Utilities
//
// This class contains common, sharable methods that may be called from any
// script in the application.

var SONY = SONY || {};

SONY.Utilities = (function(window, document) {

  'use strict';

  var self = {

    // Force a redraw for webkit browsers.

    'forceWebkitRedraw': function(){
      $('<style/>').appendTo( SONY.$body ).remove();
    },

    // converts pixel value to em value (including unit)

    pxToEm : function(pxValue, context){

      // defaults to 16px
      context = typeof context !== 'undefined' ? context : 16;

      return (pxValue / context) + 'em';
    },

    // Return calculated column if width is above 568px/35.5em

    'masonryColumns': function(containerWidth) {
      var column = containerWidth;

      if ( !Modernizr || !SONY.Settings ) {
        return;
      }

      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
        column = SONY.Settings.COLUMN_WIDTH_SLIM * containerWidth;
      }

      return column;
    },

    // Return calculated gutter if width is above 568px/35.5em

    'masonryGutters': function(containerWidth) {
      var gutter = 0;

      if ( !Modernizr || !SONY.Settings ) {
        return;
      }

      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
        gutter = SONY.Settings.GUTTER_WIDTH_SLIM * containerWidth;
      }

      return gutter;
    },

    // Parses a 2D CSS transform matrix and returns key/val pairings

    'parseMatrix': function( str ) {
      var modified;

      // We have a matrix like: "matrix(1, 0, 0, 1, -120, 0)"

      // firstly replace one or more (+) word characters (\w) followed by `(` at the start (^) with a `[`
      // then replace the `)` at the end with `]`
      modified = str.replace( /^\w+\(/, '[' ).replace( /\)$/, ']');
      // this will leave you with a string: "[0.312321, -0.949977, 0.949977, 0.312321, 0, 0]"

      // then parse the new string (in the JSON encoded form of an array) as JSON into a variable
      try {
        modified = JSON.parse(modified);
      } catch (e) {
        modified = [null,null,null,null,null,null];
      }

      // THE FIRST FOUR VALUE NAMES ARE PROBABLY WRONG. I ONLY KNOW THE LAST TWO (translates) FOR SURE.
      return {
        val1 : modified[0],
        val2 : modified[1],
        val3 : modified[2],
        val4 : modified[3],
        translateX : modified[4],
        translateY : modified[5]
      };
    },

    // Constrains a value between a min and max value

    'constrain': function(value, min, max) {
      value = parseFloat(value);

      return value < min ? min :
        value > max ? max :
        value;
    },

    scrollToTop : function() {
      $.simplescroll();
    }

  };

  return self;

})(this, this.document);
