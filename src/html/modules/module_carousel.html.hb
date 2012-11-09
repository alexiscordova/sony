<div class="carousel" data-mode="{{mode}}">
	<div class="carousel-container">
	{{#each slides}}   
		<div class="carousel-slide" data-type="{{this.type}}">
			<img class="iq-img" src="{{this.imgSrc}}" alt="{{this.alt}}" title="{{this.title}}">
			<noscript>
				<img class="iq-img" src="{{this.imgSrc}}" alt="{{this.alt}}" title="{{this.title}}">
			</noscript>
		</div>
	{{/each}}
	</div>
</div>
