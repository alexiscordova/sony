{{#each video}}
	<div id="{{this.target-div.id}}" class="{{this.target-div.class}}" data-media='{{this.target-div.data-media}}'>
		<img src="{{this.poster.src}}" alt="{{this.poster.alt}}" class="video-poster {{this.poster.class}}" >
	</div>
	<button type="button" data-target="{{this.target-div.id}}" class="btn btn-primary {{this.buttons.action-button.class}}" >{{this.buttons.action-button.label}}</button>
	<button type="button" class="btn btn-primary {{this.buttons.pause.class}}" >{{this.buttons.pause.label}}</button>
	<button type="button" class="btn btn-primary {{this.buttons.play.class}}" >{{this.buttons.play.label}}</button>
{{/each}} 