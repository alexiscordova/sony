### D4. PDP Slide Show

The pdp slide show D4. This is actually a submodule of an Editorial layout.


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
	
* pdp-slideshow-d4.css
	*../../../../build/deploy/css/modules/editorial-slideshows-e4.css

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

* pdp-slideshow-d4.js
	*../../../js/bundle/defer/editorial-slideshows-e4.js

* pdp-slideshow-d4.scss
	*../../../css/scss/modules/editorial-slideshows-e4.scss

	
Example JSON File(s)
--------------------

==JSON files==

* full-left-75-D-L-example1.json
	*../../../../src/packages/modules/editorial-slideshows-e4/demo/data/full-left-75-D-L-example1.json

* medialeft-66-D-L-example1.json
	*../../../../src/packages/modules/editorial-slideshows-e4/demo/data/medialeft-66-D-L-example1.json

* mediaright-66-D-L-example1.json
	*../../../../src/packages/modules/editorial-slideshows-e4/demo/data/mediaright-66-D-L-example1.json


Submodule Information ReadMe
----------------------------

This uses the pattern from editorials which a D4. PDP Slideshow is actually a submodule itself of an editorial layout






















