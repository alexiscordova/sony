This is the static manifest file for the Gallery, to be included in the Sony Global. The gallery has two different modes. "Editorial" is a curated, masonic grid of products. "Detailed" is a more detailed grid layout that can be filtered and sorted, use infinite scrolling and/or use the compare tool



Document Overview
-----------------

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.


==HEAD files==

* all.scss
	*../../../css/scss/modules/all.scss
* gallery-g2-g3.scss
	*../../../css/scss/modules/gallery-g2-g3.scss
* \_responsive-all.scss
	*../../../css/scss/_responsive/_responsive-all.scss
* \_responsive-gallery-g2-g3.scss
	*../../../css/scss/_responsive/_responsive-gallery-g2-g3.scss


==TAIL files==

* bootstrap.js
	*../../../js/libs/bootstrap.js
* sony-iscroll.js
	*../../../js/bundle/plugins/sony-iscroll.js
* jquery.imagesloaded.js
	*../../../js/bundle/plugins/jquery.imagesloaded.js
* jquery.infinitescroll.js
	*../../../js/bundle/plugins/jquery.infinitescroll.js
* jquery.throttle-debounce.js
	*../../../js/bundle/plugins/jquery.throttle-debounce.js
* jquery.rAF.js
	*../../../js/bundle/plugins/jquery.rAF.js
* iq.js
	*../../../js/bundle/require/iq.js
* sony-global-analytics.js
	*../../../js/bundle/require/sony-global-analytics.js
* sony-global-settings.js
	*../../../js/bundle/require/sony-global-settings.js
* sony-global-utilities.js
	*../../../js/bundle/require/sony-global-utilities.js
* sony-global.js
	*../../../js/bundle/require/sony-global.js
* jodo.rangecontrol.1.4.js
	*../../../js/bundle/secondary/jodo.rangecontrol.1.4.js
* jquery.shuffle.js
	*../../../js/bundle/secondary/jquery.shuffle.js
* sony-evenheights.js
	*../../../js/bundle/secondary/sony-evenheights.js
* sony-navigationdots.js
	*../../../js/bundle/secondary/sony-navigationdots.js
* sony-paddles.js
	*../../../js/bundle/secondary/sony-paddles.js
* sony-scroller.js
	*../../../js/bundle/secondary/sony-scroller.js
* sony-stickytabs.js
	*../../../js/bundle/secondary/sony-stickytabs.js
* sony-tab.js
	*../../../js/bundle/secondary/sony-tab.js
* sony-gallery.js
	*../../../js/bundle/defer/sony-gallery.js




Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==

* default.json
	*../../data/gallery-g2-g3/default.json
* gallery-g2-g3-tv.json
	*../../data/gallery-g2-g3/gallery-g2-g3-tv.json
* gallery-no-pricing.json
	*../../data/gallery-g2-g3/gallery-no-pricing.json
* camera-overflow.json
	*../../data/gallery-g2-g3/camera-overflow.json





Submodule Information ReadMe
----------------------------

If this module supports submodules, a clear description should be included here that covers the logic behind which submodules are included, when and what other template variables affect them, etc.. This information will be used in the CMS interface to determine which fields to show and validate.

