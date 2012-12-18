<!--
Here is your basic template setup, a div with a mode and a variation
you should start with this and add more data attributes on your template inside
to fill out the content that you need.

For more info on Templating with Handlebars

http://handlebarsjs.com/
-->

<div class="container module-spec">

	<section class="spec">
		<div class="clearfix">
			<div class="spec-title">
				<p class="title-link">
					<a href="#">Vaio Z</a>
				</p>
				<h1>VAIO E Details</h1>

				<div class="clearfix">
					<p>
						<a class="active" href="#">Specifications</a>
					</p>
					<p>
						<a href="#">Features</a>
					</p>
				</div>
			</div>

			<div class="sonyRecommends">
				<p>
					Sony recommends
				</p>
			</div>
		</div>
		
		<!-- <a href="#" id="button">test</a> -->

		<div class="tab-strip gallery-tabs">

			<div class="tableContainer clearfix">
				<table class="specsTable">
					<thead>
						<tr>
							<th>&nbsp;</th>

							{{#each productTable}}
							<th>{{#if this.productTitle}}<h2>{{this.productTitle}}</h2>{{/if}}
							{{#if this.productTitleDescription}}
							<p>
								{{this.productTitleDescription}}
							</p>{{/if}} </th>
							{{/each}}
						</tr>
					</thead>

					<tbody>

						<tr>
							<th>
								<div>
									<p>
										Processor
									</p>
								</div>
							</th>
							{{#each productTable}}

							<td class="intel7">
								<div>
									<p>{{this.processor}}</p>
									<p class="infoTitle">Configurable options</p>
									<ul>
										{{#each this.processorConfig}}
										<li>
											<p>
												{{this}}
											</p>
										</li>
										{{/each}}
									</ul>
								</div>
							</td>

							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
									<p>
										Operating System
									</p>
								</div>
							</th>
							{{#each productTable}}
							<td>
								<div>
									<p>
										{{{this.operatingSystem}}}
									</p> {{#if this.operatingSystemNote}}
									<p>
										<span>{{this.operatingSystemNote}}</span>
									</p> {{/if}}
								</div>
							</td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
									<p>
										Dimensions
									</p>
								</div>
							</th>
							{{#each productTable}}
							<td>
								<div>
								{{#if this.productImage}}
							<div class="img-respons center imgMarginBottom"><img class="iq-img" data-base="img/spec/" data-src="{{this.productImage}}">
								<noscript>
									<img src="img/spec/{{this.productImage}}">
								</noscript>
							</div>{{/if}}
							<table>
								<tbody>
									{{#if this.dimensions.width}}
									<tr>
										<td>
										<p>
											Width:
										</p></td>
										<td>
										<p>
											<span>{{this.dimensions.width}}</span>
										</p></td>
									</tr>
									{{/if}}

									{{#if this.dimensions.height}}
									<tr>
										<td>
										<p>
											Height:
										</p></td>
										<td>
										<p>
											<span>{{this.dimensions.height}}</span>
										</p></td>
									</tr>
									{{/if}}

									{{#if this.dimensions.depth}}
									<tr>
										<td>
										<p>
											Depth:
										</p></td>
										<td>
										<p>
											<span>{{this.dimensions.depth}}</span>
										</p></td>
									</tr>
									{{/if}}

									{{#if this.dimensions.weight}}
									<tr>
										<td>
										<p>
											Weight:
										</p></td>
										<td>
										<p>
											<span>{{this.dimensions.weight}}</span>
										</p></td>
									</tr>
									{{/if}}
								</tbody>
							</table>
							</div>
							</td>
							{{/each}}
						</tr>

						<tr>
							<th><div>
							<p>
								Display
							</p></div></th>
							{{#each productTable}}
							<td>
								<div>
									<p>
										{{this.display}}
									</p> {{#if this.displayDescription}}
									<p>
										<span>{{this.displayDescription}}</span>
									</p> {{/if}}
								</div>
							</td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
									<p>
										Color Options
									</p>
								</div>
							</th>
							{{#each productTable}}
							<td>
								<div>
									<div class="clearfix">
										{{{this.colorOptions}}}
									</div>
								</div>
							</td>
							{{/each}}
						</tr>
						<tr>
							<th>
								<div>
									<p>
										Memory
									</p>
								</div>
							</th>
							{{#each productTable}}
							<td>
								<div>
							<p>
								{{this.memory}}
							</p> {{#if this.memoryNote}}
							<p class="infoTitle">
								Configurable to:
							</p>
							<p>
								<span>{{this.memoryNote}}</span>
							</p> {{/if}}</div></td>
							{{/each}}
						</tr>
						<tr>
							<th><div>
							<p>
								Hard Drive
							</p>
							</div>
							</th>
							{{#each productTable}}
							<td><div> {{#if this.emphasisInfo}}
							<div class="clearfix">
								<div class="emphasis-info">
									{{this.emphasisInfo}}
								</div>
							</div> {{/if}}
							<p>
								{{this.hardDrive}}
							</p> {{#if this.hardDriveNote}}
							<p class="infoTitle">
								Configurable to:
							</p>
							<ul>
								{{#each this.hardDriveNote}}

								<li>
									<p>
										{{this}}
									</p>
								</li>

								{{/each}}
							</ul> {{/if}} </div></td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
									<p>
										Communications
									</p>
								</div>
							</th>
							{{#each productTable}}
							<td>
								<div>
									<ul>
										{{#each this.communications}}
										<li>
											<p>
												{{this}}
											</p>
										</li>
										{{/each}}
									</ul>
								</div>
							</td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
									<p>
										Hardware
									</p>
								</div>
							</th>

							{{#each productTable}}
							<td>
								<div>
									<ul>
										{{#each this.hardware}}
										<li>
											<p>
												{{this}}
											</p>
										</li>
										{{/each}}
									</ul>
								</div>
							</td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
								<p>
									Ports
								</p>
								</div>
							</th>
							{{#each productTable}}

							<td><div> {{#if this.portsImg}}
							<div class="img-respons imgMarginTop">
								<img class="iq-img" data-base="img/spec/" data-src="{{this.portsImg}}">
								<noscript>
									<img src="img/spec/{{this.portsImg}}">
								</noscript>
							</div> {{/if}}
							<p class="tableZoom">
								<a href="#myModal{{this.id}}" role="button" class="enlarge" data-toggle="modal">Enlarge</a>
							</p>
							<div id="myModal{{this.id}}" class="modal hide" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

								<div class="modal-body">
									{{#if this.productTitle}}<h2>{{this.productTitle}} - {{this.productTitleDescription}}</h2>{{/if}}

									{{#if this.portsBigImg}}
									<div class="img-respons"><img class="iq-img" data-base="img/spec/" data-src="{{this.portsBigImg}}">
										<noscript>
											<img src="img/spec/{{this.portsBigImg}}">
										</noscript>
									</div>
									{{/if}}
									<button class="close" data-dismiss="modal" aria-hidden="true">
										x
									</button>
								</div>
							</div>
							<ul>
								{{#each this.ports}}
								<li>
									<p>
										{{this}}
									</p>
								</li>
								{{/each}}
							</ul></div></td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
							<p>
								Battery and Power
							</p>
							</div>
							</th>
							{{#each productTable}}
							<td>
								<div>
							<p>
								{{this.batteryAndPower}}
							</p> {{#if this.batteryAndPowerDescription}}
							<p>
								<span>{{this.batteryAndPowerDescription}}</span>
							</p> {{/if}}

							{{#if this.batteryAndPowerSpec}}
							<ul>
								{{#each this.batteryAndPowerSpec}}
								<li>
									<p>
										{{this}}
									</p>
								</li>
								{{/each}}
							</ul> {{/if}}

							{{#if this.batterySettings}}
							<p class="infoTitle">
								Default settings:
							</p>
							<ul>
								{{#each this.batterySettings}}
								<li>
									<p>
										{{this}}
									</p>
								</li>
								{{/each}}
							</ul> {{/if}} </div></td>
							{{/each}}
						</tr>

						<tr>
							<th>
								<div>
									<p>
										In the Box
									</p>
								</div>
							</th>

							{{#each productTable}}
							<td>
								<div>
									<ul>
										{{#each this.inTheBox}}
										<li>
											<p>
												{{this}}
											</p>
										</li>
										{{/each}}
									</ul>
								</div>
							</td>
							{{/each}}
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		{{#if computersFeatures}}
		<h2 class="h2-bigger">Features</h2>

		<div class="grid no-border">
			<div class="span4">
				{{#if computersFeatures.a}}
				<h3>{{computersFeatures.a.title}}</h3>
				<p>
					{{computersFeatures.a.description}}
				</p>
				{{/if}}
			</div>

			<div class="span4">
				{{#if computersFeatures.b}}
				<h3>{{computersFeatures.b.title}}</h3>
				<p>
					{{computersFeatures.b.description}}
				</p>
				{{/if}}
			</div>

			<div class="span4">
				{{#if computersFeatures.c}}
				<h3>{{computersFeatures.c.title}}</h3>
				<p>
					{{computersFeatures.c.description}}
				</p>
				{{/if}}
			</div>
		</div>

		<div class="grid no-border">
			<div class="span4">
				{{#if computersFeatures.d}}
				<h3>{{computersFeatures.d.title}}</h3>
				<p>
					{{computersFeatures.d.description}}
				</p>
				{{/if}}
			</div>

			<div class="span4">
				{{#if computersFeatures.e}}
				<h3>{{computersFeatures.e.title}}</h3>
				<p>
					{{computersFeatures.e.description}}
				</p>
				{{/if}}
			</div>

			<div class="span4">
				{{#if computersFeatures.f}}
				<h3>{{computersFeatures.f.title}}</h3>
				<p>
					{{computersFeatures.f.description}}
				</p>
				{{/if}}
			</div>
		</div>
		{{/if}}
	</section>
</div>