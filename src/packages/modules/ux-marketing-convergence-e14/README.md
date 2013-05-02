# Overview
The ux convergence module (e14) is consists of two main elements: The Base Product (left/top) and The Partner Products (right/bottom). There is a one to many relationship between the base product and the partner products. The module on a whole has been optimized for four (1:4) or less (1:2, two minimum) partner products.

#<a id="config"></a>Configuration

**id:** *required*, unique string used for deep linking to modules on a page, should *not* be relied upon for styling/functionality

**mode:** 																		- *optional*, at this time, mode is a placeholder parameter and not currently active in the module. It's set to *default* to account for potential varitions in the future. 

**header** 																		 - *optional*, main copy rendered above the base/partner product elements

**baseProdcut:** 															 - *required*, single object container for Base Product (left/top side) elements

* **title**															     	 - *required*, used for SEO optimization in the "+" icon button markup as the title

* **img**																     	 - *required*, single image object container for Base Product images, must follow imageQualification.js naming requirements
	* **srcDesktop**										         - *required*, path to normal resolution desktop image for the Base Product
	* **srcDesktopHighRes**				               - *required*, path to retina resolution desktop image for the Base Product 
	* **srcTablet**												       - *required*, path to normal resolution tablet image for the Base Product
	* **srcTabletHighRes**				               - *required*, path to retina resolution tablet image for the Base Product
	* **srcPhone**												       - *required*, path to normal resolution image image for the Base Product
	* **srcPhoneHighRes**						             - *required*, path to retina resolution phone image for the Base Product
	* **noscriptsrc**										         - *required*, image to use in case there is no javascript, recomend using the *srcDesktop* path. 
	* **alt**															     	 - *required*, logical, clear alt text for this image group

**partnerProducts:** 													 - *required*, the object container for each Product Partner (right/top) item. 

* **theme**															     	 - *required*, Each partner product item has a theme.  That theme dictates the product color and the "+" icon color associated with each theme. 

	* *Watch* - uses color $themeRed 
	* *Listen* - uses color $themePurple 
	* *Play* - uses color $themeBlueLight 
	* *Discover* - uses color $themeGreen 
	* *Create* - uses color $themeOrange 
	* *Connect* - uses color $themeBlueDark  	

* **topLine**															     - *optional*, copy for top line of Partner Product content

* **linkText**														     - *optional*, copy for link text rendered below *topLine*, conditionally rendered if *link* has a value

* **altText**															     - *optional*, description underneath topLine, conditionally rendered if *link* has a value

* **link**															     	 - *optional*, link value for *linkText*, if empty no copy will be rendered under *topLine*

* **img**																     	 - *required*, object container for this Partner Product image family
	* **srcDesktop**										         - *required*, path to normal resolution desktop image for this Partner Product image
	* **srcDesktopHighRes**				               - *required*, path to retina resolution desktop image for this Partner Product image 
	* **srcTablet**												       - *required*, path to normal resolution tablet image for this Partner Product image
	* **srcTabletHighRes**				               - *required*, path to retina resolution tablet image for this Partner Product image
	* **srcPhone**												       - *required*, path to normal resolution image image for this Partner Product image
	* **srcPhoneHighRes**						             - *required*, path to retina resolution phone image for this Partner Product image
	* **noscriptsrc**										         - *required*, image to use in case there is no javascript, recomend using the *srcDesktop* path. 
	* **alt**															     	 - *required*, logical, clear alt text for this image group
	
		

# Naming
All possible variations / layouts for this module are explained in the [Configuration](#config) or occur automatically at different breakpoints. 