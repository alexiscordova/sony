
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

    forceWebkitRedraw: function(){

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

    masonryColumns: function(containerWidth) {

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

    masonryGutters: function(containerWidth) {

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

    parseMatrix: function( str ) {

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

    constrain: function(value, min, max) {

      value = parseFloat(value);

      return value < min ? min :
             value > max ? max :
             value;
    },

    scrollToTop: function() {
      $.simplescroll();
    },

    // Swap two jQuery elements.

    swapElements: function($elm1, $elm2) {

      var elm1 = $elm1.get(0),
          elm2 = $elm2.get(0),
          parent1, next1,
          parent2, next2;

      if ( !elm1 || !elm2 ) { return; }

      parent1 = elm1.parentNode;
      next1   = elm1.nextSibling;
      parent2 = elm2.parentNode;
      next2   = elm2.nextSibling;

      parent1.insertBefore(elm2, next1);
      parent2.insertBefore(elm1, next2);
    },

    // Given an array of numbers (`arr`), find the item in the array closest
    // to a given number (`num`). If you provide '>' or '<' for `filter`,
    // it only looks for items greater or lesser than `num`, respectively.

    closestInArray: function(arr, num, filter){

      var closest = 0, closestDiff;

      for ( var i in arr ) {

        if ( filter === '>' ) {
          if ( arr[i] < num ) { continue; }
        }

        if ( filter === '<' ) {
          if ( arr[i] > num ) { continue; }
        }

        var diff = Math.abs(arr[i] - num);
        if ( typeof closestDiff === 'undefined' || diff < closestDiff ) {
          closestDiff = diff;
          closest = arr[i];
        }
      }

      return closest;
    },

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    // Care of [Underscore](http://underscorejs.org/underscore.js).

    once: function(func) {

      var ran = false, memo;

      return function() {
        if (ran) { return memo; }
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
      };
    },

    // When you click inside the input, the text will be selected
    autoSelectInputOnFocus: function( $input ) {
      $input.on('focus', function() {
        var input = this;

        // We use a timeout here because .select() will select everything,
        // then the default browser action will deselect our selection
        setTimeout(function() {
          input.select();
        }, 0);
      });

      $input = null;
    },

    reapportionMSpans: function($spans) {

      $spans.each(function(){

        var $this = $(this),
            classes = this.className.split(' ');

        // Set span data for each possibility.
        if ( !$this.data('m-span') ) {
          for ( var j = 0; j < classes.length; j++ ) {
            if ( classes[j].indexOf('m-span') === 0 && classes[j].indexOf('m-span-at') === -1 ) {
              $this.data('m-span', classes[j]);
            }
            if ( classes[j].indexOf('m-span-at') === 0 ) {
              $this.data(classes[j], true);
            }
          }
        }

      });
    },

    // Takes a number of groups, supplied as a jQuery object (`options.$groups`) and re-apportions
    // their elements, in order, to a new set of groups. The old groups are then removed,
    // and the new groups are inserted at the point of the first group. Groups are assumed to be grids,
    // unless `options.gridSelector` is specified, in which case the method will look for that selector
    // inside each group for the location of the actual grid.
    //
    // If the `options.mobile` option is **true**, grids will be apportioned based on m-spans instead.
    //
    // If the `options.center` option is **true**, the final grid will attempt to center its contents,
    // based on the floor of half the remaining available columns.
    //
    // Example Usage:
    //
    // * Rearranges items into mobile grid, with the last grid centered. Note that it since it returns
    // the updated set, you can overwrite the previous reference to the groups (`self.$foo`)
    // in the calling context. *
    //
    //      self.$foo = Utilities.gridApportion({
    //        $groups: self.$foo,
    //        gridSelector: '.slimgrid',
    //        mobile: true,
    //        center: true
    //      });

    gridApportion: function(options) {

      if ( !options.$groups ) {
        return;
      }

      var $groups = options.$groups,
          isMobile = options.mobile,
          isCentered = options.center,
          hasGridSelector = options.gridSelector,

          $container = $groups.first().clone(),
          $appendContainer = hasGridSelector ? $container.find(options.gridSelector).empty() : $container.empty(),
          compiledGrids = [],
          $workingAppendContainer = $container.clone(),
          $workingGrid = hasGridSelector ? $workingAppendContainer.find(options.gridSelector) : $workingAppendContainer,
          roomRemaining = isMobile ? 6 : 12,
          $mSpans = $groups.find(isMobile ? '[class*="m-span"]' : '[class*="span"]');

      $mSpans.each(function(i){

        var $this = $(this),
            classes = this.className.split(' '),
            spanCount;

        for ( var j = 0; j < classes.length; j++ ) {
          if ( classes[j].indexOf(isMobile ? 'm-span' : 'span') === 0 && classes[j].indexOf('m-span-at') === -1) {
            spanCount = classes[j].split(isMobile ? 'm-span' : 'span')[1] * 1;
          }
          if ( isCentered && classes[j].indexOf(isMobile ? 'm-offset' : 'offset') === 0 ) {
            $this.removeClass(classes[j]);
          }
        }

        if ( roomRemaining < spanCount ) {
          compiledGrids.push($workingAppendContainer.clone().get(0));
          $workingAppendContainer = $container.clone();
          $workingGrid = hasGridSelector ? $workingAppendContainer.find(options.gridSelector) : $workingAppendContainer;
          roomRemaining = isMobile ? 6 : 12;
        }

        $workingGrid.append($this);
        roomRemaining -= spanCount;

        if ( i === $mSpans.length - 1 ) {

          if ( isCentered && roomRemaining >= 2 ) {
            $workingGrid.children().first().addClass((isMobile ? 'm-offset' : 'offset') + Math.floor(roomRemaining / 2));
          }

          compiledGrids.push($workingAppendContainer.clone().get(0));
          $workingAppendContainer = $workingGrid = null;
        }
      });

      $groups.not($groups.first()).remove();
      $groups.first().replaceWith($(compiledGrids));

      return $(compiledGrids);
    }

  };

  return self;

});