<div class="carousel" data-mode="{{mode}}" data-variation="{{variation}}">
	<div class="carousel-container">

		{{#each slides}}   
			<div class="carousel-slide iq-img" data-type="{{this.templateVariation}}" data-src="{{this.backgroundImg}}">
				
				<!-- Slide Headline -->	
				{{#if this.headline}}
					<h1>{{this.headline}}</h1>
				{{/if}}

				<!-- Slide Copyblock -->
				{{#if this.copyBlock}}
					<p>{{this.copyblock}}</p>
				{{/if}}

				{{#if this.ctaButton}}
					<button>this.ctaButton</button>
				{{/if}}

			</div>
		{{/each}}

	</div>
</div>




<!-- 
	

	Helper methods to figure out slide type?



	One Sony Module (Full) v.1 background image , story headline, story copyblock , 
	
{
	"templateVariation" : "1",
	"headLine" : "Sony Camera Pictogram Contest",
	"copyblock" : "Lorem ipsum delot and more...",
	"ctaButton" : "Enter To Win",
	"backgroundImg" : "images/PATH_TO_BACKGROUND.jpg"
}
 -->