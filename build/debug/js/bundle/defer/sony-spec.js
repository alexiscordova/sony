/*global jQuery, Modernizr, Exports*/

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

      self.$tableContainerBackup = null;
      self.refreshData = null;
      self.arrayTableContainer = [];
      self.arrayTableFirstColumn = [];
      self.tableContainerBackup = null;
      self.array = [];

      self.$container.find('.tableContainer').each(function(indexTable) {

        var $container = $(this),
            $firstColumn = self._findColumn( $container, 1 ), // nb of cell in the first column
            firstColumnNbCell = $($firstColumn).length,
            nbColumn = $container.find('.thead > .specRow > .specCell').length,
            dumpText = nbColumn > 2 ? ' Models' : ' Model',
            $firstColumnTablesBackup;

        self.arrayTableContainer.push([]);
        self.arrayTableFirstColumn.push([]);

        $container.find('.tbody:first > .specRow').each(function(indexRow) {
          $(this).find('>.specCell').not(':first-child').each(function(indexCell) {
            $(this).prepend('<h2>' + $firstColumn[indexRow + 1].textContent + '</h2>');
          });
        });

        $container.find('.thead > .specRow > .specCell:first-child').append('<p>' + (nbColumn - 1) + '<span>' + dumpText + '</span></p>');

        // Clone the first column (we will push it for each table)
        $firstColumnTablesBackup = self._findColumn( $container, 1 ).clone();
        self.arrayTableFirstColumn[indexTable].push($firstColumnTablesBackup);

        self._findColumn( $container, 1 ).remove();

        // Clone it without the first column
        self.$tableContainerBackup = $container.clone();
        self.arrayTableContainer[indexTable].push(self.$tableContainerBackup);

      });

      self.$window.on('resize', $.throttle(100, $.proxy( self._onResize, self )));

      self.refresh('init');
    },

    _onResize : function() {
      var self = this;

      console.log('_onResize->self', self);

      self.isMobile = Modernizr.mq('only all and (max-width: 640px)');

      self.refresh('resize');
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
      var tallest = $container.find('.specsTable').maxHeight();
      $container.height(tallest);
      $container.children('.scOverflow').height(tallest);
    },

    _findColumn : function( $container, index ) {
      var $column = $container.find('.specsTable > .thead > .specRow > .specCell:nth-child(' + index + '), .specsTable > .tbody > .specRow > .specCell:nth-child(' + index + ')');

      return $column;
    },

    _tableToDiv : function() {
      var self = this,
          $tables = self.$container.find('table');

      $tables.each(function() {

        var $table = $(this),
            tableClass = $table.hasClass('specsTable') ? 'specsTable' : 'smallTable';

        if ( Modernizr.displaytable ) {

          if ( $table.hasClass('specsTable') ) {
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
            return $('<div class="specRow">').append($(this).contents());
          });

          $table.find('th').replaceWith(function() {
            return $('<div class="specCell">').append($(this).contents());
          });

          $table.find('td').replaceWith(function() {
            var getClass = '';

            if ($(this).attr('class')) {
              getClass = $(this).attr('class');
            }

            return $('<div class="specCell ' + getClass + '">').append($(this).contents());
          });

          $table.replaceWith(function() {
            return $('<div class="' + tableClass + '">').append($(this).contents());
          });

          // Odd and Even Classes
          $table.find('.specRow:nth-child(even)').addClass('odd_rows');

        // No display: table support
        } else {

          $table.addClass('table, ' + tableClass + '');
          $table.find('thead').addClass('thead');
          $table.find('tbody').addClass('tbody');
          $table.find('tr').addClass('specRow');
          $table.find('tr:nth-child(even)').addClass('odd_rows');
          $table.find('th, td').addClass('specCell');
        }
      });

      return this;
    },

    // Usage: $(listToMatrix(nbCells, nbCol));
    _listToMatrix : function( list, elementsPerSubArray ) {
      var matrix = [],
      i = 0,
      k = -1;

      for ( ; i < list.length; i++) {
          if (i % elementsPerSubArray === 0) {
              k++;
              matrix[k] = [];
          }

          matrix[k].push(list[i]);
      }

      return matrix;
    },


    refresh : function( status ) {
      // TODO: Fix this shit.
      // Hide any modal on resize.
      if ($('.module-spec .modal').length > 0) {
        $('.module-spec .modal').modal('hide');
      }


      var self = this,
          windowWidth = $(window).width(), // Get the window width.
          minWidthTable = 321, // Minimum per table (column)
          elemMinWidth = windowWidth / minWidthTable, // Number of element present in the viewport (visible element)
          nbElementByPage = Math.min(Math.max(Math.floor(elemMinWidth), 1), 4); // Get the number of column to display.

      // If it's necessary to refresh the number of data
      if ( (self.refreshData === null) || ( self.refreshData !== nbElementByPage) ) {

        $('section > .gallery-tabs > .tableContainer').each(function(indexContainer) {
          var $this = $(this),
              sonySlider = $this.data('sonyCarousel'), // Define the carousel
              tableContainerBackup = $(self.arrayTableContainer)[indexContainer][0].clone(),
              $myCells,
              nbCol,
              nbTableToShow,
              matrix,
              i = 0;

          // Destroy the current slider instance.
          if ( sonySlider ) {
            sonySlider.destroy();
          }

          // Empty the container.
          $this.empty();

          // Get all cells
          $myCells = tableContainerBackup.clone().find(".specsTable > .thead > .specRow > .specCell, .specsTable > .tbody > .specRow > .specCell");

          // nb total column
          nbCol = tableContainerBackup.clone().find(".specRow:first .specCell").length;

          // nb of table to show
          nbTableToShow = nbCol / nbElementByPage;

          // Matrix
          matrix = self._listToMatrix( $myCells, nbCol );

          // Build the sticky nav. - We only add it once.
          if ( $this.parent().find('.tabs-container').length <= 0 ) {
            var tabContainer = $('<div class="tabs-container">'),
                tabInnerContainer = $('<div class="tabs">');

            $(matrix[0]).each(function(index) {
              tabInnerContainer.append($(this).clone().addClass('tab table-' + (indexContainer + '-' + index + 1)));
            });

            tabContainer.append(tabInnerContainer);
            $this.before(tabContainer);

            tabInnerContainer.children(':first-child').addClass('active');

            // Initialize sticky tabs
            // THERES NO DATA-TARGET ATTRIBUTE AND THEREFORE NO ACTIVE TAB
            $('.tab-strip').stickyTabs();
            $('.tabs').trigger("setup_stickytabs");
          }

          // Loop each table to add.
          for (; i < Math.ceil(nbTableToShow); i++) {
            var $table,
                $thead,
                $tbody;

            // Table div layout
            if ( Modernizr.displaytable ) {
              $table = $('<div class="specsTable" id="table-' + indexContainer + '-' + (i + 1) + '">');
              $thead = $('<div class="thead"></div>');
              $tbody = $('<div class="tbody"></div>');

            // Table layout
            } else {
              $table = $('<table class="specsTable" id="table-' + indexContainer + '-' + (i + 1) + '">');
              $thead = $('<thead class="thead"></thead>');
              $tbody = $('<tbody class="tbody"></tbody>');
            }

            // Loop in each row
            $( self._listToMatrix($myCells, nbCol) ).each(function(index) {
              var $this = $(this),
                  $currentRow,
                  $firstCurrentRow,
                  j = 1,
                  titleToCopy = '';

              // Table div layout
              if ( Modernizr.displaytable ) {
                $currentRow = $('<div class="specRow"></div>');
                $firstCurrentRow = $('<div class="specRow"></div>');

              // Table layout
              } else {
                $currentRow = $('<tr class="specRow"></tr>');
                $firstCurrentRow = $('<tr class="specRow"></tr>');
              }

              for ( ; j <= index; j++) {
                titleToCopy = $this.text();

                $this.each(function() {
                  var $that = $(this);

                  if ( $that.find('h2').length <= 0 ) {
                    $that.prepend('<h2>' + titleToCopy + '</h2>');
                  }
                });
              }

              // Put the first row inside the .thead
              if ( index === 0 ) {
                $firstCurrentRow.append( self._listToMatrix(this, nbElementByPage)[i] );
                $thead.append($firstCurrentRow);
              } else {//Else, put them inside the .tbody

                $currentRow.append( self._listToMatrix(this, nbElementByPage)[i] );
                $tbody.append($currentRow);
              }

              //Build each table.
              $table.append($thead, $tbody);
              $this.append($table);
            });
          }

          if ( !self.isMobile ) {
            //Desktop

            //Start it.
            $this.sonyCarousel({
              keyboardNavEnabled : true,
              sliderDrag : false,
              navigateByClick : false,
              autoScaleSlider: false,
              autoHeight: true
            });

            var $desktopNav = $this.closest('.tab-strip').find('.desktopNav');

            if ( $desktopNav.length <= 0 ) {
              $this.before('<div class="desktopNav"><a href="#" class="prev">Previous</a><a href="#" class="next">Next</a></div>');
            }

            // Prev
            $this.prev().find('a.next').click(function() {
              $(this).data('sonyCarousel').next();
            });

            // Next
            $this.prev().find('a.prev').click(function() {
              $(this).data('sonyCarousel').prev();
            });


            var sonySlider = $this.data('sonyCarousel');

            // init
            self._slideChanged( sonySlider );

            sonySlider.ev.on('scAfterSlideChange', function() {
              //After each slide change.. Look if it's necessary to show the Next & Previous button.
              console.log('scAfterSlideChange arguments:', arguments);
              self._slideChanged( sonySlider );
            });

          } else {
            // Mobile

            // Start it.
            $this.sonyCarousel({
              keyboardNavEnabled : false,
              drag : true,
              autoScaleSlider: false,
              autoHeight: true
            });

            //Mobile version
            var sonySlider = $this.data('sonyCarousel');

            //When you click on tabs
            $this.prev().find('.tab').click(function() {
              $(this).parent().find('.tab').removeClass('active').removeAttr('style');
              $(this).addClass('active');
              $this.sonyCarousel('goTo', $(this).index());
            });

            var sonySlider = $('.tableContainer').data('sonyCarousel');
            sonySlider.ev.on('scAfterSlideChange', function(event) {

              // triggers after slide change
              $this.closest('.tableContainer').prev().find('.tabs.sticky .tab').removeClass('active').removeAttr('style');
              $this.closest('.tableContainer').prev().find('.tabs.sticky .tab.table-' + indexContainer + '-' + (sonySlider.currSlideId + 1)).addClass('active');
            });
          }

          var leftTitle = $(self.arrayTableFirstColumn)[indexContainer][0].clone();

          // Add a title to the left of each row.
          $(leftTitle).each(function(index) {
            // index += 1
            if (index === 0) {
              $this.find('.specsTable > .thead > .specRow:nth-child(' + (index + 1) + ')').prepend($(this));
            } else {
              $this.find('.specsTable > .tbody > .specRow:nth-child(' + (index) + ')').prepend($(this));
            }
          });
        });

        // Modify the new current nbElementByPage
        self.refreshData = nbElementByPage;

        // Load iq (we load images)
        iQ.update({
          asyncDistance : -1
        });

        //remove the active class.
        $('.tabs-container .tabs .specCell').removeClass('active');

        //init the active class for the tabs
        activeTab = $('.tableContainer .specsTable:in-viewport').attr('id');
        $('.tabs-container .tabs').children('.specCell.' + activeTab).addClass('active');
      }

      var arrayCel = [];
      $('.tableContainer .specsTable > .tbody >.specRow > .specCell > div').attr("style","min-height:0");
      //This section is always running while resizing.
      $('section > .gallery-tabs > .tableContainer .specsTable').each(function(indexContainer) {

        //  self = $(this);

        if (arrayCel.length == 0) {
          isFirstTable = true;
        } else {
          isFirstTable = false;
        }

        $(this).find('>.tbody>.specRow').each(function(indexR) {

          var storedRowHeight = 0;
          var currentCellHeight = $($(this).find('.specCell')[1]).height();

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

      $('section > .gallery-tabs > .tableContainer .specsTable').each(function(indexTable) {
        self = $(this);

        $(arrayCel).each(function(index) {
          var rows = self.find('> .tbody > .specRow')[index];
          $(rows).find("> .specCell > div").attr("style","min-height:" + arrayCel[index]+"px;" );
        });
      });
      arrayCel = [];


      //console.info(status, device, browser);
      $('.tableContainer').each(function() {
        self._setContainerHeight( $(this) );
      });

      //fit the fixed header on resize.
      fixedHeader();
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

  if ( $('.module-spec').length > 0 ) {

    $('.spec').spec();

  }
});
