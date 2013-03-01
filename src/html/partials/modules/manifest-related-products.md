This is the static manifest file for the MODULE NAME, to be included in the Sony Global. PLEASE WRITE YOUR BASIC OVER VIEW ON THE MODULE HERE.



Document Overview
-----------------

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.


==HEAD files==

* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE


==TAIL files==

* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE




Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==

* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE
* FILE NAME
	*../../LOCATION RELATIVE TO THIS FILE





Submodule Information ReadMe
----------------------------

If this module supports submodules, a clear description should be included here that covers the logic behind which submodules are included, when and what other template variables affect them, etc.. This information will be used in the CMS interface to determine which fields to show and validate.

