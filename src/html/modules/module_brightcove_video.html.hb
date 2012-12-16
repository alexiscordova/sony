{{#each video}}
<div class="row-fluid">
	<div class="span10 offset1">
		<h2>{{this.title}}</h2>
		<div id="{{this.target-div.id}}" class="{{this.target-div.class}}" data-media='{{this.target-div.data-media}}'>
			<img src="{{this.poster.src}}" alt="{{this.poster.alt}}" class="video-poster {{this.poster.class}}" >
		</div>
		<button type="button" data-target="{{this.target-div.id}}" class="btn btn-primary {{this.buttons.action-button.class}}" >
			{{this.buttons.action-button.label}}
		</button>
		<button type="button" class="btn btn-primary {{this.buttons.pause.class}}" >
			{{this.buttons.pause.label}}
		</button>
		<button type="button" class="btn btn-primary {{this.buttons.play.class}}" >
			{{this.buttons.play.label}}
		</button>
	</div>
</div>
{{/each}}
<!--
Start of Brightcove Player
Should be include once
-->
<script src="http://admin.brightcove.com/js/BrightcoveExperiences.js"></script>
<script >
    // Brightcove code

    var modVP;
    var modExp;
    var modCon;
    var previousVideoID = 0;
    var currentVideo;
    //videos we will swap

    function myTemplateLoaded(experienceID) {
        player = brightcove.api.getExperience(experienceID);
        modVP = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
        modExp = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
        modCon = player.getModule(brightcove.api.modules.APIModules.CONTENT);
        modExp.addEventListener(brightcove.api.events.ExperienceEvent.TEMPLATE_READY, onTemplateReady);
        //console.log("myTemplateLoaded");
    }

    function onTemplateReady(evt) {
        modVP.addEventListener(brightcove.api.events.MediaEvent.BEGIN, videoStart);
        modVP.addEventListener(brightcove.api.events.MediaEvent.CHANGE, onMediaEventFired);
        modVP.addEventListener(brightcove.api.events.MediaEvent.COMPLETE, onMediaEventFired);
        modVP.addEventListener(brightcove.api.events.MediaEvent.ERROR, onMediaEventFired);
        modVP.addEventListener(brightcove.api.events.MediaEvent.PLAY, onMediaEventFired);
        modVP.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, onMediaProgressFired);
        modVP.addEventListener(brightcove.api.events.MediaEvent.STOP, onMediaEventFired);
        //console.log("onTemplateReady");
    }

    function playVideo() {
        modVP.play();
    }

    function pauseVideo() {
        modVP.pause();
    }

    function onMediaEventFired(evt) {
        /* console.log("MEDIA EVENT: " + evt.type + " fired at position: " + evt.position);*/
    }

    function onMediaProgressFired(evt) {
        /* console.log("CURRENT POSITION: " + evt.position);*/
    }

    function videoStart(evt) {
        /* console.log("MEDIA EVENT: " + evt.type + " fired at position: " + evt.position);*/
    }


    $(document).ready(function() {

        $(".action-video").activateBrightcove();

        $(".btn-play").click(function(e) {
            e.preventDefault();
            playVideo();
        });

        $(".btn-pause").click(function(e) {
            e.preventDefault();
            pauseVideo();
        });

    }); 
</script>

<!-- End of Brightcove Player -->

<div id="log" style="float: left">
	<div id="positionLog"></div>
	<div id="eventLog"></div>
</div>
