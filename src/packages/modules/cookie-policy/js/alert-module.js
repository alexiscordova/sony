/*global log*/

// ------------ Sony Alert ------------
// Module: Alert Module
// Version: 0.099
// Modified: 04/22/2013
// Dependencies: jQuery, bootstrap, Sony (Settings|Environment|Utilities)
// --------------------------------------

define(function(require){

  var defaults,
      $win = $(window),
      AlertModule;

  // Defaults
  // --------
  defaults = {
    alertSelector : '.alert',
    fadeDelay: 100, // how long from the element fading out to collapsing the alert
    removeDelay: 1500, // how long until the element is removed from the DOM
    fadeOut: true
  };

  AlertModule = function( elem, options ) {

    // Map optional configs if they exist  
    this.options = options ? $.extend({}, defaults, options) : defaults;
    options = this.options;

    // define our variables
    this.fadeOut = options.fadeOut;
    this.fadeDelay = options.fadeDelay;
    this.removeDelay = options.removeDelay;
    this.$alertModule = $( options.alertSelector );

    // init :)
    this.init();
  };

  // AlertModule Constructor
  // ------------------------
  AlertModule.prototype = {

    constructor: AlertModule,
    
    // display the alert 
    _displayAlert: function() {
      var self = this;

      setTimeout(function() {
        self.$alertModule.removeClass('collapsed');
      }, self.delay );

    },

    
    // Method checks if there is an option to fade out or not
    // then will run that functionality, and close the alert box
    // followed by a delay to remove the alert box from the DOM.

    _closeAlert: function(event) {
      var el = event.target, 
          self = this,
          $currTarget = $(el).closest(self.options.alertSelector);
      
      event.preventDefault();
      
      // did we define if we should fade the element out?
      if ( self.fadeOut ) {
        $currTarget.addClass('invisible');

        setTimeout(function() {
          $currTarget.addClass('collapsed');
          self._removeAlert($currTarget);
        }, self.fadeDelay );

        //$currTarget.addClass('collapsed');
      } else {
        $currTarget.addClass('collapsed');
        self._removeAlert($currTarget);
      }
      
    },

    // removes the alert from the DOM
    _removeAlert: function(el) {
      var self = this, 
          $currTarget = el;

      setTimeout(function() {
        $currTarget.remove();
      }, self.removeDelay );
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
