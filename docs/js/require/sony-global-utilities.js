
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

    // Force a redraw of all element with a font icon
    // Use the `selector` param to only redraw from a certain parent
    //
    // http://stackoverflow.com/questions/9809351/ie8-css-font-face-fonts-only-working-for-before-content-on-over-and-sometimes
    // http://andymcfee.com/2012/04/icon-fonts-pseudo-elements-and-ie8/
    // https://github.com/FortAwesome/Font-Awesome/issues/194
    // https://github.com/FortAwesome/Font-Awesome/issues/354

    forceFontIconRedraw: function( selector ) {
      var before = '[class*="fonticon-"]:before',
          after = '[class*="fonticon-"]:after{content:none !important}',
          comma = ',';

      if ( selector ) {
        before = selector + ' ' + before;
        after = selector + ' ' + after;
      }

      // Make sure only IE8 gets this
      if ( Settings.isLTIE9 && !Settings.isLTIE8 ) {

        // Clear the timer so two+ don't fire
        if ( self.iconRedrawID ) {
          clearTimeout( self.iconRedrawID );
        }

        // Set a new timer
        self.iconRedrawID = setTimeout(function redraw() {
          var head = document.getElementsByTagName('head')[0],
              style = document.createElement('style');

          style.type = 'text/css';
          style.styleSheet.cssText = before + comma + after;
          head.appendChild(style);

          setTimeout(function(){
            head.removeChild( style );
          }, 0);
        }, 100);
      }
    },

    // Converts pixel value to an em value (including unit) at a given context.
    // Default context for this application is 16.

    pxToEm : function(pxValue, context){

      context = typeof context !== 'undefined' ? context : 16;

      return (pxValue / context) + 'em';
    },

    // Helper functions to generate em-based media queries based on pixel input.

    enquire: {

      min: function(a, context) {
        context = typeof context !== 'undefined' ? context : 16;
        return '(min-width: ' + self.pxToEm(a, context) + ')';
      },

      max: function(a, context) {
        context = typeof context !== 'undefined' ? context : 16;
        return '(max-width: ' + self.pxToEm(a, context) + ')';
      },

      minMax: function(a, b, context) {
        context = typeof context !== 'undefined' ? context : 16;
        return '(min-width: ' + self.pxToEm(a, context) + ') and (max-width: ' + self.pxToEm(b, context) + ')';
      }

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

    // Not used by anything at the moment, commenting out
    // parseMatrix: function( str ) {

    //   var modified;

    //   modified = str.replace( /^\w+\(/, '[' ).replace( /\)$/, ']');

    //   try {
    //     modified = JSON.parse(modified);
    //   } catch (e) {
    //     modified = [null,null,null,null,null,null];
    //   }

    //   // **TODO**: The first four value names are probably wrong.
    //   // I only know the last two (translates) for sure.

    //   return {
    //     val1 : modified[0],
    //     val2 : modified[1],
    //     val3 : modified[2],
    //     val4 : modified[3],
    //     translateX : modified[4],
    //     translateY : modified[5]
    //   };
    // },

    // Constrains a value between a min and max boundary.

    constrain: function(value, min, max) {

      value = parseFloat(value);

      return value < min ? min :
             value > max ? max :
             value;
    },

    scrollToTop: function() {
      $('html,body').animate({ scrollTop: 0 }, 400, 'swing');
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

    // Provided a group of $spans, all of which have a class of `span12`, `span6`, etc.,
    // Reassign their column width with `toWhat` columns.
    // If "reset" is passed for `toWhat`, use the `default-spanX` class to reassign
    // the columns to a preset default value.
    //
    // *TODO*: We should cache the initial span count automatically to remove
    // the need for `default-span`.

    reassignSpanWidths: function($spans, toWhat) {

      var newSpan = toWhat;

      $spans.each(function(){

        var $this = $(this),
            classes = this.className.split(' '),
            defaultSpan, currentSpan;

        currentSpan = classes.filter(function(elem){
          return elem.indexOf('span') === 0;
        }).shift().split('span').pop() * 1;

        if ( toWhat === 'reset' ) {

          defaultSpan = classes.filter(function(elem){
            return elem.indexOf('default-span') === 0;
          }).shift().split('default-span').pop() * 1;

          newSpan = defaultSpan;
        }

        $this.removeClass('span' + currentSpan);
        $this.addClass('span' + newSpan);
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
    // Example Usage:
    //
    // * Rearranges items into mobile grid, with the last grid centered. Note that it since it returns
    // the updated set, you can overwrite the previous reference to the groups (`self.$foo`)
    // in the calling context. *
    //
    //      self.$foo = Utilities.gridApportion({
    //        $groups: self.$foo,
    //        gridSelector: '.slimgrid',
    //        mobile: true
    //      });

    gridApportion: function(options) {

      var $groups = options.$groups,
          spanClass = options.mobile ? 'm-span' : 'span',
          $container = $groups.first().clone(),
          $appendContainer = options.gridSelector ? $container.find(options.gridSelector).empty() : $container.empty(),
          compiledGrids = [],
          $workingAppendContainer = $container.clone(),
          $workingGrid = options.gridSelector ? $workingAppendContainer.find(options.gridSelector) : $workingAppendContainer,
          roomRemaining = options.mobile ? 6 : 12,
          $mSpans = $groups.find('[class*="'+spanClass+'"]');

      $mSpans.each(function(i){

        var $this = $(this),
            classes = this.className.split(' '),
            spanCount;

        // Find the class that starts with `spanClass` and get the appropriate span count.

        spanCount = classes.filter(function(elem, index, array){
          return (elem.indexOf(spanClass) === 0 && elem.indexOf('m-span-at') === -1);
        }).shift().split(spanClass).pop() * 1;

        // If there isn't enough room in this grid, push the working container to `compiledGrids` and start a new one.

        if ( roomRemaining < spanCount ) {
          compiledGrids.push($workingAppendContainer.clone().get(0));
          $workingAppendContainer = $container.clone();
          $workingGrid = options.gridSelector ? $workingAppendContainer.find(options.gridSelector) : $workingAppendContainer;
          roomRemaining = options.mobile ? 6 : 12;
        }

        $workingGrid.append($this);
        roomRemaining -= spanCount;
      });

      // Done with loop. Push remaining working elements into the compiled grids and garbage collect.

      compiledGrids.push($workingAppendContainer.clone().get(0));
      $workingAppendContainer = $workingGrid = null;

      $groups.not($groups.first()).remove();
      $groups.first().replaceWith($(compiledGrids));

      return $(compiledGrids);
    },

    // Parses the url parameters into a cached object. Each value, however, is a string.
    // So `sony.com?today=true` will become `{ today : "true" }`
    // Use the force parameter to force the query string to be cached again

    getUrlParameters : function( force ) {

      if ( !force && Settings.urlParams ) {
        return Settings.urlParams;
      }

      var search = window.location.search.substring( 1 ),
          fields = {};

      if ( search ) {
        fields = $.parseJSON('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
      }

      // Cache it
      Settings.urlParams = fields;

      return fields;
    }

  };

  return self;

});