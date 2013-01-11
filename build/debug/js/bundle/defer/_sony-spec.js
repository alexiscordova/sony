/*global jQuery, Modernizr, iQ*/

// ----------- Sony Specs Module --------
// Module: Sticky Tabs
// Version: 1.0
// Author: JP Cotoure
// Modified: 01/09/2013 by Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr
// --------------------------------------

(function($, Modernizr, window, undefined) {
  'use strict';

  var Spec = function( $container, options ) {
    var self = this;

    console.log('Spec constructor');

    $.extend(self, $.fn.spec.options, options, $.fn.spec.settings);

    // jQuery objects
    self.$container = $container;
    self.$window = $(window);
    self._init();
  };

  Spec.prototype = {

    constructor: Spec,

    _init : function() {
      var self = this;

      console.log('_init');

      self.$tableContainerBackup = null;
      self.refreshData = null;
      self.arrayTableContainer = [];
      self.arrayTableFirstColumn = [];
      self.tableContainerBackup = null;
      self.array = [];


      // Convert tables to divs...
      self._tableToDiv();

      // What is this doing?
      self.$container.find('.table-container').each(function(indexTable) {

        var $container = $(this),
            $firstColumn = self._findColumn( $container, 1 ), // nb of cell in the first column
            numColumn = $container.find('.thead > .spec-row > .spec-cell').length,
            dumpText = numColumn > 2 ? ' Models' : ' Model',
            $firstColumnTablesBackup;

        self.arrayTableContainer.push([]);
        self.arrayTableFirstColumn.push([]);

        // Take the label from the first column and prepend it to each cell...
        $container.find('.tbody').first().find('> .spec-row').each(function(indexRow) {
          $(this).find('>.spec-cell:not(:first-child)').each(function() {
            var text = $.trim( $firstColumn.eq( indexRow + 1 ).text() );
            $(this).prepend('<h2>' + text + '</h2>');
          });
        });

        $container.find('.thead > .spec-row > .spec-cell:first-child').append('<p>' + (numColumn - 1) + '<span>' + dumpText + '</span></p>');

        // Clone the first column (we will push it for each table)
        $firstColumnTablesBackup = self._findColumn( $container, 1 ).clone();
        self.arrayTableFirstColumn[indexTable].push($firstColumnTablesBackup);

        self._findColumn( $container, 1 ).remove();

        // Clone it without the first column
        self.$tableContainerBackup = $container.clone();
        self.arrayTableContainer[indexTable].push(self.$tableContainerBackup);
      });


      self.$window.on('resize', $.throttle(100, $.proxy( self._onResize, self )));
      // self.$window.on('scroll', $.proxy( self._fixHeader, self ));

      self.refresh('init');

      // What did we end up with?
      console.log(self);
    },

    _onResize : function() {
      var self = this;

      self.isMobile = Modernizr.mq('only all and (max-width: 640px)');

      self.refresh();
    },

    _slideChanged : function( sonySlider ) {
      var currentSlide = parseInt( sonySlider.currSlideId, 10 ) + 1,
          totalSlide = sonySlider.numSlides;

      if (currentSlide === 1) {
        //Hide the left arrow
        $('.desktopNav').find('.prev').hide();
      }
      else {
        $('.desktopNav').find('.prev').show();
      }

      if (totalSlide === currentSlide) {
        //Hide the right arrow
        $('.desktopNav').find('.next').hide();
      }
      else {
        $('.desktopNav').find('.next').show();
      }
    },

    _setContainerHeight : function( $container ) {
      var tallest = $container.find('.spec-table').maxHeight();
      $container.height(tallest);
      $container.children('.scOverflow').height(tallest);
    },

    _findColumn : function( $container, index ) {
      var $column = $container.find('.spec-table > .thead > .spec-row > .spec-cell:nth-child(' + index + '), .spec-table > .tbody > .spec-row > .spec-cell:nth-child(' + index + ')');

      return $column;
    },

    _tableToDiv : function() {
      var self = this,
          $tables = self.$container.find('table');

      $tables.each(function() {

        var $table = $(this),
            tableClass = $table.hasClass('spec-table') ? 'spec-table' : 'small-table';

        if ( Modernizr.displaytable ) {

          if ( $table.hasClass('spec-table') ) {
            //keep in memory
            self.myArray.push($table);
          }

          $table.find('thead').replaceWith(function() {
            return $('<div class="thead">').append($(this).contents());
          });

          $table.find('tbody').replaceWith(function() {
            return $('<div class="tbody">').append($(this).contents());
          });

          $table.find('tr').replaceWith(function() {
            return $('<div class="spec-row">').append($(this).contents());
          });

          $table.find('th').replaceWith(function() {
            return $('<div class="spec-cell">').append($(this).contents());
          });

          $table.find('td').replaceWith(function() {
            var getClass = '';

            if ($(this).attr('class')) {
              getClass = $(this).attr('class');
            }

            return $('<div class="spec-cell ' + getClass + '">').append($(this).contents());
          });

          $table.replaceWith(function() {
            return $('<div class="' + tableClass + '">').append($(this).contents());
          });

          // Odd and Even Classes
          // $table.find('.spec-row:nth-child(even)').addClass('odd_rows');

        // No display: table support
        } else {

          $table.addClass('table, ' + tableClass + '');
          $table.find('thead').addClass('thead');
          $table.find('tbody').addClass('tbody');
          $table.find('tr').addClass('spec-row');
          $table.find('tr:nth-child(even)').addClass('odd_rows');
          $table.find('th, td').addClass('spec-cell');
        }
      });

      return this;
    },

    // Usage: $(listToMatrix(nbCells, numCol));
    _listToMatrix : function( $list, elementsPerSubArray ) {
      var matrix = [],
      i = 0,
      k = -1;

      for ( ; i < $list.length; i++) {
          if (i % elementsPerSubArray === 0) {
              k++;
              matrix[ k ] = [];
          }

          matrix[ k ].push( $list[ i ] );
      }

      return matrix;
    },

    _fixHeader : function() {
        var windowWidth = $(window).width(),
            sectionWidth = $('.container > section').width(),
            currentFixedHeader = $('.fixed-header').width();

        /*
        spaceAvail = (windowWidth-sectionWidth);

        console.info('Window width: '+windowWidth);
        console.info('FixedHeader width: '+currentFixedHeader);
        console.info('Avail space: '+spaceAvail);



        $(".fixed-header:above-the-top").each(function() {
          $('.fixed-header').attr('style', 'position:fixed;top:0;background:#fff;z-index:99999; width:92.5%;');
          $('.fixed-header').next().attr('style', 'padding-top:105px;')
          $('.fixed-header').next().find('.desktopNav').attr('style', 'top:105px;')
        });
        */
    },

    // headers? idk (matrix[0])
    _buildStickyTabs : function( $tableContainer, headers, indexContainer ) {
      console.log('_buildStickyTabs', $tableContainer, headers, indexContainer);
      if ( $tableContainer.parent().find('.tabs-container').length <= 0 ) {
        console.log('building sticky headers');
        var tabContainer = $('<div class="tabs-container">'),
            tabInnerContainer = $('<div class="tabs">');

        $( headers ).each(function(index) {
          tabInnerContainer.append($(this).clone().addClass('tab table-' + (indexContainer + '-' + index + 1)));
        });

        tabContainer.append(tabInnerContainer);
        $tableContainer.before(tabContainer);

        tabInnerContainer.children(':first-child').addClass('active');

        // Initialize sticky tabs
        // THERES NO DATA-TARGET ATTRIBUTE AND THEREFORE NO ACTIVE TAB
        $('.tab-strip').stickyTabs();
        $('.tabs').trigger("setup_stickytabs");
      }
    },

    _initCarousel : function( $tableContainer, indexContainer ) {
      var self = this,
          opts = {
            keyboardNavEnabled : !self.isMobile,
            sliderDrag : self.isMobile,
            navigateByClick : false,
            autoScaleSlider: false,
            autoHeight: true
          },
          sonySlider;

      sonySlider = $tableContainer.sonyCarousel( opts ).data('sonyCarousel');

      if ( !self.isMobile ) {
        // Desktop


        var $desktopNav = $tableContainer.closest('.gallery-tabs').find('.desktopNav');

        if ( $desktopNav.length <= 0 ) {
          $tableContainer.before('<div class="desktopNav"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>');
        }

        // Prev
        $tableContainer.prev().find('a.next').click(function() {
          sonySlider.next();
        });

        // Next
        $tableContainer.prev().find('a.prev').click(function() {
          sonySlider.prev();
        });

        // init
        self._slideChanged( sonySlider );

        sonySlider.ev.on('scAfterSlideChange', function() {
          //After each slide change.. Look if it's necessary to show the Next & Previous button.
          self._slideChanged( sonySlider );
        });

      } else {
        // Mobile

        //When you click on tabs
        $tableContainer.prev().find('.tab').click(function() {
          $(this).parent().find('.tab').removeClass('active').removeAttr('style');
          $(this).addClass('active');
          $tableContainer.sonyCarousel('goTo', $(this).index());
        });

        sonySlider.ev.on('scAfterSlideChange', function() {
          // triggers after slide change
          $tableContainer.closest('.table-container').prev().find('.tabs.sticky .tab').removeClass('active').removeAttr('style');
          $tableContainer.closest('.table-container').prev().find('.tabs.sticky .tab.table-' + indexContainer + '-' + (sonySlider.currSlideId + 1)).addClass('active');
        });
      }
    },


    refresh : function() {
      // TODO: Fix this shit.
      // Hide any modal on resize.
      if ($('.module-spec .modal').length > 0) {
        $('.module-spec .modal').modal('hide');
      }

      var self = this,
          windowWidth = $(window).width(), // Get the window width.
          minWidthTable = 321, // Minimum per table (column)
          elemMinWidth = windowWidth / minWidthTable, // Number of element present in the viewport (visible element)
          numElementByPage = Math.min(Math.max(Math.floor(elemMinWidth), 1), 4); // Get the number of column to display.



      // If it's necessary to refresh the number of data
      if ( self.refreshData === null || self.refreshData !== numElementByPage ) {

        // just
        // $('section > .gallery-tabs > .table-container').each(function(indexContainer) {
        self.$container.find('.table-container').each(function(indexContainer) {
          var $tableContainer = $(this),
              sonySlider = $tableContainer.data('sonyCarousel'), // Define the carousel
              $myCells,
              numCol,
              numTablesToShow,
              matrix,
              i = 0;

          // Destroy the current slider instance.
          if ( sonySlider ) {
            sonySlider.destroy();
          }

          // Empty the container.
          $tableContainer.empty();

          self.tableContainerBackup = $(self.arrayTableContainer)[indexContainer][0].clone();

          // Get all cells
          $myCells = self.tableContainerBackup.clone().find('.spec-table > .thead > .spec-row > .spec-cell, .spec-table > .tbody > .spec-row > .spec-cell');

          // nb total column
          numCol = self.tableContainerBackup.find('.spec-row:first .spec-cell').length;

          // nb of table to show
          numTablesToShow = Math.ceil( numCol / numElementByPage );

          // Matrix
          matrix = self._listToMatrix( $myCells, numCol );

          console.log('numTablesToShow:', numTablesToShow, 'numCol:', numCol );

          // Build the sticky nav. - We only add it once.
          self._buildStickyTabs( $tableContainer, matrix[0], indexContainer );


          // Loop each table to add.
          for (; i < numTablesToShow; i++) {
            var $table,
                $thead,
                $tbody;

            // Table div layout
            if ( Modernizr.displaytable ) {
              $table = $('<div class="spec-table" id="table-' + indexContainer + '-' + (i + 1) + '">');
              $thead = $('<div class="thead"></div>');
              $tbody = $('<div class="tbody"></div>');

            // Table layout
            } else {
              $table = $('<table class="spec-table" id="table-' + indexContainer + '-' + (i + 1) + '">');
              $thead = $('<thead class="thead"></thead>');
              $tbody = $('<tbody class="tbody"></tbody>');
            }

            // Loop in each row
            var cellMatrix = self._listToMatrix($myCells, numCol);

            $.each( cellMatrix, function( cellIndex, cells ) {
              var $cells = $(cells),
                  $currentRow,
                  $firstCurrentRow,
                  j = 1,
                  titleToCopy = '';

              // Table div layout
              if ( Modernizr.displaytable ) {
                $currentRow = $('<div class="spec-row"></div>');
                $firstCurrentRow = $('<div class="spec-row"></div>');

              // Table layout
              } else {
                $currentRow = $('<tr class="spec-row"></tr>');
                $firstCurrentRow = $('<tr class="spec-row"></tr>');
              }

              for (; j <= cellIndex; j++) {
                titleToCopy = $cells.text();

                $cells.each(function() {
                  var $that = $(this);

                  if ( $that.find('h2').length <= 0 ) {
                    $that.prepend('<h2>' + titleToCopy + '</h2>');
                  }
                });
              }


              var theMatrix = self._listToMatrix(cells, numElementByPage)[i];

              // Put the first row inside the .thead
              if ( cellIndex === 0 ) {
                $firstCurrentRow.append( theMatrix );
                $thead.append( $firstCurrentRow );

              // Else, put them inside the .tbody
              } else {
                $currentRow.append( theMatrix );
                $tbody.append( $currentRow );
              }

              // Build each table.
              $table.append($thead, $tbody);
              $tableContainer.append($table);
            });
          } // end for

          self._initCarousel( $tableContainer, indexContainer );

          var leftTitle = $(self.arrayTableFirstColumn)[indexContainer][0].clone();
          console.log('leftTitle?:', leftTitle);

          // Add a title to the left of each row.
          $(leftTitle).each(function(index) {
            if (index === 0) {
              $tableContainer.find('.spec-table > .thead > .spec-row:nth-child(' + (index + 1) + ')').prepend($(this));
            } else {
              $tableContainer.find('.spec-table > .tbody > .spec-row:nth-child(' + (index) + ')').prepend($(this));
            }
          });
        });

        // Modify the new current numElementByPage
        self.refreshData = numElementByPage;

        console.log('refreshData', self.refreshData);

        // Load iq (we load images)
        iQ.update({
          asyncDistance : -1
        });

        //remove the active class.
        $('.tabs-container .tabs .spec-cell').removeClass('active');

        //init the active class for the tabs
        var activeTab = $('.table-container .spec-table:in-viewport').attr('id');
        $('.tabs-container .tabs').children('.spec-cell.' + activeTab).addClass('active');
      }

      var arrayCel = [];

      // Apparently resetting all styles except for min-height?
      $('.table-container .spec-table > .tbody > .spec-row > .spec-cell > div').css('minHeight', '');

      // This section is always running while resizing.
      self.$container.find('.spec-table').each(function() {
        var $specsTable = $(this),
            isFirstTable = !!arrayCel.length;

        $specsTable.find('> .tbody > .spec-row').each(function(indexR) {
          var $row = $(this),
              storedRowHeight = 0,
              currentCellHeight = $row.find('.spec-cell').eq(1).height();

          if (isFirstTable) {
            arrayCel.push(currentCellHeight);
          } else {
            storedRowHeight = arrayCel[indexR];
            if (currentCellHeight > storedRowHeight) {
              arrayCel[indexR] = currentCellHeight;
            }
          }

        });
      });

      self.$container.find('.spec-table').each(function() {
        var $specsTable = $(this);

        $(arrayCel).each(function(index) {
          var rows = $specsTable.find('> .tbody > .spec-row')[index];
          $(rows).find('> .spec-cell > div').css('minHeight', arrayCel[index] + 'px');
        });
      });
      arrayCel = [];


      $('.table-container').each(function() {
        self._setContainerHeight( $(this) );
      });

      // Fit the fixed header on resize.
      self._fixHeader();
    }

  };

  // Plugin definition
  $.fn.spec = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
          spec = self.data('spec');

      // If we don't have a stored spec, make a new one and save it
      if ( !spec ) {
        console.log('new Spec');
        spec = new Spec( self, options );
        self.data( 'spec', spec );
      }

      if ( typeof options === 'string' ) {
        spec[ options ].apply( spec, args );
      }
    });
  };


  // Overrideable options
  $.fn.spec.options = {
  };

  // Not overrideable
  $.fn.spec.settings = {
    isMobile: Modernizr.mq('only all and (max-width: 640px)'),
    myArray: []
  };

  //Usage: var tallest = $('div').maxHeight(); // Returns the height of the tallest div.
  $.fn.maxHeight = function() {
    var max = 0;
    this.each(function() {
      max = Math.max(max, $(this).height());
    });
    return max;
  };

}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-module').length > 0 ) {

    $('.spec-module').spec();

  }
});
