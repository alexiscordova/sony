<!-- 
	Here is your basic template setup, a div with a mode and a variation
	you should start with this and add more data attributes on your template inside 
	to fill out the content that you need. 

	For more info on Templating with Handlebars

	http://handlebarsjs.com/
-->

<div class="container-fluid module-spec">
	<section class="tables">
		<div class="spec-title">
			<p class="title-link"><a href="#">Vaio E</a></p>
			<h1>VAIO E Details</h1>
			
			<div class="clearfix">
				<p><a href="#">Specifications</a></p><p><a href="#">Features</a></p>
			</div>
		</div>
		
		<table class="bigTable">
			<thead>
				<tr>
					<th>&nbsp;</th>
					
					{{#each productTable}}
						<th><h2>{{this.productTitle}}</h2></th>
					{{/each}}
				</tr>
			</thead>
			
			<tbody>
				<tr>
					<th>Dimensions</th>
					{{#each productTable}}
					<td>{{#if this.productImage}}<div class="img-respons"><img src="img/spec/{{this.productImage}}"></div>{{/if}}

						<div class="table">
							<div class="tbody">
								{{#if this.dimensions.width}}
									<div class="row">
										<div class="column"><p>Width:</p></div>
										<div class="column"><p><span>{{this.dimensions.width}}</span></p></div>
									</div>
								{{/if}}
								
								{{#if this.dimensions.height}}
									<div class="row">
										<div class="column"><p>Height:</p></div>
										<div class="column"><p><span>{{this.dimensions.height}}</span></p></div>
									</div>
								{{/if}}
								
								{{#if this.dimensions.depth}}
									<div class="row">
										<div class="column"><p>Depth:</p></div>
										<div class="column"><p><span>{{this.dimensions.depth}}</span></p></div>
									</div>
								{{/if}}
								
								{{#if this.dimensions.weight}}
									<div class="row">
										<div class="column"><p>Weight:</p></div>
										<div class="column"><p><span>{{this.dimensions.weight}}</span></p></div>
									</div>
								{{/if}}
							</div>
						</div>

					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Display</th>
					{{#each productTable}}
					<td>
						<p>{{this.display}}</p>
						{{#if this.displayDescription}}
						<p><span>{{this.displayDescription}}</span></p>
						{{/if}}
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Processor</th>
					{{#each productTable}}
					<td>
						<p>{{this.processor}}</p>
						{{#if this.processorDescription}}
						<p><span>{{this.processorDescription}}</span></p>
						{{/if}}
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Operating System</th>
					{{#each productTable}}
					<td>
						<p>{{this.operatingSystem}}</p>
						{{#if this.operatingSystemNote}}
						<p><span>{{this.operatingSystemNote}}</span></p>
						{{/if}}
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Color Options</th>
					{{#each productTable}}
					<td><div class="clearfix">{{{this.colorOptions}}}</div></td>
					{{/each}}
				</tr>
				<tr>
					<th>Memory</th>
					{{#each productTable}}
					<td>
						<p>{{this.memory}}</p>
						{{#if this.memoryNote}}
						<p><span>{{this.memoryNote}}</span></p>
						{{/if}}
					</td>
					{{/each}}
				</tr>
				<tr>
					<th>Hard Drive</th>
					{{#each productTable}}
					<td>
						{{#if this.emphasisInfo}}
						<div class="emphasis-info">{{this.emphasisInfo}}</div>
						{{/if}}
						<p>{{this.hardDrive}}</p>
						{{#if this.hardDriveNote}}
						<p><span>{{this.hardDriveNote}}</span></p>
						{{/if}}
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Communications</th>
					{{#each productTable}}
					<td>
						{{#each this.communications}}
						<p>{{this}}</p>
						{{/each}}
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Hardware</th>
					
					{{#each productTable}}
					<td>
						{{#each this.hardware}}
						<p>{{this}}</p>
						{{/each}}
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Ports</th>
					{{#each productTable}}
					<td>
						<a class="btn" href="#">Enlarge</a>
						<p>
							<span>{{this.ports}}</span>
						</p>
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>Battery and Power</th>
					{{#each productTable}}
					<td>
						<p>{{this.batteryAndPower}}</p>
						{{#if this.batteryAndPowerDescription}}
						<p><span>{{this.batteryAndPowerDescription}}</span></p>
						{{/if}}
						
					</td>
					{{/each}}
				</tr>
				
				<tr>
					<th>In the Box</th>
					
					{{#each productTable}}
					<td>
						{{#each this.inTheBox}}
						<p>{{this}}</p>
						{{/each}}
					</td>
					{{/each}}
				</tr>
			</tbody>
		</table>
		
		{{#if computersFeatures}}
		<h2 class="h2-bigger">Features</h2>
		
		<div class="row-fluid no-border">
			<div class="span4">
				{{#if computersFeatures.a}}
				<h3>{{computersFeatures.a.title}}</h3>
				<p>{{computersFeatures.a.description}}</p>
				{{/if}}
			</div>
			
			<div class="span4">
				{{#if computersFeatures.b}}
				<h3>{{computersFeatures.b.title}}</h3>
				<p>{{computersFeatures.b.description}}</p>
				{{/if}}
			</div>
			
			<div class="span4">
				{{#if computersFeatures.c}}
				<h3>{{computersFeatures.c.title}}</h3>
				<p>{{computersFeatures.c.description}}</p>
				{{/if}}
			</div>
		</div>
		
		<div class="row-fluid no-border">
			<div class="span4">
				{{#if computersFeatures.d}}
				<h3>{{computersFeatures.d.title}}</h3>
				<p>{{computersFeatures.d.description}}</p>
				{{/if}}
			</div>
			
			<div class="span4">
				{{#if computersFeatures.e}}
				<h3>{{computersFeatures.e.title}}</h3>
				<p>{{computersFeatures.e.description}}</p>
				{{/if}}
			</div>
			
			<div class="span4">
				{{#if computersFeatures.f}}
				<h3>{{computersFeatures.f.title}}</h3>
				<p>{{computersFeatures.f.description}}</p>
				{{/if}}
			</div>
		</div>
		{{/if}}
	</section>
</div>