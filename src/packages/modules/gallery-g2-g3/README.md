This is the static manifest file for the Gallery, to be included in the Sony Global.

The gallery has three different modes: "Editorial" is a curated, masonic grid of products. "Detailed" is a more detailed grid layout that can be filtered and sorted, use infinite scrolling. The third is "compare", in which the products are displayed in large columns inside a carousel with sticky headers, filtering, sorting, and more.



# Document Overview

Each module will include this document, which contains an ordered list of the files required for the module. This manifest will be split into two sections - files in document HEAD & TAIL files (those loaded at the bottom of the file). While, CSS files will all be in the document HEAD, the two section convention will be followed for consistency. Paths should be relative to the base folder, where this file is. The CSS and JS files themselves should be un-minified development versions. Tasks like minification and SCSS compilation will be handled at build time by the platform team.

### DEPLOY HEAD files
* styles.css
* responsive.css
* all.css
* gallery-g2-g3.css
* responsive-modules.css

### DEPLOY TAIL files
* global scripts plus

### Source Jade files
* gallery-g2-g3.html.jade
* gallery-helpers.jade
* product.html.jade
* gallery-g3-accessories.jade
* gallery-filters.jade

### Source HEAD files

* styles.scss
* responsive.scss
* all.scss
* gallery-g2-g3.scss
* \_responsive-all.scss
* \_responsive-gallery-g2-g3.scss


### Source TAIL files

* bootstrap.js
* sony-iscroll.js
* jquery.imagesloaded.js
* jquery.infinitescroll.js
* jquery.throttle-debounce.js
* jquery.rAF.js
* iq.js
* sony-global-analytics.js
* sony-global-settings.js
* sony-global-utilities.js
* sony-global.js
* jodo.rangecontrol.1.4.js
* jquery.shuffle.js
* sony-evenheights.js
* sony-navigationdots.js
* sony-paddles.js
* sony-scroller.js
* sony-stickytabs.js
* sony-tab.js
* sony-gallery.js




## Example JSON Files
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

### JSON files

* default.json
* gallery-g2-g3-tv.json
* gallery-no-pricing.json
* camera-overflow.json

The `gallery-g3-accessories.html.jade` uses a different (but similar) json file.

* gallery-g3-accessories.json

#### The Gallery JSON object

For all galleries:

* The `mode` property of the `featured` object in the gallery's json file determines which type of gallery will be built. If it is `"editorial"`, the featured/curated will be built. If it is `"detailed"`, the detailed gallery will be built.
* The `name` property is used as a unique identifier for the gallery, so it should not be the same as any other `name` property of a gallery on the page.

For editorial/featured/curated galleries:

* `layout` determines the order and type of tiles that the gallery builds. They are predefined in the `gallery-helpers.jade` file.
* `Title`: Title text used for the header of the gallery
* `callout`: Text for the button below the gallery
* `href`: Link for the button below the gallery

For detailed galleries:

* `zeroProductsMessage`: the text displayed after the number zero when the filters result in zero products. e.g. `"results based on your request"`
* `startOver`: text displayed on the reset button when the filters result in zero products.
* `filterSet`: An array of filter objects. Each object in the filterSet should have a name, label, and type. name is how the filter is referenced, so it shouldn't have any spaces or dashes. Each gallery item (a product, rendered by `product.html.jade`) should also have a `"filterSet"` object which directly relates to the values in the gallery's filterSet.

```
"productCards" : {
    "_comments" : "name should be unique, as it is used for IDs",
    "name" : "camera-cards",
    "mode" : "detailed",
    "filterSet" : [
        {
            "name" : "colors",
            "label" : "Colors",
            "type" : {
                "color" : true
            },
            "filters" : [
                {
                    "label" : "Black",
                    "value" : "black"
                },
                {
                    "label" : "Yellow",
                    "value" : "yellow"
                },
                {
                    "label" : "Purple",
                    "value" : "purple"
                },
                {
                    "label" : "Teal",
                    "value" : "teal"
                },
                {
                    "label" : "White",
                    "value" : "white"
                },
                {
                    "label" : "Red",
                    "value" : "red"
                }
            ]
        },
        {...}
    ],
    "sortSet" : {...}
}
```
Above, we specified a `colors` filter. The product should therefore have a `colors` key in its `filterSet`. Values for filters can either be a single value, or an array of values. The javascript will know what to do depending on the data type you give it. The other key value pairs in this `filterSet` reference more filters that would be specified in the gallery's `filterSet`.

* `sortSet`: Similar to the `filterSet`, elements are sorted via the `sortSet` object seen below. The objects in the `sortSet` directly correspond to each product's `filterSet` (like the filters). This way we can avoid duplicate (or triplicate) data. The `reverse` key will sort from the opposite direction (reverse). _By default, low numbers are first (high)_. That is why the sort "Price (High - Low)" has `reverse` set to `true`.

```
"sortSet": [
    {
        "name": "default",
        "label": "Featured"
    },
    {
        "name": "price",
        "label": "Price - high to low",
        "reverse": true
    },
    {
        "name": "price",
        "label": "Price - low to high"
    },
    {
        "name": "popularity",
        "label": "Popularity"
    },
    {
        "name": "rating",
        "label": "Rating",
        "reverse": true
    },
    {
        "name": "release-date",
        "label": "New Products",
        "reverse": true
    }

]
```


* `compareable`: A list of labels and values for the compare tool. This may be rewritten with the new compare tool.
* `nextLink`: If a next link value is given, infinite scrolling will attempt to request that page and parse the `.gallery-item`s from it, and add them to the currently displayed ones. The example I'm using is `"gallery-single2.html"`. It must have a number in it for infinitescroll to recognize which page to request next.




## Submodule Information ReadMe
----------------------------

If this module supports submodules, a clear description should be included here that covers the logic behind which submodules are included, when and what other template variables affect them, etc.. This information will be used in the CMS interface to determine which fields to show and validate.

The Gallery uses the `product.html.jade` template as a submodule for each product tile. Each product tile's data comes from the .json file inside the product folder. Each JSON file in the product folder represents a single product.

For a product to be in a featured gallery, it must have a property in its JSON called `featured` and it must be `true`. The property that distinguishes between the featured products and featured accessories is the `type`. This `type` defaults to `product` if a type parameter is not set in the jade mixin - `featuredGallery()`.

For a product to show up in the detailed gallery, its `type` must match the given `type` parameter in `detailedGallery()` mixin. Also, it will be skipped if it has `promo: true`.

For a product to show up in the product strip tab, its `type` must match the given `type` parameter in `productStrips()` mixin, its `subtype` property must also match the `subtype` in the json data file. Up to 5 products will be displayed in the strip, after that, they don't get generated.


## Accessory Finder


## Recommended Tile


## Favorites


## Lastly
I am sorry you just inherited > 3000 lines of javascript, > 2800 lines of scss, and 1500 lines of jade for a single module. Can you say feature creep?