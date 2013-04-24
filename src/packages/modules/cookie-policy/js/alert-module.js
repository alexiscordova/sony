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
      AlertModule,
      module;

  // Public methods
  // --------------
  module = {
    'init': function() {
      new AlertModule();
    }
  };
  
  defaults = {
    allowsCookies : true,
    alertModule : '#cookie-alert'
  };

  AlertModule = function( options ) {
    $win = $(window);

    // Map optional configs if they exist  
    options = this.options = options ? $.extend({}, defaults, options) : defaults;

    this.allowsCookies = options.allowsCookies;
    this.$alertModule = $( options.alertModule );

    // init :)
    this.init();
  };

  // AlertModule Methods
  AlertModule.prototype = {

    // Check our faux setting if user allows cookies or not
    _checkCookies: function() {

      // if the user allows cookies we can display the error
      if (this.allowsCookies) { 
        this._displayAlert();
      }

    },
      
    // show ther alert 
    _displayAlert: function() {
      var self = this;

      setTimeout(function() {
        self.$alertModule.removeClass('collapsed');
      }, 1000 );

    },
    
    _closeAlert: function(event) {
      var el = event.target, 
          self = this;
      
      event.preventDefault();
      self.$alertModule.addClass('collapsed');
      
      // after we close the alert lets remove it from the DOM
      setTimeout(function() {
        self.$alertModule.remove();
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
        self._checkCookies();
      }
    }

  }; // end AlertModule prototype

  return module;
});
