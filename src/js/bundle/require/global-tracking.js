/*global jQuery, brightcove*/


// Global tracking
// ---------------------------------------------------------------
//
// * **Class:** GlobalTracking
// * **Version:** 1.0
// * **Modified:** 02/05/2013
// * **Author:** Pierre Paquet
// * **Dependencies:**  jQuery 1.7+

;(function( $ ) {
  
  'use strict';


  var GlobalTracking = function( $element, options ) {

    var self =        this;  
    self.$el =        $element;

    self.init( );

  };

  GlobalTracking.prototype = {

    'constructor' : GlobalTracking,

    'init' : function() {
      
      var self = this;
      self.clickEvent();
      
    },
    'clickEvent' : function() {
      
      var self = this;
      
      // We track all click inside module
      // **TODO:** This temporary, should be modify to reflect tracking strategy. 
      self.$el.on( 'click.tracking', function( e ) {
        console.log('click');
        var $elem         = $(e.target).parents( '*[data-module-id]'),
            elemData      = $elem.data('trackingLog') || [],
            trackingData  = elemData;
            
        $elem.type            = e.type;
        $elem.elemID          = self.$el.data('moduleId'); 
        $elem.elemName        =    self.$el.data('moduleName');  
        $elem.$actionInitElem = e.target;
        
        // Create an array of elements we are tracking
        var trackingTable = [$elem.type, $elem.$actionInitElem, $elem.elemID, $elem.elemName];
        
        elemData.push(trackingTable);
        
        $elem.data('trackingLog',trackingData);

      });
    }

  };
  
  
  jQuery.fn.globalTracking = function( options ) {

    var args = Array.prototype.slice.call( arguments, 1 );

    return this.each( function( ) {
      var self = $( this ), globalTracking = self.data( 'globalTracking' );

      if ( !globalTracking ) {
        globalTracking = new GlobalTracking( self, options );
        self.data( 'globalTracking', globalTracking );
      }

      if ( typeof options === 'string' ) {
        globalTracking[options].apply( globalTracking, args );
      }
    });

  };

})( jQuery );
