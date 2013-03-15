This is the static manifest file for the Tertiary Tout (T1 - T5) module. 


# Document Overview
---

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.

The Tertiary Tout module consists of three internal content blocks (contentBlocks).  Each content block has different modes.  Each mode has different combinations of elements associated with it. The data relationship of each content block is detailed below.

## Notes & Assumptions 

+ Container Type 'title' should not be readily changeable to enforce consistency per container type. 
+ The Tertiary Tout assumes there will always be 3 elements ("content blocks"), no more and no less.
+ The order in which 'contentBlocks' are listed in the json file (top > down) will/should be the order the elements are rendered to the page (left > right).

## Data Relationships
+ containerType
	+ contentBlock
		+ moduleMode
			+ [moduleElement1, ..., moduleElementN]

### Container Types (containerType)
_The tertiary tout module will only ever exist on the following pages:_

+ category
+ pdp
+ homepage

### Content Blocks (contentBlocks)
_The tertiary tout module has three distinct content types:_

+ article
+ usersVoice
+ sonysVoice
+ flickr	

### Content Block Modes (moduleMode)
_Each contentBlock type has various modes:_

#### article
_Modes:_

a. default
b. featured
c. news
d. event

#### usersVoice
_Modes:_

a. expertQuote
b. userQuote
c. question

#### sonysVoice
_Modes:_

a. twitter
b. facebook
c. instagram

#### flickr
_Modes:_

a. default


### Module Mode Elements (moduleElement)
_Each contentBlock's moduleMode has various elements associated with them:_

_** Notes **_

+ ( o ) = optional
+ ( r ) = required
+ If any "moduleElement" values exist in the dataset, the module assumes it should be rendered to the page (via template logic)
	+ Any required vs. optional rules for the module element below are expected to be enforced via the CMS


#### article:default

a. image (o)
b. title (r)
c. bodyCopy (o)
d. link (o)

#### article:featured

a. title (r)
b. bodyCopy (o)
c. link (o)
d. backgroundImage (o)

#### article:news

a. image (o)
b. title (r)
c. bodyCopy (r)
d. link (r)
e. date (r)

#### article:event

a. image (o)
b. title (r)
c. bodyCopy (o)
d. link (o)
e. eventMeta (o)
	

### Compatible Modules per Container Type

#### category
_Modules:_

+ article
+ usersVoice
+ sonysVoice
+ flickr

#### pdp
_Modules:_

+ article
+ usersVoice
+ sonysVoice
+ flickr

#### homepage
_Modules:_

+ article
+ sonysVoice



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

		+ link
			type: string
			description: string used as href value in <a> tag, must be valid url

		+ linkText
			type: string
			description: string used as link copy value in <a>linkText</a> tag

	+ contentBlocks
		type: object
		description: contains elements that define each content block in the tertiary tout

		+ type
			type: string
			description: along with mode defines the elements in a content block, valid strings are:
				- article
				- usersVoice
				- sonysVoice
				- flickr	

		+ mode
			type: string
			description: along with type defines the elements in a content block, valid strings are:
				- default
				- featured
				- news
				- event
				- expertQuote
				- userQuote
				- question
				- twitter
				- facebook
				- instagram

		+ images
			type: object
			description: contains image objects for content block

			+ src
				type: string
				description: path to image 

			+ alt
				type: string
				description: alt text for image if rendered in <img> tag, required for accessibility purposes

			+ noscriptsrc
				type: string
				description: default image to use, useful for SEO purposes

		+ meta
			type: object
			description: contains meta information for specific content blocks

			+ user
				type: string
				description: username for social channel

			+ timestamp
				type: string
				description: natural language timestamp

			+ title
				type: string
				description: short title used for meta display	

		+ author
			type: object
			description: contains author information for specific content blocks

			+ name
				type: string
				description: name of the author, formatting is automatic

			+ handle
				type: string
				description: user handle from social channel

			+ link
				type: string
				description: a valid url, link to user at social channel site

		+ title
			type: string
			description: title for the content block

		+ bodyCopy
			type: string
			description: copy segment for the content block

		+ articleLink
			type: string
			description: a valid url

		+ date
			type: string
			description: string, valid format: MM.DD.YYYY (may change for localization)

		+ articleAttendence
			type: string
			description: a valid number	

		+ articleAttendence
			type: string
			description: a valid number	

		+ quote
			type: string 
			description: if specific to twitter then limited to 140 characters

		+ quoteLink
			type: string
			description: valid url, link in quote 

		+ socialBtnLink
			type: string
			description: a valid url

		+ postCopy
			type: string
			description: copy for the context block

		+ postLink
			type: string
			description: a valid url	


		+ question
			type: string
			description: a valid string as a question, no quotes needed as they're rendered automatically

		+ repliesLink
			type: string
			description: a valid url

		+ answerLink
			type: string
			description: a valid url


#### JSON EXAMPLES
The json definitions can be seen used in these json example files:

+ *packages/modules/tertiary-tout-t1-t5/demo/data/tertiary-t1-t5/**article-t2-a-c-d.json***
+ *packages/modules/tertiary-tout-t1-t5/demo/data/tertiary-t1-t5/**article-t2-b.json***
+ *packages/modules/tertiary-tout-t1-t5/demo/data/tertiary-t1-t5/**sonys-voice-t4-a-b-c.json***
+ *packages/modules/tertiary-tout-t1-t5/demo/data/tertiary-t1-t5/**users-voice-t3-a-b-c.json***
+ *packages/modules/tertiary-tout-t1-t5/demo/data/tertiary-t1-t5/**flickr-t5-a.json***
+ *packages/modules/tertiary-tout-t1-t5/demo/data/tertiary-t1-t5/**homepage-en.json***
	
	
# Submodule Information ReadMe
---

This module does not support submodules. 