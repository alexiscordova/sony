/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Sony-Icons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'fonticon-10-favorite' : '&#xe000;',
			'fonticon-10-cart' : '&#xe001;',
			'fonticon-10-search' : '&#xe002;',
			'fonticon-10-account' : '&#xe003;',
			'fonticon-10-orders' : '&#xe004;',
			'fonticon-10-newsletter' : '&#xe005;',
			'fonticon-10-registered' : '&#xe006;',
			'fonticon-10-globe' : '&#xe007;',
			'fonticon-10-star' : '&#xe008;',
			'fonticon-10-star-half' : '&#xe009;',
			'fonticon-10-location' : '&#xe00a;',
			'fonticon-10-support' : '&#xe00b;',
			'fonticon-10-grid-3x3' : '&#xe00c;',
			'fonticon-10-circle-x' : '&#xe00d;',
			'fonticon-10-circle-q' : '&#xe00e;',
			'fonticon-10-square-neg-plus' : '&#xe00f;',
			'fonticon-10-plus-skinny' : '&#xe010;',
			'fonticon-10-x-skinny' : '&#xe011;',
			'fonticon-10-x-skinny-rounded' : '&#xe012;',
			'fonticon-10-chevron' : '&#xe013;',
			'fonticon-10-chevron-reverse' : '&#xe014;',
			'fonticon-10-arrowhead-down' : '&#xe015;',
			'fonticon-10-arrowhead-up' : '&#xe016;',
			'fonticon-10-arrowheads-elevator' : '&#xe017;',
			'fonticon-10-arrow-right' : '&#xe018;',
			'fonticon-10-sm-bold-plus' : '&#xe01a;',
			'fonticon-10-sm-bold-check' : '&#xe01b;',
			'fonticon-10-sm-bold-x' : '&#xe01c;',
			'fonticon-10-dot' : '&#xe01d;',
			'fonticon-10-circlearrow' : '&#xe01e;',
			'fonticon-10-x' : '&#xe01f;',
			'fonticon-10-crop-outer' : '&#xe020;',
			'fonticon-10-crop-inner' : '&#xe021;',
			'fonticon-10-video-play' : '&#xe022;',
			'fonticon-10-video-pause' : '&#xe023;',
			'fonticon-10-speaker' : '&#xe024;',
			'fonticon-15-mobile-menu' : '&#xe025;',
			'fonticon-15-circle-play' : '&#xe026;',
			'fonticon-15-popup' : '&#xe027;',
			'fonticon-15-twitter' : '&#xe028;',
			'fonticon-15-facebook-sm' : '&#xe029;',
			'fonticon-15-gplus' : '&#xe02a;',
			'fonticon-15-youtube' : '&#xe02b;',
			'fonticon-15-facebook' : '&#xe02c;',
			'fonticon-15-instagram' : '&#xe02d;',
			'fonticon-15-zoom' : '&#xe02e;',
			'fonticon-20-skateboard' : '&#xe030;',
			'fonticon-20-runner' : '&#xe031;',
			'fonticon-20-mic-studio' : '&#xe032;',
			'fonticon-30-laptop' : '&#xe033;',
			'fonticon-30-tablet' : '&#xe034;',
			'fonticon-30-memory-stick' : '&#xe035;',
			'fonticon-30-tv' : '&#xe036;',
			'fonticon-30-projector' : '&#xe037;',
			'fonticon-30-water-drop' : '&#xe038;',
			'fonticon-30-mic' : '&#xe039;',
			'fonticon-30-dongle' : '&#xe03a;',
			'fonticon-30-cd' : '&#xe03b;',
			'fonticon-30-handycam' : '&#xe03c;',
			'fonticon-30-video-camera' : '&#xe03d;',
			'fonticon-30-grid' : '&#xe03e;',
			'fonticon-30-grid-alt' : '&#xe03f;',
			'fonticon-30-headphones' : '&#xe040;',
			'fonticon-30-earbuds' : '&#xe041;',
			'fonticon-30-earclips' : '&#xe042;',
			'fonticon-30-neckphones' : '&#xe043;',
			'fonticon-30-camera' : '&#xe044;',
			'fonticon-30-support' : '&#xe045;',
			'fonticon-30-intelligent-auto' : '&#xe046;',
			'fonticon-30-superior-auto' : '&#xe047;',
			'fonticon-30-film-strip' : '&#xe048;',
			'fonticon-30-battery' : '&#xe049;',
			'fonticon-30-WiFi' : '&#xe04a;',
			'fonticon-30-Bluetooth' : '&#xe04b;',
			'fonticon-40-panorama' : '&#xe04c;',
			'fonticon-40-face' : '&#xe04d;',
			'fonticon-40-stability' : '&#xe04e;',
			'fonticon-40-battery' : '&#xe04f;',
			'fonticon-60-sony' : '&#xe051;',
			'fonticon-60-win8' : '&#xe050;',
			'fonticon-30-plus' : '&#xe019;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/font[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};