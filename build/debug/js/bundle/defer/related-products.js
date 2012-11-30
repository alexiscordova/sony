// ------------ Related Products Module ------------
// Module: HotSpot Explorer
// Version: 1.0
// Modified: 2012-11-26 by Tyler Madison, Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr
// -------------------------------------------------------------------------

(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
})(window);

(function($, Modernizr, window, undefined) {
    
    'use strict';

    var PX_REGEX = /px/gi;

    //start module
    var RelatedProducts = function(element, options){
      var t = this,
          ua = navigator.userAgent.toLowerCase(),
          i,
          browser = $.browser,
          isWebkit = browser.webkit,
          isAndroid = ua.indexOf('android') > -1;

      self.isIPAD = ua.match(/(ipad)/);
      self.isIPHONE = ua.match(/(iphone)/);   

      // feature detection, some ideas taken from Modernizr
      var tempStyle = document.createElement('div').style,
          vendors = ['webkit','Moz','ms','O'],
          vendor = '',
          lastTime = 0,
          tempV;

      for (i = 0; i < vendors.length; i++ ) {
          tempV = vendors[i];
          if (!vendor && (tempV + 'Transform') in tempStyle ) {
              vendor = tempV;
          }
          tempV = tempV.toLowerCase();
          
          if(!window.requestAnimationFrame) {
              window.requestAnimationFrame = window[tempV+'RequestAnimationFrame'];
              window.cancelAnimationFrame = window[tempV+'CancelAnimationFrame'] 
                                 || window[tempV+'CancelRequestAnimationFrame'];
          }
      }

      // requestAnimationFrame polyfill by Erik Möller
      // fixes from Paul Irish and Tino Zijdel
      if (!window.requestAnimationFrame) {
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime(),
                  timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                  id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };
      }

      if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) { clearTimeout(id); };
      }

      var bT = vendor + (vendor ? 'T' : 't' );
      
      t.useCSS3Transitions = ( (bT + 'ransform') in tempStyle ) && ( (bT + 'ransition') in tempStyle );
      
      if(t.useCSS3Transitions) {
          t.use3dTransform = (vendor + (vendor ? 'P' : 'p'  ) + 'erspective') in tempStyle;
      }
        
      vendor = vendor.toLowerCase();
      t.vendorPrefix = '-' + vendor + '-';
      t.$el = $(element);
      t.container = t.$el.find('.rpContainer').eq(0);
      t.previousId = -1;
      t.currentId = 0;
      t.slidePosition = 0;
      t.animationSpeed = 400; //ms
      t.slides = []; 
      t.slideCount = 0;
      t.isFreeDrag = false; //MODE: 


      if('ontouchstart' in window || 'createTouch' in document) {
          t.hasTouch = true;
          t.downEvent = 'touchstart.rp';
          t.moveEvent = 'touchmove.rp';
          t.upEvent = 'touchend.rp';
          t.cancelEvent = 'touchcancel.rp';
          t.lastItemFriction = 0.5;
      } else {
          t.hasTouch = false;
          t.lastItemFriction = 0.2;
          
          //do we need this?
/*          if (br.msie || br.opera) {
              t.grabCursor = t.grabbingCursor = "move";
          } else if(br.mozilla) {
              t.grabCursor = "-moz-grab";
              t.grabbingCursor = "-moz-grabbing";
          } else if(isWebkit && (navigator.platform.indexOf("Mac")!=-1)) {
              t.grabCursor = "-webkit-grab";
              t.grabbingCursor = "-webkit-grabbing";
          }
          t.setGrabCursor();*/
          

          t.downEvent = 'mousedown.rp';
          t.moveEvent = 'mousemove.rp';
          t.upEvent = 'mouseup.rp';
          t.cancelEvent = 'mouseup.rp';
      }

      if(t.useCSS3Transitions) {

          // some constants for CSS3
          t.TP = 'transition-property';
          t.TD = 'transition-duration';
          t.TTF = 'transition-timing-function';

          t.yProp = t.xProp = t.vendorPrefix +'transform';

          if(t.use3dTransform) {
              if(isWebkit) {
                  t.$el.addClass('rpWebkit3d');
              }
              t.tPref1 = 'translate3d(';
              t.tPref2 = 'px, ';
              t.tPref3 = 'px, 0px)';
          } else {
              t.tPref1 = 'translate(';
              t.tPref2 = 'px, ';
              t.tPref3 = 'px)';
          }

          t.container[(t.vendorPrefix + t.TP)] = (t.vendorPrefix + 'transform');
                  
      } else {
          t.xProp = 'left';
          t.yProp = 'top';
      }

      t.container.on(t.downEvent, function(e) { t.onDragStart(e); });   
      
    };

    RelatedProducts.prototype = {
      onDragStart : function(e){
        var t = this;

        console.log('drag start' , e.type);

        t.moveTo();
      },

      moveTo: function(type,  speed, inOutEasing, userAction, fromSwipe){
        var t = this,
            newPos,
            diff,
            newId,
            animObj = {};

        var pos = -1000; //TODO: current slide old slide, id * containerWidth
            
        //TODO: kill videos / animations

        if( !t.useCSS3Transitions ) {
          //jQuery fallback
          animObj[ t.xProp ] = pos + 'px';
          t.container.animate(animObj, t.animationSpeed, 'easeInOutSine');

        }else{
          //css3 transition
          animObj[ (t.vendorPrefix + t.TD) ] = t.animationSpeed + 'ms';
          animObj[ (t.vendorPrefix + t.TTF) ] = $.rpCSS3Easing[ 'easeInOutSine' ];
          
          t.container.css( animObj );

          animObj[ t.xProp ] = t.tPref1 + (pos + t.tPref2 + 0) + t.tPref3;
  
          t.container.css( animObj );        
          
        }


      },

    };

    $.rpCSS3Easing = {
        //add additional ease types here
        easeOutSine: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        easeInOutSine: 'cubic-bezier(0.445, 0.050, 0.550, 0.950)'
    };


    //plugin definition
    $.fn.relatedProducts = function(options) {      
      var args = arguments;
      return this.each(function(){
        var t = $(this);
        if (typeof options === "object" ||  !options) {
          if( !t.data('relatedProducts') ) {
              t.data('relatedProducts', new RelatedProducts(t, options));
          }
        } else {
          var relatedProducts = t.data('relatedProducts');
          if (relatedProducts && relatedProducts[options]) {
              return relatedProducts[options].apply(relatedProducts, Array.prototype.slice.call(args, 1));
          }
        }
      });
    };

    $(function(){
      $('.related-products').relatedProducts({});
    });

 })(jQuery, Modernizr, window,undefined);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLENS work
