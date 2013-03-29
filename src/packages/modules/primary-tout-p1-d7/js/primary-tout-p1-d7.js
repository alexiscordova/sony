// Primary Tout Module
// --------------------------------------------
//
// * **Class:** Editorial
// * **Version:** 1.0
// * **Modified:** 02/22/2013
// * **Author:** Thisispete
// * **Dependencies:** jQuery 1.7+ , sony-global-environment
//

define(function(require){

    'use strict';

    var $ = require('jquery'),
        Environment = require('require/sony-global-environment');

    var module = {
      init: function() {
        if ( $('.editorial').length > 0 ) {
          $('.editorial').editorial();
        }
      }
    };

    // Start module
    var Editorial = function(element, options){
      var self = this;
      $.extend(self, {}, $.fn.editorial.defaults, options, $.fn.editorial.settings);

      self._init();
    };

    Editorial.prototype = {
      constructor: Editorial,

      _init: function(){
        log('SONY : Editorial : Initialized');
      }
    };

    // Plugin definition
    $.fn.editorial = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          editorial = self.data('editorial');

        // If we don't have a stored moduleName, make a new one and save it
        if ( !editorial ) {
            editorial = new Editorial( self, options );
            self.data( 'editorial', editorial );
        }

        if ( typeof options === 'string' ) {
          editorial[ options ].apply( editorial, args );
        }
      });
    };

    return module;

});
