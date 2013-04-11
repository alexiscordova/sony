==Description==
The Editorial module is a very flexible catch-all layout module. It is used to group titles text and links together with submodules or images.

==Configuration==

mode:
* full            - submodule is full width text is above
* full inner      - submodule is full width text is overlayed 
* medialeft       - submodule is on the left text is on the right
* mediaright      - submodule is on the right text is on the left
* textonly        - there's no submodule just text
* tout            - consists of 1, 2, or 3 lockups of images and text (images are not treated the same as sub-modules in this case)

layout: defines the main layout columns
  * name          - used just to define the layout, optional, probably not needed
  * text          - which column the text goes into (right | left | center | full) 
  * alignment     - text alignment within the column (left | right | center)
  * columns       - array of the column breakdown for 12 column grid in order from left to right ie: [5,7] span5 on left span7 on right -or- [1,10,1] span10 in the middle of the page 
  * columnoffset  - used in touts for column layouts such as 1,3,7,1 or 1,5,5,1 where the first 1 column is skipped, should equal columns[0]
  * orientation   - (horizontal | vertical) used for 2 up touts stacked vertically (image on top) or horizontally (image on left of text)

variation         - could hold more variation options in the future for now its just background... 
  background      - used to define backgorund of the whole module only option is "gray" or leave it undefined

style: additional classes that define if it has a dark or light text box or if the text is dark or light, etc

title: optional title text of the main text block

subtitle: optional subtitle text of the main text block

body: optional body text of the main text block

link: optional link of type button (btn) or text (txt)

submodules: full, full-inner, medialeft, and mediaright require exactly 1 sub modules that load into itself - not supported in tout or textonly mode
  * type - path to jade template starting with the module directory (ie module-package-name/**/*.jade NOT packages/modules/module-package-name/**/*.jade)
  * data - path to json file starting from the src directory (ie pages/data/*.json -OR- packages/modules/module-package-name/demo/data/*.json)

columns : tout mode requires columns to define the image, title, body and link for each lockup (* touts don't support subtitle)
