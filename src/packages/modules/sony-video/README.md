### Sony Video


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
	
* sony-video.css
	*../../../../build/deploy/css/modules/sony-video.css

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

* sony-video.js
	*../../../js/bundle/defer/sony-video.js

* sony-video.scss
	*../../../css/modules/sony-video.scss

* _responsive-sony-video.scss
	*../../../css/_responsive/_responsive-sony-video.scss
	
Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==

* full-bleed-no-poster.json
    *../../data/sony-video/full-bleed-no-poster.json

* full-bleed-video.json
    *../../data/sony-video/full-bleed-video.json

* standard-video.json
    *../../data/sony-video/standard-video.json

Submodule Information ReadMe
----------------------------























