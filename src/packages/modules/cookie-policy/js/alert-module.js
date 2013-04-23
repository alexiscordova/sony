/*global log*/

// ------------ Sony Alert ------------
// Module: Alert Module
// Version: 0.099
// Modified: 04/22/2013
// Dependencies: jQuery, bootstrap, Sony (Settings|Environment|Utilities), shuffle, scroller, evenheights, tabs, stickytabs, stickynav, simplescroll, rangecontrol
// --------------------------------------

define(function(require){
  var defaults;

  defaults = {

  };

  alertModule = function( options ) {

    var AlertModule,
    $win = $(window),
    helpers;

    // Map optional configs if they exist  
    options = this.options = options ? $.extend({}, defaults, options) : defaults;

    this.init();
  };

  // AlertModule Methods
  AlertModule.prototype = {

    init: function() {
      console.log('init');
    }

  }; // end AlertModule prototype

});
