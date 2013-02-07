/*global Modernizr, Exports */

if ( !window.Exports ) {
  window.Exports = {
    Modules : {}
  };
}

Exports.fiveColumns = 5;
Exports.sixColumns = 6;
Exports.twelveColumns = 12;

// Slim grid (5 columns)
Exports.col5Width = 188;
Exports.gut5Width = 20;
Exports.fullSlimWidth = (Exports.fiveColumns * Exports.col5Width) + (Exports.gut5Width * (Exports.fiveColumns - 1));
Exports.COLUMN_WIDTH_SLIM_5 = Exports.col5Width / Exports.fullSlimWidth;
Exports.GUTTER_WIDTH_SLIM_5 = Exports.gut5Width / Exports.fullSlimWidth;

// Slim grid (12 columns)
Exports.slimColWidth = 54;
Exports.slimGutWidth = 18;
Exports.slimWidth = (Exports.twelveColumns * Exports.slimColWidth) + (Exports.slimGutWidth * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_SLIM = Exports.slimColWidth / Exports.slimWidth;
Exports.GUTTER_WIDTH_SLIM = Exports.slimGutWidth / Exports.slimWidth;

// Mobile grid @ 480 (6 columns)
Exports.colWidth320 = 36;
Exports.gutWidth320 = 12;
Exports.fullWidth320 = (Exports.sixColumns * Exports.colWidth320) + (Exports.gutWidth320 * (Exports.sixColumns - 1));
Exports.COLUMN_WIDTH_320 = Exports.colWidth320 / Exports.fullWidth320;
Exports.GUTTER_WIDTH_320 = Exports.gutWidth320 / Exports.fullWidth320;


// ---------
// Not being used / legacy ?
/*

// Twelve columns @ 768
Exports.colWidth768 = 34;
Exports.gutWidth768 = 22;
Exports.fullWidth768 = (Exports.twelveColumns * Exports.colWidth768) + (Exports.gutWidth768 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_768 = Exports.colWidth768 / Exports.fullWidth768;
Exports.GUTTER_WIDTH_768 = Exports.gutWidth768 / Exports.fullWidth768;

Exports.COLUMN_WIDTH_568 = Exports.COLUMN_WIDTH_768;
Exports.GUTTER_WIDTH_568 = Exports.GUTTER_WIDTH_768;

// Twelve columns @ 980
Exports.colWidth980 = 43;
Exports.gutWidth980 = 30;
Exports.fullWidth980 = (Exports.twelveColumns * Exports.colWidth980) + (Exports.gutWidth980 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_980 = Exports.colWidth980 / Exports.fullWidth980;
Exports.GUTTER_WIDTH_980 = Exports.gutWidth980 / Exports.fullWidth980;

// Twelve columns @ 1200
Exports.colWidth1200 = 52;
Exports.gutWidth1200 = 36;
Exports.fullWidth1200 = (Exports.twelveColumns * Exports.colWidth1200) + (Exports.gutWidth1200 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_1200 = Exports.colWidth1200 / Exports.fullWidth1200;
Exports.GUTTER_WIDTH_1200 = Exports.gutWidth1200 / Exports.fullWidth1200;


Exports.gColumns = function( containerWidth ) {
  var column;

  // 568 - 979
  if ( Modernizr.mq('(min-width: 35.5em) and (max-width: 61.1875em)') ) {
    column = Exports.COLUMN_WIDTH_568 * containerWidth;

  // 1200
  } else if ( Modernizr.mq('(min-width: 75em)') ) {
    column = Exports.COLUMN_WIDTH_1200 * containerWidth;

  // 980
  } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
    column = Exports.COLUMN_WIDTH_980 * containerWidth;

  } else {
    column = containerWidth;
  }

  return column;
};

Exports.gGutters = function( containerWidth ) {
  var gutter;

  // 568 - 979
  if ( Modernizr.mq('(min-width: 35.5em) and (max-width: 61.1875em)') ) {
    gutter = Exports.GUTTER_WIDTH_568 * containerWidth;

  // 1200
  } else if ( Modernizr.mq('(min-width: 75em)') ) {
    gutter = Exports.GUTTER_WIDTH_1200 * containerWidth;

  // 980
  } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 61.25em)') ) {
    gutter = Exports.GUTTER_WIDTH_980 * containerWidth;

  } else {
    gutter = 0;
  }

  return gutter;
};

// --------
*/

Exports.masonryColumns = function( containerWidth ) {
  var column = containerWidth;

  // 568px+
  if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
    column = Exports.COLUMN_WIDTH_SLIM * containerWidth;
  }

  return column;
};

Exports.masonryGutters = function( containerWidth ) {
  var gutter = 0;

  // 568+
  if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 35.5em)') ) {
    gutter = Exports.GUTTER_WIDTH_SLIM * containerWidth;
  }

  return gutter;
};

/**
 * Constrains a value between a min and max value
 * @param  {Number} value number to be contstrained
 * @param  {Number} min   minimum
 * @param  {Number} max   max
 * @return {Number}
 */
Exports.constrain = function(value, min, max) {
    'use strict';

    value = parseFloat(value);

    return value < min ? min :
        value > max ? max :
        value;
};



