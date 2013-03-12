// ------------ jodo ------------
// Module : RangeControl
// Version : 1.4
// Authored: 2011-11-08 by Jason Eberle
// Modified: 2012-01-26 by Christopher Mischler
// Modified: 2012-12-07 by Glen Cheney
// Dependencies : jQuery 1.7+, <HTML> conditional classes (for custom cursors)
// ------------------------------
/*
 *  The comment structure is compatible with NaturalDocs for compiling Documentation.
 *  Please keep this in mind if you make any updates.
*/


/*
    Class: RangeControl
        Adds a draggable 'slider' to a 'rail' (a long skinny div).
*/

/*
    Group: Constructor
    > RangeControl( $rail, opts )

    Dependencies:
        jQuery 1.7+, <HTML> conditional classes (for custom cursors)

    Parameters:
        opts:
            Possible values to be passed in through the _opts_ parameter

            orientation - (String, Default: 'h'): Horizontal or Vertical.
                            Valid values: 'h' or 'v'
            range - (Boolean, Default: false): if true, this will add a second handle for a range controller
            callback - (function, Default: null): function to call every time the slider is moved/updated.
                        Returns: currentPositionPct (Integer, current position percent)
            initialValue - (String or Number, Default: 0): Initial handle position.
                            Valid values:
                                for positioning relative to the rail's total length: '0%' through '100%' ,
                                for positioning relative to the rail's origin: the number (in px),
                                if 'steps' is enabled, the step number
            initialMin - (String or Number, Default: 0): Initial minimum range handle position
            initialMax - (String or Number, Default: 100%): Initial maximum range handle position
            steps - (Integer, Default: 0): How many 'steps' (stop-points) between start & end
            $ambit - ($Object, Default: null): Element to use as the ambit
                        (the colored section along the rail to signify the area 'below' the handle).
                        If null or undefined, a new <span/> will be created, with a class
                        of 'ambit'.
            $handle - ($Object, Default: null): Element to use as the handle.
                        If null or undefined, a new <span/> will be created, with a class
                        of 'handle'.
            $minHandle - ($Object, Default: null): Element to use as the handle.
                        If null or undefined, a new <span/> will be created, with a class
                        of 'handle slidecontrol-min-handle'.
            hideHandle - (Boolean, Default: false): Hides the handle
            hideAmbit - (Boolean, Default: false): Hides the ambit

    Returns:
        jQuery - The jQuery chain
*/

