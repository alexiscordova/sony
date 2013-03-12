This is the static manifest file for the Tertiary Tout (T1 - T5) module. 


# Document Overview
---


Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.

The Tertiary Tout module consists of three internal content modules (contentModules).  Each content module has different modes.  Each mode has different combinations of elements associated with it. The data relationship of each content module is detailed below.  

## Notes & Assumptions 

+ Container Type 'title' should not be readily changeable to enforce consistency per container type. 
+ The Tertiary Tout assumes there will always be 3 elements ("content modules"), no more and no less.
+ The order in which 'contentModules' are listed in the json file (top > down) will/should be the order the elements are rendered to the page (left > right).

## Data Relationships
+ containerType
	+ contentModule
		+ moduleMode
			+ [moduleElement1, ..., moduleElementN]

### Container Types (containerType)
_The tertiary tout module will only ever exist on the following pages:_

+ category
+ pdp
+ homepage

### Content Modules (contentModule)
_The tertiary tout module has three distinct content types:_

+ article
+ usersVoice
+ sonysVoice
+ flickr	

### Content Module Modes (moduleMode)
_Each contentModule type has various modes:_

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
_Each contentModule's moduleMode has various elements associated with them:_

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


# JSON FIELD VALIDATION
---

Each module should contain at least one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

## JSON files

+ article-t2-a-c-d.json
	+ ../data/tertiary-t1-t5/article-t2-a-c-d.json
+ article-t2-b.json
	+ ../data/tertiary-t1-t5/article-t2-b.json
+ flickr-t5-a.json
	+ ../data/tertiary-t1-t5/flickr-t5-a.json
+ homepage-en.json
	+ ../data/tertiary-t1-t5/homepage-en.json
+ sonys-voice-t4-a-b-c.json
	+ ../data/tertiary-t1-t5/sonys-voice-t4-a-b-c.json
+ users-voice-t3-a-b-c.json
	+ ../data/tertiary-t1-t5/users-voice-t3-a-b-c.json


# Submodule Information ReadMe
---

This module does not support submodules. 
