<!DOCTYPE html>
<!--[if lt IE8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs_head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs_nav.html'}}

			<!-- Subhead
			================================================== -->
			<header class="jumbotron subhead" id="overview">
			  <div class="container">
			    <h2 class="bs-docs-heading">Scaffolding</h2>
			    <p class="p1">The system is built on responsive 12-column grids, layouts, and components, with 2 primary left &amp; right margins.</p>
			  </div>
			</header>
			
			<div class="main">	
			

			        <!-- Content and grid (wrappers)
			        ================================================== -->
			        <section id="contentWrappers">

			          <div class="container">
			          	<h2 class="bs-docs-heading">Root-level page structure</h2>

				        	<h3 class="bs-docs-heading">Page structure overview</h3>
				          <p>The "main" section of the page is 100% wide with no margins or padding.</p>

				          <div class="docs-page-structure-page">
				          	<div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>	
				          	<div class="docs-page-structure-main"><pre class="prettyprint">&lt;div id="main" /&gt;</pre></div>	
				          	<div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div>				          	
				          </div>


				          <h3 class="bs-docs-heading">"Main" content structure</h3>
				          <p>Directly inside of "main" are the major <code>.container</code> sections of the page, each its own 'row' of content. All "root-level" modules should always be wrapped in one of these <code>&lt;section class="container"&gt;</code>. By default, each container has left &amp; right margins*, which may be different at each responsive breakpoint. To remove the side margins, add <code>.full-bleed</code> to the container</p>
				          <p class="p3">*They're margins in theory, but not in css. margin-left and margin-right are actually auto, and the container has a set (percent) width, calculated based on the size the margins should be.</p>

				          <div class="docs-page-structure-page">
				          	<div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>	
				          	<div class="docs-page-structure-main2">
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          		<section class="docs-page-structure-main-container-full-bleed"><pre class="prettyprint">&lt;section class="container full-bleed" /&gt;</pre></section>
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          	</div>
				          	<div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div>			          	
				          </div>

				          <h3 class="bs-docs-heading">"Main" content max-width and full-bleed</h3>
				          <p>The <code>.container</code> sections will expand horizontally with the browser, until hitting a maximum width, beyond which point they'll have a fixed width, and margins will increase if the browser is sized any wider. If you need a container to be truly full bleed, no matter how wide the browser window is, add the class <code>.full-bleed-no-max</code></p>

				          <div class="docs-page-structure-page docs-page-structure-page-max">
				          	<div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>	
				          	<div class="docs-page-structure-main2">
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          		<div class="docs-docs-page-structure-maxWidth-outline"></div>
				          		<section class="docs-page-structure-main-container-full-bleed"><pre class="prettyprint">&lt;section class="container full-bleed" /&gt;</pre></section>
				          		<section class="docs-page-structure-main-container-full-bleed docs-page-structure-main-container-full-bleed-no-max"><pre class="prettyprint">&lt;section class="container full-bleed-no-max" /&gt;</pre></section>
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          	</div>
				          	<div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div>			          	
				          </div>
				          <p class="p4">The red lines indicate the "max-width" setting.</p>




				          <h3 class="bs-docs-heading">Nesting containers</h3>
				          <p>If you need a full-bleed for a background, but still need the regular margins for content, you can nest a <code>.container</code> section inside of a <code>.full-bleed</code> and/or <code>.full-bleed-no-max</code>  section.</p>

				          <div class="docs-page-structure-page docs-page-structure-page-max" style="margin-bottom:10px;">
				          	<div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>	
				          	<div class="docs-page-structure-main2">
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          		
				          		<section class="docs-page-structure-main-container-full-bleed nesting-demo">
				          			<div class="docs-page-structure-main-container">
<pre class="prettyprint">
&lt;section class="container full-bleed"&gt;
   &lt;div class="container"&gt;&lt;/div&gt;
&lt;/section&gt;	
</pre>
				          			</div>			          				
				          		</section>

				          		<section class="docs-page-structure-main-container-full-bleed docs-page-structure-main-container-full-bleed-no-max nesting-demo">
				          			<div class="docs-page-structure-main-container-full-bleed">
				          				<div class="docs-page-structure-main-container">
<pre class="prettyprint">
&lt;section class="container full-bleed-no-max"&gt;
   &lt;div class="container full-bleed"&gt;
      &lt;div class="container"&gt;&lt;/div&gt;
   &lt;/div&gt;
&lt;/section&gt;	
</pre>
				          				</div>			          				
				          			</div>
				          		</section>
				          		<div class="docs-docs-page-structure-maxWidth-outline"></div>
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          	</div>
				          	<div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div>			          	
				          </div>


				        	<h3 class="bs-docs-heading">Grid container &amp; margins</h3>
				          <p>If you want to utilize the grid (you should), the next block inside of <code>.container</code> should be a <code>.grid</code>. By default, the grid also has its own margins, which like <code>.container</code> can be overridden by adding <code>.full-bleed</code>.</p>

				          <div class="docs-page-structure-page">
				          	<div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>	
				          	<div class="docs-page-structure-main3">
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          		<section class="docs-page-structure-main-container docs-page-structure-main-container-grid-wrap">
				          			<div class="grid show-grid"><div class="span12"><pre class="prettyprint">&lt;div class="grid" /&gt;</pre></div></div>
				          			<div class="grid show-grid full-bleed"><div class="span12"><pre class="prettyprint">&lt;div class="grid full-bleed" /&gt;</pre></div></div>
				          			<div class="grid show-grid"><div class="span12"><pre class="prettyprint">&lt;div class="grid" /&gt;</pre></div></div>
				          		</section>
				          		<section class="docs-page-structure-main-container"><pre class="prettyprint">&lt;section class="container" /&gt;</pre></section>
				          	</div>
				          	<div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div>			          	
				          </div>

				        </div>

			        
			        </section>



							<section class="container" style="padding-bottom:20px; padding-top:0; border-top:0;">
				        <h3 class="bs-docs-heading">Examples</h3>
				        <p>Resize your browser to see how the <code>.container</code> and <code>.grid</code> respond with the <code>.full-bleed</code> and <code>.full-bleed-no-max</code> classes.</p>
				        <p><small>Note: You need a display wider than 1400px to see any difference between <code>.full-bleed</code> and <code>full-bleed-no-max</code>.</small></p>
							</section>

			        <section class="docs-container-demo container">
								<pre class="prettyprint">&lt;section class="container" /&gt;</pre>
				      </section>

			        <section class="docs-container-demo container full-bleed">
			        	<pre class="prettyprint">&lt;section class="container full-bleed" /&gt;</pre>
				      </section>

			        <section class="docs-container-demo container full-bleed-no-max">
			        	<pre class="prettyprint">&lt;section class="container full-bleed-no-max" /&gt;</pre>
				      </section>



			        <section class="docs-container-demo container" style="margin-bottom:50px;">
			        	<pre class="prettyprint">&lt;section class="container"&gt;</pre>
				      	<div class="grid"><pre class="prettyprint">&lt;div class="grid" /&gt;</pre></div>
				      	<div class="grid full-bleed"><pre class="prettyprint">&lt;div class="grid full-bleed" /&gt;</pre></div>
			        	<pre class="prettyprint">&lt;/section&gt;</pre>
				      </section>






			        <!-- Grid system
			        ================================================== -->
			        <section id="gridSystem" class="container">

			          <h2 class="bs-docs-heading">Default grid system</h2>

			        	<h3 class="bs-docs-heading">Live grid example</h3>
			          <p>The default grid system utilizes <strong>12 fluid columns</strong>. Column widths and gutters are percent based, and flex with the width of the parent element.</p>
			          <p>The grid also adapts to responsive breakpoints, with slightly different column widths and gutters, ensuring proper proportions for key screen resolutions and devices. Below 767px viewports, the columns stack vertically and stretch the full width of their parent element.</p>
			          <div class="bs-docs-grid">
			            <div class="grid show-grid">
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			            </div>
			            <div class="grid show-grid">
			              <div class="span2">2</div>
			              <div class="span3">3</div>
			              <div class="span3">3</div>
			              <div class="span4">4</div>
			            </div>
			            <div class="grid show-grid">
			              <div class="span6">6</div>
			              <div class="span6">6</div>
			            </div>
			            <div class="grid show-grid">
			              <div class="span12">12</div>
			            </div>
			          </div>
			
			          <h4 class="bs-docs-heading">Basic grid HTML</h4>
			          <p>For a simple two column layout, create a <code>.grid</code> and add the appropriate number of <code>.span*</code> columns. As this is a 12-column grid, each <code>.span*</code> spans a number of those 12 columns, and should always add up to 12 for each grid row (or the number of columns in the parent).</p>
			          
			          <div class="bs-docs-grid">
			            <div class="grid show-grid">
			              <div class="span4">4</div>
			              <div class="span8">8</div>
			            </div>
			          </div>

<pre class="prettyprint linenums">
&lt;div class="grid"&gt;
  &lt;div class="span4"&gt;...&lt;/div&gt;
  &lt;div class="span8"&gt;...&lt;/div&gt;
&lt;/div&gt;
</pre>
			          <p>Given this example, we have <code>.span4</code> and <code>.span8</code>, making for 12 total columns and a complete grid row.</p>
			          



			          <h3 class="bs-docs-heading">Rows</h3>
			          <p>Each row is its own individual grid. For multiple rows, just stack multiple <code>.grid</code> containers.</p>
								<div class="bs-docs-grid">
			            <div class="grid show-grid">
			              <div class="span6">6</div>
			              <div class="span6">6</div>
			            </div>
			            <div class="grid show-grid">
			              <div class="span12">12</div>
			            </div>
			          </div>

<pre class="prettyprint linenums">
&lt;div class="grid"&gt;
  &lt;div class="span6"&gt;...&lt;/div&gt;
  &lt;div class="span6"&gt;...&lt;/div&gt;
&lt;/div&gt;
&lt;div class="grid"&gt;
  &lt;div class="span12"&gt;...&lt;/div&gt;
&lt;/div&gt;
</pre>




			          <h3 class="bs-docs-heading">Offsetting columns</h3>
			          <p>Move columns to the right using <code>.offset*</code> classes. Each class increases the left margin of a column by a whole column. For example, <code>.offset2</code> moves <code>.span4</code> over two columns.</p>
			          <div class="bs-docs-grid">
			            <div class="grid show-grid">
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			            </div>
			            <div class="grid show-grid">
			              <div class="span3">3</div>
			              <div class="span4 offset2">4 offset 2</div>
			              <div class="span3">3</div>
			            </div><!-- /grid -->
			          </div>
<pre class="prettyprint linenums">
&lt;div class="grid"&gt;
  &lt;div class="span3"&gt;...&lt;/div&gt;
  &lt;div class="span4 offset2"&gt;...&lt;/div&gt;
  &lt;div class="span3"&gt;...&lt;/div&gt;
&lt;/div&gt;
</pre>
			

			<!-- 
			          <h3 class="bs-docs-heading" class="NotUpdatedYet">Nesting columns -- THIS IS CURRENTLY BROKEN FOR THE FLUID GRID</h3>
			          <p>To nest your content with a grid, add a new <code>.grid</code> and set of <code>.span*</code> columns within an existing <code>.span*</code> column. Notice that a grid inside of a grid does not have left and right margins, so its total width is the same as its parent span. Nested grid rows should include a set of columns that add up to the number of columns of its parent.</p>
			          <div class="grid show-grid">
			            <div class="span8">
			              Level 1 of column (span8)
			              
			              <div class="grid show-grid">
			                <div class="span6">
			                  Level 2 (span6)
			                </div>
			                <div class="span2">
			                  Level 2 (span2)
			                </div>
			              </div>
			            </div>

			            <div class="span4">
			              Level 1 of column (span4)
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="grid"&gt;
  &lt;div class="span12"&gt;
    Level 1 column (span12)
    &lt;div class="grid full-bleed"&gt;
      &lt;div class="span9"&gt;Level 2 (span9)&lt;/div&gt;
      &lt;div class="span3"&gt;Level 2 (span3)&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
</pre>
--> 
							</section>





			
			        <!-- Fixed width grid system
			        ================================================== -->

			        <!-- 
			        <section id="fixedGridSystem" class="container">
			          <h2 class="bs-docs-heading">Fixed width grid system</h2>


			          <h3 class="bs-docs-heading">Fixed width grid example</h3>
			          <p>Make any grid "fixed width" by changing <code>.grid</code> to <code>.grid-px-width</code>. The column classes stay the exact same, making it easy to flip between fluid and fixed grids.</p>
			          <p>The fixed width grid system utilizes the same <strong>12 columns</strong> but have a defined width for each responsive breakpoint. Below 767px viewports, the columns become fluid and stack vertically.</p>
			          <div class="bs-docs-grid">
			            <div class="grid-px-width show-grid">
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			              <div class="span1">1</div>
			            </div>
			            <div class="grid-px-width show-grid">
			              <div class="span2">2</div>
			              <div class="span3">3</div>
			              <div class="span3">3</div>
			              <div class="span4">4</div>
			            </div>
			            <div class="grid-px-width show-grid">
			              <div class="span6">6</div>
			              <div class="span6">6</div>
			            </div>
			            <div class="grid-px-width show-grid">
			              <div class="span12">12</div>
			            </div>
			          </div>

			        </section>
							--> 
			
			
			
			
			        <!-- Layouts (Default and fluid)
			        ================================================== -->

			        <!-- 
			        <section id="layouts" class="container">
			          <h2 class="bs-docs-heading">Layouts</h2>
			
			          <h3 class="bs-docs-heading">Fixed layout</h3>
			          <p>Provides a common fixed-width (and optionally responsive) layout with only <code><pre class="prettyprint linenums">&lt;div class="container-px-width"&gt;</code> required.</p>
			          <div class="mini-layout">
			            <div class="mini-layout-body"></div>
			          </div>
			<pre class="prettyprint linenums">
			&lt;body&gt;
			  &lt;div class="container-px-width"&gt;
			    ...
			  &lt;/div&gt;
			&lt;/body&gt;
			</pre>
			
			          <h3 class="bs-docs-heading">Fluid layout</h3>
			          <p>Create a fluid, two-column page with <code><pre class="prettyprint linenums">&lt;div class="container"&gt;</code>&mdash;great for applications and docs.</p>
			          <div class="mini-layout fluid">
			            <div class="mini-layout-sidebar"></div>
			            <div class="mini-layout-body"></div>
			          </div>
			<pre class="prettyprint linenums">
			&lt;div class="container"&gt;
			  &lt;div class="grid"&gt;
			    &lt;div class="span2"&gt;
			      &lt;!--Sidebar content--&gt;
			    &lt;/div&gt;
			    &lt;div class="span10"&gt;
			      &lt;!--Body content--&gt;
			    &lt;/div&gt;
			  &lt;/div&gt;
			&lt;/div&gt;
			</pre>
			        </section>
			--> 
			
			
			
			        <!-- Responsive design
			        ================================================== -->
			        <section id="responsive" class="container">
			          <h2 class="bs-docs-heading">Responsive design</h2>

			
			          {{! About }}
			          <!-- <h3 class="bs-docs-heading">About responsive Bootstrap</h3> --> 
			          <img src="img/responsive-illustrations.png" alt="Responsive devices" style="float: right; margin: 0 0 20px 20px;">
			          <p>Media queries allow for custom CSS based on a number of conditions&mdash;ratios, widths, display type, etc&mdash;but usually focuses around <code>min-width</code> and <code>max-width</code>.</p>
			         	<!-- 
			          <ul>
			            <li>Modify the width of column in our grid</li>
			            <li>Stack elements instead of float wherever necessary</li>
			            <li>Resize headings and text to be more appropriate for devices</li>
			          </ul>
			
			          {{! Supported }}
			          <h3 class="bs-docs-heading">Supported devices</h3>
			          <p>Bootstrap supports a handful of media queries in a single file to adapt to difference devices and screen resolutions.</p>
			          <table class="table table-bordered table-striped">
			            <thead>
			              <tr>
			                <th>Label</th>
			                <th>Layout width</th>
			                <th>Column width</th>
			                <th>Gutter width</th>
			              </tr>
			            </thead>
			            <tbody>
			              <tr>
			                <td>Large display</td>
			                <td>1200px and up</td>
			                <td>70px</td>
			                <td>30px</td>
			              </tr>
			              <tr>
			                <td>Default</td>
			                <td>980px and up</td>
			                <td>60px</td>
			                <td>20px</td>
			              </tr>
			              <tr>
			                <td>Portrait tablets</td>
			                <td>768px and above</td>
			                <td>42px</td>
			                <td>20px</td>
			              </tr>
			              <tr>
			                <td>Phones to tablets</td>
			                <td>767px and below</td>
			                <td class="muted" colspan="2">Fluid columns, no fixed widths</td>
			              </tr>
			              <tr>
			                <td>Phones</td>
			                <td>480px and below</td>
			                <td class="muted" colspan="2">Fluid columns, no fixed widths</td>
			              </tr>
			            </tbody>
			          </table>

			        	--> 
			<pre class="prettyprint linenums">
			/* Large desktop */
			@media (min-width: 1200px) { ... }
			
			/* Portrait tablet to landscape and desktop */
			@media (min-width: 768px) and (max-width: 979px) { ... }
			
			/* Landscape phone to portrait tablet */
			@media (max-width: 767px) { ... }
			
			/* Landscape phones and down */
			@media (max-width: 480px) { ... }
			</pre>
			
			
			          {{! Responsive utility classes }}
			          <h3 class="bs-docs-heading">Responsive utility classes</h3>
			          <p>For faster mobile-friendly development, use these utility classes for showing and hiding content by device. Below is a table of the available classes and their effect on a given media query layout (labeled by device). <!-- They can be found in <code>responsive.less</code>.--> </p>
			          <table class="table table-bordered table-striped responsive-utilities">
			            <thead>
			              <tr>
			                <th>Class</th>
			                <th>Phones <small>767px and below</small></th>
			                <th>Tablets <small>768px to 979px</small></th>
			                <th>Desktops <small>Default</small></th>
			              </tr>
			            </thead>
			            <tbody>
			              <tr>
			                <th><code>.visible-phone</code></th>
			                <td class="is-visible">Visible</td>
			                <td class="is-hidden">Hidden</td>
			                <td class="is-hidden">Hidden</td>
			              </tr>
			              <tr>
			                <th><code>.visible-tablet</code></th>
			                <td class="is-hidden">Hidden</td>
			                <td class="is-visible">Visible</td>
			                <td class="is-hidden">Hidden</td>
			              </tr>
			              <tr>
			                <th><code>.visible-desktop</code></th>
			                <td class="is-hidden">Hidden</td>
			                <td class="is-hidden">Hidden</td>
			                <td class="is-visible">Visible</td>
			              </tr>
			              <tr>
			                <th><code>.hidden-phone</code></th>
			                <td class="is-hidden">Hidden</td>
			                <td class="is-visible">Visible</td>
			                <td class="is-visible">Visible</td>
			              </tr>
			              <tr>
			                <th><code>.hidden-tablet</code></th>
			                <td class="is-visible">Visible</td>
			                <td class="is-hidden">Hidden</td>
			                <td class="is-visible">Visible</td>
			              </tr>
			              <tr>
			                <th><code>.hidden-desktop</code></th>
			                <td class="is-visible">Visible</td>
			                <td class="is-visible">Visible</td>
			                <td class="is-hidden">Hidden</td>
			              </tr>
			            </tbody>
			          </table>
			
			          <h4 class="bs-docs-heading">When to use</h4>
			          <p>Use on a limited basis and avoid creating entirely different versions of the same site. Instead, use them to complement each device's presentation.</p>
			
			          <h4 class="bs-docs-heading">Responsive utilities test case</h4>
			          <p>Resize your browser or load on different devices to test the above classes.</p>
			          <h5 class="bs-docs-heading">Visible on...</h5>
			          <p>Green checkmarks indicate that class is visible in your current viewport.</p>
			          <ul class="responsive-utilities-test">
			            <li>Phone<span class="visible-phone">&#10004; Phone</span></li>
			            <li>Tablet<span class="visible-tablet">&#10004; Tablet</span></li>
			            <li>Desktop<span class="visible-desktop">&#10004; Desktop</span></li>
			          </ul>
			          <h5 class="bs-docs-heading">Hidden on...</h5>
			          <p>Here, green checkmarks indicate that class is hidden in your current viewport.</p>
			          <ul class="responsive-utilities-test hidden-on">
			            <li>Phone<span class="hidden-phone">&#10004; Phone</span></li>
			            <li>Tablet<span class="hidden-tablet">&#10004; Tablet</span></li>
			            <li>Desktop<span class="hidden-desktop">&#10004; Desktop</span></li>
			          </ul>
			
			        </section>			
			
			      </div>
			    </div>
			
			  </div>
			  
		{{partial 'includes/docs_foot.html'}}
	</body>
</html>