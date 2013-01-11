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
  };


}(jQuery, Modernizr, window));







$(document).ready(function() {

  if ( $('.spec-module').length > 0 ) {

    $('.spec-module').spec();

  }
});
