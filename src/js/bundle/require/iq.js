/*
 * image qualification library 
 * author: thisispete for odopod / nurun
 * 
 * borrows concepts / code snippets from: 
 * https://github.com/adamdbradley/foresight.js
 * https://github.com/sebarmeli/JAIL
 * https://github.com/tubalmartin/riloadr
 * 
 * */

(function(iQ, $, Modernizr){
	"use strict";
	
	iQ.images = [];
	iQ.resizeFlaggedImages = [];
	iQ.options = iQ.options || {};
	
	// using property string references for minification purposes
	var 
	LOCAL_STORAGE_KEY = 'iqjs',
	HIGH = 'high',
	LOW = 'low',
	LENGTH = 'length',
	SCROLL = 'scroll',
	RESIZE = 'resize',
	RETRIES = 'retries',
	LOADING = 'loading',
	COMPLETE = 'complete',
	LOADIMAGES = 'loadImages',
	DELAY = 150,
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
	
	//high res settings
	minDevicePixelRatio = opts.minDevicePixelRatio || 2,
	highResPathSuffix = opts.highResPathSuffix || '@2x',
	
	//deferred loading 
	asyncDistance = opts.asyncDistance || 0,
	
	//image path template settings
	base = opts.base || '',
	pathTemplate = opts.pathTemplate || '{fileName}-{breakpoint}{highRes}.{ext}',
	QUESTION_MARK_REGEX = /\?/,
	BREAKPOINT_NAME_REGEX = /{breakpoint}/gi,
	HIGH_RES_REGEX = /{highRes}/gi,
	FILE_NAME_REGEX = /{fileName}/gi,
	FILE_EXT_REGEX = /{ext}/gi,
	breakpoint,
	breakpointName,
	breakpoints = opts.breakpoints ||  [
		{name: 'phone',      maxWidth: 480},
		{name: 'tablet',     minWidth: 481, maxWidth: 960},
		{name: 'desktop',    minWidth: 961, defaultBreakpoint: true}],
	
	//bandwidth testing settings
	bandwidth = LOW,
	connTestResult,
	speedConnectionStatus,
	connKbps,
	minKbps = opts.minKbps || 300,
	speedTestUri = opts.speedTestUri || 'http://foresightjs.appspot.com/speed-test/50K',
	speedTestKB = opts.speedTestKB || 50,
	speedTestExpireMinutes = opts.speedTestExpireMinutes || 30,
	
	//optional override settings
	updateOnResize = opts.updateOnResize || false,
	resizeFlag = opts.resizeFlag || 'update-always',
	
	//optional callback funcitons

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
	screenWidth = win.screen.width,
	devicePixelRatio = win.devicePixelRatio || 1,
	lastOrientation,
	
	// Reduce by 5.5x the # of times loadImages is called when scrolling
	scrollListener = throttle(function() {
        loadImages();
    }, DELAY),

    // Reduce to 1 the # of times loadImages is called when resizing 
	resizeListener = debounce(function() {
        loadImages();
    }, DELAY),

    // Reduce to 1 the # of times loadImages is called when orientation changes.  
	orientationchangeListener = debounce(function(){
        if (win[ORIENTATION] !== lastOrientation) {
            lastOrientation = win[ORIENTATION];
            loadImages();
        }
    }, DELAY),
    
	imageIterateStatus,
	initIQ = function(){
		viewportWidth = viewportWidth || getViewportWidthInCssPixels(); 
		breakpoint = getBreakpoint(breakpoints, viewportWidth);
		breakpointName = breakpoint.name;		
		loadImages();
	},

  updateImages = function( imagesWereAdded ) {
      loadImages( imagesWereAdded !== false );
  },
	
	loadImages = function(update){
			var current, i;
            // If initial collection is not done or 
            // new images have been added to the DOM, collect them.
            if (!iQ.images[LENGTH] || update === true || updateOnResize === true) {
                // Add event listeners
                addAsyncListeners();
                iQ.images = [];

                // Create a static list
                $(jquerySelector).each(function(idx, elm) {
                    // If we haven't processed this image yet and it is a responsive image
                    // Add image to the list
                        iQ.images.push(elm);
                        $(elm).hasClass(resizeFlag) && iQ.resizeFlaggedImages.push(elm);
                });
            }
            
            // Load images
            if (iQ.images[LENGTH]) {
                i = 0;
                while (current = iQ.images[i]) {
                    if (current && isInViewportRange(current, asyncDistance)) { 
                        loadImage(current, i);
                         // Reduce the images array for shorter loops
        				iQ.images.splice(i, 1); 
                        i--;
                    }
                    i++;
                }
            } 
            if(iQ.resizeFlaggedImages[LENGTH]){
            	i = 0;
            	while(current = iQ.resizeFlaggedImages[i]){
            		if(current && isInViewportRange(current, asyncDistance)){
            			 loadImage(current, i);
            		}
            		i++;
            	}
            }

            // No more images to load? remove event listeners
            !iQ.images[LENGTH] && !iQ.resizeFlaggedImages[length] && removeAsyncListeners();
            !iQ.images[LENGTH] && ONCOMPLETE in iQ.options && iQ.options[ONCOMPLETE]();

            // Clean up
            current = null;     
	},
	
	
 	/*
     * Loads an image.
     */
    loadImage = function (img, idx) {    
        viewportWidth = getViewportWidthInCssPixels(); 
        breakpoint = getBreakpoint(breakpoints, viewportWidth);
   		breakpointName = breakpoint.name;
   		//console.log(breakpointName);
   		var newsrc = getImageSrc(img, breakpointName);
        
		
		if($(img).data('current') !== newsrc){
			$(img).data('current', newsrc); 
            setNewSrc(img, newsrc);
        }
   },
   setNewSrc  = function(img, newsrc){
	   	if($(img).is('img')){
	    	//for img elements
	    	img.src = newsrc;
	    }else if ($(img).is('div')){
	    	//for div elements backgroudn images
	    	$(img).css('background-image', 'url('+newsrc+')');
		}
	},
	
	/*
     * React on scroll, resize and orientationchange events
     */  
	addAsyncListeners = function () {
	    addEvent(win, SCROLL, scrollListener);        
	    addEvent(win, RESIZE, resizeListener);
	
	    // Is orientationchange event supported? If so, let's try to avoid false 
	    // positives by checking if win.orientation has actually changed.
	    if (orientationSupported) {
	        lastOrientation = win[ORIENTATION];
	        addEvent(win, ORIENTATIONCHANGE, orientationchangeListener);
	    }    
	},


    /*
     * Removes event listeners if defer mode is 'belowfold'
     */  
    removeAsyncListeners = function() {
    	removeEvent(win, SCROLL, scrollListener);        
        !updateOnResize && removeEvent(win, RESIZE, resizeListener);

        // Is orientationchange event supported? If so, remove the listener 
        orientationSupported && removeEvent(win, ORIENTATIONCHANGE, orientationchangeListener);
    },
    
    initSpeedTest = function () {
		// only check the connection speed once, if there is a status then we've
		// already got info or it already started
		if ( speedConnectionStatus ) return;

		// force that this device has a low or high bandwidth, used more so for debugging purposes
		if ( opts.forceBandwidth ) {
			bandwidth = opts.forceBandwidth;
			connTestResult = 'force';
			speedConnectionStatus = COMPLETE;
			return;
		}

		// if the device pixel ratio is 1, then no need to do a network connection 
		// speed test since it can't show hi-res anyways
		if ( devicePixelRatio === 1 ) {
			connTestResult = 'skip';
			speedConnectionStatus = COMPLETE;
			return;
		}

		// if we know the connection is 2g or 3g 
		// don't even bother with the speed test, cuz its slow
		// Network connection feature detection referenced from Modernizr
		// Modernizr v2.5.3, www.modernizr.com
		// Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
		// Available under the BSD and MIT licenses: www.modernizr.com/license/
		// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/network-connection.js 
		// Modified by Adam Bradley for Foresight.js
		var connection = navigator.connection || { type: 'unknown' }; // polyfill
		var isSlowConnection = connection.type == 3 // connection.CELL_2G 
							   || connection.type == 4 // connection.CELL_3G
							   || /^[23]g$/.test( connection.type ); // string value in new spec
		if ( isSlowConnection ) {
			// we know this connection is slow, don't bother even doing a speed test
			connTestResult = 'connTypeSlow';
			speedConnectionStatus = COMPLETE;
			return;
		}

		// check if a speed test has recently been completed and its 
		// results are saved in the local storage
		try {
			var fsData = JSON.parse( localStorage.getItem( LOCAL_STORAGE_KEY ) );
			if ( fsData !== null ) {
				if ( ( new Date() ).getTime() < fsData.exp ) {
					// already have connection data within our desired timeframe
					// use this recent data instead of starting another test
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
			// speed test image download completed
			// figure out how long it took and an estimated connection speed
			endTime = ( new Date() ).getTime();

			var duration = ( endTime - startTime ) / 1000;
			duration = ( duration > 1 ? duration : 1 ); // just to ensure we don't divide by 0

			connKbps = ( ( speedTestKB * 1024 * 8 ) / duration ) / 1024;
			bandwidth = ( connKbps >= minKbps ? HIGH : LOW );
			
			speedTestComplete( 'networkSuccess' );
		};

		speedTestImg.onerror = function () {
			// fallback incase there was an error downloading the speed test image
			speedTestComplete( 'networkError', 5 );
		};

		speedTestImg.onabort = function () {
			// fallback incase there was an abort during the speed test image
			speedTestComplete( 'networkAbort', 5 );
		};

		// begin the network connection speed test image download
		startTime = ( new Date() ).getTime();
		speedConnectionStatus = 'loading';
		if ( document.location.protocol === 'https:' ) {
			// if this current document is SSL, make sure this speed test request
			// uses https so there are no ugly security warnings from the browser
			speedTestUri = speedTestUri.replace( 'http:', 'https:' );
		}
		speedTestImg.src = speedTestUri + "?r=" + Math.random();

		// calculate the maximum number of milliseconds it 'should' take to download an XX Kbps file
		// set a timeout so that if the speed test download takes too long
		// than it isn't a 'high-bandwidth' and ignore what the test image .onload has to say
		// this is used so we don't wait too long on a speed test response 
		// Adding 350ms to account for TCP slow start, quickAndDirty === true
		speedTestTimeoutMS = ( ( ( speedTestKB * 8 ) / minKbps ) * 1000 ) + 350;
		setTimeout( function () {
			speedTestComplete( 'networkSlow' );
		}, speedTestTimeoutMS );
	},

	speedTestComplete = function ( connTestResult, expireMinutes ) {
		// if we haven't already gotten a speed connection status then save the info
		if (speedConnectionStatus === COMPLETE) return;

		// first one with an answer wins
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

		// initImageRebuild();
		
		
	},

	/*
     * Returns the breakpoint data to apply.
     * Uses the viewport width to mimic CSS behavior.
     */
    getBreakpoint = function(breakpoints, vWidth) {
        var _vWidth = vWidth, 
        	i = 0,
        	breakpoint = {},
        	_breakpoint, 
        	minWidth, 
        	maxWidth,
        	defaultBreakpoint;  
        
        while (_breakpoint = breakpoints[i]) {
            minWidth = _breakpoint['minWidth'];
            maxWidth = _breakpoint['maxWidth'];
            defaultBreakpoint = _breakpoint['defaultBreakpoint'] ? _breakpoint : defaultBreakpoint;
            
            
            // Viewport width found
            if (vWidth > 0) {
                if (minWidth && maxWidth  && vWidth >= minWidth && vWidth <= maxWidth || 
                    minWidth && !maxWidth && vWidth >= minWidth || 
                    maxWidth && !minWidth && vWidth <= maxWidth) {
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
        return Modernizr.mq('only all') ? breakpoint : defaultBreakpoint;
        
    },
    
    
    /*
     * Returns the layout viewport width in CSS pixels.
     * To achieve a precise result the following meta must be included at least:
     * <meta name="viewport" content="width=device-width">
     * See: 
     * - http://www.quirksmode.org/mobile/viewports2.html
     * - http://www.quirksmode.org/mobile/tableViewport.html
     * - https://github.com/h5bp/mobile-boilerplate/wiki/The-Markup
     */
    getViewportWidthInCssPixels = function() {
		var widths = [docElm.clientWidth, docElm.offsetWidth, doc.body.clientWidth],
        	screenWidthFallback = Math.ceil(screenWidth / devicePixelRatio),
        	l = widths[LENGTH],
        	i = 0,
			width;
        
        for (; i < l; i++) {
            // If not a number remove it
            if (isNaN(widths[i])) {
                widths.splice(i, 1);
                i--;
            }
        }
        
        if (widths[LENGTH]) {
            width = Math.max.apply(Math, widths);
            
            // Catch cases where the viewport is wider than the screen
            if (!isNaN(screenWidthFallback)) {
                width = Math.min(screenWidthFallback, width);
            }
        }
        
        return width || screenWidthFallback || 0;
    },
    
    
    /*
     * Returns the URL of an image
     * If reload is true, a timestamp is added to avoid caching.
     */
    getImageSrc = function(img, breakpointName, reload) {   	
    	var src = ($(img).data('base') || base) + pathTemplate,
        fileName = ($(img).data('src') || EMPTYSTRING).split('.');

        src = src.replace(BREAKPOINT_NAME_REGEX, breakpointName);
        src = src.replace(FILE_NAME_REGEX, fileName[0]);
        src = src.replace(FILE_EXT_REGEX, fileName[1]);
        
        src = src.replace(HIGH_RES_REGEX, (bandwidth === HIGH && devicePixelRatio >= minDevicePixelRatio)? highResPathSuffix : EMPTYSTRING);
        
        if (reload) {
            src += (QUESTION_MARK_REGEX.test(src) ? '&' : '?') + 
                'riloadrts='+(new Date).getTime();
        }
    	        
        return src;
    },
    
    
    /*
     * Tells if an image is visible to the user or not. 
     */
    isInViewportRange = function(img, asyncDistance) { 
      	var $ct = $(window);
		var is_ct_window  = $ct[0] === window,
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
    }
    
	
	;
	    
	 /* 
     * Thanks to underscore.js and lodash.js
     * Returns a function, that, when invoked, will only be triggered at most once
     * during a given window of time.
     */
    function throttle(func, wait) {
        var args, 
        	result,
        	thisArg,
        	timeoutId,
        	lastCalled = 0;

        function trailingCall() {
            lastCalled = new Date;
            timeoutId = null;
            func.apply(thisArg, args);
        };

        return function() {
            var now = new Date, 
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
    };
	
	/* 
     * Thanks to underscore.js and lodash.js
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     */
    
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
        };

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
    };
	
	 /*
     * Simple event attachment/detachment
     * Since we attach listeners to the window scroll, resize and 
     * orientationchange events, native functions are 6x faster than jQuery's
     * event handling system.
     */
	function addEvent(elem, type, fn) {
        elem[add](pre + type, fn, false);
    }
    
    function removeEvent(elem, type, fn) {
        elem[rem](pre + type, fn, false);
    }
    
    // kickoff 
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
		// force a certain device pixel ratio, used more so for debugging purposes
		devicePixelRatio = opts.forcePixelRatio;
	}

    iQ.update = updateImages;

	// DOM does not need to be ready to begin the network connection speed test
	initSpeedTest();
	//console.log(bandwidth, connTestResult, devicePixelRatio)
	
} (this.iQ = this.iQ || {}, jQuery, Modernizr));