/*global log*/
/*jshint debug:true */

// ------------ Sony Alert ------------
// Module: Alert Module
// Version: 0.099
// Modified: 04/22/2013
// Dependencies: jQuery, bootstrap, Sony (Settings|Environment|Utilities), shuffle, scroller, evenheights, tabs, stickytabs, stickynav, simplescroll, rangecontrol
// --------------------------------------

define(function(require){

  var defaults,
      $win = $(window),
      AlertModule;

  // Defaults
  // --------
  defaults = {
    allowsCookies : true,
    alertSelector : '.alert'
  };

  AlertModule = function( elem, options ) {

    // Map optional configs if they exist  
    this.options = options ? $.extend({}, defaults, options) : defaults;
    options = this.options;

    // define our variables
    this.allowsCookies = options.allowsCookies;
    this.$alertModule = $( options.alertSelector );

    // init :)
    this.init();
  };

  // AlertModule Constructor
  // ------------------------
  AlertModule.prototype = {

    constructor: AlertModule,
    
    // show ther alert 
    _displayAlert: function() {
      var self = this;

      setTimeout(function() {
        self.$alertModule.removeClass('collapsed');
      }, 1000 );

    },
    
    _closeAlert: function(event) {
      var el = event.target, 
          self = this,
          currTarget = $(el).closest(self.options.alertSelector);
      
      event.preventDefault();
      currTarget.addClass('collapsed');
      
      // after we close the alert lets remove it from the DOM
      setTimeout(function() {
        currTarget.remove();
      }, 1500 );
    },

    // init our bindings to show? // hide the message
    _initBindings: function() {
      var self = this;

      self.$alertModule.on('click', 'button', $.proxy(self._closeAlert, self));

    },

    init: function() {
      var self = this;

      $(domReady);

      // once the dom is ready we can fire our calls
      function domReady() {
        self._initBindings();
        self._displayAlert();
      }
    }

  }; // end AlertModule prototype

  // Attach the AlertModule constructor to jQuery
  // ------------------------
  $.fn.sonyAlert = function(settings) {
    new AlertModule(this, settings);
  };
});