define(function(require){

    'use strict';

    var $ = require('jquery');

    var namespace = 'rangecontrol';

    var RangeControl = function($rail, opts) {
        // set up defaults, override with opts.
        $.extend(this, $.fn.rangeControl.defaults, opts, $.fn.rangeControl.settings);

        var th = this,

        init = function() {
            var th = this;

            // Our container
            th.$rail = $rail;

            th.evts.down = ( !th.isTouch ? 'mousedown' : 'touchstart' ) + '.' + namespace;
            th.evts.move = ( !th.isTouch ? 'mousemove' : 'touchmove' ) + '.' + namespace;
            th.evts.up = ( !th.isTouch ? 'mouseup' : 'touchend' ) + '.' + namespace;

            // if rail.css position is static, change it to relative.
            if ( th.$rail.css('position') === 'static' ) {
                th.$rail.css('position', 'relative');
            }

            // make sure orientation is either 'v' or 'h' in case an invalid value is passed in.
            th.orientation = th.orientation === 'v' ? 'v' : 'h';
            th.dimension = th.orientation === 'h' ? 'width' : 'height';
            th.property = th.orientation === 'h' ? 'left' : 'top';

            // * *
            // Set up the handle
            // * *

            // If $handle is passed in as a jQuery Object, leave it; otherwise, create one.
            th.$handle = th.$handle instanceof jQuery ? th.$handle : $('<span/>', {'class' : 'handle'});
            th.$handle.attr('unselectable', 'on').css(th.handleCss);

            // Create another handle if we're dealing with a range.
            if ( th.range ) {
                th.$minHandle = th.$minHandle instanceof jQuery ? th.$minHandle : $('<span/>', {'class' : 'handle'});
                th.$minHandle.data('min', true).addClass(namespace + '-min-handle').attr('unselectable', 'on').css(th.handleCss);
                th.$handle.data('max', true).addClass(namespace + '-max-handle');
            }

            // If the handle doesn't already exist inside of $rail, append it.
            if ( th.$rail.find(th.$handle).length === 0) {
                th.$rail.append(th.$handle);
                if ( th.range ) {
                    th.$rail.append( th.$minHandle );
                }
            }


            // If the value passed in for $handle is false, we want it to function the same, so we have to leave the
            // handle there; we'll just make it invisible.
            // In this case, only the $ambit will be visible. If that's disabled, too, the user's SOL.
            if ( th.hideHandle ) {
                th.$handle.css({
                    'opacity': '0',
                    'background': 'none',
                    'border': 'none'
                });
            }
            if ( th.hideHandle && th.hideAmbit ) {
                console.warn('**HEY!** $handle and $ambit can\'t both be false!');
            }


            // As long as $ambit isn't false (null, true, a jQuery obj), we need one.
            // If it's passed in as a jQuery Object, use that. Otherwise create a new one.
            if ( !th.hideAmbit ) {
                th.$ambit = th.$ambit instanceof jQuery ? th.$ambit : $('<span/>', {'class' : 'ambit'});

                if ( th.$rail.find(th.$ambit).length === 0) {
                    th.$rail.append(th.$ambit);
                }

                th.$ambit.css({
                    'display' : 'block',
                    'position' : 'absolute'
                }).css( th.property, 0 );
            } else {
                th.$ambit = false;
            }

        },

        events = function() {
            var $handles = th.range ? th.$handle.add(th.$minHandle) : th.$handle,
                $body = $('body'),
                $document = $(document);


            // Make sure the handle doesn't get a selected-text highlight
            // Seems to be fine without this
            // $handles.on('selectstart dragstart mousedown', false);

            // * *
            // Set up handle events
            // * *

            // User grabs the handle. Begin dragging.
            $handles.on( th.evts.down, function(downEvt) {
                if ( th.inMotion ) {
                    return;
                }

                downEvt.preventDefault();

                var $handle = this.className.indexOf('min') > -1 ? th.$minHandle : th.$handle,
                    theClass = !th.range ? '' :
                        this.className.indexOf('min') > -1 ? 'grabbing-min' : 'grabbing-max',
                    offset = th.$rail.offset();
                th.inMotion = true;

                $body.addClass('grabbing ' + theClass);
                $handle.addClass('grabbed');
                th.fire( th.evts.start );

                // User moves cursor/finger
                $document.on( th.evts.move, function(moveEvt) {
                    moveEvt.preventDefault();
                    var touch = th.isTouch ? moveEvt.originalEvent.targetTouches[0] : null,
                    pageX = th.isTouch ? touch.pageX : moveEvt.pageX,
                    pageY = th.isTouch ? touch.pageY : moveEvt.pageY,
                    position = 0;

                    if ( th.orientation === 'h' ) {
                        position = pageX - offset.left;
                    } else {
                        position = pageY - offset.top;
                    }
                    th.slideToPos(position, $handle);
                })

                // User lets go
                .on( th.evts.up, function() {
                    $document.off('.' + namespace);
                    th.inMotion = false;
                    $body.removeClass('grabbing ' + theClass);
                    $handles.removeClass('grabbed');
                    th.fire( th.evts.end );
                });

            // User clicks, not click-and-hold.
            }).on('click.' + namespace, function(e) {
                e.stopPropagation();
            });

            // User clicks on the rail. Jump the handle to the clicked spot (or nearest step).
            th.$rail.on('click', function(e) {
                if(!th.inMotion) {
                    var offset = th.$rail.offset();

                    var slideTo;
                    if (th.orientation === 'h') {
                        slideTo = e.pageX - offset.left;
                    } else {
                        slideTo = e.pageY - offset.top;
                    }
                    th.slideToPos(slideTo);
                }
            });


            // Update the rail size on window resize
            $(window).on('resize.' + namespace, function() {
                th.refresh(false);
            });
        };

        // Set up handles and ambit
        init.call(th);

        // Add events to handles and abmit
        events.call(th);

        // Set the rail size, step size, visibility, and handle positions to initial states
        th.reset(true);
    };

    RangeControl.prototype.slideToInitialPos = function() {
        var th = this;
        if ( !th.range ) {
            th.slideToInitialVal();
        } else {
            th.slideToInitialMin();
            th.slideToInitialMax();
        }
    };

    RangeControl.prototype.slideToInitialVal = function() {
        this.slideToPos( this.parseHandlePosition( this.initialValue ) );
    };

    RangeControl.prototype.slideToInitialMin = function() {
        this.slideToPos( this.parseHandlePosition( this.initialMin ), this.$minHandle );
    };

    RangeControl.prototype.slideToInitialMax = function() {
        this.slideToPos( this.parseHandlePosition( this.initialMax ), this.$handle );
    };

    /*
        Method: parseHandlePosition
            Parses the position (in pixels) where the handle should be based on user input

        Returns:
            Int - pixel value for position
    */
    RangeControl.prototype.parseHandlePosition = function(input) {
        var th = this,
        pixels = 0;

        // Set up initial position of the handle, based on initialValue.
        // if initialValue is a number:
        if ( $.type(input) === 'number' && input ) {
            // slideToPos: if 'steps' is enabled, slide to that step; otherwise slide to that px position.
            pixels = input * (th.steps ? th.stepSize : 1);

        // if initialValue is a string:
        } else if ( $.type(input) === 'string' ) {
            // if initialValue contains 'px', convert it to an Integer & slide to that absolute position.
            // this will ignore whether 'steps' is enabled.
            if ( input.indexOf('px') > -1 ) {
                pixels = parseInt( input, 10 );

            // if initialValue ends with a % sign, convert it to an Integer & slide to that relative position.
            } else if ( input.indexOf('%') > -1 ) {
                pixels = th.railSize * ( parseInt( input, 10 ) / 100);
            }
        }

        return pixels;
    };

    /*
        Group: Methods
    */
    /*
        Method: slideToPos
            Move the handle & expand the ambit to the position (in pixels) in newPos.
            Will be called when clicking on the rail, or on mousemove while dragging the handle.
            If 'steps' was enabled, the number passed to slideToPos has already been set to the step location.

        Parameters:
            newPos - (Integer, in px, Required): New target position of the handle, based on the target position
                        relative to the zero position (top/left) of the rail.

        Returns:
            RangeControl - .
    */
    RangeControl.prototype.slideToPos = function(newPos, $handle) {
        $handle = $handle || this.$handle;

        var th = this,
        data = {},
        isMin = $handle.data('min') === true,
        curStep, newStep,

        getStep = function(pos) {
            return Math.round(pos / th.stepSize);
        };

        // Make sure the new position is valid
        newPos = th.validatePos(newPos, isMin);

        if ( th.steps ) {
            curStep = getStep(th.currentPosition);
            newStep = getStep(newPos);
            data = {
                oldStep : curStep,
                newStep : newStep,
                stepDelta : newStep - curStep
            };

            newPos = newStep * th.stepSize;

            if (data.stepDelta) {
                th.goToPos(newPos, $handle, data);
            }
        } else {
            data = {
                oldPosition : th.currentPosition,
                newPosition : newPos,
                positionDelta : newPos - th.currentPosition
            };

            th.goToPos(newPos, $handle, isMin);
        }

        return th;
    };

    /*
        Method: validatePos
            Makes sure the new position is valid

        Parameters:
            newPos - (Integer, in px, Required): New target position of the handle, based on the target position
                        relative to the zero position (top/left) of the rail.
            isMin - (Boolean, Optional): true if the currently dragged handle is the minimum handle

        Returns:
            Int - a parsed and validated position in pixels.
    */
    RangeControl.prototype.validatePos = function(newPos, isMin) {
        var th = this;
        // Parse and validate pos
        if ( newPos < 0 ) {
            newPos = 0;
        }
        if ( newPos > th.railSize ) {
            newPos = th.railSize;
        }

        // Don't let range values go past the other
        if ( th.range ) {
            var newPosWithThreshold = newPos,
            // If the range threshold is between 0 and 1, treat it as a percentage of the width
            threshold = th.rangeThreshold > 0 && th.rangeThreshold < 1 ? th.rangeThreshold * th.railSize : th.rangeThreshold;

            if ( isMin ) {
                newPosWithThreshold += threshold;
                if ( th.currentPosition !== false && newPosWithThreshold > th.currentPosition ) {
                    newPos = th.currentPosition - threshold;
                }
            } else {
                newPosWithThreshold -= threshold;
                if ( th.currentMinPosition !== false && newPosWithThreshold < th.currentMinPosition) {
                    newPos = th.currentMinPosition + threshold;
                }
            }
        }

        return newPos;
    };

    /*
        Method: goToPos
            Handles logic for moving handles to the correct positions. This function should only be called from slideToPos

        Parameters:
            pos - (Integer, in px, Required): New target position of the handle, based on the target position
                        relative to the zero position (top/left) of the rail.
            $handle - (jQuery object, Required): jQuery object representing the current handle
            data - (Object, Required): data passed to the event that is triggered

        Returns:
            RangeControl - .
    */
    RangeControl.prototype.goToPos = function(pos, $handle, isMin) {
        var th = this,
            response = [];

        $handle[0].style[ th.property ] = ( pos / th.railSize * 100 ) + '%';
        if ( isMin ) {
            th.lastMinPosition = pos;
        } else {
            th.lastPosition = pos;
        }

        if ( !th.range ) {
            th.currentPosition = th.lastPosition;
            th.currentPositionPct = th.lastPosition / th.railSize * 100;

        // Range control
        // Calculate position values
        } else {

            // If the plugin is being intialized, but it is hidden, our calculated values will be wrong. Use initial ones.
            // To update isHidden, call .rangeControl('refresh') when the visibility changes
            if ( th.isHidden ) {
                th.currentPosition = th.parseHandlePosition( th.initialMax );
                th.currentMinPosition = th.parseHandlePosition( th.initialMin );

            // Else get the position from our last position
            } else {
                // lastPosition is initialized at false
                th.currentPosition = th.lastPosition !== false ? th.lastPosition : th.parseHandlePosition( th.$handle.css( th.property ), 10 );
                th.currentMinPosition = th.lastMinPosition !== false ? th.lastMinPosition : th.parseHandlePosition( th.$minHandle.css( th.property ), 10 );
            }
            th.currentPositionPct = Math.min( th.currentPosition / th.railSize * 100, 100 ); // don't let it go above 100
            th.currentMinPositionPct = Math.min( th.currentMinPosition / th.railSize * 100, 100 );


            // Make sure we can get to 100% and 0%
            if ( th.currentPositionPct > 99.49 ) {
                th.currentPositionPct = 100;
            } else if ( th.currentPositionPct < 0.5 ) {
                th.currentPositionPct = 0;
            }
            if ( th.currentMinPositionPct > 99.49 ) {
                th.currentMinPositionPct = 100;
            } else if ( th.currentMinPositionPct < 0.5 ) {
                th.currentMinPositionPct = 0;
            }

            // Change ambit's width/height and left/top
            var css = {};
            css[ th.dimension ] = th.getHandleDist() + '%';
            css[ th.property ] = th.currentMinPositionPct + '%';
            th.$ambit.css( css );
        }

        if ( th.$ambit && !th.range ) {
            th.$ambit[ th.dimension ]( th.currentPositionPct + '%' );
        }

        // Build response for slid event
        if ( th.range ) {
            response = [{
                    min: th.currentMinPosition,
                    max: th.currentPosition
                },{
                    min: th.currentMinPositionPct,
                    max: th.currentPositionPct
                },
                th
            ];
        } else {
            response = [ th.currentPositionPct, th ];
        }

        // Trigger slid event
        th.fire( th.evts.slid, response );

        return th;
    };

    /*
        Method: getHandleDist
            Gets the distance between the minimum and maximum handles (in percent)

        Returns:
            Float
    */
    RangeControl.prototype.getHandleDist = function() {
        var th = this,
        // Access the style property to ensure the return value is a percent
        dist = parseFloat( th.$handle[0].style[ th.property ] ) - parseFloat( th.$minHandle[0].style[ th.property ] );
        return dist;
    };

    /*
        Method: slideToStep
            Move the handle & expand the ambit to the designated 'step' position.

        Parameters:
            step - (Integer, Required): New target position of the handle, based on the cursor position
                    relative to the zero position (top/left) of the rail.

        Returns:
            RangeControl - .
    */
    RangeControl.prototype.slideToStep = function(step) {
        this.slideToPos( step * (this.steps ? this.stepSize : 1) );

        return this;
    };

    /*
        Method: updateSize
            Set up the initial positioning & values for railSize & stepSize, based on width (for horizontal)
            or height (for vertical) of rail.

        Parameters:
            andHandles - if true, the function will update the position of the handles

        Returns:
            RangeControl - .

    */
    RangeControl.prototype.updateSize = function( andHandles ) {
        var th = this,
            size;

        // Get the size of the rail
        size = th.orientation === 'h' ? th.$rail.outerWidth() : th.$rail.outerHeight();

        // Only make continue if the size has actually changed
        if ( size !== th.railSize ) {
            th.railSize = size || th.railSize; // the rail size could have been reset to 0 if it's hidden on resize

            // Calcualte stepSize based on railSize & # of steps.
            if ( th.steps ) {
                th.stepSize = th.railSize / th.steps;
            }

            if ( andHandles !== false ) {
                th.slideToPos( th.currentPosition );
                if ( th.range ) {
                    th.slideToPos( th.currentMinPosition, th.$minHandle );
                }
            }
        }


        return th;
    };

    RangeControl.prototype.fire = function( name, args ) {
        this.$rail.trigger( name + '.' + namespace, args || [this] );
    };

    /*
        Method: refresh
            Updates sizing values

        Returns:
            RangeControl - .

    */
    RangeControl.prototype.refresh = function( andHandles ) {
        var th = this;

        // If the rail is not visible, there may be some sizing issues
        th.isHidden = th.$rail.is(':hidden');

        // Get the size of the rail
        th.updateSize( andHandles );

        return this;
    };

    // Resest sizing and handle positions
    RangeControl.prototype.reset = function( isHardReset ) {
        var th = this,
            hasPercent = th.$handle[0].style[ th.property ].indexOf('%') > -1;


        // Set the rail size, step size, and visibility
        th.refresh(false);

        // The handle's left|top value would be a percentage if slideToPos was already called on that handle
        // We can use this to determine if we've already initialized the handle
        if ( isHardReset || !hasPercent ) {
            // Give handles initial values
            th.slideToInitialPos();
        } else {
            if ( !th.range ) {
                th.slideToPos( th.parseHandlePosition( th.$handle[0].style[ th.property ] ) );
            } else {
                th.slideToPos( th.parseHandlePosition( th.$minHandle[0].style[ th.property ] ), th.$minHandle );
                th.slideToPos( th.parseHandlePosition( th.$handle[0].style[ th.property ] ), th.$handle );
            }
        }
    };


    RangeControl.prototype.destroy = function() {
        var th = this;

        th.$rail.empty().removeData('rangeControl');
    };


    /*
        Group: jQuery Plugin Wrapper
    */
    /*
        Method: $.fn.rangeControl
            jQuery Plugin Wrapper for RangeControl

        Parameters:
            opts - (Plain js Object, Default: {} ): Used to pass in custom options.

        opts:
            Possible values to be passed in through the _opts_ parameter

            orientation - (String, Default: 'h'): Horizontal or Vertical.
                            Valid values: 'h' or 'v'
            range - (Boolean, Default: false): if true, this will add a second handle for a range controller
            callback - (function, Default: null): function to call every time the slider is moved/updated.
                        Returns: currentPositionPct (Integer, current position percent)
            initialValue - (String or Number, Default: 0): Initial handle position.
                            Valid values:
                                for positioning relative to the rail's total length: '0%' through '100%' ,
                                for positioning relative to the rail's origin: the number (in px),
                                if 'steps' is enabled, the step number
            initialMin - (String or Number, Default: 0): Initial minimum range handle position
            initialMax - (String or Number, Default: 100%): Initial maximum range handle position
            steps - (Integer, Default: 0): How many 'steps' (stop-points) between start & end
            $ambit - ($Object, Default: null): Element to use as the ambit
                        (the colored section along the rail to signify the area 'below' the handle).
                        If null or undefined, a new <span/> will be created, with a class
                        of 'ambit'.
            $handle - ($Object, Default: null): Element to use as the handle.
                        If null or undefined, a new <span/> will be created, with a class
                        of 'handle'.
            $minHandle - ($Object, Default: null): Element to use as the handle.
                        If null or undefined, a new <span/> will be created, with a class
                        of 'handle slidecontrol-min-handle'.
            hideHandle - (Boolean, Default: false): Hides the handle
            hideAmbit - (Boolean, Default: false): Hides the ambit

        Returns:
            jQuery - The jQuery chain
    */
    $.fn.rangeControl = function(opts) {
        var args = Array.prototype.slice.apply( arguments );
        return this.each(function() {
            var $this = $(this),
                rangeControl = $this.data('rangeControl');

            if ( !rangeControl ) {
                rangeControl = new RangeControl($this, opts);
                $this.data('rangeControl', rangeControl);
            }

            if ( typeof opts === 'string' ) {
                rangeControl[ opts ].apply( rangeControl, args.slice(1) );
            }
        });
    };

    $.fn.rangeControl.defaults = {
        initialValue : 0,
        steps : 0,
        orientation : 'h',
        hideHandle : false,
        hideAmbit : false,
        $handle : null,
        $ambit : null,
        callback : null,
        range : false,
        initialMin : '0',
        initialMax : '100%',
        rangeThreshold: 0
    };

    $.fn.rangeControl.settings = {
        isTouch : !!( 'ontouchstart' in window ),
        inMotion : false,
        stepSize : 0,
        railSize : false,
        currentPosition : false,
        currentPositionPct : false,
        currentMinPosition : false,
        currentMinPositionPct : false,
        lastPosition: false,
        lastMinPosition: false,
        evts : {
            start : 'scrubstart',
            end : 'scrubend',
            slid : 'slid'
        },

        handleCss : {
            'display' : 'block',
            'position' : 'absolute',
            'top' : 0,
            'left' : 0,
            'MozUserSelect': 'none',
            'msUserSelect': 'none',
            'webkitUserSelect': 'none',
            'userSelect':'none'
        }
    };
});