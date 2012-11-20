
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
          // if the last column is bigger than the next, and we're not on the last column
          if ( lastCol > colY && i != len - 1 ) {
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
});