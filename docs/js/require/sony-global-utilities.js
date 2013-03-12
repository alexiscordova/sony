
// Sony Utilities Class
// --------------------
//
// * **Class:** SONY.Utilities
//
// This class contains common, sharable methods that may be called from any
// script in the application.

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      Settings = require('require/sony-global-settings');

  var self = {

    // Force a redraw for webkit browsers.

    'forceWebkitRedraw': function(){

      var tempStyleSheet = document.createElement('style');

      document.body.appendChild(tempStyleSheet);
      document.body.removeChild(tempStyleSheet);
    },

    // Converts pixel value to an em value (including unit) at a given context.
    // Default context for this application is 16.

    pxToEm : function(pxValue, context){

      context = typeof context !== 'undefined' ? context : 16;

      return (pxValue / context) + 'em';
    },

    // Return calculated column if width is above 568px/35.5em.

    'masonryColumns': function(containerWidth) {

      var column = containerWidth;

      if ( !Modernizr || !Settings ) {
        return;
      }

      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
        column = Settings.COLUMN_WIDTH_SLIM * containerWidth;
      }

      return column;
    },

    // Return calculated gutter if width is above 568px/35.5em.

    'masonryGutters': function(containerWidth) {

      var gutter = 0;

      if ( !Modernizr || !Settings ) {
        return;
      }

      if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
        gutter = Settings.GUTTER_WIDTH_SLIM * containerWidth;
      }

      return gutter;
    },

    // Takes a 2D CSS transform matrix (such as `matrix(1, 0, 0, 1, -120, 0)`) and
    // returns a JSON object exposing the same paramters.

    'parseMatrix': function( str ) {

      var modified;

      modified = str.replace( /^\w+\(/, '[' ).replace( /\)$/, ']');

      try {
        modified = JSON.parse(modified);
      } catch (e) {
        modified = [null,null,null,null,null,null];
      }

      // **TODO**: The first four value names are probably wrong.
      // I only know the last two (translates) for sure.

      return {
        val1 : modified[0],
        val2 : modified[1],
        val3 : modified[2],
        val4 : modified[3],
        translateX : modified[4],
        translateY : modified[5]
      };
    },

    // Constrains a value between a min and max boundary.

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

});