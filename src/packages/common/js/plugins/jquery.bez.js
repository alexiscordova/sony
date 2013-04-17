/*!
 * Bez @VERSION
 * http://github.com/rdallasgray/bez
 * 
 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
 * 
 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 * 
 * Copyright @YEAR Robert Dallas Gray. All rights reserved.
 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
 *
 * **Modified:** 04/16/2013
 * **Author:** Telly Koosis, George Pantazis
 * ** 4-16-13: Modified coOrdArray to be an incoming string (coOrdStr) 
 *             then converting string into proper floats for array (coOrdArray)
*/
define(function(require){

  'use strict';

  var jQuery = require('jquery');
    

  jQuery.extend({ bez: function(coOrdStr) {
    
   var coOrdArray = coOrdStr.split(", ");
    for(var i=0; i<coOrdArray.length; i++) { coOrdArray[i] = parseFloat(coOrdArray[i]); };

    // original source from here down... 
    var encodedFuncName = "bez_" + jQuery.makeArray(arguments).join("_").replace(".", "p");
    if (typeof jQuery.easing[encodedFuncName] !== "function") {
      var polyBez = function(p1, p2) {
        var A = [null, null], B = [null, null], C = [null, null],
          bezCoOrd = function(t, ax) {
            C[ax] = 3 * p1[ax], B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax], A[ax] = 1 - C[ax] - B[ax];
            return t * (C[ax] + t * (B[ax] + t * A[ax]));
          },
          xDeriv = function(t) {
            return C[0] + t * (2 * B[0] + 3 * A[0] * t);
          },
          xForT = function(t) {
            var x = t, i = 0, z;
            while (++i < 14) {
              z = bezCoOrd(x, 0) - t;
              if (Math.abs(z) < 1e-3) break;
              x -= z / xDeriv(x);
            }
            return x;
          };
          return function(t) {
            return bezCoOrd(xForT(t), 1);
          }
      };
      jQuery.easing[encodedFuncName] = function(x, t, b, c, d) {
        return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t/d) + b;
      }
    }
    return encodedFuncName;
  }});
});