
// ------------ Sony Draggable Object (SonyDraggable) Module ------------
// Module: SonyDraggable Module
// Version: 0.1
// Modified: 01/23/2013
// Author: George Pantazis
// Dependencies: jQuery 1.7+
// ----------------------------------------------------------------------
// Notes:
// This plugin is based on the API of jQuery UI Draggable (http://api.jqueryui.com/draggable),
// and serves as a bare-bones version to satisfy the needs of the Dual Viewer (E9).
// ----------------------------------------------------------------------

(function($) {

  'use strict';

  var SonyDraggable = function($element, options){

    var self = this;

    $.extend(self, {}, $.fn.editorialDualViewer.defaults, options);

    self.$el = $element;
    self.$containment = $(self.containment);

    self.init();
  };

  SonyDraggable.prototype = {

    'constructor': SonyDraggable,

    'init': function() {

      var self = this;

      self.startPositionX = self.$el.position().left;
      self.startPositionY = self.$el.position().top;

      self.$containment.on('mousedown', function(e){ self.moveStart(e); });
      self.$containment.on('mouseup', function(e){ self.moveEnd(e); });
      self.$containment.on('mouseleave', function(e){ self.moveEnd(e); });
    },

    'moveStart': function(e) {

      e.preventDefault();

      var self = this,
          $this = $(e.target);

      if ( self.$el.has($this).length === 0 ) return;

      // EOD NOTE: The problem with this is that it doesn't consider the page margins,
      // so if you resize your cursor will be wrong.

      self.startMouseX = self.startMouseX || e.pageX;
      self.startMouseY = self.startMouseY || e.pageY;

      self.$containment.on('mousemove', function(e) {

        var movedX = e.pageX - self.startMouseX,
            movedY = e.pageY - self.startMouseY;

        if ( self.axis.search('x') >= 0 ) {
          self.$el.css('left', self.startPositionX + movedX);
        }

        if ( self.axis.search('y') >= 0 ) {
          self.$el.css('top', self.startPositionY + movedY);
        }

        self.drag({
          'position': {
            'left': movedX,
            'top': movedY
          }
        })
      })

    },

    'moveEnd': function(e) {

      e.preventDefault();

      var self = this,
          $this = $(e.currentTarget);

      self.$containment.off('mousemove');
    }

  };

  $.fn.sonyDraggable = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        sonyDraggable = self.data('sonyDraggable');

      if ( !sonyDraggable ) {
          sonyDraggable = new SonyDraggable( self, options );
          self.data( 'sonyDraggable', sonyDraggable );
      }

      if ( typeof options === 'string' ) {
        sonyDraggable[ options ].apply( sonyDraggable, args );
      }
    });
  };

  $.fn.sonyDraggable.defaults = {

  };

})(jQuery);
