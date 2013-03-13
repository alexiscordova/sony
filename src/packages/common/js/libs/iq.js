
// Image Qualification Library (iQ)
// --------------------------------
//
// * **Class:** iQ
// * **Version:** 0.1
// * **Modified:** 01/23/2013
// * **Author:** thisispete
//
// *Borrows concepts / code from:*
//
// * [Foresight.js](https://github.com/adamdbradley/foresight.js)
// * [JAIL](https://github.com/sebarmeli/JAIL)
// * [Riloadr](https://github.com/tubalmartin/riloadr)
//
// requires imagesloaded plugin to add on image load listeners:
// https://github.com/desandro/imagesloaded

define(function(require){

  'use strict';

  if ( !window.iQ ) {
    window.iQ = {};
  }

  var iQ = window.iQ,
      $ = require('jquery'),
      Modernizr = require('modernizr'),
      imagesloaded = require('plugins/jquery.imagesloaded');

  iQ.images = [];
  iQ.resizeFlaggedImages = [];
  iQ.options = iQ.options || {};

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // *Thanks to underscore.js and lodash.js.*

  function throttle(func, wait) {
    var args,
        result,
        thisArg,
        timeoutId,
        lastCalled = 0;

    function trailingCall() {
      lastCalled = new Date();
      timeoutId = null;
      func.apply(thisArg, args);
    }

    return function() {
      var now = new Date(),
      remain = wait - (now - lastCalled);

      args = arguments;
      thisArg = this;

      if (remain <= 0) {
        lastCalled = now;
        result = func.apply(thisArg, args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(trailingCall, remain);
      }
      return result;
    };
  }

  // Returns a function that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  //
  // *Thanks to underscore.js and lodash.js.*

  function debounce(func, wait, immediate) {
      var args,
        result,
        thisArg,
        timeoutId;

      function delayed() {
          timeoutId = null;
          if (!immediate) {
              func.apply(thisArg, args);
          }
      }

      return function() {
          var isImmediate = immediate && !timeoutId;
          args = arguments;
          thisArg = this;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(delayed, wait);

          if (isImmediate) {
              result = func.apply(thisArg, args);
          }
          return result;
      };
  }

  // Property string references for minification purposes.
  var LOCAL_STORAGE_KEY = 'iqjs',
      HIGH = 'high',
      LOW = 'low',
      LENGTH = 'length',
      SCROLL = 'scroll',
      RESIZE = 'resize',
      COMPLETE = 'complete',
      EMPTYSTRING = '',
      ON = 'on',
      LOAD = 'load',
      ONCOMPLETE = ON+COMPLETE,
      ORIENTATION = 'orientation',
      EVENTLISTENER = 'EventListener',
      ADDEVENTLISTENER = 'add'+EVENTLISTENER,
      ORIENTATIONCHANGE = ORIENTATION+'change',

      opts = iQ.options,
      jquerySelector = opts.jquerySelector || '.iq-img',

      // High-resolution settings
      minDevicePixelRatio = opts.minDevicePixelRatio || 2,
      highResPathSuffix = opts.highResPathSuffix || '@2x',

      // Deferred loading
      asyncDistance = opts.asyncDistance || 0,

      throttleSpeed = opts.throttleSpeed || 250,

      // Image path template settings
      base = opts.base || '',
      pathTemplate = opts.pathTemplate || '{fileName}-{breakpoint}{highRes}.{ext}',
      QUESTION_MARK_REGEX = /\?/,
      BREAKPOINT_NAME_REGEX = /\{breakpoint\}/gi,
      HIGH_RES_REGEX = /\{highRes\}/gi,
      FILE_NAME_REGEX = /\{fileName\}/gi,
      FILE_EXT_REGEX = /\{ext\}/gi,
      breakpoint,
      breakpointName,
      breakpoints = opts.breakpoints || [
        {name: 'phone',      maxWidth: 480},
        {name: 'tablet',     minWidth: 481, maxWidth: 768},
        {name: 'desktop',    minWidth: 769, defaultBreakpoint: true}],

      // Bandwidth testing settings
      bandwidth = LOW,
      connTestResult,
      speedConnectionStatus,
      connKbps,
      minKbps = opts.minKbps || 300,
      speedTestUri = opts.speedTestUri || 'http://foresightjs.appspot.com/speed-test/50K',
      speedTestKB = opts.speedTestKB || 50,
      speedTestExpireMinutes = opts.speedTestExpireMinutes || 30,

      // Optional override settings
      updateOnResize = opts.updateOnResize || false,
      resizeFlag = opts.resizeFlag || 'update-always',
      noFadeFlag = opts.noFadeFlag || 'no-fade',
      fade = opts.fade || 'true',

      // Optional callback functions
      win = window,
      doc = win.document,
      docElm = doc.documentElement,
      setTimeout = win.setTimeout,

      // Event model
      w3c = ADDEVENTLISTENER in doc,
      pre = w3c ? EMPTYSTRING : ON,
      add = w3c ? ADDEVENTLISTENER : 'attachEvent',
      rem = w3c ? 'remove'+EVENTLISTENER : 'detachEvent',

      // Feature support
      orientationSupported = ORIENTATION in win && ON+ORIENTATIONCHANGE in win,
      viewportWidth,
      devicePixelRatio = win.devicePixelRatio || 1,
      lastOrientation = -1,

  // Reduce by 5.5x the # of times loadImages is called when scrolling
  scrollListener = throttle(function() {
    loadImages(false);
  }, throttleSpeed),

  // Reduce to 1 the # of times loadImages is called when resizing
  resizeListener = debounce(function() {
    loadImages(true);
  }, throttleSpeed),

  // Reduce to 1 the # of times loadImages is called when orientation changes.
  orientationchangeListener = debounce(function(){
    if (win[ORIENTATION] !== lastOrientation) {
      lastOrientation = win[ORIENTATION];
      loadImages(true, true, false);
    }
  }, throttleSpeed),

  initIQ = function(){
    viewportWidth = viewportWidth || getViewportWidthInCssPixels();
    breakpoint = getBreakpoint(breakpoints, viewportWidth);
    breakpointName = breakpoint.name;
    loadImages(false, false, false);
  },

  updateImages = function( imagesWereAdded ) {
    loadImages(false, false, imagesWereAdded === true );
  },

  onImageLoad = function($elm /*, $images, $proper, $broken*/ ) {
    if (fade && $elm.data('fadeonce') !== true && !$elm.hasClass(noFadeFlag)) {
      $elm.data('fadeonce', true);
      $elm.css({'opacity': 1, '-ms-filter':'"progid:DXImageTransform.Microsoft.Alpha(opacity=100)"', 'filter':'alpha(opacity=100)'});
      setTimeout(function() {
        $elm.css({
          'opacity' : '',
          'filter' : '',
          '-ms-filter' : ''
        });
      }, 900);
      $elm.data('hasLoaded', true);
      $elm.trigger('imageLoaded');
    }
    $elm.trigger('imageReLoaded');
  },

  loadImages = function(resizing, rotating, update){
    var current, i;

      // If initial collection is not done or
      // new images have been added to the DOM, collect them.
      if (!iQ.images[LENGTH] || update === true || (updateOnResize === true && resizing) || rotating) {
        // Add event listeners
        addAsyncListeners();
        iQ.images = [];

        // Create a static list
        $(jquerySelector).each(function(idx, elm) {
          // If we haven't processed this image yet and it is a responsive image,
          // add image to the list.
          iQ.images.push(elm);
          // $(elm).hasClass(resizeFlag) && iQ.resizeFlaggedImages.push(elm);
          //if its an img not a background image set it up to fade in on load
          if (elm.tagName == 'IMG') {
            if(fade && $(elm).data('fadeonce') !== true && !$(elm).hasClass(noFadeFlag)){
              $(elm).css({'opacity': 0, '-ms-filter':'"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"', 'filter':'alpha(opacity=0)', 'zoom':1, '-webkit-transition': 'opacity 0.4s ease-out', '-moz-transition': 'opacity 0.4s ease-out', '-o-transition': 'opacity 0.4s ease-out', 'transition': 'opacity 0.4s ease-out' });
            }
          }
        });
      }

      // Load images scroll or resize
      if (iQ.images[LENGTH]) {
        i = 0;
        while (current = iQ.images[i]) {
          if (current && isInViewportRange(current, asyncDistance)) {
            loadImage(current, i);

            // Reduce the images array for shorter loops.
            iQ.images.splice(i, 1);
            i--;
          }
          i++;
        }
      }

      // check images that are flagged to update on resize
      if(iQ.resizeFlaggedImages[LENGTH]){
        i = 0;
        while(current = iQ.resizeFlaggedImages[i]){
          if(current && isInViewportRange(current, asyncDistance)){
            loadImage(current, i);
          }
          i++;
        }
      }

      // No more images to load? Remove event listeners!
      !iQ.images[LENGTH] && !iQ.resizeFlaggedImages[length] && removeAsyncListeners();
      !iQ.images[LENGTH] && ONCOMPLETE in iQ.options && iQ.options[ONCOMPLETE]();

      // Clean up.
      current = null;
  },

  loadImage = function (img) {
    viewportWidth = getViewportWidthInCssPixels();
    breakpoint = getBreakpoint(breakpoints, viewportWidth);
    breakpointName = breakpoint.name;
    var newsrc = getImageSrc(img, breakpointName),
        $img = $(img);
    // skip if new src = current
    if ($img.data('current') !== newsrc) {
      $img.data('current', newsrc);

      // if its an image set src else set bg image
      if ($img.is('img')) {
        $img
          .attr('src', newsrc)
          .imagesLoaded(onImageLoad);
      } else if ($img.is('div')) {
        $(document.createElement('img'))
          .attr('src', newsrc)
          .imagesLoaded(function(){
            $img.css('background-image', 'url('+newsrc+')');
            $img.data('hasLoaded', true);
            $img.trigger('iQ:imageLoaded');
          });
      }
    }
  },

  // React on scroll, resize and orientationchange events.
  addAsyncListeners = function () {
    addEvent(win, SCROLL, scrollListener);
    addEvent(win, RESIZE, resizeListener);

    // Is orientationchange event supported? If so, let's try to avoid false
    // positives by checking if win.orientation has actually changed.

    if (orientationSupported) {
      addEvent(win, ORIENTATIONCHANGE, orientationchangeListener);
    }
  },

  // Removes event listeners if defer mode is 'belowfold'.
  removeAsyncListeners = function() {
    removeEvent(win, SCROLL, scrollListener);
    !updateOnResize && removeEvent(win, RESIZE, resizeListener);

    // Is orientationchange event supported? If so, remove the listener.
    orientationSupported && removeEvent(win, ORIENTATIONCHANGE, orientationchangeListener);
  },

  initSpeedTest = function () {
    // Only check the connection speed once, if there is a status then we've
    // already got info or it already started.
    if ( speedConnectionStatus ) {
      return;
    }

    // Force that this device has a low or high bandwidth, used more so for debugging purposes.
    if ( opts.forceBandwidth ) {
      bandwidth = opts.forceBandwidth;
      connTestResult = 'force';
      speedConnectionStatus = COMPLETE;
      return;
    }

    // If the device pixel ratio is 1, then no need to do a network connection
    // speed test since it can't show hi-res anyways.
    if ( devicePixelRatio === 1 ) {
      connTestResult = 'skip';
      speedConnectionStatus = COMPLETE;
      return;
    }

    // If we know the connection is 2G or 3G
    // don't even bother with the speed test, cuz its slow.
    // Network connection feature detection referenced from [Modernizr v2.5.3](http://www.modernizr.com),
    // by Faruk Ates, Paul Irish, Alex Sexton.
    // Available under the [BSD and MIT licenses](http://www.modernizr.com/license/).

    var connection = navigator.connection || { type: 'unknown' }; // polyfill
    var isSlowConnection = connection.type === 3 || connection.type === 4 || /^[23]g$/.test( connection.type );
    if ( isSlowConnection ) {
      // @e know this connection is slow, don't bother even doing a speed test.
      connTestResult = 'connTypeSlow';
      speedConnectionStatus = COMPLETE;
      return;
    }

    // Check if a speed test has recently been completed and its
    // results are saved in the local storage.
    try {
      var fsData = JSON.parse( localStorage.getItem( LOCAL_STORAGE_KEY ) );
      if ( fsData !== null ) {
        if ( ( new Date() ).getTime() < fsData.exp ) {
          // Already have connection data within our desired timeframe
          // use this recent data instead of starting another test.
          bandwidth = fsData.bw;
          connKbps = fsData.kbps;
          connTestResult = 'localStorage';
          speedConnectionStatus = COMPLETE;
          return;
        }
      }
    } catch( e ) { }

    var
    speedTestImg = document.createElement( 'img' ),
    endTime,
    startTime,
    speedTestTimeoutMS;

    speedTestImg.onload = function () {
      // Speed test image download completed;
      // figure out how long it took and an estimated connection speed.
      endTime = ( new Date() ).getTime();

      var duration = ( endTime - startTime ) / 1000;
      duration = ( duration > 1 ? duration : 1 ); // Just to ensure we don't divide by 0.
      connKbps = ( ( speedTestKB * 1024 * 8 ) / duration ) / 1024;
      bandwidth = ( connKbps >= minKbps ? HIGH : LOW );

      speedTestComplete( 'networkSuccess' );
    };

    speedTestImg.onerror = function () {
      // Fallback in case there was an error downloading the speed test image.
      speedTestComplete( 'networkError', 5 );
    };

    speedTestImg.onabort = function () {
      // Fallback in case there was an abort during the speed test image.
      speedTestComplete( 'networkAbort', 5 );
    };

    // Begin the network connection speed test image download.
    startTime = ( new Date() ).getTime();
    speedConnectionStatus = 'loading';
    if ( document.location.protocol === 'https:' ) {
      // If this current document is SSL, make sure this speed test request
      // uses https so there are no ugly security warnings from the browser.
      speedTestUri = speedTestUri.replace( 'http:', 'https:' );
    }
    speedTestImg.src = speedTestUri + '?r=' + Math.random();

    // Calculate the maximum number of milliseconds it *should* take to download an XX Kbps file
    // set a timeout so that if the speed test download takes too long
    // then it isn't a 'high-bandwidth' and ignore what the test image .onload has to say
    // this is used so we don't wait too long on a speed test response
    // Adding 350ms to account for TCP slow start, quickAndDirty === true
    speedTestTimeoutMS = ( ( ( speedTestKB * 8 ) / minKbps ) * 1000 ) + 350;
    setTimeout( function () {
      speedTestComplete( 'networkSlow' );
    }, speedTestTimeoutMS );
  },

  speedTestComplete = function ( connTestResult, expireMinutes ) {
    // If we haven't already gotten a speed connection status then save the info.
    if (speedConnectionStatus === COMPLETE) {
      return;
    }

    // First one with an answer wins!
    speedConnectionStatus = COMPLETE;
    connTestResult = connTestResult;

    try {
      if ( !expireMinutes ) {
        expireMinutes = speedTestExpireMinutes;
      }
      var fsDataToSet = {
        kbps: connKbps,
        bw: bandwidth,
        exp: ( new Date() ).getTime() + (expireMinutes * 60000)
      };
      localStorage.setItem( LOCAL_STORAGE_KEY, JSON.stringify( fsDataToSet ) );
    } catch( e ) { }
  },

  // Returns the breakpoint data to apply.
  // Uses the viewport width to mimic CSS behavior.

  getBreakpoint = function(breakpoints, vWidth) {
    var _vWidth = vWidth,
        i = 0,
        breakpoint = {},
        _breakpoint,
        minWidth,
        maxWidth,
        defaultBreakpoint;

    while (_breakpoint = breakpoints[i]) {
      minWidth = _breakpoint.minWidth;
      maxWidth = _breakpoint.maxWidth;
      defaultBreakpoint = _breakpoint.defaultBreakpoint ? _breakpoint : defaultBreakpoint;

      // Viewport width found
      if (vWidth > 0) {
        if (
          minWidth && maxWidth  && vWidth >= minWidth && vWidth <= maxWidth ||
          minWidth && !maxWidth && vWidth >= minWidth ||
          maxWidth && !minWidth && vWidth <= maxWidth
        ) {
          breakpoint = _breakpoint;
        }

      // Viewport width not found so let's find the smallest image size
      // (mobile first approach).
      } else if (_vWidth <= 0 || minWidth < _vWidth || maxWidth < _vWidth) {
        _vWidth = minWidth || maxWidth || _vWidth;
        breakpoint = _breakpoint;
      }

      i++;
    }

    // if media queries are not supported we want to get the default breakpoint size only regardless of screen size.
    return Modernizr.mediaqueries ? breakpoint : defaultBreakpoint;

  },

  // Returns the layout viewport width in CSS pixels.
  // To achieve a precise result the following meta must be included at least:
  //
  //      <meta name="viewport" content="width=device-width">
  //
  // See:
  //
  // * [Quirksmode: A Tale of Two Viewports](http://www.quirksmode.org/mobile/viewports2.html)
  // * [Quirksmode: Browser compatibility â€” Viewports](http://www.quirksmode.org/mobile/tableViewport.html)
  // * [H5BP: The Markup](https://github.com/h5bp/mobile-boilerplate/wiki/The-Markup)
  getScreenWidth = function(){
    return win.outerWidth || win.screen.width;
  },
  getViewportWidthInCssPixels = function() {
    var widths = [docElm.clientWidth, docElm.offsetWidth, doc.body.clientWidth],
        l = widths[LENGTH],
        i = 0,
        width;

    for (; i < l; i++) {
      // If not a number remove it.
      if (isNaN(widths[i])) {
        widths.splice(i, 1);
        i--;
      }
    }

    if (widths[LENGTH]) {
      width = Math.max.apply(Math, widths);

      // Catch cases where the viewport is wider than the screen
      if (!isNaN(getScreenWidth())) {
        width = Math.min(getScreenWidth(), width);
      }
    }
    return width || getScreenWidth() || 0;
  },

  // Returns the URL of an image
  // If reload is true, a timestamp is added to avoid caching.

  getImageSrc = function(img, breakpointName, reload) {
    var src = ($(img).data('base') || base) + pathTemplate,
        fileName = ($(img).data('src') || EMPTYSTRING).split('.');

    src = src.replace(BREAKPOINT_NAME_REGEX, breakpointName);
    src = src.replace(FILE_NAME_REGEX, fileName[0]);
    src = src.replace(FILE_EXT_REGEX, fileName[1]);
    src = src.replace(HIGH_RES_REGEX, (bandwidth === HIGH && devicePixelRatio >= minDevicePixelRatio)? highResPathSuffix : EMPTYSTRING);

    // if (reload) {
      // src += (QUESTION_MARK_REGEX.test(src) ? '&' : '?');
      // src += 'riloadrts='+(new Date).getTime();
    // }

    return src;
  },

  // Tells if an image is visible to the user or not.
  isInViewportRange = function(img, asyncDistance) {
    var $ct = $(window);
    var is_ct_window = $ct[0] === window,
        ct_offset  = (is_ct_window ? { top:0, left:0 } : $ct.offset()),
        ct_top     = ct_offset.top + ( is_ct_window ? $ct.scrollTop() : 0),
        ct_left    = ct_offset.left + ( is_ct_window ? $ct.scrollLeft() : 0),
        ct_right   = ct_left + $ct.width(),
        ct_bottom  = ct_top + $ct.height(),
        img_offset =  $(img).offset(),
        img_width =  $(img).width(),
        img_height =  $(img).height();

    var inView = (ct_top - asyncDistance) <= (img_offset.top + img_height) &&
        (ct_bottom + asyncDistance) >= img_offset.top &&
        (ct_left - asyncDistance)<= (img_offset.left + img_width) &&
        (ct_right + asyncDistance) >= img_offset.left;

    return inView;
  };

  // Simple event attachment/detachment.
  // Since we attach listeners to the window scroll, resize and
  // orientationchange events, native functions are 6x faster than jQuery's
  // event handling system.
  function addEvent(elem, type, fn) {
    elem[add](pre + type, fn, false);
  }

  function removeEvent(elem, type, fn) {
    elem[rem](pre + type, fn, false);
  }

  // Kickoff!
  iQ.ready = function () {
    if ( !document.body ) {
      return window.setTimeout( iQ.ready, 1 );
    }
    initIQ();
  };

  if ( document.readyState === COMPLETE ) {
    setTimeout( iQ.ready, 1 );
  } else {
    addEvent(win, LOAD, iQ.ready);
  }

  if ( opts.forcePixelRatio ) {
    // Force a certain device pixel ratio, used more so for debugging purposes.
    devicePixelRatio = opts.forcePixelRatio;
  }

  iQ.update = debounce(updateImages, throttleSpeed);

  // DOM does not need to be ready to begin the network connection speed test.
  initSpeedTest();

  return iQ;

});