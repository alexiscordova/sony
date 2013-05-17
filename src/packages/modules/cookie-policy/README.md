### E13 Editorial Carousel

The E13 Editorial Carousel is the module that contains a carousel of games


Document Overview
-----------------

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.


== DEPLOY HEAD files ==

* styles.css
	*../../../../build/deploy/css/responsive.css

* styles.css
	*../../../../build/deploy/css/responsive.css

* responsive.css
	*../../../../build/deploy/css/responsive.css

* all.css
	*../../../../build/deploy/css/modules/all.css

* e13-editorial-carousel.css
	*../../../../build/deploy/css/modules/e13-editorial-carousel.css

* responsive.css
	*../../../../build/deploy/css/responsive-modules.css

== DEPLOY TAIL files ==

* jquery.min.js
	*http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

* modernizr-2.6.2.min.js
	*../../../../build/deploy/js/libs/modernizr-2.6.2.min.js

* plugins.min.js
	*../../../../build/deploy/js/plugins.min.js

* require.min.js
	*../../../../build/deploy/js/require.min.js

* secondary.min.js
	*../../../../build/deploy/js/secondary.min.js

* defer.min.js
	*../../../../build/deploy/js/defer.min.js

== Related Source ==

* e13-editorial-carousel.js
	*../../../js/bundle/defer/e13-editorial-carousel.js

* e13-editorial-carousel.scss
	*../../../css/scss/modules/e13-editorial-carousel.scss

Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==


* default.json
	*../../data/e13-editorial-carousel/default.json


Submodule Information ReadMe
----------------------------























