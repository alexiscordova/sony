<!DOCTYPE html>
<!--[if lt IE8]>  <html class="no-js ie oldie lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie oldie lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie ie9" lang="en"> <![endif]-->
<!--[if gt IE 9]> <html class="no-js ie gt-ie9 modern" lang="en"> <![endif]-->
<!--[!(IE)]><!--><html class="no-js notIE modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs-head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs-nav.html'}}
		
		
			<!-- Subhead
			================================================== -->
			<header class="jumbotron subhead" id="overview">
			  <div class="container-px-width">
			    <h2 class="bs-docs-heading">Getting started</h2>
			    <p class="p1">Overview of the project, its contents, and how to get started with a simple template.</p>
			  </div>
			</header>
			
			
			  <div class="container-px-width">
			
			    <!-- Docs nav
			    ================================================== -->
			    <div class="grid">
			      <div class="span3 bs-docs-sidebar">
			        <ul class="simple-nav simple-nav-list bs-docs-sidenav">
			          <li><a href="#download-bootstrap"><i class="icon-chevron-right"></i> Download</a></li>
			          <li><a href="#file-structure"><i class="icon-chevron-right"></i> File structure</a></li>
			          <li><a href="#contents"><i class="icon-chevron-right"></i> What's included</a></li>
			          <li><a href="#html-template"><i class="icon-chevron-right"></i> HTML template</a></li>
			          <li><a href="#examples"><i class="icon-chevron-right"></i> Examples</a></li>
			          <li><a href="#what-next"><i class="icon-chevron-right"></i> What next?</a></li>
			        </ul>
			      </div>
			      <div class="span9">
			
			
			
			        <!-- Download
			        ================================================== -->
			        <section id="download-bootstrap">
			          <h2 class="bs-docs-heading">1. Download</h2>
			          <p class="p1">Before downloading, be sure to have a code editor (we recommend <a href="http://sublimetext.com/2">Sublime Text 2</a>) and some working knowledge of HTML and CSS. We won't walk through the source files here, but they are available for download. We'll focus on getting started with the compiled Bootstrap files.</p>
			
			          <div class="grid">
			            <div class="span6">
			              <h3 class="bs-docs-heading">Download compiled</h3>
			              <p><strong>Fastest way to get started:</strong> get the compiled and minified versions of our CSS, JS, and images. No docs or original source files.</p>
			              <p><a class="btn btn-large btn-special" href="bootstrap.zip" {{#production}}onclick="_gaq.push(['_trackEvent', 'Getting started', 'Download', 'Download compiled']);"{{/production}}>Download Bootstrap</a></p>
			            </div>
			            <div class="span6">
			              <h3 class="bs-docs-heading">Download source</h3>
			              <p>Get the original files for all CSS and JavaScript, along with a local copy of the docs by downloading the latest version directly from GitHub.</p>
			              <p><a class="btn btn-large" href="https://github.com/twitter/bootstrap/zipball/master" {{#production}}onclick="_gaq.push(['_trackEvent', 'Getting started', 'Download', 'Download source']);"{{/production}}>Download Bootstrap source</a></p>
			            </div>
			          </div>
			        </section>
			
			
			
			        <!-- File structure
			        ================================================== -->
			        <section id="file-structure">
			          <h2 class="bs-docs-heading">2. File structure</h2>
			          <p class="p1">Within the download you'll find the following file structure and contents, logically grouping common assets and providing both compiled and minified variations.</p>
			          <p>Once downloaded, unzip the compressed folder to see the structure of (the compiled) Bootstrap. You'll see something like this:</p>
			<pre class="prettyprint">
			  bootstrap/
			  ├── css/
			  │   ├── bootstrap.css
			  │   ├── bootstrap.min.css
			  ├── js/
			  │   ├── bootstrap.js
			  │   ├── bootstrap.min.js
			  ├── img/
			  │   ├── glyphicons-halflings.png
			  │   ├── glyphicons-halflings-white.png
			  └── README.md
			</pre>
			          <p>This is the most basic form of Bootstrap: compiled files for quick drop-in usage in nearly any web project. We provide compiled CSS and JS (<code>bootstrap.*</code>), as well as compiled and minified CSS and JS (<code>bootstrap.min.*</code>). The image files are compressed using <a href="http://imageoptim.com/">ImageOptim</a>, a Mac app for compressing PNGs.</p>
			          <p>Please note that all JavaScript plugins require jQuery to be included.</p>
			        </section>
			
			
			
			        <!-- Contents
			        ================================================== -->
			        <section id="contents">
			          <h2 class="bs-docs-heading">3. What's included</h2>
			          <p class="p1">Bootstrap comes equipped with HTML, CSS, and JS for all sorts of things, but they can be summarized with a handful of categories visible at the top of the <a href="http://getbootstrap.com">Bootstrap documentation</a>.</p>
			
			          <h3 class="bs-docs-heading">Docs sections</h3>
			          <h5 class="bs-docs-heading"><a href="http://twitter.github.com/bootstrap/scaffolding.html">Scaffolding</a></h5>
			          <p>Global styles for the body to reset type and background, link styles, grid system, and two simple layouts.</p>
			          <h5 class="bs-docs-heading"><a href="http://twitter.github.com/bootstrap/base-css.html">Base CSS</a></h5>
			          <p>Styles for common HTML elements like typography, code, tables, forms, and buttons. Also includes <a href="http://glyphicons.com">Glyphicons</a>, a great little icon set.</p>
			          <h5 class="bs-docs-heading"><a href="http://twitter.github.com/bootstrap/components.html">Components</a></h5>
			          <p>Basic styles for common interface components like tabs and pills, navbar, alerts, page headers, and more.</p>
			          <h5 class="bs-docs-heading"><a href="http://twitter.github.com/bootstrap/javascript.html">Javascript plugins</a></h5>
			          <p>Similar to Components, these Javascript plugins are interactive components for things like tooltips, popovers, modals, and more.</p>
			
			          <h3 class="bs-docs-heading">List of components</h3>
			          <p>Together, the <strong>Components</strong> and <strong>Javascript plugins</strong> sections provide the following interface elements:</p>
			          <ul>
			            <li>Button groups</li>
			            <li>Button dropdowns</li>
			            <li>Navigational tabs, pills, and lists</li>
			            <li>Navbar</li>
			            <li>Labels</li>
			            <li>Badges</li>
			            <li>Page headers and hero unit</li>
			            <li>Thumbnails</li>
			            <li>Alerts</li>
			            <li>Progress bars</li>
			            <li>Modals</li>
			            <li>Dropdowns</li>
			            <li>Tooltips</li>
			            <li>Popovers</li>
			            <li>Accordion</li>
			            <li>Carousel</li>
			            <li>Typeahead</li>
			          </ul>
			          <p>In future guides, we may walk through these components individually in more detail. Until then, look for each of these in the documentation for information on how to utilize and customize them.</p>
			        </section>
			
			
			
			        <!-- HTML template
			        ================================================== -->
			        <section id="html-template">
			          <h2 class="bs-docs-heading">4. Basic HTML template</h2>
			          <p class="p1">With a brief intro into the contents out of the way, we can focus putting Bootstrap to use. To do that, we'll utilize a basic HTML template that includes everything we mentioned in the <a href="#file-structure">File structure</a>.</p>
			          <p>Now, here's a look at a <strong>typical HTML file</strong>:</p>
			<pre class="prettyprint linenums">
			&lt;!DOCTYPE html&gt;
			&lt;html&gt;
			  &lt;head&gt;
			    &lt;title&gt;Bootstrap 101 Template&lt;/title&gt;
			  &lt;/head&gt;
			  &lt;body&gt;
			    &lt;h1&gt;Hello, world!&lt;/h1&gt;
			    &lt;script src="http://code.jquery.com/jquery-latest.js"&gt;&lt;/script&gt;
			  &lt;/body&gt;
			&lt;/html&gt;
			</pre>
			          <p>To make this <strong>a Bootstrapped template</strong>, just include the appropriate CSS and JS files:</p>
			<pre class="prettyprint linenums">
			&lt;!DOCTYPE html&gt;
			&lt;html&gt;
			  &lt;head&gt;
			    &lt;title&gt;Bootstrap 101 Template&lt;/title&gt;
			    &lt;!-- Bootstrap --&gt;
			    &lt;link href="css/bootstrap.min.css" rel="stylesheet"&gt;
			  &lt;/head&gt;
			  &lt;body&gt;
			    &lt;h1&gt;Hello, world!&lt;/h1&gt;
			    &lt;script src="http://code.jquery.com/jquery-latest.js"&gt;&lt;/script&gt;
			    &lt;script src="js/bootstrap.min.js"&gt;&lt;/script&gt;
			  &lt;/body&gt;
			&lt;/html&gt;
			</pre>
			          <p><strong>And you're set!</strong> With those two files added, you can begin to develop any site or application with Bootstrap.</p>
			        </section>
			
			
			
			        <!-- Examples
			        ================================================== -->
			        <section id="examples">
			          <h2 class="bs-docs-heading">5. Examples</h2>
			          <p class="p1">Move beyond the base template with a few example layouts. We encourage folks to iterate on these examples and not simply use them as an end result.</p>
			          <ul class="thumbnails bootstrap-examples">
			            <li class="span3">
			              <a class="thumbnail" href="examples/hero.html">
			                <img src="img/examples/bootstrap-example-hero.jpg" alt="">
			              </a>
			              <h5 class="bs-docs-heading">Basic marketing site</h5>
			              <p>Featuring a hero unit for a primary message and three supporting elements.</p>
			            </li>
			            <li class="span3">
			              <a class="thumbnail" href="examples/fluid.html">
			                <img src="img/examples/bootstrap-example-fluid.jpg" alt="">
			              </a>
			              <h5 class="bs-docs-heading">Fluid layout</h5>
			              <p>Uses our new responsive, fluid grid system to create a seamless liquid layout.</p>
			            </li>
			            <li class="span3">
			              <a class="thumbnail" href="examples/starter-template.html">
			                <img src="img/examples/bootstrap-example-starter.jpg" alt="">
			              </a>
			              <h5 class="bs-docs-heading">Starter template</h5>
			              <p>A barebones HTML document with all the Bootstrap CSS and javascript included.</p>
			            </li>
			          </ul>
			        </section>
			
			
			
			
			        <!-- Next
			        ================================================== -->
			        <section id="what-next">
			          <h2 class="bs-docs-heading">What next?</h2>
			          <p class="p1">Head to the docs for information, examples, and code snippets, or take the next leap and customize Bootstrap for any upcoming project.</p>
			          <a class="btn btn-large btn-special" href="./scaffolding.html" {{#production}}onclick="_gaq.push(['_trackEvent', 'Getting started', 'Next steps', 'Visit docs']);"{{/production}}>Visit the Bootstrap docs</a>
			          <a class="btn btn-large" href="./customize.html" style="margin-left: 5px;" {{#production}}onclick="_gaq.push(['_trackEvent', 'Getting started', 'Next steps', 'Customize']);"{{/production}}>Customize Bootstrap</a>
			        </section>
			
			
			
			
			      </div>
			    </div>
			
			  </div>
		{{partial 'includes/docs-foot.html'}}
	</body>
</html>