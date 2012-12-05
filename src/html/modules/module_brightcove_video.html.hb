{{#each video}}
	<div id="{{this.target-div.id}}" class="{{this.target-div.class}}" data-media='{{this.target-div.data-media}}'>
		<img src="{{this.poster.src}}" alt="{{this.poster.alt}}" class="video-poster {{this.poster.class}}" >
	</div>
	<a href="#{{this.target-div.id}}" class="{{this.buttons.action-button.class}}">{{this.buttons.action-button.label}}</a>
	<a href="#" class="{{this.buttons.pause.class}}">{{this.buttons.pause.label}}</a>
	<a href="#" class="{{this.buttons.play.class}}">{{this.buttons.play.label}}</a>
{{/each}}