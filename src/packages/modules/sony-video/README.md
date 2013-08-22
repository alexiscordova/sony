### Sony Video


Overview:
----------------------------------
The Sony Video player module is based on Flowplayer Unlimited 5.4.1, it has been modified to fit the requirements of cross browser compatibility as outlined in the technical spec. Out of the box there was not complete support nor UI capabilities that were required by design and/or compatibility requirements. Using Scene 7 as the content provider we established early on that the only format that seemed to support an adaptive bitrate was coming back as an MP4. Using that browsers that could support the MP4 format via HTML5 recieved that version of the player, leading with HTML5 first, with a Flash fallback. For compatibility with Playstation another custom fallback was created to support video playback on that device because Flowplayer's Flash version requirement is Flash 10.1 and Playstation's latest system update only supports a version of Flash Player 9. No plugins were used or implemented at the time of development. Since the Flowplayer was heavily modified to suit the device compatibility additional plugins and addon support is unknown without further development.

Usage:
----------------------------------
As a submodule, usage should be fairly straightforward. The sony-video module is to be included as a submodule when video is required, and fed an appropriate JSON file as can be seen in the debug/sony-video-layouts.html or as included as a submodule in another module. i.e. editorial-videos-e3-layouts.html. These are good starting points to familiarize yourself with how this works. The actual JADE that includes the Flowplayer markup is in jade-helpers.jade.



== DEPLOY HEAD files ==

* styles.css
	*../../../../build/deploy/css/responsive.css

* styles.css
	*../../../../build/deploy/css/responsive.css
	
* responsive.css
	*../../../../build/deploy/css/responsive.css
	
* all.css
	*../../../../build/deploy/css/modules/all.css
	
* sony-video.css
	*../../../../build/deploy/css/modules/sony-video.css

* responsive.css
	*../../../../build/deploy/css/responsive-modules.css	
== DEPLOY TAIL files ==

* jquery.min.js
	*http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js

* modernizr-2.6.2.min.js
	*../../../../build/deploy/js/libs/modernizr-2.6.2.min.js

* plugins.min.js
	*../../../../build/deploy/js/plugins.min.js

* require.min.js
	*../../../../build/deploy/js/require.min.js
	
* secondary.min.js
	*../../../../build/deploy/js/secondary.min.js

* defer.min.js
	*../../../../build/deploy/js/defer.min.js
	
== Related Source ==

* sony-video.js
	*../../../js/bundle/defer/sony-video.js

* sony-video.scss
	*../../../css/modules/sony-video.scss

* _responsive-sony-video.scss
	*../../../css/_responsive/_responsive-sony-video.scss
	
Example JSON File(s)
--------------------

Each module should contain atleast one example JSON file. Additional JSON files that cover the template variables that could be populated in the module (even though some variations may not use all of them) will also be listed here.

==JSON files==

* full-bleed-no-poster.json
    *../../data/sony-video/full-bleed-no-poster.json

* full-bleed-video.json
    *../../data/sony-video/full-bleed-video.json

* standard-video.json
    *../../data/sony-video/standard-video.json
















