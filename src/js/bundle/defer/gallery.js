
if ( !Exports ) {
  var Exports = {
    Modules : {}
  };
}

// Five columns
Exports.fiveColumns = 5;
Exports.twelveColumns = 12;
Exports.col5Width = 204;
Exports.gut5Width = 23;
Exports.fullWidth = (Exports.fiveColumns * Exports.col5Width) + (Exports.gut5Width * (Exports.fiveColumns - 1));
Exports.COLUMN_WIDTH = Exports.col5Width / Exports.fullWidth;
Exports.GUTTER_WIDTH = Exports.gut5Width / Exports.fullWidth;
Exports.GALLERY_ITEM_HEIGHT = 337;
Exports.GALLERY_RATIOS = {
  normal: Exports.col5Width / Exports.GALLERY_ITEM_HEIGHT,
  promo: ((Exports.col5Width * 2) + Exports.gut5Width) / Exports.GALLERY_ITEM_HEIGHT,
  large: ((Exports.col5Width * 3) + (Exports.gut5Width * 2)) / ((Exports.GALLERY_ITEM_HEIGHT * 2) + Exports.gut5Width)
};

// Twelve columns @ 768
Exports.colWidth768 = 34;
Exports.gutWidth768 = 22;
Exports.fullWidth768 = (Exports.twelveColumns * Exports.colWidth768) + (Exports.gutWidth768 * (Exports.twelveColumns - 1));
Exports.COLUMN_WIDTH_768 = Exports.colWidth768 / Exports.fullWidth768;
Exports.GUTTER_WIDTH_768 = Exports.gutWidth768 / Exports.fullWidth768;

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

$(document).ready(function() {

  if ( $('.gallery').length > 0 ) {

    // Initialize galleries
    $('.gallery').each(function() {
      var $this = $(this),
      data = $this.data(),
      options = { mode : data.mode };

      $this.addClass('gallery-' + data.mode).gallery(options);
    });

    // Initialize sticky tabs
    $('.tab-strip').stickyTabs();

    // Hide other tabs
    $('.tab-pane:not(.active)').addClass('off-screen');

    // // Should be called after everything is initialized
    $(window).trigger('hashchange');
  }
});