### Related Products

The related products G1. is the module that contains gallery tiles that are associated with the current product page that the module lives on. 


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
	
* related-products.css
	*../../../../build/deploy/css/modules/related-products.css

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

* related-products.js
	*../../../js/bundle/defer/related-products.js

* related-products.scss
	*../../../css/scss/modules/related-products.scss

* _responsive-related-products.scss
	*../../../css/scss/_responsive/_responsive-related-products.scss
	
Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==


* homepage.json
	*../../data/related-products-g1/homepage.json

* homepage-tabbed.json
	*../../data/related-products-g1/homepage-tabbed.json

* plate-orange-count
	*../../data/related-products-g1/plate-orange-count.json
	
* plate-orange-btn
	*../../data/related-products-g1/plate-orange-btn.json
	
* plate-purple
	*../../data/related-products-g1/plate-orange.json
	
* plate-teal
	*../../data/related-products-g1/plate-teal.json
	
* 3up-view.json
	*../../data/related-products-g1/3up-view.json
	
* 2up-view.json
	*../../data/related-products-g1/2up-view.json

* 3up-view.json
	*../../data/related-products-g1/3up-view.json

* 4up-view.json
	*../../data/related-products-g1/4up-view.json

* 5up-view.json
	*../../data/related-products-g1/5up-view.json


Submodule Information ReadMe
----------------------------

While this module doesn't support submodules they way that the carousel is built uses a similar system to create multiple 'slides' worth of products. This uses a different variable in the json data, for example in the homepage demo the jade template is fed 'homepage.json' which uses a variable called 'slideContent' instead of 'submodules' that the jade template works off of to build a complete module witch each slide getting it's own layout template to build each product slide. For example in the hompage again it is fed the 'homepage.json' file which contains the 'slideContent' variable that has 3 references to different layouts, the first being '5up-teal-color.json' the second being '4up-purple-color.json' and the third being '3up-orange-color.json'























