<!-- 
	Here is your basic template setup, a div with a mode and a variation
	you should start with this and add more data attributes on your template inside 
	to fill out the content that you need. 

	For more info on Templating with Handlebars

	http://handlebarsjs.com/
-->

<div class="container-fluid module-spec">
	{{#each productDetails}}
	
	<div class="spec-title">
		<p class="title-link"><a href="#">{{this.productName}}</a></p>
		{{#if this.productName}}
		<h1>{{this.productName}} Details</h1>
		{{/if}}
		
		<div class="clearfix">
			<p><a href="#">Specifications</a></p><p><a href="#">Features</a></p>
		</div>
	</div>
	
	<section class="details">
		<div class="row-fluid">
			{{#if this.infos}}
			<div class="span4">
				<h2>What's in the Box</h2>
				<ul>
				{{#each this.infos}}
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
			
			{{#if this.lens.rows1}}
			<div class="span4">
				<table>
					{{#if this.lens.rows1.lensType}}
					<tr>
						<th><h3>Lens Type:</h3></th>
						<td><p>{{lens.rows1.lensType}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.lensMountType}}
					<tr>
						<th><h3>Lens Mount Type:</h3></th>
						<td><p>{{lens.rows1.lensMountType}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.aperture}}
					<tr>
						<th><h3>Aperture:</h3></th>
						<td><p>{{lens.rows1.aperture}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.apertureMax}}
					<tr>
						<th><h3>Aperture (Max.):</h3></th>
						<td><p>{{lens.rows1.apertureMax}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.apertureMin}}
					<tr>
						<th><h3>Aperture (Min.):</h3></th>
						<td><p>{{lens.rows1.apertureMin}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.focalLength}}
					<tr>
						<th><h3>Focal Length:</h3></th>
						<td><p>{{lens.rows1.focalLength}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.shotMode}}
					<tr>
						<th><h3>Steady Shot Mode:</h3></th>
						<td><p>{{lens.rows1.shotMode}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.opticalZoom}}
					<tr>
						<th><h3>Optical Zoom:</h3></th>
						<td><p>{{lens.rows1.opticalZoom}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows1.digitalZoom}}
					<tr>
						<th><h3>Digital Zoom:</h3></th>
						<td><p>{{lens.rows1.digitalZoom}}</p></td>
					</tr>
					{{/if}}
				</table>
			</div>
			{{/if}}
			
			{{#if this.lens.rows2}}
			<div class="span4">
				<table>
					{{#if this.lens.rows2.focalLength}}
					<tr>
						<th><h3>Focal Length:</h3></th>
						<td><p>{{lens.rows2.focalLength}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.filterDiameter}}
					<tr>
						<th><h3>Filter Diameter:</h3></th>
						<td><p>{{lens.rows2.filterDiameter}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.lensGroup}}
					<tr>
						<th><h3>Lens Groups- Elements:</h3></th>
						<td><p>{{lens.rows2.lensGroup}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.minimumFocus}}
					<tr>
						<th><h3>Minimum Focus Distance:</h3></th>
						<td><p>{{lens.rows2.minimumFocus}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.angleOfView}}
					<tr>
						<th><h3>Angle of View:</h3></th>
						<td><p>{{lens.rows2.angleOfView}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.lensConstruction}}
					<tr>
						<th><h3>Lens Construction:</h3></th>
						<td><p>{{lens.rows2.lensConstruction}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.apertureBlade}}
					<tr>
						<th><h3>Aperture Blade:</h3></th>
						<td><p>{{lens.rows2.apertureBlade}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows2.clearImageZoom}}
					<tr>
						<th><h3>Clear Image Zoom: </h3></th>
						<td><p>{{lens.rows2.clearImageZoom}}</p></td>
					</tr>
					{{/if}}
				</table>
			</div>
			{{/if}}
			
			{{#if this.lens.rows3}}
			<div class="span4">
				<table>
					{{#if this.lens.rows3.focalDistance}}
					<tr>
						<th><h3>Focal Distance:</h3></th>
						<td><p>{{lens.rows3.focalDistance}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows3.asphericElements}}
					<tr>
						<th><h3>Aspheric Elements:</h3></th>
						<td><p>{{lens.rows3.asphericElements}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows3.distanceEncoder}}
					<tr>
						<th><h3>Distance Encoder:</h3></th>
						<td><p>{{lens.rows3.distanceEncoder}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows3.exteriorFinish}}
					<tr>
						<th><h3>Exterior Finish:</h3></th>
						<td><p>{{lens.rows3.exteriorFinish}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows3.internalMotor}}
					<tr>
						<th><h3>Internal Motor:</h3></th>
						<td><p>{{lens.rows3.internalMotor}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows3.maximumMagnification}}
					<tr>
						<th><h3>Maximum Magnification:</h3></th>
						<td><p>{{lens.rows3.maximumMagnification}}</p></td>
					</tr>
					{{/if}}
					{{#if this.lens.rows3.steadyShotMode}}
					<tr>
						<th><h3>Steady Shot Mode:</h3></th>
						<td><p>{{lens.rows3.steadyShotMode}}</p></td>
					</tr>
					{{/if}}
				</table>
			</div>
			{{/if}}

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
			<div class="span3">
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
			
			<div class="span3">
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
		<h2 class="h2-bigger">Features</h2>
		
		<div class="row-fluid no-border">
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
		
		<div class="row-fluid no-border">
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
</div>