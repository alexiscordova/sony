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
      
      self.$el.on( 'click.tracking', function( e ) {
        
        var $elem     = $(e.target).parents( '*[data-module-id]'),
            elemData  = $elem.data('trackingLog') || [],
            trackingData = elemData;
            
        $elem.type = e.type;
        $elem.elemID =    self.$el.data('moduleId'); 
        $elem.elemName =    self.$el.data('moduleName');  
        $elem.$actionInitElem = e.target;
        
        var time = Date.now();
        
        var trackingTable = [$elem.type, $elem.$actionInitElem, $elem.elemID, $elem.elemName, time];
        
        elemData.push(trackingTable);
        
        $elem.data('trackingLog',trackingData);
        var temp;
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
    } );

  };

  $( function( ) {
    $( '*[data-module-id]' ).globalTracking( );
  } );

})( jQuery );
