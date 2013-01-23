// ------------ Sony Hotspot Module ------------
// Module: HotSpot Explorer
// Version: 1.0
// Modified: 2012-11-26 by Tyler Madison
// Dependencies: jQuery 1.7+, Modernizr
// -------------------------------------------------------------------------

(function(window){
    'use strict';
    var sony = window.sony = window.sony || {};
    sony.modules = sony.modules || {};
})(window);

(function($, Modernizr, window, undefined) {

  'use strict';

  var PX_REGEX = /px/gi;

  var HotSpotExplorer = function(element, options){
      var self = this;
      self.$el = $(element);
      self.maxWidth = parseInt(self.$el.css('maxWidth').replace(PX_REGEX , '') , 10);

      self.setup = $.extend({}, $.fn.hotSpotExplorer.defaults, options);
      self.hotspots = self.$el.find('.hsSpot');

      self._init();
  };


  HotSpotExplorer.prototype._init = function(){
      var self = this;

      // resize
      var resizeTimer;
      $(window).on('resize', function() {
          if(resizeTimer) {
              clearTimeout(resizeTimer);
          }
          resizeTimer = setTimeout(function() { self._updateHotspots(); }, 25);
      });

      self._updateHotspots();

      //console.log('hotspot explorer init');
  };

  HotSpotExplorer.prototype._updateHotspots = function(){
      var self = this;
      //console.log('resize');

      $.each(self.hotspots , function(){
          var $hs = $(this),
              $data = $hs.data(),
              ratio = parseInt(self.$el.css('width').replace(PX_REGEX , '') , 10) / self.maxWidth;

          $hs.css({'top': ratio * $data.y + 'px' , 'left': ratio * $data.x + 'px' , 'visibility' : 'visible'});

      });
  };

  //end HotspotExplorer

  $.fn.hotSpotExplorer = function(options) {
      var args = arguments;
      return this.each(function(){
          var t = $(this);
          if (typeof options === "object" ||  !options) {
              if( !t.data('hotSpotExplorer') ) {
                  t.data('hotSpotExplorer', new HotSpotExplorer(t, options));
              }
          } else {
              var hotSpotExplorer = t.data('hotSpotExplorer');
              if (hotSpotExplorer && hotSpotExplorer[options]) {
                  return hotSpotExplorer[options].apply(hotSpotExplorer, Array.prototype.slice.call(args, 1));
              }
          }
      });
  };

  $(function(){
      $('.hsExplorer').each(function(){
          var $el = $(this);
          $el.hotSpotExplorer({});
      });
  });


 })(jQuery, Modernizr, window,undefined);



