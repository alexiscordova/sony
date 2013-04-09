This is the static manifest file for the Multiple PDP Specifications, to be included in the Sony Global.
The multiple spec page provides a way to compare multiple products side by side.


Document Overview
-----------------

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.

== DEPLOY HEAD files ==
* styles.css
    * ../../../../build/deploy/css/styles.css
* responsive.css
    * ../../../../build/deploy/css/responsive.css
* spec-z1-z2.css
    * ../../../../build/deploy/css/modules/spec-z1-z2.css
* responsive-modules.css
    * ../../../../build/deploy/css/responsive-modules.css

== DEPLOY TAIL files ==
* global scripts plus
    * ../../../../build/deploy/js/defer.min.js

== Source Jade files ==
* spec-multi-z2.jade
    * spec-multi-z2.jade
* product.html.jade
    * product.html.jade

== Source HEAD files==

* styles.scss
    *../../../css/scss/styles.scss
* responsive.scss
    *../../../css/scss/responsive.scss
* spec-z1-z2.scss
    *../../../css/scss/modules/spec-z1-z2.scss
* \_responsive-spec-z1-z2.scss
    *../../../css/scss/_responsive/_responsive-spec-z1-z2.scss


== Source TAIL files==

* bootstrap.js
    *../../../js/libs/bootstrap.js
* sony-iscroll.js
    *../../../js/bundle/plugins/sony-iscroll.js
* jquery.imagesloaded.js
    *../../../js/bundle/plugins/jquery.imagesloaded.js
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
* sony-stickynav.js
    *../../../js/bundle/secondary/sony-stickynav.js
* spec-multi-z2.js
    *../../../js/bundle/defer/spec-multi-z2.js




Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==

* default.json
    *../../data/spec-single-z1/default.json





Submodule Information ReadMe
----------------------------

If this module supports submodules, a clear description should be included here that covers the logic behind which submodules are included, when and what other template variables affect them, etc.. This information will be used in the CMS interface to determine which fields to show and validate.

The Multiple Specifications PDP uses the `product.html.jade` template as a submodule for each product tile. Each product tile's data comes from the .json file inside the product folder. Each JSON file in the product folder represents a single product.

The text/graphics/icons in each cell are decided on by which keys are present in the current object.

There will be one column per sub module included on the page.

