# Overview
The product details module (d5) is organized into three main sections: top, center, bottom.  

The **top** section contains the module's *title* and *description* copy. 

The **center** section contains four main elements:

* **features** [^1] - each feature set contains of *copy*, *icon*, and a *link*
* **specs** [^2] - each spec set contains a *title* and *copy*
* **measurements** [^3] - each measurement set contains an *image*, *height* set, and a *width* set
* **extras** [^4] - each extra contains a *title* and *copy*

The center section can contain various layout options for its contents. Please refer to the Module Library for more inforation on these layouts. 

The **bottom** section is entirely optional and therefore contains three layout independent elements: *button*, *icon* + *copy* ("Text tout")


#<a id="config"></a>Configuration

* **id:** *required*, unique string used for deep linking to modules on a page, should *not* be relied upon for styling/functionality
* **top:** - *required*, object container for top elements
	* **title** - *optional*, string, title for entire module
	* **desc** - *optional*, string, description copy for module, column split is handled automatically based on device/browser capabilities and breakpoint requirements
* **center:** - *required*, object container for center elements 
  * **features:** - *required*, object container for *feature* elements, can be empty
    * **icon** - *optional*, string, icon css name defined by the Style Guide, located: *Design > Design Guidelines >Iconography*
    * **copy** - *required*, string, description for *feature*
    * **link** - *optional*, url, valid link for *linkLabel*
    * **linkLabel** - if *link* = true then *required*, if *link* = false, *linkLabel* will not be display, string
  * **specs:** - *required*, object container for *spec* elements, can be empty
    * **title** - *required*, string, spec item title
    * **copy** - *optional*, string, spec item descriptive copy
  * **measurements:** - *required*, object container for *measurement* elements, can be empty
    * **thinImage** - *required*, boolean, determines if margin is needed on *image*, if the image is thin set to *true*
	* **image:** - *required*, single image object container for each measurememnt image set, must follow imageQualification.js naming requirements, **if no image, no other *measurement* elements should render to the page**
      * **srcDesktop**   - *required*, path to normal resolution desktop image for the each measurememnt
      * **srcDesktopHighRes**  - *required*, path to retina resolution desktop image for the each measurememnt 
      * **srcTablet**  - *required*, path to normal resolution tablet image for the each measurememnt
      * **srcTabletHighRes**   - *required*, path to retina resolution tablet image for the each measurememnt
      * **srcPhone**   - *required*, path to normal resolution image image for the each measurememnt
      * **srcPhoneHighRes**  - *required*, path to retina resolution phone image for the each measurememnt
      * **noscriptsrc**  - *required*, image to use in case there is no javascript, recomend using the *srcDesktop* path. 
      * **alt** - *required*, logical, clear alt text for this image group
    * **height:** - *required*, json object container to hold *measurement* dimensions, can be empty
		* **cm** - *optional*, number as string, centimeter value for item's height (vertical) measurement
		* **inches** - *optional*, number as string, inches value for item's height (vertical) measurement
    * **width:** - *required*, json object container to hold *measurement* dimensions, can be empty
		* **cm** - *optional*, number as string, centimeter value for item's width (horizontial) measurement
		* **inches** - *optional*, number as string, inches value for item's width (horizontal) measurement
	* **extras:** - *required*, json object container for each *extra* element, can be empty
		* **title** - *required*, string, title for extra element, requires *copy* to be rendered
		* **copy** - *required*, string, description copy for extra element, requires *title* to be rendered
* **bottom:** - *required*, json object container for bottom elements, can be empty
	* **textTout:** - *required*, json object container for *textTout* element, can be empty, *only one child allowed*
		* **icon** - *optional*, path, single image for *textTout* icon, cannot sit alone (required *copy*)
		* **copy** - *optional*, string, descrptive copy for *textTout* 
		* **link** - *optional*, url, valid url link, requires *linkLabel* to render 
		* **linkLabel** - *optional*, string, link text, requires *link* to render, used for link title attribute as well
	* **bottomBtn:** - *required*, json object container for *bottomBtn* element, can be empty, *only one child allowed*
		* **buttonLink** - *optional*, url, valid url link, requires *buttonLabel* to render 
		* **buttonLabel** - *optional*, string, link text, requires *buttonLink* to render, used for link title attribute as well 


# Naming
All possible variations / layouts for this module are illustrated in the Design Guide's Module Library. 

The jade template calculates potential layout combinations and converts that into a numerical value. 

* 111 = Features | Specs | Measurements = a three-column layout
* 101 = Features | Measurements = a two-column layout
* 11 = Specs | Measurements = a two-column layout
* 110 = Features | Specs = a two-column layout
* 100 = Features = a two-column layout because the features should be split into two columns
* 10 = Specs = a two-column layout because the specs should be split into two columns






[^1]: There is no technically-enforced limit on the front-end for this object set, if features are the only layout element in the module, they will be equally divided between two columns
[^2]: There is no technically-enforced limit on the front-end for this object set, if specs are the only layout element in the module, they will be equally divided between two columns
[^3]: There is no technically-enforced limit on the front-end for this object set, measurements will try to float next to each other, if there is not enough space, they will wrap naturally.
[^4]: There is no technically-enforced limit on the front-end for this object set, each extra item will stack vertically, if extras and one other layout element (features or specs) is present, they are accounted for in the two-column wrapping logic