# Story Sequence

_Batch 2 Nurun custom module_

## Description
The story sequence module provides a image based sequence of assets triggered by an automatic timer. The user clicks a CTA which starts the timer, shown as a dial. When the timer expires, the image sequence animates. At the end of the sequence, optional title and copy are shown. The the dial timer is started again.

## Dependencies
* jQuery
* Modernizr
* [SonySequence](../../common/js/secondary/sony-img-sequence.js)
* [Timer](../../common/js/secondary/sony-timer.js)
* [Viewport](../../common/js/secondary/sony-viewport.js)
* [Dial](../../common/js/secondary/sony-dial.js)

## Source Files
The source files required for this module.

* [story-sequence-b2-x00.jade](html/story-sequence-b2-x00.jade)
* [story-sequence-b2-x00.js](js/story-sequence-b2-x00.js)
* [index.js](js/index.js)
* [story-sequence-b2-x00.scss](css/story-sequence-b2-x00.scss)
* [_responsive-story-sequence-b2-x00.scss](css/_responsive-story-sequence-b2-x00.scss)

## JSON

* `backdrop` : a background image for the module. Will be present at all times.
* `title` : title for the module before the user clicks the call to action.
* `cta` : call to action text.
* `img` : an image object for the cover (before the user clicks the CTA).
* `sequence` : an array of sequence items.
  * `stop` : if present, indicates that the sequence should stop here.
  * `coords` : an array of positions for the copy. The first is the `left` value and the second is the `top` value.
  * `align` : optional. Because positioning elements with left/top doesn't work well when the goal is center, bottom, or right alignment, this option is provided. It should be one of: `"center"`, `"right"`, `"bottom"`, or `"bottom-right"`.
  * `textAlign` : optional. text alignment for the copy. It should be one of: `"center"`, `"right"`, or `"left"`.
  * `title` : optional. title for the copy.
  * `body` : optional. body copy.
  * `image` : required. The image object that will be used in the image sequence

