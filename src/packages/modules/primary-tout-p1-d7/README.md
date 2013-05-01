#Overview
The primary tout is a large header section with text over a full-bleed image, generally the first thing on the page. It has a few variations and layout options, in some cases it is just text, in others it can load a video or gallery into itself. 

##Configuration 

**mode:**  
*default P1, P2, p3* - primary tout standard - Most basic mode with text in one block with the option for right or left positioning  
*homepage P1* - Specific to the homepage, slightly different layout with the h1 separate from the text block  
*product-intro-plate D3* - This has a video and or gallery button that loads in a submodule, mainly used on PDP's   
*title-plate D7* - simple photo and text header that is shorter than the default p1 and generally used on gallery pages  

**layout:** defines the main layout columns  
*text* - which column the text goes into (right | left | center)  
*alignment* - text alignment within the column (left | right | center)  
*valign* - (top | bottom | middle)
*columns* - array of the column breakdown for 12 column grid in order from left to right ie: [5,7] span5 on left span7 on right -or- [1,10,1] span10 in the middle of the page  

**theme:** some configurations define an optional global theme color ie (themePurple | themeGreen) some text, buttons, and icons pick up this color  

**style:** additional classes that define if it has a dark or light text box or if the text is dark or light, etc 

**variation:** optional variation parameters get picked up for certain modes
*headertext* - (undefined | smaller) - if smaller it uses t2 class for headline instead of h1
*mobilebg* - (undefined | true) - forces background box - always contrasts the text color so if style is dark-text-trans-box it goes light-box in mobile, light-text-trans-box = dark-box
*quote* - (undefined | true) - makes the text a quote style on the homepage  
*secondbox* - (undefined | true) - uses the second box style for the homepage design  
*substyle* - (required if secondbox is true) style for the second box
*backgroundstyle* - (undefined | full-bleed | solid-color) - only for d7 variations, bg can be full bleed (cover), a solid color, or defaults to a set size (auto not cover)
*headline* - (undefined | true) - for p1, p2, p3 if this is defined true there will be no background box and the type padding will follow custom layout rules

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
