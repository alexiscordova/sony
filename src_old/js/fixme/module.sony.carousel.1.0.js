// ------------ Sony Carousel Module ------------
// Module: Carousel
// Version: 1.0
// Modified: 2012-11-12 by Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr, jodo.timer.js
// Optional: jQuery throttle-debounce (only used on window resize)
// -------------------------------------------------------------------------

/*global jQuery, Modernizr */
(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
})(window);

(function($, Modernizr, window, undefined) {

    'use strict'; // jshint ;

    var Carousel = sony.modules.Carousel = function($el, opts) {
        $.extend(this, $.fn.carousel.defaults, opts, $.fn.carousel.settings);



        // Private methods: init, paginate, gestures, nav
        var init = function() {
            var t = this,
            transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };

            t.$el = $el;
            t.$parent = t.$el.parent();
            t.slides = t.childFilter === null ? t.$el.children() : t.$el.children(t.childFilter);



            // Get the right prefixed names e.g. WebkitTransitionDuration
            t.tapOrClick = t.hasTouch ? 'touchstart' : 'click';
            t.transformName = Modernizr.prefixed('transform'); // css version
            t.transitionName = Modernizr.prefixed('transition');
            t.transitionProperty = Modernizr.prefixed('transitionProperty');
            t.transitionDuration = Modernizr.prefixed('transitionDuration');
            t.transitionEasing = Modernizr.prefixed('transitionTimingFunction');
            t.transitionEnd = transEndEventNames[t.transitionName];

            // Set the slide width to the width of the first slide, if it's undefined
            setDimensions.call(t);

            // Gotta have 3d transforms to do 3d transforms yo.
            if (t.transition === 'convex' && !t.hasTransforms3d) {
                t.transition = 'slide';
                t.$el.css('overflow', 'hidden');
            }

            if (t.transition === 'slide' && t.loopAround === false) {
                t.transition = 'container';
            }

            // Set up CSS for different effects.
            // FYI this has the chance to be called twice
            t.effects[t.transition].init.call(t);

            nav.call(t);

            // Add the index buttons
            if (t.showIndexBtns === true) {
                paginate.call(t);
            }

            // Set up gesture events
            gestures.call(t);

            // Update things when the window is resized. And now. Use throttle/debounce if it's available
            var resizeFunc = $.throttle ? $.throttle(200, $.proxy(t._onResize, t)) : $.proxy(t._onResize, t);
            $(window).on('resize', resizeFunc).on('load', function() {
                if (setDimensions.call(t)) {
                    t.effects[t.transition].init.call(t);
                }
                t._onResize(true);
            });
            t._onResize();

            // Now that we've resized the container, make the images variable width/height
            t.slides.find('img, video, embed, object').css({ maxWidth: '100%', height: 'auto'});


            if (t.timeout && t.pauseOnHover) {
                var $hoverEl = t.$el;

                // If the controls are outside of the container element,
                // Add them to the collection of elements that should pause the slideshow on hover
                if (!t.putControlsInside && t.pauseOnIndexHover) {

                    // t.indexBtns is an array of jQuery objects
                    $.each(t.indexBtns, function() {
                        $hoverEl = $hoverEl.add(this);
                    });
                }

                // Pause on hover, resume on mouse out
                $hoverEl.hover(function() {
                    t.pause(true);
                }, function() {
                    t.resume(true);
                });
            }

            // Slide to starting slide
            if (t.slides.length > 1) {
                t.isCarousel = true;
                t.slideToIndex(t.start);
                t.canGoNext = true;
                t.canGoPrev = true;
            }
        },

        // Sets width/height dimensions of the slides. It returns a boolean indicating a value has changed
        setDimensions = function() {
            var t = this,
                changed = false;

            if (t.slideWidth === undefined || t.slideWidth === 0) {
                t.slideWidth = t.slides.eq(t.currIndex).outerWidth(true);
                changed = true;
            }
            if (t.slideHeight === undefined || t.slideHeight === 0) {
                t.slideHeight = t.slides.eq(t.currIndex).outerHeight(true);
                changed = true;
            }
            t.$el.height(t.slideHeight);
            return changed;
        },

        paginate = function() {
            var t = this,
            numBtns = Math.ceil(t.slides.length / t.step),
            i = 0,
            $nav = $('<nav class="carousel-controls" />'),
            $parent = t.putControlsInside ? t.$el : t.$parent,
            navigate = function(e) {

                var btnIndex = $(e.currentTarget).data('index');

                if (btnIndex === t.currIndex) { return; }

                // if only moving 1, just go for it
                if (Math.abs(t.currIndex - btnIndex) < 2) {
                    t.slideToIndex(btnIndex * t.step);
                }

                // if moving more than 1, cycle through quickly to keep things in sync.
                else {
                    var dist = btnIndex - t.currIndex,
                    delayedStart;
                    i = t.currIndex;

                    if (dist > 0) {
                        // going up
                        delayedStart = setInterval(function() {
                            i++;
                            if (i <= btnIndex) {
                                t.slideToIndex(i * t.step, i !== btnIndex);
                            } else {
                                clearInterval(delayedStart);
                            }
                        }, 50);

                    } else {
                        // going down
                        delayedStart = setInterval(function() {
                            i--;
                            if (i >= btnIndex) {
                                t.slideToIndex(i * t.step, i !== btnIndex);
                            } else {
                                clearInterval(delayedStart);
                            }
                        }, 50);
                    }

                }
            },
            $ol = $('<ol/>', {'class' : t.indexButtonClass, 'style' : 'padding: 0;'});
            t.indexBtns = [];

            // Loop through all the index buttons and add events to them
            for (; i < numBtns; i++) {
                var title,
                    btn = $('<li class="carousel-index-btn" />');

                // Insert the title into the button if that's cool.
                if (t.useTitles) {
                    title = t.slides.eq(i).data('title') || t.slides.eq(i).attr('title');
                    btn.text(title);
                }

                t.indexBtns.push(btn);

                btn.data('index', i)
                    .appendTo($ol)
                    .on(t.tapOrClick, navigate);
            }



            //TM
            if(t.type === 'default-full'){
                t.indexThumbs = [];


                t.$el.parent().find('.carousel-tray .carousel-index-thumb').each(function(i){
                    var $thumb = $(this);

                    t.indexThumbs.push($thumb);

                    $thumb.data('index', i).on(t.tapOrClick, navigate);

                });


            }


            // Append the index buttons to the carousel controls
            $nav.append($ol);
            $parent.append($nav);

            // resize & center the btnList, so
            if (t.autoCenterIndexBtns) {
                var btnListWidth = 0;
                $ol.children().each(function() {
                    btnListWidth += $(this).outerWidth(true);
                });

                $ol.css({
                    width: btnListWidth + 'px',
                    margin: 'auto',
                    float: 'none'
                });

            }
        },

        gestures = function() {
            var t = this,
            coords = {
                startX: null,
                startY: null,
                endX: null,
                endY: null
            },
            lastTouch = 0;

            t.$el.on('touchstart', function(e) {
                coords.startX = e.originalEvent.targetTouches[0].clientX;
                coords.startY = e.originalEvent.targetTouches[0].clientY;
                coords.endX = coords.startX;
                coords.endY = coords.startY;
            });

            t.$el.on('touchmove', function(e) {
                var newX = e.originalEvent.targetTouches[0].clientX,
                    newY = e.originalEvent.targetTouches[0].clientY,
                    absX = Math.abs(coords.endX - newX),
                    absY = Math.abs(coords.endY - newY);

                // If we've moved more Y than X, we're scrolling vertically
                if (absX < absY && t.swipe === 'horizontal') {
                    return;
                }

                // Prevents the page from scrolling left/right
                e.preventDefault();

                coords.endX = newX;
                coords.endY = newY;
            });

            t.$el.on('touchend', function(e) {
                var swipe = {},
                    deltaX = coords.startX - coords.endX,
                    deltaY = coords.startY - coords.endY,
                    absX = Math.abs(deltaX),
                    absY = Math.abs(deltaY),
                    now = new Date().getTime();

                swipe.distance = (absX > absY) ? absX : absY;
                swipe.direction = (absX < absY) ?
                    (deltaY < 0 ? 'down' : 'up') :
                    (deltaX < 0 ? 'right' : 'left');

                // If we have a swipe of > 50px, let's use it!
                if (swipe.distance > 50) {
                    if ((swipe.direction === 'left' && t.swipe === 'horizontal') || (swipe.direction === 'up' && t.swipe === 'vertical')) {
                        t.advance();
                    } else if ((swipe.direction === 'right' && t.swipe === 'horizontal') || (swipe.direction === 'down' && t.swipe === 'vertical')) {
                        t.retreat();
                    }
                }

                if (now - lastTouch < 350) {
                    t.trigger('doubleTap', [e, t]);
                }
                lastTouch = now;

            });
        },

        nav = function() {
            var $nav,
            t = this,
            span = '<span/>',
            $parent = t.putControlsInside ? t.$el : t.$parent;

            if (t.slides.length < 2) {
                return;
            }

            // Add the buttons
            if (t.generateNav && t.showPrevNextBtns) {

                // Create and append the carousel controls
                $nav = $('<nav/>',{'class':'carousel-btns'});

                // Next button
                t.btnNext = $(span, {
                    'class' : t.genButtonClass + ' ' + t.nextButtonClass
                });

                // if there needs to be an innerButton create it; otherwise set btnNextInner as t.btnNext
                if (t.prevNextInnerButtonClass === '') {
                    t.btnNext.html(t.nextText);
                } else {
                    $(span, {'class' : t.prevNextInnerButtonClass}).html(t.nextText).appendTo(t.btnNext);
                }

                $nav.append(t.btnNext);

                // prev button
                t.btnPrev = $(span, {
                    'class' : t.genButtonClass + ' ' + t.prevButtonClass
                });

                // if there needs to be an innerButton create it; otherwise set btnNextInner as t.btnNext
                if (t.prevNextInnerButtonClass === '') {
                    t.btnPrev.html(t.prevText);
                } else {
                    $(span, {'class' : t.prevNextInnerButtonClass}).html(t.prevText).appendTo(t.btnPrev);
                }

                $nav.append(t.btnPrev);
                $parent.append($nav);
            }

            // They probably already made their own nav. Just add events to the buttons
            else if (!t.generateNav && t.showPrevNextBtns) {
                t.btnNext = $parent.find('.' + t.nextButtonClass);
                t.btnPrev = $parent.find('.' + t.prevButtonClass);
            }

            // Bind events
            if (t.showPrevNextBtns) {
                t.btnNext.on(t.tapOrClick, function() {
                    if (!t.btnNext.hasClass(t.disabledClass)) {
                        t.advance();
                    }
                });

                t.btnPrev.on(t.tapOrClick, function() {
                    if (!t.btnPrev.hasClass(t.disabledClass)) {
                        t.retreat();
                    }
                });
            }


            // Add slideCount text container
            if (t.showSlideCountTxt) {
                // See if it's on the page already in case they've made their own
                t.slideCountTxt = $parent.find('.' + t.slideCountTxtClass);
                var found = t.slideCountTxt.length > 0;

                // Generate span with slide count text in it if we didn't find it
                if (!found) {
                    t.slideCountTxt = $(span, {
                        'class' : t.slideCountTxtClass
                    });
                }

                t._setSlideCount(t.currIndex);

                if (!found) {
                    $parent.append(t.slideCountTxt);
                }
            }

            if (t.canClickElement === true) {
                t.slides.each(function(i) {
                    $(this).on(t.tapOrClick, function(e) {
                        e.preventDefault();
                        t.slideToIndex(i);
                    });
                });
            }
        };

        init.call(this);
    };

    // Advance to the next slide
    Carousel.prototype.advance = function() {
        var t = this,
        prevIndex = t.currIndex;

        if (!t.canGoNext) {
            return;
        }

        t.currIndex += t.step;

        if (t.currIndex > t.slides.length - t.step) {
            t.currIndex = 0;
        }

        t.slide(t.currIndex, prevIndex, 'advance');
    };

    // Retreat to the previous slide
    Carousel.prototype.retreat = function() {
        var t = this,
        prevIndex = t.currIndex;

        if (!t.canGoPrev) {
            return;
        }

        t.currIndex -= t.step;

        if (t.currIndex < 0) {
            t.currIndex = t.slides.length - 1;
        }

        t.slide(t.currIndex, prevIndex, 'retreat');
    };

    // isQuickSlide means the slide is being skipped/gone through quickly but still shown
    Carousel.prototype.slideToIndex = function(index, isQuickSlide) {
        var t = this,
        prevIndex = t.currIndex,
        direction;
        if (index === prevIndex) {
            prevIndex = t.slides.length - 1;
        }
        direction = index > prevIndex ? 'advance' : 'retreat';
        t.currIndex = index;
        t.slide(t.currIndex, prevIndex, direction, isQuickSlide);
    };

    // Sllllllllllide
    Carousel.prototype.slide = function(index, prevIndex, direction, isQuickSlide) {
        var t = this,
            tx = -(index * t.slideWidth);

        // Trigger our slide start event for those interested
        t.trigger('slideStart', [index, prevIndex, direction, t]);


        // if buttons are visible, and loop=false and loopAround=false, disable first or last button when you get to an end
        if (t.showPrevNextBtns && t.btnNext && t.btnPrev && !t.loopAround && !t.loop) {
            t.btnNext.add(t.btnPrev).filter('.' + t.disabledClass).removeClass(t.disabledClass);
            t.canGoNext = true;
            t.canGoPrev = true;

            if (index === 0) {
                t.btnPrev.addClass(t.disabledClass);
                t.canGoPrev = false;
            } else if (index === t.slides.length - 1) {
                t.canGoNext = false;
                t.btnNext.addClass(t.disabledClass);
            }
        }

        // Update text
        if (t.showSlideCountTxt) {
            t._setSlideCount(index + 1);
        }

        // Transition
        t._transition(tx, index, prevIndex, direction);

        // Add active class to current slide
        t.slides.removeClass(t.activeClass).eq(index).addClass(t.activeClass);

        // Add active class to current index button
        t._highlightIndexButton();

        // Adjust the container's height
        if (t.autoResize) {
            t._autoResizeHeight();
        }

        // Decide what to do with the timer
        if (t.timeout) {
            if (!t.isPaused && !isQuickSlide) {
                t._setTimer(index, prevIndex, direction);
            } else if (t.isPaused) {
                if (t.timer) {
                    t.timer.reset();
                }
            }
        }
    };

    // Sets a new timer to advance the slide when it ends.
    Carousel.prototype._setTimer = function(index, prevIndex, direction) {
        var t = this;

        // If timeout > 0, set a timer to advance
        if (t.timer) {
            t.timer.reset();
        }

        // No longer paused because we're starting a timer
        t.isPaused = false;
        t.pausedManually = false;

        t.trigger('timerStart', [index, prevIndex, direction, t]);

        // Create a new timer and call advance when it's done
        t.timer = $.timer(function() {
            t.advance();
        }, t.timeout);
    };

    // highlight the correct index button
    Carousel.prototype._highlightIndexButton = function() {
        var t = this,
            $btn,$thumb;
        if (t.showIndexBtns === true && t.indexBtns.length > 0) {
            $btn = $(t.indexBtns[ Math.floor(t.currIndex / t.step) ]);
            $btn.addClass(t.activeClass).siblings().removeClass(t.activeClass);
        }

        if(t.type === 'default-full'){
            $thumb = $(t.indexThumbs[ Math.floor(t.currIndex / t.step) ]);
            $thumb.addClass(t.activeClass).siblings().removeClass(t.activeClass);
        }
    };

    // Do the transition
    Carousel.prototype._transition = function(tx, index, prevIndex, direction) {
        var t = this,
            $nextSlide = t.slides.eq(index),
            $prevSlide = t.slides.eq(prevIndex),
            complete = function() {
                t.trigger('slideEnd', [index, prevIndex, direction, t]);
            };

        t.effects[t.transition].transition.call(t, $nextSlide, $prevSlide, direction, complete, tx);
    };

    // Sets the transition duratio to zero,
    // sets the property's value,
    // forces a reflow so that the browser doesn't cache our changes,
    // resets the transition duration
    Carousel.prototype._skipTransition = function(element, property, value) {
        var t = this,
            reflow,
            duration = element.style[this.transitionDuration];

        element.style[t.transitionDuration] = '0ms'; // ms needed for firefox!
        element.style[property] = value;
        reflow = element.offsetWidth; // Force reflow
        element.style[t.transitionDuration] = duration;
    };

    // Pause the carousel
    Carousel.prototype.pause = function(fromHover) {
        var t = this,
            remaining;

        if (t.pausedManually || t.timer === null) {
            return;
        }

        remaining = t.timer.pause();
        t.pausedManually = fromHover === undefined;
        t.isPaused = true;
        t.$el.addClass('paused');
        t.trigger('paused', [remaining, t]);
    };

    // Resume the carousel
    Carousel.prototype.resume = function(fromHover) {
        var t = this,
            remaining;

        if (fromHover === undefined || t.pausedManually === false) {
            t.pausedManually = false;
            remaining = t.timer.resume();
            t.$el.removeClass('paused');
            t.isPaused = false;
            t.trigger('resumed', [remaining, t]);
        }
    };

    // On window resize, update the width/height of the carousel container
    Carousel.prototype._onResize = function() {
        var t = this,
            tempHeight = 0,
            $slide = t.slides.eq(t.currIndex);

        t.slideWidth = t.$el.parent().outerWidth(true);

        if (t.transition === 'container') {
            t.slides.css('width', t.slideWidth);
            t.$el.width(t.slides.length * t.slideWidth);
        } else {
            t.$el.width(t.slideWidth);
        }

        tempHeight = $slide.outerHeight();
        if (tempHeight === 0) {
            // Don't make it smaller onload
            return;
        }
        t.slideHeight = tempHeight;
        t.$el.height(t.slideHeight);

        t.effects[t.transition].init.call(t);
    };

    // Animates the height of the previous slide to the next slide
    Carousel.prototype._autoResizeHeight = function() {
        var t = this,
            $slide = t.slides.eq(t.currIndex);
        t.$el.animate({height: $slide.outerHeight(true)}, t.duration / 2, t.jsEasing);
    };

    // Sets the slide count (e.g. "slide 1/5")
    Carousel.prototype._setSlideCount = function(index) {
        var i, span, txt,
            t = this,
            frag = document.createDocumentFragment(),
            data = {
                'carousel-count-prefix': t.slideCountPrefix,
                'carousel-count-current': index,
                'carousel-count-separator': t.slideCountSeparator,
                'carousel-count-total': t.slides.length
            };

        // If we don't need a prefix, delete it from the object so it's not looped through
        if (!t.slideCountPrefix) {
            delete data['carousel-count-prefix'];
        }

        // Append elements to a document fragment so we're not working with live DOM elements (faster)
        for (i in data) {
            span = document.createElement('span');
            txt = document.createTextNode(data[i]);
            span.className = i;
            span.appendChild(txt);
            frag.appendChild(span);
        }

        // Put our fragment in the container
        t.slideCountTxt.html(frag);
    };

    // Borrowed from Modernizr source :)
    // Gets something like webkitTransform and makes it -webkit-transform
    Carousel.prototype.getPrefixed = function(prop) {
        return this.prefix(Modernizr.prefixed(prop));
    };

    Carousel.prototype.prefix = function(prop) {
        return prop.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    };

    Carousel.prototype.trigger = function(name, args) {
        this.$el.trigger(name + '.' + this.Carousel, args);
    };

    Carousel.prototype.effects = {};

    // Slide container
    Carousel.prototype.effects.container = {

        init: function() {
            var t = this;
            t.slides.css('float', 'left');
            t.$el.width(t.slideWidth * t.slides.length);
            if (t.isCSS && t.hasTransforms) {
                t.$el.css(t.transitionName, t.prefix(t.transformName) + ' ' + t.duration + 'ms ' + t.cssEasing);

            } else {
                t.$el.css('marginLeft', t.start * t.slideWidth);
            }
        },

        transition: function($nextSlide, $prevSlide, direction, complete, tx) {
            var t = this,
            whichProperty = t.hasTransforms ? t.transformName : 'marginLeft',
            value;

            if (t.isCSS) {
                if (t.hasTransforms3d) {
                    value = 'translate3d(' + tx + 'px, 0, 0)';
                } else if (t.hasTransforms) {
                    value = 'translate(' + tx + 'px, 0)';
                } else {
                    value = tx + 'px';
                }

                t.$el.css(whichProperty, value).one(t.transitionEnd, complete);
            }

            // jQuery animate fallback
            else {
                t.$el.animate({marginLeft: tx}, t.duration, t.jsEasing, complete);
            }
        }
    };

    // Slide Continuous
    Carousel.prototype.effects.slide = {

        init: function() {
            var t = this;
            t.slides.each(function(index) {
                var offset = (index - t.currIndex) * t.slideWidth,
                whichProperty = t.hasTransforms ? t.transformName : 'left',
                value;

                offset += 'px';

                this.style.position = 'absolute';
                this.style.top = 0;
                this.style.left = 0;
                this.style.zIndex = 1;

                if (t.isCSS) {
                    if (t.hasTransforms3d) {
                        value = 'translate3d(' + offset + ', 0, 0)';
                    } else if (t.hasTransforms) {
                        value = 'translate(' + offset + ', 0)';
                    } else {
                        value = offset;
                    }

                    // Set transform
                    this.style[whichProperty] = value;

                    // Set transition
                    this.style[t.transitionName] = t.prefix(whichProperty) + ' ' + t.duration + 'ms ' + t.cssEasing;
                } else {
                    this.style.left = offset;
                }
            });
        },

        transition: function($nextSlide, $prevSlide, direction, complete) {
            var t = this,
                whichProperty,
                next = $nextSlide[0],
                prev = $prevSlide[0],
                nextSlideStart = direction === 'advance' ? t.slideWidth : -t.slideWidth,
                prevSlideEnd = -1 * nextSlideStart;

            if (t.isCSS) {
                var nextStartValue, nextEndValue, prevEndValue;
                whichProperty = t.hasTransforms ? t.transformName : 'left';

                // Determine what we should be using... there's probably a better way. DRY!
                if (t.hasTransforms3d) {
                    nextStartValue = 'translate3d(' + nextSlideStart + 'px, 0, 0)';
                    nextEndValue = 'translate3d(0, 0, 0)';
                    prevEndValue = 'translate3d(' + prevSlideEnd + 'px, 0, 0)';
                } else if (t.hasTransforms) {
                    nextStartValue = 'translate(' + nextSlideStart + 'px, 0)';
                    nextEndValue = 'translate(0, 0)';
                    prevEndValue = 'translate(' + prevSlideEnd + 'px, 0)';
                } else {
                    nextStartValue = nextSlideStart + 'px';
                    nextEndValue = 0;
                    prevEndValue = prevSlideEnd + 'px';
                }

                // don't show transition when we're moving things around
                t._skipTransition(next, whichProperty, nextStartValue);

                // Trigger transitions
                if (prev) {
                    prev.style[whichProperty] = prevEndValue;
                    prev.style.zIndex = 1;
                }
                next.style[whichProperty] = nextEndValue;
                next.style.zIndex = 2;

                // Trigger slide end event on transition end
                $nextSlide.one(t.transitionEnd, complete);
            }

            else {
                $nextSlide.css('left', nextSlideStart + 'px');
                $nextSlide.animate({left: 0}, t.duration, t.jsEasing);
                $prevSlide.animate({left: prevSlideEnd + 'px'}, t.duration, t.jsEasing);
            }
        }
    };

    // Fade
    Carousel.prototype.effects.fade = {

        init: function() {
            var t = this;
            t.slides.each(function() {
                this.style.position = 'absolute';
                this.style.top = 0;
                this.style.left = 0;
                this.style.zIndex = 1;

                if (t.isCSS) {
                    this.style.opacity = 0;
                    this.style[t.transitionName] = 'opacity ' + t.duration + 'ms ' + t.cssEasing;
                } else {
                    $(this).fadeOut();
                }
            });
        },

        transition: function($nextSlide, $prevSlide, direction, complete) {
            var t = this;
            if (t.isCSS) {
                $prevSlide.css({
                    opacity: 0,
                    zIndex: 1
                });
                $nextSlide.css({
                    opacity: 1,
                    zIndex: 2
                }).one(t.transitionEnd, complete);
            } else {
                $prevSlide.css({
                    zIndex: 1
                }).fadeOut(t.duration);
                $nextSlide.css({
                    zIndex: 2
                }).fadeIn(t.duration, complete);
            }
        }
    };

    // 3D transforms!
    Carousel.prototype.effects.convex = {

        init: function() {
            var t = this;
            t.slides.each(function() {
                this.style.position = 'absolute';
                this.style.top = 0;
                this.style.left = 0;

                // We already checked to make sure transforms are available, no need for fallbacks.
                this.style[t.transitionName] = 'all ' + t.duration + 'ms ' + t.cssEasing;
                this.style[Modernizr.prefixed('transformStyle')] = 'preserve-3d';
                this.style.zIndex = 1;
                this.parentNode.style[Modernizr.prefixed('perspective')] = '600px';
                this.style[t.transformName] = 'translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0)';
                this.style.opacity = 0;
            });
        },

        transition: function($nextSlide, $prevSlide, direction, complete) {
            var t = this,
                next = $nextSlide[0],
                prev = $prevSlide[0],
                future = 'translate3d(100%, 0, 0) rotateY(90deg) translate3d(100%, 0, 0)',
                past = 'translate3d(-100%, 0, 0) rotateY(-90deg) translate3d(-100%, 0, 0)',
                nextStartPosition, prevEndPosition;

            if (direction === 'advance') {
                nextStartPosition = future;
                prevEndPosition = past;
            } else {
                nextStartPosition = past;
                prevEndPosition = future;
            }

            t._skipTransition(next, t.transformName, nextStartPosition);

            if (prev) {
                prev.style[t.transformName] = prevEndPosition;
                prev.style.opacity = 0;
            }

            next.style[t.transformName] = '';
            next.style.opacity = 1;

            // Trigger slide end event on transition end
            $nextSlide.one(t.transitionEnd, complete);
        }
    };

    // Vertical slides
    Carousel.prototype.effects.vertical = {

        init: function() {
            var t = this;
            t.slides.each(function(index) {
                var offset = (index - t.currIndex) * t.slideHeight,
                whichProperty = t.hasTransforms ? t.transformName : 'top',
                value;

                offset += 'px';

                this.style.position = 'absolute';
                this.style.top = 0;
                this.style.left = 0;
                this.style.zIndex = 1;

                if (t.isCSS) {
                    if (t.hasTransforms3d) {
                        value = 'translate3d(0, ' + offset + ', 0)';
                    } else if (t.hasTransforms) {
                        value = 'translate(0, ' + offset + ')';
                    } else {
                        value = offset;
                    }

                    // Set transform
                    this.style[whichProperty] = value;

                    // Set transition
                    this.style[t.transitionName] = t.prefix(whichProperty) + ' ' + t.duration + 'ms ' + t.cssEasing;
                } else {
                    this.style.top = offset;
                }
            });
        },

        transition: function($nextSlide, $prevSlide, direction, complete) {
            var t = this,
                whichProperty,
                next = $nextSlide[0],
                prev = $prevSlide[0],
                nextSlideStart = direction === 'advance' ? t.slideHeight : -t.slideHeight,
                prevSlideEnd = -1 * nextSlideStart;

            if (t.isCSS) {
                var nextStartValue, nextEndValue, prevEndValue;
                whichProperty = t.hasTransforms ? t.transformName : 'top';

                // Determine what we should be using... there's probably a better way. DRY!
                if (t.hasTransforms3d) {
                    nextStartValue = 'translate3d(0, ' + nextSlideStart + 'px, 0)';
                    nextEndValue = 'translate3d(0, 0, 0)';
                    prevEndValue = 'translate3d(0, ' + prevSlideEnd + 'px, 0)';
                } else if (t.hasTransforms) {
                    nextStartValue = 'translate(0, ' + nextSlideStart + 'px)';
                    nextEndValue = 'translate(0, 0)';
                    prevEndValue = 'translate(0, ' + prevSlideEnd + 'px)';
                } else {
                    nextStartValue = nextSlideStart + 'px';
                    nextEndValue = 0;
                    prevEndValue = prevSlideEnd + 'px';
                }

                // don't show transition when we're moving things around
                t._skipTransition(next, whichProperty, nextStartValue);

                // Trigger transitions
                if (prev) {
                    prev.style[whichProperty] = prevEndValue;
                    prev.style.zIndex = 1;
                }
                next.style[whichProperty] = nextEndValue;
                next.style.zIndex = 2;

                // Trigger slide end event on transition end
                $nextSlide.one(t.transitionEnd, complete);
            }

            else {
                $nextSlide.css('top', nextSlideStart + 'px');
                $nextSlide.animate({top: 0}, t.duration, t.jsEasing);
                $prevSlide.animate({top: prevSlideEnd + 'px'}, t.duration, t.jsEasing);
            }
        }

    };

    $.fn.carousel = function(opts) {
        return this.each(function() {
            var $this = $(this),
                carousel = $this.data('carousel');

            if (!carousel) {
                carousel = new Carousel($this, opts);
                $this.data('carousel', carousel);
            }

            // Execute a function. It will be called like this: carousel.pause('arg1', 'arg2') when you do this: $el.carousel('pause', 'arg1', 'arg2')
            if (typeof opts === 'string') {
                carousel[opts].apply( carousel, Array.prototype.slice.call( arguments, 1 ) );
            }
        });
    };

    $.fn.carousel.defaults = {

        // Navigation
        generateNav: true, // Will generate and append the neccessary html elements for navigation if true
        genButtonClass: 'carousel-btn', // Class name for prev/next buttons
        prevButtonClass: 'carousel-btn-prev', // Class name for prev button
        nextButtonClass: 'carousel-btn-next', // Class name for next button
        nextText: '›', // Text that will go inside the next nav button
        prevText: '‹', // Text that will go inside the previous nav button
        prevNextInnerButtonClass: '', // Optionally puts another element inside the .carousel-btn element
        activeClass: 'active', // Active class for slides and index buttons
        disabledClass: 'disabled', // Disabled class for slide nav buttons
        showPrevNextBtns: true, // if false, carousel won't generate or attach events to nav buttons
        putControlsInside: false, // if true, carousel-controls div will be inside the container ($el). Otherwise it'll be a sibling
        canClickElement: false, //if this is true, you can click the element to slide it into focus

        // Slide counter
        showSlideCountTxt: false, // shows a counter for your slides like "2 of 6"
        slideCountTxtClass: 'carousel-slide-count-txt', // Class name for slide counter
        slideCountPrefix: '', // Prefix your slides with something. e.g. "slide 1 of 5"
        slideCountSeparator: ' of ', // e.g. "3 of 5"

        // Index buttons
        indexButtonClass: 'carousel-index-btns',
        showIndexBtns: true, // Shows pagination buttons
        useTitles: false, // Use the title or data-title attribute on the slide and put it in the index button
        autoCenterIndexBtns: false, // if true, will center index button ul within its container

        // Transitions / effects
        transition: 'slide', // slide, fade, convex, vertical
        duration: 500, // Length (in milliseconds) of the animation/transition
        cssEasing: 'ease-in-out', // for css transitions. One of default, 'linear', 'ease-in', 'ease-out', 'ease-in-out', or 'cubic-bezier'
        jsEasing: 'swing', // jQuery's easing functions. Built in ones are only 'swing' and 'linear'
        loop: true, // as in, should the 'next' button be enabled at the end, and slide all the way back to the start? (and 'prev' to the end)
        loopAround: null, // loopAround, as in the last slide will appear to be a next consecutive slide, and not visibly rewind all the way back to the start/end
        swipe: 'horizontal', // Direction of the swipe which advances/retreats the carousel. Either 'horizontal' or 'vertical'

        // Timing
        timeout: 0, // if greater than zero, the carousel will automatically advance every `timeout` milliseconds. Default is 0.
        pauseOnHover: false, // setting this to true will pause the slideshow on mouseover. Default is false.
        pauseOnIndexHover: false, // If your index buttons are outside the carousel, and want the carousel to pause on hover of index buttons, set this to true

        // Misc
        start: 0, // starting slide index (zero based)
        childFilter: null, // slides are selected with children(), specifiy a selector to filter the results
        step: 1, // currently not working great
        autoResize: false // if true, the container's height will be resized with each slide to fit it's height
    };

    $.fn.carousel.settings = {
        isCSS: Modernizr.csstransitions,
        hasTransforms: Modernizr.csstransforms,
        hasTransforms3d: Modernizr.csstransforms3d,
        hasTouch: Modernizr.touch,
        Carousel: 'carousel',
        indexBtns: [],
        isCarousel: false,
        currIndex: 0,
        timer: null
    };

})(jQuery, Modernizr, window);