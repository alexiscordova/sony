
// Sony Global Settings
// --------------------
//
// * **Class:** SONY.Settings
//
// This class should only expose key/value pairs for global settings.

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
      bez = require('plugins/index').bez; // bez exposed through index.js

  var self = {},
      ua = navigator.userAgent,
      transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',
        'MozTransition'    : 'transitionend',
        'OTransition'      : 'oTransitionEnd',
        'msTransition'     : 'MSTransitionEnd',
        'transition'       : 'transitionend'
      };

  self.$window = $(window);
  self.$document = $(document);
  self.$html = $(document.documentElement);
  self.$body = $(document.body);

  self.isIPhone = (/iphone|ipod/gi).test( ua );
  self.isIOS = (/iphone|ipod|ipad/gi).test( ua );
  self.isAndroid = (/android/gi).test( ua );
  self.isPS3 = (/playstation 3/gi).test( ua );
  self.isSonyTabletS = (/sony tablet s/gi).test( ua );
  // self.isMobileDevice = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/gi).test( ua );

  self.isModern = self.$html.hasClass('modern');

  if ( self.isModern ) {
    self.isLTIE8 = self.isLTIE9 = self.isLTIE10 = false;
  } else {
    self.isLTIE8 = self.$html.hasClass('lt-ie8');
    self.isLTIE9 = self.isLTIE8 || self.$html.hasClass('lt-ie9');
    self.isLTIE10 = self.isLTIE9 || self.$html.hasClass('lt-ie10');
  }

  // http://blogs.windows.com/windows_phone/b/wpdev/archive/2012/11/15/adapting-your-webkit-optimized-site-for-internet-explorer-10.aspx
  self.hasTouchEvents = Modernizr.touch;
  self.hasPointerEvents = navigator.pointerEnabled || navigator.msPointerEnabled;

  self.START_EV = self.hasTouchEvents ? 'touchstart' : self.hasPointerEvents ? 'MSPointerDown' : 'mousedown';
  self.MOVE_EV = self.hasTouchEvents ? 'touchmove' : self.hasPointerEvents ? 'MSPointerMove' : 'mousemove';
  self.END_EV = self.hasTouchEvents ? 'touchend' : self.hasPointerEvents ? 'MSPointerUp' : 'mouseup';
  self.CANCEL_EV = self.hasTouchEvents ? 'touchcancel' : self.hasPointerEvents ? 'MSPointerCancel' : 'mousecancel';
  self.transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

  self.windowWidth = self.$window.width();
  self.windowHeight = self.$window.height();

  self.shuffleEasing = 'ease-out';
  self.shuffleSpeed = 250;

  // Get grid percentages
  self.fiveColumns = 5;
  self.sixColumns = 6;
  self.twelveColumns = 12;

  // Slim grid (5 columns)
  self.col5Width = 188;
  self.gut5Width = 20;
  self.fullSlimWidth = (self.fiveColumns * self.col5Width) + (self.gut5Width * (self.fiveColumns - 1));
  self.COLUMN_WIDTH_SLIM_5 = self.col5Width / self.fullSlimWidth;
  self.GUTTER_WIDTH_SLIM_5 = self.gut5Width / self.fullSlimWidth;

  // Slim grid (12 columns)
  self.slimColWidth = 54;
  self.slimGutWidth = 18;
  self.slimWidth = (self.twelveColumns * self.slimColWidth) + (self.slimGutWidth * (self.twelveColumns - 1));
  self.COLUMN_WIDTH_SLIM = self.slimColWidth / self.slimWidth;
  self.GUTTER_WIDTH_SLIM = self.slimGutWidth / self.slimWidth;

  // Mobile grid @ 480 (6 columns)
  self.colWidth320 = 36;
  self.gutWidth320 = 12;
  self.fullWidth320 = (self.sixColumns * self.colWidth320) + (self.gutWidth320 * (self.sixColumns - 1));
  self.COLUMN_WIDTH_320 = self.colWidth320 / self.fullWidth320;
  self.GUTTER_WIDTH_320 = self.gutWidth320 / self.fullWidth320;

  self.loaderPath = 'img/loader.gif';
  // self.loaderURI = self.isLTIE8 ? self.loaderPath : 'data:image/gif;base64,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';

  self.easing = {
    'easeInOutExpo': '1, 0, 0, 1',
    'easeInOutQuint': '0.86, 0, 0.07, 1',
    'easeInSine': '0.47, 0, 0.745, 0.715',
    'easeOutSine': '0.39, 0.575, 0.565, 1',
    'easeInOutSine': '0.445, 0.05, 0.55, 0.95',
    'easeInQuad':  '0.55, 0.085, 0.68, 0.53',
    'easeOutQuad': '0.250, 0.460, 0.450, 0.940',
    'easeOutExpo': '0.190, 1.000, 0.220, 1.000',
    'easeOutCubic':'0.215, 0.610, 0.355, 1.000',
    'easeOutQuart':'0.165, 0.840, 0.440, 1.000',
    'easeOutNav':  '0.455, 0.030, 0.515, 0.955'
  };

  self.$easing = {
    'easeInOutExpo':  $.bez(self.easing.easeInOutExpo),
    'easeInOutQuint': $.bez(self.easing.easeInOutQuint),
    'easeInSine':     $.bez(self.easing.easeInSine),
    'easeOutSine':    $.bez(self.easing.easeOutSine),
    'easeInOutSine':  $.bez(self.easing.easeInOutSine),
    'easeInQuad':     $.bez(self.easing.easeInQuad),
    'easeOutQuad':    $.bez(self.easing.easeOutQuad),
    'easeOutExpo':    $.bez(self.easing.easeOutExpo),
    'easeOutCubic':   $.bez(self.easing.easeOutCubic),
    'easeOutQuart':   $.bez(self.easing.easeOutQuart),
    'easeOutNav':     $.bez(self.easing.easeOutNav)
  };

  return self;

});