$(document).ready(function() {

	$(document).on('keydown', function(e) {
        // 191 is '/'
        if ( e.which === 191 && e.shiftKey ) {
            $('body').toggleClass('debug');


				//toggle window sizer
				(function(e,t){
					var n=e,r=false,i=0;
					if(!t.getElementById("tm-window-resizer")){
						var s=t.createElement("div");
						s.style.position="fixed";
						s.style.bottom="0";
						s.style.right="0";
						s.style.backgroundColor="rgba(126,255,0,0.8)";
						s.style.height="20px";
						s.style.width="126px";
						s.style.display="block";
						s.id="tm-window-resizer";
						var o=t.createElement("p");
						o.style.color="#000";
						o.style.fontSize="11px";
						o.style.fontFamily="Helvetica,Arial,sans-serif";
						o.style.display="block";
						o.style.margin="4px 3px 0 7px";
						o.id="tm-resizer-text";
						s.appendChild(o);
						t.body.appendChild(s);
						var u = function(e){
							clearTimeout(i);
							i=setTimeout(function(){
							n.console.log(n.innerWidth);
							o.innerHTML="Window Width: "+n.innerWidth+"px";},100);};
							o.innerHTML="Window Width: "+n.innerWidth+"px";
							n.addEventListener("resize",u);
					}else{
						if(t.getElementById("tm-window-resizer").style.display === 'none'){
							t.getElementById("tm-window-resizer").style.display = 'block';
						}else{
							t.getElementById("tm-window-resizer").style.display = 'none';
						}
					}
				})(window,document);

        }
	});
	
});