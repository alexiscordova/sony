
// NURUN NOTE:
// If you need to detect when your module is scrolled into view,
// use sony-viewport.js as it is a global handler for that.

// This jQuery plugin should be avoided in favor of sony-viewport whereever possible

/*
* Viewport - jQuery selectors for finding elements in viewport
*
* Copyright (c) 2008-2009 Mika Tuupola
*
* Licensed under the MIT license:
* http://www.opensource.org/licenses/mit-license.php
*
* Project home:
* http://www.appelsiini.net/projects/viewport
*
*/

define(function(require){

    'use strict';

    var $ = require('jquery');

    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };

    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };

    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };

    // HEY, READ THE ABOVE NOTE!
    $.inviewport = function(element, settings) {
        var $element = $(element);
        var offset = $element.offset();

        var $window = $(window);
        var windowTop = $window.scrollTop();
        var threshold = settings.threshold;

        if (offset.top - threshold < windowTop) {
            if (offset.top + $element.height() + threshold >= windowTop) {
                // top edge below the window's top
            } else {
                return false;
            }
        } else {
            if (offset.top - threshold <= windowTop + $window.height()) {
                // bottom edge above the window's bottom
            } else {
                return false;
            }
        }

        var windowLeft = $window.scrollLeft();

        if (offset.left - threshold < windowLeft) {
            if (offset.left + $element.width() + threshold >= windowLeft) {
                // left edge be on the left side of the window's left edge
            } else {
                return false;
            }
        } else {
            if (offset.left - threshold <= windowLeft + $window.width()) {
                // right edge be on the right side of the window's right edge
            } else {
                return false;
            }
        }

        return true;
    };

    $.extend($.expr[':'], {
        //'below-the-fold': function(a, i, m) {
        'below-the-fold': function(a) {
            return $.belowthefold(a, {threshold : 0});
        },
        //'above-the-top': function(a, i, m) {
        'above-the-top': function(a) {
            return $.abovethetop(a, {threshold : 0});
        },
        //'left-of-screen': function(a, i, m) {
        'left-of-screen': function(a) {
            return $.leftofscreen(a, {threshold : 0});
        },
        //'right-of-screen': function(a, i, m) {
        'right-of-screen': function(a) {
            return $.rightofscreen(a, {threshold : 0});
        },
        //'in-viewport': function(a, i, m) {
        'in-viewport': function(a) {
            return $.inviewport(a, {threshold : 0});
        }
    });

});