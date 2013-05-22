$(document).ready(function() {

	$(document).on('keydown', function(e) {
        // 191 is '/'
        if ( e.which === 191 && e.shiftKey ) {
            $('body').toggleClass('debug');
        }
	});
	
});