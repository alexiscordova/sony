// Primary Tout Module
// --------------------------------------------
//
// * **Class:** PrimaryTout
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
        if ( $('.primary-tout').length > 0 ) {
          $('.primary-tout').primaryTout();
        }
      }
    };

    // Start module
    var PrimaryTout = function(element, options){
      var self = this;
      $.extend(self, {}, $.fn.primaryTout.defaults, options, $.fn.primaryTout.settings);

      self._init();
    };

    PrimaryTout.prototype = {
      constructor: PrimaryTout,

      _resize: function(){
        var w = $(window).outerWidth();
        if(w > 980){
          //this makes the header grow 1px taller for every 20px over 980w..
          $('.primary-tout.homepage .image-module').css('height', Math.round(Math.min(770, 490 + ((w - 980) / 5))));
          $('.primary-tout.default .image-module').css('height', Math.round(Math.min(660, 560 + ((w - 980) / 5))));
        }else{
          //this removes the dynamic css so it will reset back to responsive styles
          $('.primary-tout.homepage .image-module, .primary-tout.default .image-module').css('height', '');
        }

        // this each and find inner for layouts page
        $.each ($('.primary-tout.homepage .inner .table-center-wrap'), function(i,e){
          var self = $(e);
          var outer = self.closest('.primary-tout.homepage');
          self.height(outer.height() - outer.find('.secondary').outerHeight());
        });
      },

      _init: function(){
        this._resize();
        Environment.on('global:resizeDebounced', this._resize);

        log('SONY : PrimaryTout : Initialized');
      }
    };

    // Plugin definition
    $.fn.primaryTout = function( options ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      return this.each(function() {
        var self = $(this),
          primaryTout = self.data('primaryTout');

        // If we don't have a stored moduleName, make a new one and save it
        if ( !primaryTout ) {
            primaryTout = new PrimaryTout( self, options );
            self.data( 'primaryTout', primaryTout );
        }

        if ( typeof options === 'string' ) {
          primaryTout[ options ].apply( primaryTout, args );
        }
      });
    };

    return module;

});
