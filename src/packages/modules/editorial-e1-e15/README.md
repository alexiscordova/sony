==Description==
The Editorial module is a very flexible catch-all layout module. It is used to group headlines and text together with other modules.

==Configuration==






//TODO: UPDATE THIS (copied from the primary tout)

mode:
* default P1, P2 - primary tout standard - Most basic mode with text in one block with the option for right or left positioning
* homepage P1 - Specific to the homepage, slightly different layout with the h1 separate from the text block
* product-intro-plate D3 - This has a video and or gallery button that loads in a submodule, mainly used on PDP's 
* title-plate D7 - simple photo and text header that is shorter than the default p1 and generally used on gallery pages

layout: defines the main layout columns
  * text - which column the text goes into (right | left | center)
  * alignment - text alignment within the column (left | right | center)
  * mobilealign - (top | bottom) some configs define the text locking to the top or bottom of the container in mobile
  * columns - array of the column breakdown for 12 column grid in order from left to right ie: [5,7] span5 on left span7 on right -or- [1,10,1] span10 in the middle of the page 

theme: some configurations define an optional global theme color ie (themePurple | themeGreen) some text, buttons, and icons pick up this color

style: additional classes that define if it has a dark or light text box or if the text is dark or light, etc

variation: optional variation parameters get picked up for certain modes
  *example- headertext: (smaller | larger) - makes the header text a h2 or h1

image: defines the image src and attrubutes (see image module)

eyebrow: optional text that comes before the h1 headline (often the product category or model)

headline: optional h1 headline of the main text block

body: optional body text of the main text block

links: supports 0 or more links of type button (btn) or text (txt) possibly more options for video or gallery icons

submodules: supports 0 or more sub modules that load into itself (functionality pending not available on 'home-page' mode)