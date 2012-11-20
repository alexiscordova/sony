
<!-- 
	Here is your basic template setup, a div with a mode and a variation
	you should start with this and add more data attributes on your template inside 
	to fill out the content that you need. 

	For more info on Templating with Handlebars

	http://handlebarsjs.com/
-->

	{{#each computers}}   
		<p>{{this.computerName}}</p>
		<p>{{this.dimensions}}</p>
	{{/each}}

		<section class="details">
			<div class="row-fluid">
				<div class="span4">
					<h2>What's in the Box</h2>
					<ul>
						<li>Battery NP-BX1</li>
						<li>Wrist Strap</li>
						<li>AC Adaptor AC-UD11</li>
						<li>Shoulder Strap Adaptor</li>
						<li>Micro USB cable</li>
						<li>Instruction Manual</li>
					</ul>
				</div>
				
				<div class="span4">
					<h2>Size and Weight</h2>
					<table>
						<tr>
							<th><h3>Dimension:</h3></th>
							<td><p>4" x 2.4" x 1.4" (10.16 x 5.81 x 3.59cm)</p></td>
						</tr>
						
						<tr>
							<th><h3>Weight:</h3></th>
							<td><p>7.5 ounces (213g)</p></td>
						</tr>
					</table>
				</div>
			</div>
			
			<h2>Optics/Lens</h2>
			<div class="row-fluid">
				<div class="span4">
					
					<table>
						<tr>
							<th><h3>LensType:</h3></th>
							<td><p>Carl Zeiss Vario-Sonnar T</p></td>
						</tr>
						
						<tr>
							<th><h3>Aperture:</h3></th>
							<td><p>F1.8-4.9</p></td>
						</tr>
						
						<tr>
							<th><h3>Optical Zoom:</h3></th>
							<td><p>3.6x</p></td>
						</tr>
						
						<tr>
							<th><h3>Digital Zoom:</h3></th>
							<td><p>20M(14x) / 10M(20x) / 5M(28x) / VGA(54x)</p></td>
						</tr>
					</table>
				</div>
				
				<div class="span4">
					<table>
						<tr>
							<th><h3>Focal Length:</h3></th>
							<td><p>16:9 29-105mm / 4:3 30-108mm / 3:2 28-100mm / 11:36-127mm</p></td>
						</tr>
						
						<tr>
							<th><h3>Lens Construction:</h3></th>
							<td><p>7 elements in 6 groups (incl. AA lens)</p></td>
						</tr>
						
						<tr>
							<th><h3>Aperture Blade:</h3></th>
							<td><p>Irish diaphragm (7 blades)</p></td>
						</tr>
						
						<tr>
							<th><h3>Clear image Zoom:</h3></th>
							<td><p>7.2x</p></td>
						</tr>
					</table>
				</div>

				<div class="span4">
					<table>
						<tr>
							<th><h3>Focal Distance:</h3></th>
							<td><p>AF approx 5cm to infinity (W), approx: 55cm to infinity (T)</p></td>
						</tr>
						
						<tr>
							<th><h3>Steady Shot Modes:</h3></th>
							<td><p>[Still image] Optical [Movie] Active Mode, Optical type with electronic compensation (Anti-rolling)</p></td>
						</tr>
						
					</table>
				</div>
			</div>
			
			
			<h2>Exposure System</h2>
			<div class="row-fluid">
				<div class="span4">
					
					<table>
						<tr>
							<th><h3>Metering Modes:</h3></th>
							<td><p>Multi segment / center weighted</p></td>
						</tr>
						
						<tr>
							<th><h3>exposure Conpensation:</h3></th>
							<td><p>+/-3.0EV, 1/3EV step</p></td>
						</tr>
						
						<tr>
							<th><h3>Scene mode:</h3></th>
							<td><p>Portrait, Anti Motion Blur, Sports Action, Pet, Gourmet, Macro, Landscape, Sunset, Night, Scene, Hand-held Twilight, Night Portrait, Fireworks, High Sensitivy</p></td>
						</tr>
						
					</table>
				</div>
				
				<div class="span4">
					<table>
						<tr>
							<th><h3>D-Range Optimizer:</h3></th>
							<td><p>Off, Dynamic Range Optimizer (Auto/Level), Auto High Dynamic Range: Exposure difference level (1.0-5.0EV, 1.0-EV step)</p></td>
						</tr>
						
						<tr>
							<th><h3>Creative Style:</h3></th>
							<td><p>Standard, Vivid, Portrait, Landscape, Sunset, Black &apm; White</p></td>
						</tr>
						
						<tr>
							<th><h3>White Balance Mode:</h3></th>
							<td><p>Auto/Daylight/Shade/Cloudy/Incandescent/Fluor (Warm White)/Fluor (Cool White)</p></td>
						</tr>
					</table>
				</div>

				<div class="span4">
					<table>
						<tr>
							<th><h3>ISO Sensitivity (Movie):</h3></th>
							<td><p>Auto (ISO125-3200 equivalent, selectable with upper/lower limit), 125/200/400/800/1600/3200</p></td>
						</tr>
						
						<tr>
							<th><h3>Picture Effect:</h3></th>
							<td><p>Toy Camera, Pop Color, Posterization, Retro Photo, Soft High-key, Partial Color, High Contrast Monochrome, Soft Focus, HDR Painting, Rich-tone Monochrome, Miniature, Watercolor.</p></td>
						</tr>
						
					</table>
				</div>
			</div>
		</section>
	
		<section class="tables">
			<h2>Tables</h2>
			
			<table class="bigTable">
				<thead>
					<tr>
						<th>&nbsp;</th>
						<th><h2>11.6”</h2></th>
						<th><h2>14”</h2></th>
						<th><h2>14” Premium</h2></th>
						<th><h2>15.5” Premium</h2></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>Dimensions</th>
						<td><img src="img/spec/S_15_Black.png">
							<ul>
								<li>Width: <span>11.42”</span></li>
								<li>Height: <span>8.02”</span></li>
								<li>Depth: <span>0.93-1.25”</span></li>
								<li>Weight: <span>4.97 lbs</span></li>
							</ul>
						</td>
						
						<td><img src="img/spec/S_15_White.png">
							<ul>
								<li>Width: <span>13.55”</span></li>
								<li>Height: <span>9.60”</span></li>
								<li>Depth: <span>1.00-1.32”</span></li>
								<li>Weight: <span>5.30 lbs</span></li>
							</ul>
						</td>
						
						<td><img src="img/spec/S_15_Black.png">
							<ul>
								<li>Width: <span>13.43”</span></li>
								<li>Height: <span>9.65”</span></li>
								<li>Depth: <span>0.86-1.32”</span></li>
								<li>Weight: <span>5.08 lbs</span></li>
							</ul>
						</td>
						
						<td><img src="img/spec/S_15_Black.png">
							<ul>
								<li>Width: <span>14.43”</span></li>
								<li>Height: <span>9.99”</span></li>
								<li>Depth: <span>1.00-1.39”</span></li>
								<li>Weight: <span>5.97 lbs</span></li>
							</ul>
						</td>
					</tr>
					
					<tr>
						<th>Display</th>
						<td><p>11.6" LED backlite display (1366 x 768)</p></td>
						<td><p>14" LED backlite display (1366 x 768)</p></td>
						<td><p>14" LED backlite display (1600 x 900)</p></td>
						<td><p>14" LED backlite display (1366 x 768)</p></td>
					</tr>
					
					<tr>
						<th>Processor</th>
						<td>AMD® E2-1800 dual-core processor (1.70GHz3)</td>
						<td><p>Intel® Pentium® B970(2.30GHz3)</p>
							<span>
								configurable Options:
								2nd gen Intel® Core™
								i3-2370M
								(2.40GHz3)
								2nd gen Intel® Core™
								i5-2450M
								(2.50GHz / 3.10GHz3 with
								Turbo Boost10)
							</span>
						</td>
						<td><p>3rd gen Intel® Core™ i3-3110M (2.40GHz3)</p>
							<span>
								configurable Options:
								3rd gen Intel® Core™ i5-3210M
								(2.50GHz / 3.10GHz3 with
								Turbo Boost10)
								3rd gen Intel® Core™ i5-3320M
								(2.60GHz / 3.30GHz3 with
								Turbo Boost10)
								3rd gen Intel® Core™
								i7-3612QM quad-core (2.10GHz
								/ 3.10GHz3 with Turbo
								Boost10)
							</span>
						</td>
						<td><p>Intel® Pentium® B970 (2.30GHz3)</p>
							<span>
								configurable Options:
								2nd gen Intel® Core™
								i3-2370M 2.40GHz3)
								2nd gen Intel® Core™
								i5-2450M (2.50GHz / 3.10GHz3
								with Turbo Boost10)
								3rd gen Intel® Core™ i5-3210M
								(2.50GHz / 3.10GHz3 with
								Turbo Boost10)
								3rd gen Intel® Core™
								i7-3612QM quad-core (2.10GHz
								/ 3.10GHz3 with Turbo
								Boost10)
							</span>
						</td>
					</tr>
					
					<tr>
						<th>Operating System</th>
						<td><p>Windows® 7 Home Premium 64-bit</p></td>
						<td><p>Windows® 7 Home Premium 64-bit</p></td>
						<td><p>Windows® 7 Home Premium 64-bit</p></td>
						<td><p>Windows® 7 Home Premium 64-bit</p></td>
					</tr>
					
					<tr>
						<th>Color Options</th>
						<td><span class="color white"></span></td>
						<td><span class="color grey"></span><span class="color white"></span></td>
						<td><span class="color grey"></span><span class="color white"></span><span class="color black"></span></td>
						<td><span class="color white"></span><span class="color grey"></span><span class="color darkGrey"></span><span class="color black"></span></td>
					</tr>
					<tr>
						<th>Memory</th>
						<td><p>4GB (4GB x1) DDR3-1333MHz</p></td>
						<td><p>4GB (4GB x1) DDR3-1333MHz</p> <span>Configurable to 6GB or 8GB</span></td>
						<td><p>4GB (4GB x1) DDR3-1600MHz</p> <span>Configurable to 6GB, 8GB, 16GB</span></td>
						<td><p>4GB (4GB x1) DDR3-1333MHz</p> <span>Configurable to 6GB, 8GB</span></td>
					</tr>
					<tr>
						<th>Hard Drive</th>
						<td><p>500GB (5400rpm) hard drive</p></td>
						<td><p>320GB (5400rpm) hard drive</p><span>Configurable to 500 GB, 640GB or 750 GB</span></td>
						<td><p>500GB (5400rpm) hard drive</p>
							
							<span>Configurable Options: 640GB (7200rpm)
							750GB (7200rpm)
							1TB (5400rpm)
							256GB (256GB x1) solid state
							drive
							512GB (512GB x1) solid state
							drive</span>
						</td>
						<td><p>320GB (5400rpm) hard drive</p> <span>Configurable to 500 GB, 640GB or 750 GB</span></td>
					</tr>
					
					<tr>
						<th>Communications</th>
						<td><p>Wi-Fi® wireless networking (802.11b/g/n)
							1000BASE-T/100BASE-TX/10BASE-T Gigabit Ethernet LAN
							Bluetooth® (4.0 + HS)</p>
						</td>
						
						<td><p>Wi-Fi® wireless networking (802.11b/g/n)
							1000BASE-T/100BASE-TX/10BASE-T Gigabit Ethernet LAN
							Bluetooth® (4.0 + HS)</p>
						</td>
						
						<td><p>Wi-Fi® wireless networking (802.11b/g/n)
							1000BASE-T/100BASE-TX/10BASE-T Gigabit Ethernet LAN
							Bluetooth® (4.0 + HS)</p>
						</td>
						
						<td><p>Wi-Fi® wireless networking (802.11b/g/n)
							1000BASE-T/100BASE-TX/10BASE-T Gigabit Ethernet LAN
							Bluetooth® (4.0 + HS)</p>
						</td>
					</tr>
					
					<tr>
						<th>Hardware</th>
						<td>
							<p>Backlit QWERTY keyboard, 82 keys with 1.7mm stroke and 19.05mm pitch
								Clickable touchpad (gesture supported)
								Built-in 1.3MP HD web camera powered by Exmor® for PC and microphone
								VAIO, WEB and ASSIST buttons
							</p>
						</td>
						
						<td>
							<p>Backlit QWERTY keyboard, 82 keys with 1.7mm stroke and 19.05mm pitch
								Clickable touchpad (gesture supported)
								Built-in 1.3MP HD web camera powered by Exmor® for PC and microphone
								VAIO, WEB and ASSIST buttons
							</p>
						</td>
						
						<td>
							<p>Backlit QWERTY keyboard, 82 keys with 1.7mm stroke and 19.05mm pitch
								Clickable touchpad (gesture supported)
								Built-in 1.3MP HD web camera powered by Exmor® for PC and microphone
								VAIO, WEB and ASSIST buttons
							</p>
						</td>
						
						<td>
							<p>Backlit QWERTY keyboard, 82 keys with 1.7mm stroke and 19.05mm pitch
								Clickable touchpad (gesture supported)
								Built-in 1.3MP HD web camera powered by Exmor® for PC and microphone
								VAIO, WEB and ASSIST buttons
							</p>
						</td>
					</tr>
					
					<tr>
						<th>Ports</th>
						<td>
							<span>
								Gigabit Ethernet (RJ-45)
								HDMI® output
								Headphone output
								Microphone input
								USB 2.0 x2
								USB 3.0 x1 (charging)
								VGA output
							</span>
						</td>
						
						<td>
							<span>
								Gigabit Ethernet (RJ-45)
								HDMI® output
								Headphone output
								Microphone input
								USB 2.0 x3
								USB 3.0 x1 (charging)
								VGA output
							</span>
						</td>
						
						<td>
							<span>
								Gigabit Ethernet (RJ-45)
								HDMI® output
								Headphone output
								Microphone input
								USB 2.0 x2
								USB 3.0 x2 (1 charging)
								VGA output
							</span>
						</td>
						
						<td>
							<span>
								Gigabit Ethernet (RJ-45)
								HDMI® output
								Headphone output
								Microphone input
								USB 2.0 x3
								USB 3.0 x1 (charging)
								VGA output
							</span>
						</td>
					</tr>
					
					<tr>
						<th>Battery and Power</th>
						<td>
							<p>Up to 5 hours 30 minutes</p>
							<span>
								Estimated battery life with standard battery (3500mAh, included)
								Estimated battery life with large battery (5000mAh, sold
								separately)
								Default Settings: Up to 6 hours 15 minutes
							</span>
						</td>
						
						<td>
							<p>Up to 5 hours 30 minutes</p>
							<span>
								Estimated battery life with standard battery (3500mAh, included)
								Estimated battery life with large battery (5000mAh, sold
								separately)
								Default Settings: Up to 6 hours 15 minutes
							</span>
						</td>
						
						<td>
							<p>Up to 5 hours 30 minutes</p>
							<span>
								Estimated battery life with standard battery (3500mAh, included)
								Estimated battery life with large battery (5000mAh, sold
								separately)
								Default Settings: Up to 6 hours 15 minutes
							</span>
						</td>
						
						<td>
							<p>Up to 5 hours 30 minutes</p>
							<span>
								Estimated battery life with standard battery (3500mAh, included)
								Estimated battery life with large battery (5000mAh, sold
								separately)
								Default Settings: Up to 6 hours 15 minutes
							</span>
						</td>
					</tr>
					
					<tr>
						<th>In the Box</th>
						<td>
							<p>Standard lithium-ion battery (5300mAh)
								AC adapter
								Power cord
							</p>
						</td>
						
						<td>
							<p>Standard lithium-ion battery (5300mAh)
								AC adapter
								Power cord
							</p>
						</td>
						
						<td>
							<p>Standard lithium-ion battery (5300mAh)
								AC adapter
								Power cord
							</p>
						</td>
						
						<td>
							<p>Standard lithium-ion battery (5300mAh)
								AC adapter
								Power cord
							</p>
						</td>
					</tr>
				</tbody>
			</table>
			
			
			<h2>Features</h2>
			
			<div class="row-fluid">
				<div class="span4">
					<h3>Lorem ipsum title 1</h3>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porttitor velit non leo volutpat elementum. Nunc ornare magna et metus eleifend gravida eu id tellus. Integer sit amet sapien ligula. Phasellus viverra nisl sapien, in convallis nunc. Ut eu diam purus. Donec nunc mi, ullamcorper laoreet ornare in, eleifend quis enim. Sed at augue justo, vitae faucibus ipsum. In ac fringilla eros. Duis dictum, enim imperdiet pretium posuere, eros tortor aliquet nunc, id fermentum lorem nisi ut nibh. Morbi consectetur, velit eget elementum sollicitudin, velit justo congue lacus, ut tempor tellus lorem ut leo. Aenean pharetra venenatis odio, nec tincidunt tellus cursus ac. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin sit amet malesuada sapien.</p>
				</div>
				
				<div class="span4">
					<h3>Lorem ipsum title 2</h3>
					<p>Proin congue dignissim augue, at tempus ligula euismod quis. Suspendisse laoreet interdum nibh ac consequat. Phasellus at risus ligula. Duis sollicitudin placerat ante sit amet auctor. Duis nec leo elit, ac dapibus nunc. Phasellus bibendum, nunc eget rhoncus viverra, felis libero fringilla eros, sit amet sodales nisi purus vel elit. Donec nunc augue, cursus id laoreet a, pellentesque sit amet urna. Quisque venenatis feugiat diam, a condimentum sapien vestibulum et. Maecenas sed magna enim, nec rhoncus lorem. Duis ultrices, risus in commodo vestibulum, sapien risus imperdiet libero, sit amet mollis eros lorem eu nisl. Morbi vel imperdiet urna. Maecenas eget lacus vel enim bibendum elementum et sed orci.</p>
				</div>
				
				<div class="span4">
					<h3>Lorem ipsum title 2</h3>
					<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur imperdiet, justo eget dapibus feugiat, felis dui euismod eros, at mollis mauris mi eget erat. Sed pretium, enim at mattis laoreet, turpis nulla iaculis lacus, a rhoncus nisi diam et tortor. Nunc semper sapien vitae arcu mattis sed dictum augue malesuada. Quisque nec urna arcu, non pharetra dolor. Sed augue augue, vestibulum eget sagittis eu, fringilla vel velit. Pellentesque feugiat fermentum metus, ut lobortis dui auctor id.</p>
				</div>
			</div>
			
			<div class="row-fluid">
				<div class="span4">
					<h3>Lorem ipsum title 1</h3>
					<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porttitor velit non leo volutpat elementum. Nunc ornare magna et metus eleifend gravida eu id tellus. Integer sit amet sapien ligula. Phasellus viverra nisl sapien, in convallis nunc. Ut eu diam purus. Donec nunc mi, ullamcorper laoreet ornare in, eleifend quis enim. Sed at augue justo, vitae faucibus ipsum. In ac fringilla eros. Duis dictum, enim imperdiet pretium posuere, eros tortor aliquet nunc, id fermentum lorem nisi ut nibh. Morbi consectetur, velit eget elementum sollicitudin, velit justo congue lacus, ut tempor tellus lorem ut leo. Aenean pharetra venenatis odio, nec tincidunt tellus cursus ac. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin sit amet malesuada sapien.</p>
				</div>
				
				<div class="span4">
					<h3>Lorem ipsum title 2</h3>
					<p>Proin congue dignissim augue, at tempus ligula euismod quis. Suspendisse laoreet interdum nibh ac consequat. Phasellus at risus ligula. Duis sollicitudin placerat ante sit amet auctor. Duis nec leo elit, ac dapibus nunc. Phasellus bibendum, nunc eget rhoncus viverra, felis libero fringilla eros, sit amet sodales nisi purus vel elit. Donec nunc augue, cursus id laoreet a, pellentesque sit amet urna. Quisque venenatis feugiat diam, a condimentum sapien vestibulum et. Maecenas sed magna enim, nec rhoncus lorem. Duis ultrices, risus in commodo vestibulum, sapien risus imperdiet libero, sit amet mollis eros lorem eu nisl. Morbi vel imperdiet urna. Maecenas eget lacus vel enim bibendum elementum et sed orci.</p>
				</div>
				
				<div class="span4">
					<h3>Lorem ipsum title 2</h3>
					<p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Curabitur imperdiet, justo eget dapibus feugiat, felis dui euismod eros, at mollis mauris mi eget erat. Sed pretium, enim at mattis laoreet, turpis nulla iaculis lacus, a rhoncus nisi diam et tortor. Nunc semper sapien vitae arcu mattis sed dictum augue malesuada. Quisque nec urna arcu, non pharetra dolor. Sed augue augue, vestibulum eget sagittis eu, fringilla vel velit. Pellentesque feugiat fermentum metus, ut lobortis dui auctor id.</p>
				</div>
			</div>
		</section>
