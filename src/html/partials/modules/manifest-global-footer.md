This is the static manifest file for the Global Footer, to be included in the Sony Global. Both versions of the Footer – Default and "Minimal" – share the same jade file, with the "Minimal" version skipping over the pieces it doesn't render to the page. The "Minimal" version is triggered by including '"minimal":true' in the data object ("e") in the footer Partial declaration on the page.



Document Overview
-----------------

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.



== DEPLOY HEAD files ==

* b64-icons-woff.css
	* ../../../../build/deploy/fonts/b64-icons-woff.css
* modernizr-2.6.2.js
	* ../../../../build/deploy/js/libs/modernizr-2.6.2.js
* LAB.min.js !??
	* ../../../../build/deploy/js/libs/LAB.min.js
* styles.css
	* ../../../../build/deploy/css/styles.css
* responsive.css
	* ../../../../build/deploy/css/responsive.css



== DEPLOY TAIL files ==

* bootstrap.js
	* ../../../../build/deploy/js/libs/bootstrap.js
* plugins.min.js
	* ../../../../build/deploy/js/libs/plugins.min.js
* require.min.js
	* ../../../../build/deploy/js/require.min.js
* secondary.min.js
	* ../../../../build/deploy/js/secondary.min.js
* defer.min.js
	* ../../../../build/deploy/js/defer.min.js



== SOURCE HEAD files ==

* b64-icons-ttf.css
	* ../../../fonts/b64-icons-ttf.css
* b64-icons-woff.css
	* ../../../fonts/b64-icons-woff.css
* icons-eot.css
	* ../../../fonts/icons-eot.css
* styles.scss
  * ../../../css/scss/styles.scss
* responsive.scss
  * ../../../css/scss/responsive.scss
	


Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==

* default.json
	*../../data/global-footer/default.json
* sample_session_data.json
	*../../data/global-footer/sample_session_data.json

