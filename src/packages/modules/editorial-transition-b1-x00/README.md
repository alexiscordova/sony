# Image Sequence

_Batch 1/2 Nurun custom module_

The image sequence module is a module which is similar to the functionality of the 360 module yet has added features and functionality. First being a slider which users can drag a slide handle which displays the corresponding image within the image sequence.

** DEV NOTES **
- Mobile layout for annotation notes are not complete -- issues occur when resizing the window and annotations are at far left || right || bottom || top of the window it's following. They have no where else to go -- unless they can move outside of the viewport.


## Dependencies
* jQuery
* Modernizr
* Sony Environment
* [Slider](../../common/js/secondary/sony-slider-control.js)
* [Sequenece](../../common/js/secondary/sony-img-sequenece.js)

## Source Files
The source files required for this module.

* [editorial-transision-b1-x00.jade](html/feature-slideshow-b1-x00.jade)
* [feature-slideshow-b1-x00.js](js/feature-slideshow-b1-x00.js)
* [index.js](js/index.js)
* [feature-slideshow-b1-x00.scss](css/feature-slideshow-b1-x00.scss)
* [_responsive-feature-slideshow-b1-x00.scss](css/_responsive-feature-slideshow-b1-x00.scss)


## JSON

### Example files(s)

* [editorial-transition-data.json](demo/data/feature-slideshow-default.json)

### JSON Properties

**Layout : {}** - Controls the Global Layout of the module. Similar pattern from the E1 modules.

**Mode**
- full : submodule is full width text is above

- full inner : submodule is full width text is overlayed

**Style**

- additional classes that define if it has a dark or light text box or if the text is dark or light, etc

**Text**

- which column the text goes into (right | left | center | full)

**Alignment**

- text alignment within the column (left | right | center)

**Columns**

- array of the column breakdown for 12 column grid in order from left to right ie: [5,7] span5 on left span7 on right || [1,10,1] span10 in the middle of the page

- - - - - -

**Variation: {}**- could hold more variation options in the future for now its just background...

- - - - - -

**Background : string** - if images in the sequence will use <img> tags versus <div> with background properties for iQ.

- - - - - -

**sequenceConfig** - Global Configuration settings for the sequence.

**autoplay** - Sets if sequence will play automatically or not when loaded (do not use with slider)

**viewControls** - Sets if the default editorial-360viewer-e8 'drag to rotate' controls are displayed or not. (note: do not use when `barControls` are set to true)

**barControls** - deprecated setting. Used to set the slider controls.

**loopAnimation** - used to loop the animation sequence. (note: do not set to true, if slider controls are present)

**animationSpeed** - used to set the sequence speed between slid transitions.

- - - - - -

**sequence: []** - an array containing objects for each individual slide within the sequence.

**image: {}** - contains image sources for (noscriptsrc | srcDesktop | srcDesktopHighRes | srcTablet | srcTabletHighRes | srcPhone | srcPhoneHighRes )

**label: {}** - optional field if you want a label to correspond to the image sequence position

- `type` - determines if the label will be a text label or a icon label ( text | icon )

- `content` - what will the content of the label be, or the icon type.

**notes: []** - optional field which displays notes or annotations on the individual sequence. Will display only if user stops on the specific sequence.

- `pointer` - position of the annotation arrow. ( left | right | down | up )

- `headline` - the headline of the note.

- `subheadline` - Subheadline for the not

- `coords: ['val%','val%'] - positionering for the note, uses percentages (x and y)

- - - - - -

### Submodule Information ReadMe

Each object in the sequence array is one slide within a sequence of images.
