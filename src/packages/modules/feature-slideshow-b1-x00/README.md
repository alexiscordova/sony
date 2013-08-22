# Feature Slideshow

_Batch 1 Nurun custom module_

The feature slideshow is a slideshow which fades between slides. It uses sony-fade.js which does nearly everything. Caption sizes are set dynamically with javascript because of the currently limited availability of flexbox.


## Dependencies
* jQuery
* Modernizr
* Sony Environment
* [Fade](../../common/js/secondary/sony-fade.js)

## Source Files
The source files required for this module.

* [feature-slideshow-b1-x00.jade](html/feature-slideshow-b1-x00.jade)
* [feature-slideshow-b1-x00.js](js/feature-slideshow-b1-x00.js)
* [index.js](js/index.js)
* [feature-slideshow-b1-x00.scss](css/feature-slideshow-b1-x00.scss)
* [_responsive-feature-slideshow-b1-x00.scss](css/_responsive-feature-slideshow-b1-x00.scss)


## JSON

### Example files(s)

* [feature-slideshow-default.json](demo/data/feature-slideshow-default.json)
* [feature-slideshow-editorial.json](demo/data/feature-slideshow-editorial.json)

### JSON Properties

* `mode` : Either `"slideshow"` or `"editorial"`. Slideshows have the title and body copy on top of the slideshow while the editorial mode places the copy above the carousel.
* `crossfade` : Optional. A number between zero and one. A crossfade of 1.0 means that both images will fade at the same time. A crossfade of zero means the previous slide will wait until the next slide has completely faded in before it fades out.
* `backdrop` : Optional. A background image for the module. Will be present at all times.
* `speed` : Optional. Transition duration for the slides (length of the fading).
* `style` : Box and copy colors. Can have the same values as E1s.
* `title` : The title for the module. Visible at all times.
* `body` : The body copy for the module. Visible at all times.

### Submodule Information ReadMe

Each submodule is a slide. The slide should have a `caption` and `img` property. The `img` is a standard image object. The `caption` has a `stat` and a `description`.


