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

      var t = this;

        t.$el = $(element);
        t.maxWidth = parseInt(t.$el.css('maxWidth').replace(PX_REGEX , '') , 10);

        t.setup = $.extend({}, $.fn.hotSpotExplorer.defaults, options);
        t.hotspots = t.$el.find('.hsSpot');

      t._init();
    };


    HotSpotExplorer.prototype._init = function(){
        var t = this;

        // resize
        var resizeTimer;
        $(window).on('resize', function() {
            if(resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(function() { t._updateHotspots(); }, 25);
        });

        t._updateHotspots();
    };

    HotSpotExplorer.prototype._updateHotspots = function(){
        var t = this;

        $.each(t.hotspots , function(){
            var $hs = $(this),
                $data = $hs.data(),
                ratio = parseInt(t.$el.css('width').replace(PX_REGEX , '') , 10) / t.maxWidth;

            $hs.css({'top': ratio * $data.y + 'px' , 'left': ratio * $data.x + 'px' , 'visibility' : 'visible'});

        });
    };

    //end HotspotExplorer

    $.fn.hotSpotExplorer = function(options) {
        var args = arguments;
        return this.each(function(){
            var t = $(this);
            if (typeof options === 'object' ||  !options) {
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