//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*

if ( !Exports ) {
  var Exports = {
    Modules : {}
  };
}


(function($, window, undefined) {

    var MasonryOverflow = function( $container, options ) {
        var self = this;

        $.extend(self, $.fn.masonryOverflow.options, options, $.fn.masonryOverflow.settings);

        self.$container = $container;
        self.originalWidth = self.$container.width();
        console.log( self.type );

        self.$container.width( self.getContainerWidth() );

        // 3610

        // var width = 0,
        //     colYs = [];
        // $container.children().each(function() {
        //   var $item = $(this),
        //   width += $item.outerWidth(true),

        //   //how many columns does this brick span
        //   colSpan = Math.ceil( width / self.shuffleColumns );
        //   console.log( colSpan );

        //   if ( colSpan === 1 ) {
        //       // if brick spans only one column, just like singleMode
        //       self._placeItem( $this, self.colYs, fn );
        //   } else {
        //       // brick spans more than one column
        //       // how many different places could this brick fit horizontally
        //       var groupCount = self.cols + 1 - colSpan,
        //           groupY = [],
        //           groupColY,
        //           i;

        //       // for each group potential horizontal position
        //       for ( i = 0; i < groupCount; i++ ) {
        //           // make an array of colY values for that one group
        //           groupColY = self.colYs.slice( i, i + colSpan );
        //           // and get the max value of the array
        //           groupY[i] = Math.max.apply( Math, groupColY );
        //       }

        //       self._placeItem( $this, groupY, fn );
        //   }
        // });

        // var width = 0;
        // $container.children().each(function() {
        //   var $item = $(this),
        //   itemWidth = $item.outerWidth(true);
        //   width += (itemWidth + 23);
        //   console.log(itemWidth, width);
        // });

        // width -= 23;

        // console.log( width / 2);

        // $container.width( width / 2 );

        self.shuffle = self.$container.shuffle({
          speed: self.shuffleSpeed,
          easing: self.shuffleEasing,
          columnWidth: self.shuffleColumns,
          gutterWidth: self.shuffleGutters
        }).data('shuffle');

        // Check to see how everything went.
        var lastCol = 0;
        for ( var i = 0, len = self.shuffle.colYs.length; i < len; i++) {
          var colY = self.shuffle.colYs[ i ];
          // if the previous column is bigger than the next, and we're not on the final column
          if ( lastCol > colY && i < len - 2 ) {
            // Columns don't line up perfectly
            self.extraSpace = (self.shuffle.columnWidth * (i + 1)) / 2;
            console.log('they dont line up', self.extraSpace, self.shuffle.colYs);
            self.$container.width( self.getContainerWidth() );
            self.shuffle.resized();
            break;
          }
          lastCol = colY;
        }

        self.isInitialized = true;
    };

    MasonryOverflow.prototype = {

        constructor: MasonryOverflow,

        getContainerWidth : function() {
          var self = this;
          return (self.originalWidth * self.slides) + ((self.slides - 1) * self.shuffleGutters) + self.extraSpace;
        }

    };

    // Plugin definition
    $.fn.masonryOverflow = function( opts ) {
        var args = Array.prototype.slice.apply( arguments );
        return this.each(function() {
            var $this = $(this),
                masonryOverflow = $this.data('masonryOverflow');

            // If we don't have a stored masonryOverflow, make a new one and save it
            if ( !masonryOverflow ) {
                masonryOverflow = new MasonryOverflow( $this, opts );
                $this.data( 'masonryOverflow', masonryOverflow );
            }

            if ( typeof opts === 'string' ) {
                masonryOverflow[ opts ].apply( masonryOverflow, args.slice(1) );
            }
        });
    };


    // Overrideable options
    $.fn.masonryOverflow.options = {
      slides: 2,
      shuffleSpeed: 400,
      shuffleEasing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
      shuffleColumns: {
        1470: 56,
        1112: 56,
        940: 60,
        724: 42
      },
      shuffleGutters: {
        1470: 40,
        1112: 40,
        940: 20,
        724: 20
      }
    };

    // Not overrideable
    $.fn.masonryOverflow.settings = {
      isInitialized: false,
      extraSpace: 0
    };

}(jQuery, window));


Exports.Modules.RelatedProducts = (function($) {

  var $container,


  _init = function() {
    $container = $('.products');
    
    $container.each(function() {
      var $this = $(this),
          data = $container.data();
      
      // Count up width of all items (+ margins?)

      // Divide by 2, add margins to each depending on number of elements?

      // Init shuffle
      $container.masonryOverflow({
        slides: 3,
        type: data.type,
        shuffleColumns: 204,
        shuffleGutters: 23
      });
      
    });

  };

  return {
    init: _init
  };
}(jQuery));



$(document).ready(function() {

  if ( $('body').hasClass('related-products-module') ) {
    Exports.Modules.RelatedProducts.init();
  }
});*/