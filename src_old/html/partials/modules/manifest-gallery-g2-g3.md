This is the static manifest file for the Gallery, to be included in the Sony Global. The gallery has two different modes. "Editorial" is a curated, masonic grid of products. "Detailed" is a more detailed grid layout that can be filtered and sorted, use infinite scrolling and/or use the compare tool.



Document Overview
-----------------

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.

== DEPLOY HEAD files ==
* styles.css
	* ../../../../build/deploy/css/styles.css
* responsive.css
	* ../../../../build/deploy/css/responsive.css
* all.css
	* ../../../../build/deploy/css/modules/all.css
* gallery-g2-g3.css
	* ../../../../build/deploy/css/modules/gallery-g2-g3.css
* responsive-modules.css
	* ../../../../build/deploy/css/responsive-modules.css

== DEPLOY TAIL files ==
* global scripts plus
	* ../../../../build/deploy/js/defer.min.js

== Source Jade files ==
* gallery-g2-g3.html.jade
    * gallery-g2-g3.html.jade
* gallery-helpers.jade
    * ../includes/gallery-helpers.jade
* product.html.jade
    * product.html.jade
* gallery-g3-accessories.jade
    * gallery-g3-accessories.jade
* gallery-filters.jade
    * gallery-filters.jade

== Source HEAD files==

* styles.scss
	*../../../css/scss/styles.scss
* responsive.scss
	*../../../css/scss/responsive.scss
* all.scss
	*../../../css/scss/modules/all.scss
* gallery-g2-g3.scss
	*../../../css/scss/modules/gallery-g2-g3.scss
* \_responsive-all.scss
	*../../../css/scss/_responsive/_responsive-all.scss
* \_responsive-gallery-g2-g3.scss
	*../../../css/scss/_responsive/_responsive-gallery-g2-g3.scss


== Source TAIL files==

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

The `gallery-g3-accessories.html.jade` uses a different (but similar) json file.

* gallery-g3-accessories.json
	*../../data/gallery-g2-g3/gallery-g3-accessories.json




Submodule Information ReadMe
----------------------------

If this module supports submodules, a clear description should be included here that covers the logic behind which submodules are included, when and what other template variables affect them, etc.. This information will be used in the CMS interface to determine which fields to show and validate.

The Gallery uses the `product.html.jade` template as a submodule for each product tile. Each product tile's data comes from the .json file inside the product folder. Each JSON file in the product folder represents a single product.

For a product to be in a featured gallery, it must have a property in its JSON called `featured` and it must be `true`. The property that distinguishes between the featured products and featured accessories is the `type`. This `type` defaults to `product` if a type parameter is not set in the jade mixin - `featuredGallery()`.

For a product to show up in the detailed gallery, its `type` must match the given `type` parameter in `detailedGallery()` mixin. Also, it will be skipped if it has `promo: true`.

For a product to show up in the product strip tab, its `type` must match the given `type` parameter in `productStrips()` mixin, its `subtype` property must also match the `subtype` in the json data file. Up to 5 products will be displayed in the strip, after that, they don't get generated.
