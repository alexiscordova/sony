$(document).ready(function() {
  if ( $('.primary-tout.home-page').length > 0 ) {
  	$.guid= 0
  	var resize = function(){
		 $('.primary-tout.home-page').find('.fill').height($('.primary-tout.home-page').height() - $('.primary-tout.home-page').find('.hero-unit').outerHeight() - parseInt($('.primary-tout.home-page').find('.hero-unit').css('margin-bottom'), 10) );
	}
	resize();
  	$(window).resize($.throttle(250, resize) );
  }
})

 