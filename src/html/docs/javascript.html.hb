<!DOCTYPE html>
<!--[if lt IE8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs_head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs_nav.html'}}

			<!--==================================================
			 Subhead
			================================================== -->
			<header class="jumbotron subhead">
			  <div class="container-px-width">
			    <h2 class="bs-docs-heading">Sony Bootstrap JavaScript Library</h2>
			    <p class="p1">Bring Bootstrap's components to life &mdash; with custom javascript &amp; jQuery plugins.
			  </div>
			</header>
			
			  <div class="container-px-width">
			
			
			
			
			
			<!--==================================================
			 Docs nav
			================================================== -->
			    <div class="grid">
			      <div class="span3 bs-docs-sidebar">
			        <ul class="simple-nav simple-nav-list bs-docs-sidenav">
			          <li><a href="#overview"><i class="icon-chevron-right"></i> Overview</a></li>
			          <li><a href="#image-qualifications"><i class="icon-chevron-right"></i> Image Qualifications</a></li>
			        </ul>
			      </div>
			      <div class="span9">
			
			
			
			
			
			<!--==================================================
			 Overview
			================================================== -->
			        <section id="overview">
			          <h2 class="bs-docs-heading">JavaScript in Bootstrap</h2>
			
			          <h4 class="bs-docs-heading">Individual or compiled</h4>
			          <p>If you have downloaded the latest version of Bootstrap, both <strong>bootstrap.js</strong> and <strong>bootstrap.min.js</strong> contain all of the plugins listed on this page.</p>
			
			          <h4 class="bs-docs-heading">Data attributes</h4>
			          <p>You can use all Bootstrap plugins purely through the markup API without writing a single line of JavaScript. This is Bootstrap's first class API and should be your first consideration when using a plugin.</p>
			
			          <p>That said, in some situations it may be desirable to turn this functionality off. Therefore, we also provide the ability to disable the data attribute API by unbinding all events on the body namespaced with `'data-api'`. This looks like this:
			          <pre class="prettyprint linenums">$('body').off('.data-api')</pre>
			
			          <p>Alternatively, to target a specific plugin, just include the plugins name as a namespace along with the data-api namespace like this:</p>
			          <pre class="prettyprint linenums">$('body').off('.alert.data-api')</pre>
			
			          <h4 class="bs-docs-heading">Programmatic API</h4>
			          <p>We also believe you should be able to use all Bootstrap plugins purely through the JavaScript API. All public APIs are single, chainable methods, and return the collection acted upon.</p>
			          <pre class="prettyprint linenums">$(".btn.danger").button("toggle").addClass("fat")</pre>
			          <p>All methods should accept an optional options object, a string which targets a particular method, or nothing (which initiates a plugin with default behavior):</p>
			<pre class="prettyprint linenums">
			$("#myModal").modal()                       // initialized with defaults
			$("#myModal").modal({ keyboard: false })   // initialized with no keyboard
			$("#myModal").modal('show')                // initializes and invokes show immediately</p>
			</pre>
			          <p>Each plugin also exposes it's raw constructor on a `Constructor` property: <code>$.fn.popover.Constructor</code>. If you'd like to get a particular plugin instance, retrieve it directly from an element: <code>$('[rel=popover]').data('popover')</code>.</p>
			
			          <h4 class="bs-docs-heading">Events</h4>
			          <p>Bootstrap provides custom events for most plugin's unique actions. Generally, these come in an infinitive and past participle form - where the infinitive (ex. <code>show</code>) is triggered at the start of an event, and it's past participle form (ex. <code>shown</code>) is trigger on the completion of an action.</p>
			          <p>All infinitive events provide preventDefault functionality. This provides the abililty to stop the execution of an action before it starts.</p>
			<pre class="prettyprint linenums">
			$('#myModal').on('show', function (e) {
			    if (!data) return e.preventDefault() // stops modal from being shown
			})
			</pre>
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Image Qualifications
			================================================== -->
			          <section id="image-qualifications">
			            <h2 class="bs-docs-heading">Image Qualifications <small>image-qualification.js</small></h2>
			
			            <h3 class="bs-docs-heading">Example</h3>
			            <p>Lorem ipsum</p>
			            <div class="bs-docs-example">
			              Drop some sample Markup here, and the prettyprint code for it below.
			            </div>{{! /example }}
			<pre class="prettyprint linenums">
			&lt;div id="myCarousel" class="carousel slide"&gt;
			  &lt;!-- Carousel items --&gt;
			  &lt;div class="carousel-inner"&gt;
			    &lt;div class="active item"&gt;…&lt;/div&gt;
			    &lt;div class="item"&gt;…&lt;/div&gt;
			    &lt;div class="item"&gt;…&lt;/div&gt;
			  &lt;/div&gt;
			  &lt;!-- Carousel nav --&gt;
			  &lt;a class="carousel-control left" href="#myCarousel" data-slide="prev"&gt;&amp;lsaquo;&lt;/a&gt;
			  &lt;a class="carousel-control right" href="#myCarousel" data-slide="next"&gt;&amp;rsaquo;&lt;/a&gt;
			&lt;/div&gt;
			</pre>
			
			            <div class="alert alert-warning">
			              <strong>Heads up!</strong>
			              Lorem ipsum
			            </div>
			
			
			            <hr class="bs-docs-separator">
			
			
			            <h3 class="bs-docs-heading">Usage</h3>
			
			            <h4 class="bs-docs-heading">Via data attributes</h4>
			            <p>...</p>
			
			            <h4 class="bs-docs-heading">Via JavaScript</h4>
			            <p>I'm leaving some of this carousel markup below, as an example of formatting - feel free to rip it all out or replace it or whateve.</p>
			            <pre class="prettyprint linenums">$('.image-qualification').image-qualification()</pre>
			
			            <h4 class="bs-docs-heading">Options</h4>
			            <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-interval=""</code>.</p>
			            <table class="table table-bordered table-striped">
			              <thead>
			               <tr>
			                 <th style="width: 100px;">Name</th>
			                 <th style="width: 50px;">type</th>
			                 <th style="width: 50px;">default</th>
			                 <th>description</th>
			               </tr>
			              </thead>
			              <tbody>
			               <tr>
			                 <td>interval</td>
			                 <td>number</td>
			                 <td>5000</td>
			                 <td>The amount of time to delay between automatically cycling an item. If false, carousel will not automatically cycle.</td>
			               </tr>
			               <tr>
			                 <td>pause</td>
			                 <td>string</td>
			                 <td>"hover"</td>
			                 <td>Pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on mouseleave.</td>
			               </tr>
			              </tbody>
			            </table>
			
			            <h4 class="bs-docs-heading">Methods</h4>
			            <h5 class="bs-docs-heading">.carousel(options)</h5>
			            <p>Initializes the carousel with an optional options <code>object</code> and starts cycling through items.</p>
			<pre class="prettyprint linenums">
			$('.carousel').carousel({
			  interval: 2000
			})
			</pre>
			            <h5 class="bs-docs-heading">.carousel('cycle')</h5>
			            <p>Cycles through the carousel items from left to right.</p>
			            <h5 class="bs-docs-heading">.carousel('pause')</h5>
			            <p>Stops the carousel from cycling through items.</p>
			            <h5 class="bs-docs-heading">.carousel(number)</h5>
			            <p>Cycles the carousel to a particular frame (0 based, similar to an array).</p>
			            <h5 class="bs-docs-heading">.carousel('prev')</h5>
			            <p>Cycles to the previous item.</p>
			            <h5 class="bs-docs-heading">.carousel('next')</h5>
			            <p>Cycles to the next item.</p>
			
			            <h4 class="bs-docs-heading">Events</h4>
			            <p>Bootstrap's carousel class exposes two events for hooking into carousel functionality.</p>
			            <table class="table table-bordered table-striped">
			              <thead>
			               <tr>
			                 <th style="width: 150px;">Event</th>
			                 <th>Description</th>
			               </tr>
			              </thead>
			              <tbody>
			               <tr>
			                 <td>slide</td>
			                 <td>This event fires immediately when the <code>slide</code> instance method is invoked.</td>
			               </tr>
			               <tr>
			                 <td>slid</td>
			                 <td>This event is fired when the carousel has completed its slide transition.</td>
			               </tr>
			              </tbody>
			            </table>
			          </section>
			
			
			
			
			
			
			
			      </div>
			    </div>
			
			  </div>
		
		{{partial 'includes/docs_foot.html'}}
	</body>
</html>