# Feature Slideshow

The feature slideshow is a slideshow which fades between slides. It uses sony-fade.js which does nearly everything. Caption sizes are set dynamically with javascript because of the currently limited availability of flexbox. The backdrop image is optional. `crossfade`, `delay`, and `speed` can all set from the json configuration. The crossfade value is a number between zero and one. A crossfade of 1.0 means that both images will fade at the same time. A crossfade of zero means the previous slide will wait until the next slide has completely faded in before it fades out.


## Document Overview

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.


== Related Source ==

* feature-slideshow-b1-x00.jade
  * html/feature-slideshow-b1-x00.jade

* feature-slideshow-b1-x00.js
  * js/feature-slideshow-b1-x00.js

* feature-slideshow-b1-x00.scss
  * css/feature-slideshow-b1-x00.scss


### Example JSON File(s)


==JSON files==

* feature-slideshow-default.json
  * demo/data/feature-slideshow-default.json

* feature-slideshow-editorial.json
  * demo/data/feature-slideshow-editorial.json


### Submodule Information ReadMe

Each submodule is a slide. The slide should have a `caption` and `img` property. The `img` is a standard image object. The `caption` has a `stat` and a `description`.


