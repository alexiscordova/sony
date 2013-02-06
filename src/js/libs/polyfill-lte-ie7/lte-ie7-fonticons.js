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
			'fonticon-10-star' : '&#xe007;',
			'fonticon-10-star-half' : '&#xe008;',
			'fonticon-10-location' : '&#xe009;',
			'fonticon-10-support' : '&#xe00a;',
			'fonticon-10-grid-3x3' : '&#xe00b;',
			'fonticon-10-circle-x' : '&#xe00c;',
			'fonticon-10-circle-q' : '&#xe00d;',
			'fonticon-10-square-neg-plus' : '&#xe00e;',
			'fonticon-10-plus-skinny' : '&#xe00f;',
			'fonticon-10-x-skinny' : '&#xe010;',
			'fonticon-10-x-skinny-rounded' : '&#xe011;',
			'fonticon-10-chevron' : '&#xe012;',
			'fonticon-10-arrowhead-up' : '&#xe013;',
			'fonticon-10-arrowhead-down' : '&#xe014;',
			'fonticon-10-arrowheads-elevator' : '&#xe015;',
			'fonticon-10-arrow-right' : '&#xe016;',
			'fonticon-10-sm-bold-plus' : '&#xe017;',
			'fonticon-10-sm-bold-check' : '&#xe018;',
			'fonticon-10-sm-bold-x' : '&#xe019;',
			'fonticon-10-mobile-icon' : '&#xe01a;',
			'fonticon-10-dot' : '&#xe01b;',
			'fonticon-10-circlearrow' : '&#xe01c;',
			'fonticon-10-x' : '&#xe01d;',
			'fonticon-10-crop-outer' : '&#xe01e;',
			'fonticon-10-crop-inner' : '&#xe01f;',
			'fonticon-10-video-play' : '&#xe020;',
			'fonticon-10-video-pause' : '&#xe021;',
			'fonticon-10-speaker' : '&#xe022;',
			'fonticon-10-twitter' : '&#xe023;',
			'fonticon-10-facebook' : '&#xe024;',
			'fonticon-20-gplus' : '&#xe025;',
			'fonticon-15-youtube' : '&#xe026;',
			'fonticon-20-skateboard' : '&#xe029;',
			'fonticon-20-runner' : '&#xe02a;',
			'fonticon-20-mic-studio' : '&#xe02b;',
			'fonticon-20-zoom' : '&#xe02c;',
			'fonticon-20-circle-play' : '&#xe02d;',
			'fonticon-20-popup' : '&#xe02e;',
			'fonticon-20-mobile-menu' : '&#xe02f;',
			'fonticon-30-laptop' : '&#xe030;',
			'fonticon-30-tablet' : '&#xe031;',
			'fonticon-30-memory-stick' : '&#xe032;',
			'fonticon-30-tv' : '&#xe033;',
			'fonticon-30-projector' : '&#xe034;',
			'fonticon-30-water-drop' : '&#xe035;',
			'fonticon-30-mic' : '&#xe036;',
			'fonticon-30-dongle' : '&#xe037;',
			'fonticon-30-cd' : '&#xe038;',
			'fonticon-30-handycam' : '&#xe039;',
			'fonticon-30-video-camera' : '&#xe03a;',
			'fonticon-30-grid' : '&#xe03b;',
			'fonticon-30-grid-alt' : '&#xe03c;',
			'fonticon-30-headphones' : '&#xe03d;',
			'fonticon-30-earbuds' : '&#xe03e;',
			'fonticon-30-earclips' : '&#xe03f;',
			'fonticon-30-neckphones' : '&#xe040;',
			'fonticon-30-camera' : '&#xe041;',
			'fonticon-36-panorama' : '&#xe042;',
			'fonticon-36-face' : '&#xe043;',
			'fonticon-30-intelligent-auto' : '&#xe044;',
			'fonticon-30-superior-auto' : '&#xe045;',
			'fonticon-30-film-strip' : '&#xe046;',
			'fonticon-36-stability' : '&#xe047;',
			'fonticon-36-battery' : '&#xe048;',
			'fonticon-60-wifi' : '&#xe049;',
			'fonticon-60-bluetooth' : '&#xe04a;',
			'fonticon-30-support' : '&#xe04b;',
			'fonticon-60-win8' : '&#xe04c;',
			'fonticon-60-sony' : '&#xe04d;'
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