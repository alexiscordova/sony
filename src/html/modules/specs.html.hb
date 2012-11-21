
<!-- 
	Here is your basic template setup, a div with a mode and a variation
	you should start with this and add more data attributes on your template inside 
	to fill out the content that you need. 

	For more info on Templating with Handlebars

	http://handlebarsjs.com/
-->

{{#each camera}}

{{#if this.productName}}
<h1>{{this.productName}}</h1>
{{/if}}

<section class="details">
	<div class="row-fluid">
		{{#if this.box}}
		<div class="span4">
			<h2>What's in the Box</h2>
			<ul>
			{{#each this.box}}
				<li>{{this}}</li>
			{{/each}}
			</ul>
		</div>
		{{/if}}
		
		<div class="span4">
			<h2>Size and Weight</h2>
			<table>
				{{#if this.dimension}}
				<tr>
					<th><h3>Dimension:</h3></th>
					<td><p>{{this.dimension}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.weight}}
				<tr>
					<th><h3>Weight:</h3></th>
					<td><p>{{this.weight}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	
	{{#if this.lens}}
	<h2>Optics/Lens</h2>
	<div class="row-fluid">
		<div class="span4">
			
			<table>
				{{#if this.lens.type}}
				<tr>
					<th><h3>Lens Type:</h3></th>
					<td><p>{{this.lens.type}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.lens.aperture}}
				<tr>
					<th><h3>Aperture:</h3></th>
					<td><p>{{this.lens.aperture}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.lens.opticalZoom}}
				<tr>
					<th><h3>Optical Zoom:</h3></th>
					<td><p>{{this.lens.opticalZoom}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.lens.digitalZoom}}
				<tr>
					<th><h3>Digital Zoom:</h3></th>
					<td><p>{{this.lens.digitalZoom}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.lens.focalLength}}
				<tr>
					<th><h3>Focal Length:</h3></th>
					<td><p>{{this.lens.focalLength}}</p></td>
				</tr>
				{{/if}}
			
				{{#if this.lens.lensConstruction}}
				<tr>
					<th><h3>Lens Construction:</h3></th>
					<td><p>{{this.lens.lensConstruction}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.lens.apertureBlade}}
				<tr>
					<th><h3>Aperture Blade:</h3></th>
					<td><p>{{this.lens.apertureBlade}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.lens.clearImageZoom}}
				<tr>
					<th><h3>Clear image Zoom:</h3></th>
					<td><p>{{this.lens.clearImageZoom}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>

		<div class="span4">
			<table>
				{{#if this.lens.focalDistance}}
				<tr>
					<th><h3>Focal Distance:</h3></th>
					<td><p>{{this.lens.focalDistance}}</p></td>
				</tr>
				{{/if}}
			
				{{#if this.lens.steadyShotModes}}
				<tr>
					<th><h3>Steady Shot Modes:</h3></th>
					<td><p>{{this.lens.steadyShotModes}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.exposure}}
	<h2>Exposure System</h2>
	<div class="row-fluid">
		<div class="span4">
			
			<table>
				{{#if this.exposure.meteringModes}}
				<tr>
					<th><h3>Metering Modes:</h3></th>
					<td><p>{{this.exposure.meteringModes}}</p></td>
				</tr>
				{{/if}}
			
				{{#if this.exposure.exposureConpensation}}
				<tr>
					<th><h3>exposure Conpensation:</h3></th>
					<td><p>{{this.exposure.exposureConpensation}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.exposure.sceneMode}}
				<tr>
					<th><h3>Scene mode:</h3></th>
					<td><p>{{this.exposure.sceneMode}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.exposure.rangeOptimizer}}
				<tr>
					<th><h3>D-Range Optimizer:</h3></th>
					<td><p>{{this.exposure.rangeOptimizer}}</p></td>
				</tr>
				{{/if}}
			
				{{#if this.exposure.creativeStyle}}
				<tr>
					<th><h3>Creative Style:</h3></th>
					<td><p>{{this.exposure.creativeStyle}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.exposure.whiteBalanceMode}}
				<tr>
					<th><h3>White Balance Mode:</h3></th>
					<td><p>{{this.exposure.whiteBalanceMode}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>

		<div class="span4">
			<table>
				{{#if this.exposure.isoSensitivity}}
				<tr>
					<th><h3>ISO Sensitivity (Movie):</h3></th>
					<td><p>{{this.exposure.isoSensitivity}}</p></td>
				</tr>
				{{/if}}
			
				{{#if this.exposure.pictureEffect}}
				<tr>
					<th><h3>Picture Effect:</h3></th>
					<td><p>{{this.exposure.pictureEffect}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	
	{{#if this.sensor}}
	<h2>Imaging Sensor</h2>
	<div class="row-fluid">
		<div class="span4">
			
			<table>
				{{#if this.sensor.imagingSensor}}
				<tr>
					<th><h3>Imaging Sensor:</h3></th>
					<td><p>{{this.sensor.imagingSensor}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.sensor.pixelGross}}
				<tr>
					<th><h3>Pixel Gross:</h3></th>
					<td><p>{{this.sensor.pixelGross}}</p></td>
				</tr>
				{{/if}}
			
				{{#if this.sensor.creativeStyle}}
				<tr>
					<th><h3>Picture Resolution:</h3></th>
					<td><p>{{this.sensor.pictureResolution}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	
	{{#if this.lcdDisplay}}
	<h2>LCD Display</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.lcdDisplay.type}}
				<tr>
					<th><h3>LCD Type:</h3></th>
					<td><p>{{this.lcdDisplay.type}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.lcdDisplay.brightness}}
				<tr>
					<th><h3>Brightness Control:</h3></th>
					<td><p>{{this.lcdDisplay.brightness}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	
	{{#if this.driveSystem}}
	<h2>Drive System</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.driveSystem.shutterType}}
				<tr>
					<th><h3>Shutter Type:</h3></th>
					<td><p>{{this.driveSystem.shutterType}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.driveSystem.shootingSpeed}}
				<tr>
					<th><h3>Shooting Speed:</h3></th>
					<td><p>{{this.driveSystem.shootingSpeed}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.driveSystem.selfTimer}}
				<tr>
					<th><h3>Self-timer:</h3></th>
					<td><p>{{this.driveSystem.selfTimer}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.advancedFeatures}}
	<h2>Advanced Features</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.advancedFeatures.sweepPanorama}}
				<tr>
					<th><h3>Sweep Panorama:</h3></th>
					<td><p>{{this.advancedFeatures.sweepPanorama}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.advancedFeatures.faceDetection}}
				<tr>
					<th><h3>Face Detection:</h3></th>
					<td><p>{{this.advancedFeatures.faceDetection}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.advancedFeatures.imageStabilization}}
				<tr>
					<th><h3>Image Stabilization:</h3></th>
					<td><p>{{this.advancedFeatures.imageStabilization}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.advancedFeatures.intelligentAuto}}
				<tr>
					<th><h3>Intelligent Auto:</h3></th>
					<td><p>{{this.advancedFeatures.intelligentAuto}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.advancedFeatures.superiorAuto}}
				<tr>
					<th><h3>Superior Auto:</h3></th>
					<td><p>{{this.advancedFeatures.superiorAuto}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.advancedFeatures.PhotoCreativity}}
				<tr>
					<th><h3>Photo Creativity:</h3></th>
					<td><p>{{this.advancedFeatures.PhotoCreativity}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.Recording}}
	<h2>Recording</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.Recording.mediaType}}
				<tr>
					<th><h3>Media Type:</h3></th>
					<td><p>{{this.Recording.mediaType}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.Recording.imageMode}}
				<tr>
					<th><h3>Still Image Mode:</h3></th>
					<td><p>{{this.Recording.imageMode}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.Recording.imageSize169}}
				<tr>
					<th><h3>Still Image Size 16:9:</h3></th>
					<td><p>{{this.Recording.imageSize169}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.Recording.imageSize32}}
				<tr>
					<th><h3>Still Image Size 3:2:</h3></th>
					<td><p>{{this.Recording.imageSize32}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.Recording.imageSize43}}
				<tr>
					<th><h3>Still Image Size 4:3:</h3></th>
					<td><p>{{this.Recording.imageSize43}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.Recording.videoFormat}}
				<tr>
					<th><h3>Video Format:</h3></th>
					<td><p>{{this.Recording.videoFormat}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.Recording.panoramaImageSize}}
				<tr>
					<th><h3>Panorama Image Size:</h3></th>
					<td><p>{{this.Recording.panoramaImageSize}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.Recording.videoMode}}
				<tr>
					<th><h3>Video Mode:</h3></th>
					<td><p>{{this.Recording.videoMode}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.Recording.photoCapture}}
				<tr>
					<th><h3>Photo Capture (Movie):</h3></th>
					<td><p>{{this.Recording.photoCapture}}</p></td>
				</tr>
				{{/if}}
				
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.focusControl}}
	<h2>Focus Control</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.focusControl.focusSystem}}
				<tr>
					<th><h3>Focus System:</h3></th>
					<td><p>{{this.focusControl.focusSystem}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.focusControl.afModes}}
				<tr>
					<th><h3>AF Modes:</h3></th>
					<td><p>{{this.focusControl.afModes}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.power}}
	<h2>Power</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.power.batteryType}}
				<tr>
					<th><h3>Battery Type:</h3></th>
					<td><p>{{this.power.batteryType}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.power.powerConsumption}}
				<tr>
					<th><h3>Power Consumption:</h3></th>
					<td><p>{{this.power.powerConsumption}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.interface}}
	<h2>Interface</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.interface.memoryCardSlot}}
				<tr>
					<th><h3>Memory Card Slot:</h3></th>
					<td><p>{{this.interface.memoryCardSlot}}</p></td>
				</tr>
				{{/if}}
				
				{{#if this.interface.hdOutput}}
				<tr>
					<th><h3>HD Output:</h3></th>
					<td><p>{{this.interface.hdOutput}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
		
		<div class="span4">
			<table>
				{{#if this.interface.usbPorts}}
				<tr>
					<th><h3>USB Port(s):</h3></th>
					<td><p>{{this.interface.usbPorts}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.convenienceFeatures}}
	<h2>Convenience Features</h2>
	<div class="row-fluid">
		<div class="span4">
			<table>
				{{#if this.convenienceFeatures.imagePlayback}}
				<tr>
					<th><h3>Still Image Playback:</h3></th>
					<td><p>{{this.convenienceFeatures.imagePlayback}}</p></td>
				</tr>
				{{/if}}
			</table>
		</div>
	</div>
	{{/if}}
	
	{{#if this.features}}
	<h2>Features</h2>
	
	<div class="row-fluid">
		<div class="span4">
			{{#if this.features.a}}
			<h3>{{this.features.a.title}}</h3>
			<p>{{this.features.a.description}}</p>
			{{/if}}
		</div>
		
		<div class="span4">
			{{#if this.features.b}}
			<h3>{{this.features.b.title}}</h3>
			<p>{{this.features.b.description}}</p>
			{{/if}}
		</div>
		
		<div class="span4">
			{{#if this.features.c}}
			<h3>{{this.features.c.title}}</h3>
			<p>{{this.features.c.description}}</p>
			{{/if}}
		</div>
	</div>
	
	<div class="row-fluid">
		<div class="span4">
			{{#if this.features.d}}
			<h3>{{this.features.d.title}}</h3>
			<p>{{this.features.d.description}}</p>
			{{/if}}
		</div>
		
		<div class="span4">
			{{#if this.features.e}}
			<h3>{{this.features.e.title}}</h3>
			<p>{{this.features.e.description}}</p>
			{{/if}}
		</div>
		
		<div class="span4">
			{{#if this.features.f}}
			<h3>{{this.features.f.title}}</h3>
			<p>{{this.features.f.description}}</p>
			{{/if}}
		</div>
	</div>
	{{/if}}
	
</section>
{{/each}}





<section class="tables">
	<h2>Tables</h2>
	
	<table class="bigTable">
		<thead>
			<tr>
				<th>&nbsp;</th>
				
				{{#each computer}}
					<th><h2>{{this.computerName}}</h2></th>
				{{/each}}
			</tr>
		</thead>
		
		<tbody>
			<tr>
				<th>Dimensions</th>
				{{#each computer}}
				<td>{{#if this.computerImage}}<img src="img/spec/{{this.computerImage}}">{{/if}}
					<ul>
						{{#if this.dimensions.width}}
						<li>Width: <span>{{this.dimensions.width}}</span></li>
						{{/if}}
						
						{{#if this.dimensions.height}}
						<li>Height: <span>{{this.dimensions.height}}</span></li>
						{{/if}}
						
						{{#if this.dimensions.depth}}
						<li>Depth: <span>{{this.dimensions.depth}}</span></li>
						{{/if}}
						
						{{#if this.dimensions.weight}}
						<li>Weight: <span>{{this.dimensions.weight}}</span></li>
						{{/if}}
					</ul>
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Display</th>
				{{#each computer}}
				<td>
					<p>{{this.display}}</p>
					{{#if this.displayDescription}}
					<span>{{this.displayDescription}}</span>
					{{/if}}
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Processor</th>
				{{#each computer}}
				<td>
					<p>{{this.processor}}</p>
					{{#if this.processorDescription}}
					<span>{{this.processorDescription}}</span>
					{{/if}}
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Operating System</th>
				{{#each computer}}
				<td>
					<p>{{this.operatingSystem}}</p>
					{{#if this.operatingSystemNote}}
					<span>{{this.operatingSystemNote}}</span>
					{{/if}}
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Color Options</th>
				{{#each computer}}
				<td>{{{this.colorOptions}}}</td>
				{{/each}}
			</tr>
			<tr>
				<th>Memory</th>
				{{#each computer}}
				<td>
					<p>{{this.memory}}</p>
					{{#if this.memoryNote}}
					<span>{{this.memoryNote}}</span>
					{{/if}}
				</td>
				{{/each}}
			</tr>
			<tr>
				<th>Hard Drive</th>
				{{#each computer}}
				<td>
					<p>{{this.hardDrive}}</p>
					{{#if this.hardDriveNote}}
					<span>{{this.hardDriveNote}}</span>
					{{/if}}
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Communications</th>
				{{#each computer}}
				<td>
					{{#each this.communications}}
					<p>{{this}}</p>
					{{/each}}
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Hardware</th>
				
				{{#each computer}}
				<td>
					{{#each this.hardware}}
					<p>{{this}}</p>
					{{/each}}
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Ports</th>
				{{#each computer}}
				<td>
					<button><span>Enlarge</span></button>
					<p>
						<span>{{this.ports}}</span>
					</p>
				</td>
				{{/each}}
			</tr>
			
			<tr>
				<th>Battery and Power</th>
				{{#each computer}}
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
				
				{{#each computer}}
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
	<h2>Features</h2>
	
	<div class="row-fluid">
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
	
	<div class="row-fluid">
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