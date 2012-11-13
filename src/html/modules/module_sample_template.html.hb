
<!-- 
	Here is your basic template setup, a div with a mode and a variation
	you should start with this and add more data attributes on your template inside 
	to fill out the content that you need. 

	For more info on Templating with Handlebars

	http://handlebarsjs.com/
-->
<div class="" data-mode="{{}}" data-variation="{{}}">

	<!-- sample handlebars template -->
	{{#each results}}   
		<div class="carousel-slide iq-img" data-type="{{this.templateVariation}}" data-src="{{this.backgroundImg}}">
			<h1>{{this.headline}}</h1>
			<p>{{this.copyblock}}</p>
			<button>{{this.ctaButton}}</button>
		</div>
	{{/each}}


</div>