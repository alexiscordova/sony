This is the static manifest file for the Product Details (D5) module. 


# Document Overview
---

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.


## Notes & Assumptions 


## Data Relationships

_** Notes **_

+ ( o ) = optional
+ ( r ) = required


# JSON DEFINITIONS
---

Each module should contain at least one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

For more information on how json elements relate to each other, including required or optional values, please see the data relationships section of this document. 

	+ id
		type: string
		description: a unique id for the tertiary tout

	+ header
		type: object
		description: contains header information for the tertiary tout container

		+ title
			type: string
			description: title for the tertiary tout, valid strings are contextual based on location:
				- homepage: "Latest News"
				- product detail page: "Use & Own"
				- category page: "Community"

#### JSON EXAMPLES
The json definitions can be seen used in these json example files:

+ *packages/modules/product-details-d5/demo/data/tertiary-t1-t5/**product-details-d5.json***
	

# Submodule Information ReadMe
---

This module does not support submodules. 