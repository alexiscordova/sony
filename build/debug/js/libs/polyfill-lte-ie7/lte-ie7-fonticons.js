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
			'fonticon-10-chevron-sm' : '&#xe015;',
			'fonticon-10-alpha-light' : '&#xe016;',
			'fonticon-10-alpha' : '&#xe017;',
			'fonticon-10-alpha-medium' : '&#xe018;',
			'fonticon-10-alpha-bold' : '&#xe019;',
			'fonticon-10-arrowhead-down' : '&#xe01a;',
			'fonticon-10-arrowhead-up' : '&#xe01b;',
			'fonticon-10-arrowheads-elevator' : '&#xe01c;',
			'fonticon-10-arrow-right' : '&#xe01d;',
			'fonticon-10-sm-bold-plus' : '&#xe01e;',
			'fonticon-10-sm-bold-check' : '&#xe01f;',
			'fonticon-10-sm-bold-x' : '&#xe020;',
			'fonticon-10-dot' : '&#xe021;',
			'fonticon-10-circlearrow' : '&#xe022;',
			'fonticon-10-x' : '&#xe023;',
			'fonticon-10-video-enlarge' : '&#xe024;',
			'fonticon-10-video-minimize' : '&#xe025;',
			'fonticon-10-video-play' : '&#xe026;',
			'fonticon-10-video-pause' : '&#xe027;',
			'fonticon-10-speaker' : '&#xe028;',
			'fonticon-15-mobile-menu' : '&#xe029;',
			'fonticon-15-circle-play' : '&#xe02a;',
			'fonticon-15-popup' : '&#xe02b;',
			'fonticon-15-twitter' : '&#xe02c;',
			'fonticon-15-facebook-sm' : '&#xe02d;',
			'fonticon-15-gplus' : '&#xe02e;',
			'fonticon-15-youtube' : '&#xe02f;',
			'fonticon-15-facebook' : '&#xe030;',
			'fonticon-15-instagram' : '&#xe031;',
			'fonticon-15-zoom' : '&#xe032;',
			'fonticon-20-skateboard' : '&#xe033;',
			'fonticon-20-runner' : '&#xe034;',
			'fonticon-20-mic-studio' : '&#xe035;',
			'fonticon-30-laptop' : '&#xe036;',
			'fonticon-30-tablet' : '&#xe037;',
			'fonticon-30-memory-stick' : '&#xe038;',
			'fonticon-30-tv' : '&#xe039;',
			'fonticon-30-projector' : '&#xe03a;',
			'fonticon-30-water-drop' : '&#xe03b;',
			'fonticon-30-mic' : '&#xe03c;',
			'fonticon-30-dongle' : '&#xe03d;',
			'fonticon-30-cd' : '&#xe03e;',
			'fonticon-30-handycam' : '&#xe03f;',
			'fonticon-30-video-camera' : '&#xe040;',
			'fonticon-30-grid' : '&#xe041;',
			'fonticon-30-grid-alt' : '&#xe042;',
			'fonticon-30-headphones' : '&#xe043;',
			'fonticon-30-earbuds' : '&#xe044;',
			'fonticon-30-earclips' : '&#xe045;',
			'fonticon-30-neckphones' : '&#xe046;',
			'fonticon-30-camera' : '&#xe047;',
			'fonticon-30-support' : '&#xe048;',
			'fonticon-30-intelligent-auto' : '&#xe049;',
			'fonticon-30-superior-auto' : '&#xe04a;',
			'fonticon-30-film-strip' : '&#xe04b;',
			'fonticon-30-battery' : '&#xe04c;',
			'fonticon-30-wifi' : '&#xe04d;',
			'fonticon-30-bluetooth' : '&#xe04e;',
			'fonticon-30-plus' : '&#xe04f;',
			'fonticon-40-panorama' : '&#xe050;',
			'fonticon-40-face' : '&#xe051;',
			'fonticon-40-stability' : '&#xe052;',
			'fonticon-40-battery' : '&#xe053;',
			'fonticon-60-win8' : '&#xe056;',
			'fonticon-60-sony' : '&#xe057;'
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