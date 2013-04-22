#Overview
The primary tout is a large header section with text over a full-bleed image, generally the first thing on the page. It has a few variations and layout options, in some cases it is just text, in others it can load a video or gallery into itself. 

##Data model

```
#!json

{
    "mode": "default",
    "layout": {
        "text": "left",
        "alignment": "left",
        "columns": [8, 4]
    },
    "style": "dark-text-trans-box",
    "variation": {
        "headertext": "larger"
    },
    "image": {
        "background": "true",
        "srcDesktop": "img/primary-tout-p1-d7/primary-tout-01-desktop.jpg",
        "srcDesktopHighRes": "img/primary-tout-p1-d7/primary-tout-01-desktop@2x.jpg",
        "srcTablet": "img/primary-tout-p1-d7/primary-tout-01-tablet.jpg",
        "srcTabletHighRes": "img/primary-tout-p1-d7/primary-tout-01-tablet@2x.jpg",
        "srcPhone": "img/primary-tout-p1-d7/primary-tout-01-phone.jpg",
        "srcPhoneHighRes": "img/primary-tout-p1-d7/primary-tout-01-phone@2x.jpg",
        "noscriptsrc": "img/primarytout/primary-tout-01-desktop.jpg",
        "alt": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    },
    "headline": "Take beautiful pictures",
    "body": "Body copy atum zzril delenit augue duis dolore te feugait nulla facilisi. ",
    "links": [
        {
            "type": "video",
            "text": "Play Video",
            "url": "#",
            "submodule": 0
        }
    ],
    "submodules": [
        {
            "type": "image/html/image.jade",
            "data": "packages/modules/primary-tout-p1-d7/demo/data/video-placeholder.json"
        }
    ]
}

```

##Description 

The primary tout is a large header section with text over a full-bleed image, generally the first thing on the page. It has a few variations and layout options, in some cases it is just text, in others it can load a video or gallery into itself.

##Configuration 

**mode:**  
*default P1, P2* - primary tout standard - Most basic mode with text in one block with the option for right or left positioning  
*homepage P1* - Specific to the homepage, slightly different layout with the h1 separate from the text block  
*product-intro-plate D3* - This has a video and or gallery button that loads in a submodule, mainly used on PDP's   
*title-plate D7* - simple photo and text header that is shorter than the default p1 and generally used on gallery pages  

**layout:** defines the main layout columns  
*text* - which column the text goes into (right | left | center)  
*alignment* - text alignment within the column (left | right | center)  
*mobilealign* - (top | bottom) some configs define the text locking to the top or bottom of the container in mobile  
*columns* - array of the column breakdown for 12 column grid in order from left to right ie: [5,7] span5 on left span7 on right -or- [1,10,1] span10 in the middle of the page  

**theme:** some configurations define an optional global theme color ie (themePurple | themeGreen) some text, buttons, and icons pick up this color  

**style:** additional classes that define if it has a dark or light text box or if the text is dark or light, etc  

**variation:** optional variation parameters get picked up for certain modes  
*headertext* - (undefined | smaller | larger) - makes the header a t1 for larger and a t3 for smaller undefined is t2  
*mobilealign* - (top | bottom) - makes the text panel align top or bottom in phone layout  
*quote* - (undefined | true) - makes the text a quote style on the homepage  
*secondbox* - (undefined | true) - uses the second box style for the homepage design  
*substyle* - (required if secondbox is true) style for the second box  

**image:** defines the image src and attrubutes (see image module)

**eyebrow:** optional text that comes before the h1 headline (often the product category or model)  
*text* - (required) plain text (optional plusbox inline using [+] string will be replaced at render time with the appropriate symbol markup)  
*link* - (undefined | url) url for a link src  

**headline:** optional h1 headline of the main text block  

**quote:** optional headline quote text (requires setting quote = true in variation settings)  
**byline:** attribute for the quote text (requires setting quote = true in variation settings)  

**body:** optional body text of the main text block  

**links:** supports 0 or more links  
*type* - (btn | text | video | carousel) - the type of button / icon / style  
*text* - the text for the button  
*url* - link  
*submodule* - index number (0 based) of the submodule to show for product intro plates that have nested submodules that showup when a link is clicked  

**submodules:** supports 0 or more sub modules that load into itself (only for product-intro-plate or default mode)
