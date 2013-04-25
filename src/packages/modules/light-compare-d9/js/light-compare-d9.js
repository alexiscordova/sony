define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      iQ = require('iq'),
      enquire = require('enquire');

  var module = {
    init: function() {
      $('.launch-modal').on('click', function(){
        $('#light-compare-modal').modal();
      });
      this.tabhide();

      var breakpoints = [ 767, 768, 979, 980 ];
      var breakpointReactor = function( e ) {
        iQ.update();
      };

      for( var i=0; i < breakpoints.length; i++ ) {
        if( 0 === i ) {
          /* log( "(max-width: " + breakpoints[ i ] + "px)" ); */
          enquire.register( "(max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
        } else {
          /* log( "(min-width: " + ( breakpoints[ i-1 ] + 1 ) + "px) and (max-width: " + breakpoints[ i ] + "px)" ); */
          enquire.register( "(min-width: " + ( breakpoints[ i-1 ] + 1 ) + "px) and (max-width: " + breakpoints[ i ] + "px)", breakpointReactor).listen();
        }
      }
    },

    // temp tab behavior, remove this after integrating tabs
    tabhide: function(){
      var $modal = $('.light-compare-modal');
      $('.tab').hide().first().show();
    }

  };

  return module;

});
