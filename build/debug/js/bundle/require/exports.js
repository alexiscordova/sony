/*global jQuery, Modernizr, iQ, Exports */

if ( !Exports ) {
  var Exports = {
    Modules : {}
  };
}

Exports.fiveColumns = 5;
Exports.twelveColumns = 12;

// Five columns
Exports.col5Width = 204;
Exports.gut5Width = 23;
Exports.fullWidth = (Exports.fiveColumns * Exports.col5Width) + (Exports.gut5Width * (Exports.fiveColumns - 1));
Exports.COLUMN_WIDTH = Exports.col5Width / Exports.fullWidth;
Exports.GUTTER_WIDTH = Exports.gut5Width / Exports.fullWidth;

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


Exports.masonryColumns = function( containerWidth ) {
  var column;

  if ( Modernizr.mq('(min-width: 568px) and (max-width:979px)') ) {
    column = Exports.COLUMN_WIDTH_568 * containerWidth;

  } else if ( Modernizr.mq('(min-width: 1200px)') ) {
    column = Exports.COLUMN_WIDTH_1200 * containerWidth;

  } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 980px)') ) {
    column = Exports.COLUMN_WIDTH_980 * containerWidth;

  } else {
    column = containerWidth;
  }

  return column;
};

Exports.masonryGutters = function( containerWidth ) {
  var gutter;

  if ( Modernizr.mq('(min-width: 568px) and (max-width:979px)') ) {
    gutter = Exports.GUTTER_WIDTH_568 * containerWidth;

  } else if ( Modernizr.mq('(min-width: 1200px)') ) {
    gutter = Exports.GUTTER_WIDTH_1200 * containerWidth;

  } else if ( !Modernizr.mediaqueries || Modernizr.mq('(min-width: 980px)') ) {
    gutter = Exports.GUTTER_WIDTH_980 * containerWidth;

  } else {
    gutter = 0;
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
