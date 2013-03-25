
// Sony Global Settings
// --------------------
//
// * **Class:** SONY.Settings
//
// This class should only expose key/value pairs for global settings.

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr');

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

  self.isLTIE9 = self.$html.hasClass('lt-ie9');
  self.isLTIE10 = self.isLTIE9 || self.$html.hasClass('lt-ie10');

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

  return self;

});