# Overview
The editorial chapter module is a generic container module which  is often used as a parent container for editorial layouts such as E1, and E6 modules. The editorial chapter modules contain various configurable options which set styles for the navigational tabs. 


## Configuration

### id
===========
An optional field which contains a unique id. If the field is left empty it will disable ability for hot-linking to specific chapter tabs. 


### nav_mode
===========
Is a required field which is used to set global configureable for the chapter navigation style and UI.

* *thumb*          - Global setting used to set the navigational tabs to contain an graphical image to the left of each label.
* *icon*           - Global setting used to set the navigational tabs to contain an icon to the left of each label.
* *text*           - Global setting used to set the navigational tabs to use no graphic or icon, and only displays the label for each tab.


### nav_shade
===========
Is an required field for the coloring and styling of the chapter navigation. Two options would be ```white / gray```


### nav_location
===========
*now deprecated* field which determined if the chapter navigation would be placed above the chapter slides or on the bottom of the chapter slides. 

### contains_hotspots
===========
Optional boolean field which is required only if a submodules with hotspots will be included inside this nodules. Tells jade templates to add specific classes to accommodate the ability for a submodule to include hotpot functionality. Two options can be set to ```true / false```


## submodules
===========
Is an array object ```[{ },{ }]``` which contains the core data for each individual tab being used on for the chapter module. Each item contains a set of configurable items that define the styling, and data architecture.

* *type*          - This defines what module markup to use per the slide. It's important to make sure that the type will be able to populate the data accurately. For example, if type is set tot he following: ```type: editorial-layouts-e1.jade``` it will be able to populate generic content module data.
* *data*          - Defines the data module that will be used on the specific slide. 
* *icon*          - _Optional Setting_ If the global chapter's nav_mode is set to `icon` than this is a mandatory setting. Contains a string for the type of icon to be used for the navigation tab. For a list of icons see: [global styling - icons](http://sandbox.odopod.com/sony-style-guide/doku.php?id=development:globalstyling#icons)
* *thumb*         - _Optional Setting_ If the global chapter's nav_mode is set to `thumb` than this is a mandatory setting. Contains an object of image paths for the graphical images used next to the label for individual navigational tabs.
* *label*         - The label for the navigational tab. 
