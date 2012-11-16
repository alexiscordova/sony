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
			    <h1>Global Components</h1>
			    <p class="p1">Reusable components for navigation, alerts, modals, and more.</p>
			  </div>
			</header>
			
			
			  <div class="container">
			
			
			
			
			<!--==================================================
			 Docs nav
			================================================== -->
			    <div class="row">
			      <div class="span3 bs-docs-sidebar">
			        <ul class="simple-nav simple-nav-list bs-docs-sidenav">
			          <li><a href="#overview"><i class="icon-chevron-right"></i> Overview</a></li>
			
			          <li><a href="#global-nav"><i class="icon-chevron-right"></i> Global Nav</a></li>
			          <li><a href="#sub-nav"><i class="icon-chevron-right"></i> Sub Nav</a></li>
			          <li><a href="#hotspots"><i class="icon-chevron-right"></i> Hotspots &amp; Circle-Buttons</a></li>
			          <li><a href="#dropdowns"><i class="icon-chevron-right"></i> Dropdowns</a></li>
			          <li><a href="#tabs"><i class="icon-chevron-right"></i> Tabs</a></li>
			          <li><a href="#buttons"><i class="icon-chevron-right"></i> Buttons</a></li>
			          <li><a href="#collapse"><i class="icon-chevron-right"></i> Collapse</a></li>
			          <li><a href="#alerts"><i class="icon-chevron-right"></i> Alerts</a></li>
			          <li><a href="#modals"><i class="icon-chevron-right"></i> Modals</a></li>
			          <li><a href="#pagination"><i class="icon-chevron-right"></i> Pagination</a></li>
			          <li><a href="#progress"><i class="icon-chevron-right"></i> Progress bars</a></li>
			
			          <li><a href="#labels-badges"><i class="icon-chevron-right"></i> Labels and badges</a></li>
			          <li><a href="#typography"><i class="icon-chevron-right"></i> Typography</a></li>
			
			          <li><a href="#misc"><i class="icon-chevron-right"></i> Misc</a></li>
			
			          <li><a href="#scrollspy"><i class="icon-chevron-right"></i> Scrollspy</a></li>
			          <li><a href="#tooltips"><i class="icon-chevron-right"></i> Tooltip</a></li>
			          <li><a href="#popovers"><i class="icon-chevron-right"></i> Popover</a></li>
			          <li><a href="#affix"><i class="icon-chevron-right"></i> Affix</a></li>
			          <li><a href="#typeahead"><i class="icon-chevron-right"></i> Typeahead</a></li>
			        </ul>
			      </div>
			      <div class="span9">
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Overview
			================================================== -->
			        <section id="overview">
			          <h2 class="bs-docs-heading" id="headings">Overview</h2>
			          <p>This is pretty much just a skeleton right now. Very little of these have actually been updated for Sony, and are just the original Bootstrap versions.</p>
			          <p>Some may not have the correct CSS; some we may eventually remove if we don't need them.</p>
			          

				        <section class="NotUpdatedYet" style="padding:10px 20px"><h6>Sections with a light blue background have not been styled or updated yet. If you update them, remove the class "NotUpdatedYet" from the parent container of the section, and from the "bs-docs-example" container as well.</h6></section>

			

			          <div class="NotUpdatedYet">
			            <h3 class="bs-docs-heading">Transitions <small>bootstrap-transition.js</small></h3>
			            <h4 class="bs-docs-heading">About transitions</h4>
			            <p>For simple transition effects, include bootstrap-transition.js once alongside the other JS files. If you're using the compiled (or minified) bootstrap.js, there is no need to include this&mdash;it's already there.</p>
			            <h4 class="bs-docs-heading">Use cases</h4>
			            <p>A few examples of the transition plugin:</p>
			            <ul>
			              <li>Sliding or fading in modals</li>
			              <li>Fading out tabs</li>
			              <li>Fading out alerts</li>
			              <li>Sliding carousel panes</li>
			            </ul>
			
			            {{! Ideas: include docs for .fade.in, .slide.in, etc }}
			          </div>
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Global Nav
			================================================== -->
			        <section id="global-nav" class="NotUpdatedYet">
			
			          <h2 class="bs-docs-heading">Global Nav</h2>
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Sub Nav
			================================================== -->
			        <section id="sub-nav" class="NotUpdatedYet">
			
			          <h2 class="bs-docs-heading">Sub Nav</h2>
			          <p>Replace the sub-nav divs in this example with your own sub-nav markup</p>
			          </section><!-- END sub-nav --> 
			
			
			
			
			
			
			
			
			
			<!--==================================================
			  Hotspots & CircleButtons
			================================================== -->
			        <section id="hotspots">

			          <h2 class="bs-docs-heading">Hotspots &amp; Circle-Buttons</h2>
			          <p>These are kinda jittery; there might be a better way to animate the halo</p>
			          <div class="bs-docs-example" style="height:100px;">
		              
		              <div class="hotspot hotspot-plus" style="left:80px; top:90px;">
										<div class="circle-button"><span class="circle-button-icon"></span></div>
										<!-- <div class="tooltip left" style="height: 211px; margin-top: -105.5px; ">
											<h4>Universal Remote</h4>
											<p>Control your Google TV, cable and satellite set-top-box, audio, TV set, and Blu-ray or DVD player with a single remote. Thanks to Bluetooth technology, you don’t even need to point the remote at your Sony Google TV box for it to work.</p>
										</div> -->
									</div>

									<div class="hotspot hotspot-secondary hotspot-close" style="left:180px; top:90px;">
										<div class="circle-button"><span class="circle-button-icon"></span></div>
									</div>

									<div class="hotspot hotspot-large" style="left:280px; top:90px;">
										<div class="circle-button"><span class="circle-button-icon"></span></div>
									</div>

									<div class="hotspot hotspot-xlarge hotspot-xlarge-revealer" style="left:400px; top:90px;">
										<div class="circle-button"><span class="circle-button-icon"></span></div>
									</div>


			          </div>
<pre class="prettyprint linenums">
&lt;div class="hotspot hotspot-plus"&gt;
  &lt;div class="circle-button"&gt;&lt;span class="circle-btn-icon"&gt;&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;div class="hotspot hotspot-secondary hotspot-close"&gt;
  &lt;div class="circle-button"&gt;&lt;span class="circle-btn-icon"&gt;&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;div class="hotspot hotspot-large"&gt;
  &lt;div class="circle-button"&gt;&lt;span class="circle-btn-icon"&gt;&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;div class="hotspot hotspot-xlarge hotspot-xlarge-revealer"&gt;
  &lt;div class="circle-button"&gt;&lt;span class="circle-btn-icon"&gt;&lt;/span&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			</section>
			
			
			
			
			<!--==================================================
			 Dropdowns
			================================================== -->
			        <section id="dropdowns">
			          <h2 class="bs-docs-heading">Dropdowns &amp; Button Dropdown Menus</h2>
			          <p>Toggleable, contextual menu for displaying lists of links. Made interactive with the <a href="./javascript.html#dropdowns">dropdown javascript plugin</a>.</p>
			
			          <h3 class="bs-docs-heading">Overview and examples</h3>
			          <p>Dropdowns can be triggered using any number of button types, by placing it within a <code>.btn-group</code> and providing the proper menu markup. Here are some examples using a <code>.dropdown-toggle</code></p>
			          
			          <div class="bs-docs-example">
		              <div class="btn-group">
		                <a class="btn dropdown-toggle" data-toggle="dropdown">Filter results</a>
		                <ul class="dropdown-menu">
		                  <li><a href="#">Action</a></li>
		                  <li><a href="#">Another action</a></li>
		                  <li><a href="#">Something else here</a></li>
		                  <li class="divider"></li>
		                  <li><a href="#">Separated link</a></li>
		                </ul>
		              </div><!-- /btn-group -->
			          </div>
<pre class="prettyprint linenums">
&lt;div class="btn-group"&gt;
  &lt;a class="btn dropdown-toggle" data-toggle="dropdown" href="#"&gt;Filter results&lt;/a&gt;
  &lt;ul class="dropdown-menu"&gt;
    &lt;li&gt;&lt;a href="#"&gt;Action&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;Another action&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;Something else here&lt;/a&gt;&lt;/li&gt;
    &lt;li class="divider"&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;Separated link&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Different sizes</h4>
			          <!-- <p>Button dropdowns work at any size:  <code>.btn-large</code>, <code>.btn-small</code>, or <code>.btn-mini</code>.</p> -->
			          <p>There's also a small dropdown button, by adding <code>.btn-small</code> to the button</p>
			          <div class="bs-docs-example">
		              <div class="btn-group">
		                <button class="btn btn-small dropdown-toggle" data-toggle="dropdown">Sort by</button>
		                <ul class="dropdown-menu">
		                  <li><a href="#">Action</a></li>
		                  <li><a href="#">Another action</a></li>
		                  <li><a href="#">Something else here</a></li>
		                  <li class="divider"></li>
		                  <li><a href="#">Separated link</a></li>
		                </ul>
		              </div><!-- /btn-group -->
			          </div>
<pre class="prettyprint linenums">
&lt;div class="btn-group"&gt;
  &lt;a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="#"&gt;Sort by&lt;/a&gt;
  &lt;ul class="dropdown-menu"&gt;
    &lt;!-- dropdown menu links --&gt;
  &lt;/ul&gt;
&lt;/div&gt;
</pre>


			          <h4 class="bs-docs-heading">Alternate Style</h4>
			          <!-- <p>Button dropdowns work at any size:  <code>.btn-large</code>, <code>.btn-small</code>, or <code>.btn-mini</code>.</p> -->
			          <p>There's also a light version, by adding <code>.dropdown-toggle-alt</code> to the button</p>
			          <div class="bs-docs-example">
		              
			              <div class="btn-group">
			                <button class="btn dropdown-toggle dropdown-toggle-alt" data-toggle="dropdown">Sort by</button>
			                <ul class="dropdown-menu">
			                  <li><a href="#">Action</a></li>
			                  <li><a href="#">Another action</a></li>
			                  <li><a href="#">Something else here</a></li>
			                  <li class="divider"></li>
			                  <li><a href="#">Separated link</a></li>
			                </ul>
			              </div><!-- /btn-group -->

			              <div class="btn-group" style="margin-left:0">
			                <button class="btn btn-small dropdown-toggle dropdown-toggle-alt" data-toggle="dropdown">Sort by</button>
			                <ul class="dropdown-menu">
			                  <li><a href="#">Action</a></li>
			                  <li><a href="#">Another action</a></li>
			                  <li><a href="#">Something else here</a></li>
			                  <li class="divider"></li>
			                  <li><a href="#">Separated link</a></li>
			                </ul>
			              </div><!-- /btn-group -->
			          </div>



			
			          <h4 class="bs-docs-heading">Requires javascript</h4>
			          <p>Button dropdowns require the <a href="./javascript.html#dropdowns">Bootstrap dropdown plugin</a> to function.</p>
			          <p>In some cases&mdash;like mobile&mdash;dropdown menus will extend outside the viewport. You need to resolve the alignment manually or with custom javascript.</p>
							










			
			          <h4 class="bs-docs-heading">Markup</h4>
			          <p>Looking at just the dropdown menu, here's the required HTML. You need to wrap the dropdown's trigger and the dropdown menu within <code>.dropdown</code>, or another element that declares <code>position: relative;</code>. Then just create the menu.</p>
			
<pre class="prettyprint linenums">
&lt;div class="dropdown"&gt;
  &lt;!-- Link or button to toggle dropdown --&gt;
  &lt;ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"&gt;
    &lt;li&gt;&lt;a tabindex="-1" href="#"&gt;Action&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a tabindex="-1" href="#"&gt;Another action&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a tabindex="-1" href="#"&gt;Something else here&lt;/a&gt;&lt;/li&gt;
    &lt;li class="divider"&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a tabindex="-1" href="#"&gt;Separated link&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Options</h4>
			          <p>Align menus to the right and add include additional levels of dropdowns.</p>
			
			          <h4 class="bs-docs-heading">Aligning the menus</h4>
			          <p>Add <code>.pull-right</code> to a <code>.dropdown-menu</code> to right align the dropdown menu.</p>
<pre class="prettyprint linenums">
&lt;ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel"&gt;
  ...
&lt;/ul&gt;
</pre>
			
			          <h5 class="bs-docs-heading">Sub menus on dropdowns</h5>
			          <p>Add an extra level of dropdown menus, appearing on hover like those of OS X, with some simple markup additions. Add <code>.dropdown-submenu</code> to any <code>li</code> in an existing dropdown menu for automatic styling.</p>
			          <div class="bs-docs-example">
			            <div class="dropdown clearfix">
			              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display: block; position: static; margin-bottom: 5px; *width: 180px;">
			                <li><a tabindex="-1" href="#">Action</a></li>
			                <li><a tabindex="-1" href="#">Another action</a></li>
			                <li><a tabindex="-1" href="#">Something else here</a></li>
			                <li class="divider"></li>
			                <li class="dropdown-submenu">
			                  <a tabindex="-1" href="#">More options</a>
			                  <ul class="dropdown-menu">
			                    <li><a tabindex="-1" href="#">Second level link</a></li>
			                    <li><a tabindex="-1" href="#">Second level link</a></li>
			                    <li><a tabindex="-1" href="#">Second level link</a></li>
			                    <li><a tabindex="-1" href="#">Second level link</a></li>
			                    <li><a tabindex="-1" href="#">Second level link</a></li>
			                  </ul>
			                </li>
			              </ul>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"&gt;
  ...
  &lt;li class="dropdown-submenu"&gt;
    &lt;a tabindex="-1" href="#"&gt;More options&lt;/a&gt;
    &lt;ul class="dropdown-menu"&gt;
      ...
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;
</pre>

			
			
			          <h3 class="bs-docs-heading">Usage</h3>
			
			          <h4 class="bs-docs-heading">Via data attributes</h4>
			          <p>Add <code>data-toggle="dropdown"</code> to a link or button to toggle a dropdown.</p>
<pre class="prettyprint linenums">
&lt;div class="dropdown"&gt;
  &lt;a class="dropdown-toggle" data-toggle="dropdown" href="#"&gt;Dropdown trigger&lt;/a&gt;
  &lt;ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"&gt;
    ...
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			          <p>To keep URLs intact, use the <code>data-target</code> attribute instead of <code>href="#"</code>.</p>
<pre class="prettyprint linenums">
&lt;div class="dropdown"&gt;
  &lt;a class="dropdown-toggle" id="dLabel" role="button" data-toggle="dropdown" data-target="#" href="/page.html"&gt;
    Dropdown
    &lt;b class="caret"&gt;&lt;/b&gt;
  &lt;/a&gt;
  &lt;ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"&gt;
    ...
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Via JavaScript</h4>
			          <p>Call the dropdowns via JavaScript:</p>
			          <pre class="prettyprint linenums">$('.dropdown-toggle').dropdown()</pre>
			
			          <h4 class="bs-docs-heading">Options</h4>
			          <p><em>None</em></p>
			
			          <h4 class="bs-docs-heading">Methods</h4>
			          <h5 class="bs-docs-heading">$().dropdown()</h5>
			          <p>A programatic api for activating menus for a given navbar or tabbed navigation.</p>
			        </section>
			
			
			




			
			<!--==================================================
			 Tabs
			================================================== -->
			        <section id="tabs" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Togglable tabs <small>bootstrap-tab.js</small></h2>
			
			
			          <h3 class="bs-docs-heading">Example tabs</h3>
			          <p>Add quick, dynamic tab functionality to transiton through panes of local content, even via dropdown menus.</p>
			          <div class="bs-docs-example">
			            <ul id="myTab" class="simple-nav nav-tabs">
			              <li class="active"><a href="#home" data-toggle="tab">Home</a></li>
			              <li><a href="#profile" data-toggle="tab">Profile</a></li>
			              <li class="dropdown">
			                <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
			                <ul class="dropdown-menu">
			                  <li><a href="#dropdown1" data-toggle="tab">@fat</a></li>
			                  <li><a href="#dropdown2" data-toggle="tab">@mdo</a></li>
			                </ul>
			              </li>
			            </ul>
			            <div id="myTabContent" class="tab-content">
			              <div class="tab-pane fade in active" id="home">
			                <p>Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
			              </div>
			              <div class="tab-pane fade" id="profile">
			                <p>Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
			              </div>
			              <div class="tab-pane fade" id="dropdown1">
			                <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork. Williamsburg banh mi whatever gluten-free, carles pitchfork biodiesel fixie etsy retro mlkshk vice blog. Scenester cred you probably haven't heard of them, vinyl craft beer blog stumptown. Pitchfork sustainable tofu synth chambray yr.</p>
			              </div>
			              <div class="tab-pane fade" id="dropdown2">
			                <p>Trust fund seitan letterpress, keytar raw denim keffiyeh etsy art party before they sold out master cleanse gluten-free squid scenester freegan cosby sweater. Fanny pack portland seitan DIY, art party locavore wolf cliche high life echo park Austin. Cred vinyl keffiyeh DIY salvia PBR, banh mi before they sold out farm-to-table VHS viral locavore cosby sweater. Lomo wolf viral, mustache readymade thundercats keffiyeh craft beer marfa ethical. Wolf salvia freegan, sartorial keffiyeh echo park vegan.</p>
			              </div>
			            </div>
			          </div>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Usage</h3>
			          <p>Enable tabbable tabs via JavaScript (each tab needs to be activated individually):</p>
<pre class="prettyprint linenums">
$('#myTab a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
})</pre>
			          <p>You can activate individual tabs in several ways:</p>
<pre class="prettyprint linenums">
$('#myTab a[href="#profile"]').tab('show'); // Select tab by name
$('#myTab a:first').tab('show'); // Select first tab
$('#myTab a:last').tab('show'); // Select last tab
$('#myTab li:eq(2) a').tab('show'); // Select third tab (0-indexed)
</pre>
			
			          <h4 class="bs-docs-heading">Markup</h4>
			          <p>You can activate a tab or pill navigation without writing any JavaScript by simply specifying <code>data-toggle="tab"</code> or <code>data-toggle="pill"</code> on an element. Adding the <code>simple-nav</code> and <code>nav-tabs</code> classes to the tab <code>ul</code> will apply the Bootstrap tab styling.</p>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-tabs"&gt;
  &lt;li&gt;&lt;a href="#home" data-toggle="tab"&gt;Home&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#profile" data-toggle="tab"&gt;Profile&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#messages" data-toggle="tab"&gt;Messages&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#settings" data-toggle="tab"&gt;Settings&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;</pre>
			
			          <h4 class="bs-docs-heading">Methods</h4>
			          <h5 class="bs-docs-heading">$().tab</h5>
			          <p>
			            Activates a tab element and content container. Tab should have either a <code>data-target</code> or an <code>href</code> targeting a container node in the DOM.
			          </p>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-tabs" id="myTab"&gt;
  &lt;li class="active"&gt;&lt;a href="#home"&gt;Home&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#profile"&gt;Profile&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#messages"&gt;Messages&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#settings"&gt;Settings&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;

&lt;div class="tab-content"&gt;
  &lt;div class="tab-pane active" id="home"&gt;...&lt;/div&gt;
  &lt;div class="tab-pane" id="profile"&gt;...&lt;/div&gt;
  &lt;div class="tab-pane" id="messages"&gt;...&lt;/div&gt;
  &lt;div class="tab-pane" id="settings"&gt;...&lt;/div&gt;
&lt;/div&gt;

&lt;script&gt;
  $(function () {
    $('#myTab a:last').tab('show');
  })
&lt;/script&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Events</h4>
			          <table class="table table-bordered table-striped">
			            <thead>
			             <tr>
			               <th style="width: 150px;">Event</th>
			               <th>Description</th>
			             </tr>
			            </thead>
			            <tbody>
			             <tr>
			               <td>show</td>
			               <td>This event fires on tab show, but before the new tab has been shown. Use <code>event.target</code> and <code>event.relatedTarget</code> to target the active tab and the previous active tab (if available) respectively.</td>
			            </tr>
			            <tr>
			               <td>shown</td>
			               <td>This event fires on tab show after a tab has been shown. Use <code>event.target</code> and <code>event.relatedTarget</code> to target the active tab and the previous active tab (if available) respectively.</td>
			             </tr>
			            </tbody>
			          </table>
<pre class="prettyprint linenums">
$('a[data-toggle="tab"]').on('shown', function (e) {
  e.target // activated tab
  e.relatedTarget // previous tab
})
</pre>
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Nav, Tabs, & Pills
			================================================== -->
			        <section id="navs" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Nav: tabs, pills, and lists</small></h2>
			          <h3 class="bs-docs-heading">Lightweight defaults <small>Same markup, different classes</small></h3>
			          <p>All nav components here&mdash;tabs, pills, and lists&mdash;<strong>share the same base markup and styles</strong> through the <code>.simple-nav</code> class.</p>
			
			          <h4 class="bs-docs-heading">Basic tabs</h4>
			          <p>Take a regular <code>&lt;ul&gt;</code> of links and add <code>.nav-tabs</code>:</p>
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-tabs">
			              <li class="active"><a href="#">Home</a></li>
			              <li><a href="#">Profile</a></li>
			              <li><a href="#">Messages</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-tabs"&gt;
  &lt;li class="active"&gt;
    &lt;a href="#"&gt;Home&lt;/a&gt;
  &lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;...&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;...&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Basic pills</h4>
			          <p>Take that same HTML, but use <code>.nav-pills</code> instead:</p>
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-pills">
			              <li class="active"><a href="#">Home</a></li>
			              <li><a href="#">Profile</a></li>
			              <li><a href="#">Messages</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-pills"&gt;
  &lt;li class="active"&gt;
    &lt;a href="#"&gt;Home&lt;/a&gt;
  &lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;...&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;...&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Disabled state</h4>
			          <p>For any nav component (tabs, pills, or list), add <code>.disabled</code> for <strong>gray links and no hover effects</strong>. Links will remain clickable, however, unless custom javascript is implemented to prevent those clicks.</p>
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-pills">
			              <li><a href="#">Clickable link</a></li>
			              <li><a href="#">Clickable link</a></li>
			              <li class="disabled"><a href="#">Disabled link</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-pills"&gt;
  ...
  &lt;li class="disabled"&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;
  ...
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Component alignment</h4>
			          <p>To align nav links, use the <code>.pull-left</code> or <code>.pull-right</code> utility classes. Both classes will add a CSS float in the specified direction.</p>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Stackable</h3>
			          <p>As tabs and pills are horizontal by default, just add a second class, <code>.simple-nav-stacked</code>, to make them appear vertically stacked.</p>
			
			          <h4 class="bs-docs-heading">Stacked tabs</h4>
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-tabs simple-nav-stacked">
			              <li class="active"><a href="#">Home</a></li>
			              <li><a href="#">Profile</a></li>
			              <li><a href="#">Messages</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-tabs simple-nav-stacked"&gt;
			  ...
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Stacked pills</h4>
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-pills simple-nav-stacked">
			              <li class="active"><a href="#">Home</a></li>
			              <li><a href="#">Profile</a></li>
			              <li><a href="#">Messages</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-pills simple-nav-stacked"&gt;
  ...
&lt;/ul&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Tabs with dropdowns</h3>
			          <p>Add dropdown menus with a little extra HTML and the <a href="./javascript.html#dropdowns">dropdowns javascript plugin</a>.</p>
			
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-tabs">
			              <li class="active"><a href="#">Home</a></li>
			              <li><a href="#">Help</a></li>
			              <li class="dropdown">
			                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
			                <ul class="dropdown-menu">
			                  <li><a href="#">Action</a></li>
			                  <li><a href="#">Another action</a></li>
			                  <li><a href="#">Something else here</a></li>
			                  <li class="divider"></li>
			                  <li><a href="#">Separated link</a></li>
			                </ul>
			              </li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-tabs"&gt;
  &lt;li class="dropdown"&gt;
    &lt;a class="dropdown-toggle"
       data-toggle="dropdown"
       href="#"&gt;
        Dropdown
        &lt;b class="caret"&gt;&lt;/b&gt;
      &lt;/a&gt;
    &lt;ul class="dropdown-menu"&gt;
      &lt;!-- links --&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Pills with dropdowns</h4>
			          <div class="bs-docs-example">
			            <ul class="simple-nav nav-pills">
			              <li class="active"><a href="#">Home</a></li>
			              <li><a href="#">Help</a></li>
			              <li class="dropdown">
			                <a class="dropdown-toggle" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
			                <ul class="dropdown-menu">
			                  <li><a href="#">Action</a></li>
			                  <li><a href="#">Another action</a></li>
			                  <li><a href="#">Something else here</a></li>
			                  <li class="divider"></li>
			                  <li><a href="#">Separated link</a></li>
			                </ul>
			              </li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-pills"&gt;
  &lt;li class="dropdown"&gt;
    &lt;a class="dropdown-toggle"
       data-toggle="dropdown"
       href="#"&gt;
        Dropdown
        &lt;b class="caret"&gt;&lt;/b&gt;
      &lt;/a&gt;
    &lt;ul class="dropdown-menu"&gt;
      &lt;!-- links --&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Nav lists</h3>
			          <p>A simple and easy way to build groups of nav links with optional headers. They're best used in sidebars like the Finder in OS X.</p>
			
			          <h4 class="bs-docs-heading">Example nav list</h4>
			          <p>Take a list of links and add <code>class="simple-nav nav-list"</code>:</p>
			          <div class="bs-docs-example">
			            <div class="well" style="max-width: 340px; padding: 8px 0;">
			              <ul class="simple-nav nav-list">
			                <li class="simple-nav-header">List header</li>
			                <li class="active"><a href="#">Home</a></li>
			                <li><a href="#">Library</a></li>
			                <li><a href="#">Applications</a></li>
			                <li class="simple-nav-header">Another list header</li>
			                <li><a href="#">Profile</a></li>
			                <li><a href="#">Settings</a></li>
			                <li class="divider"></li>
			                <li><a href="#">Help</a></li>
			              </ul>
			            </div> <!-- /well -->
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-list"&gt;
  &lt;li class="simple-nav-header"&gt;List header&lt;/li&gt;
  &lt;li class="active"&gt;&lt;a href="#"&gt;Home&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;Library&lt;/a&gt;&lt;/li&gt;
  ...
&lt;/ul&gt;
</pre>
			          <p>
			            <span class="label label-info">Note</span>
			            For nesting within a nav list, include <code>class="simple-nav nav-list"</code> on any nested <code>&lt;ul&gt;</code>.
			          </p>
			
			          <h4 class="bs-docs-heading">Horizontal dividers</h4>
			          <p>Add a horizontal divider by creating an empty list item with the class <code>.divider</code>, like so:</p>
<pre class="prettyprint linenums">
&lt;ul class="simple-nav nav-list"&gt;
  ...
  &lt;li class="divider"&gt;&lt;/li&gt;
  ...
&lt;/ul&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Tabbable nav</h3>
			          <p>Bring your tabs to life with a simple plugin to toggle between content via tabs. Bootstrap integrates tabbable tabs in four styles: top (default), right, bottom, and left.</p>
			
			          <h4 class="bs-docs-heading">Tabbable example</h4>
			          <p>To make tabs tabbable, create a <code>.tab-pane</code> with unique ID for every tab and wrap them in <code>.tab-content</code>.</p>
			          <div class="bs-docs-example">
			            <div class="tabbable" style="margin-bottom: 18px;">
			              <ul class="simple-nav nav-tabs">
			                <li class="active"><a href="#tab1" data-toggle="tab">Section 1</a></li>
			                <li><a href="#tab2" data-toggle="tab">Section 2</a></li>
			                <li><a href="#tab3" data-toggle="tab">Section 3</a></li>
			              </ul>
			              <div class="tab-content" style="padding-bottom: 9px; border-bottom: 1px solid #ddd;">
			                <div class="tab-pane active" id="tab1">
			                  <p>I'm in Section 1.</p>
			                </div>
			                <div class="tab-pane" id="tab2">
			                  <p>Howdy, I'm in Section 2.</p>
			                </div>
			                <div class="tab-pane" id="tab3">
			                  <p>What up girl, this is Section 3.</p>
			                </div>
			              </div>
			            </div> <!-- /tabbable -->
			          </div>
<pre class="prettyprint linenums">
&lt;div class="tabbable"&gt; &lt;!-- Only required for left/right tabs --&gt;
  &lt;ul class="simple-nav nav-tabs"&gt;
    &lt;li class="active"&gt;&lt;a href="#tab1" data-toggle="tab"&gt;Section 1&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#tab2" data-toggle="tab"&gt;Section 2&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
  &lt;div class="tab-content"&gt;
    &lt;div class="tab-pane active" id="tab1"&gt;
      &lt;p&gt;I'm in Section 1.&lt;/p&gt;
    &lt;/div&gt;
    &lt;div class="tab-pane" id="tab2"&gt;
      &lt;p&gt;Howdy, I'm in Section 2.&lt;/p&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h5 class="bs-docs-heading">Fade in tabs</h5>
			          <p>To make tabs fade in, add <code>.fade</code> to each <code>.tab-pane</code>.</p>
			
			          <h5 class="bs-docs-heading">Requires jQuery plugin</h5>
			          <p>All tabbable tabs are powered by our lightweight jQuery plugin. Read more about how to bring tabbable tabs to life <a href="./javascript.html#tabs">on the javascript docs page</a>.</p>
			
			          <h4 class="bs-docs-heading">Tabbable in any direction</h4>
			
			          <h5 class="bs-docs-heading">Tabs on the bottom</h5>
			          <p>Flip the order of the HTML and add a class to put tabs on the bottom.</p>
			          <div class="bs-docs-example">
			            <div class="tabbable tabs-below">
			              <div class="tab-content">
			                <div class="tab-pane active" id="A">
			                  <p>I'm in Section A.</p>
			                </div>
			                <div class="tab-pane" id="B">
			                  <p>Howdy, I'm in Section B.</p>
			                </div>
			                <div class="tab-pane" id="C">
			                  <p>What up girl, this is Section C.</p>
			                </div>
			              </div>
			              <ul class="simple-nav nav-tabs">
			                <li class="active"><a href="#A" data-toggle="tab">Section 1</a></li>
			                <li><a href="#B" data-toggle="tab">Section 2</a></li>
			                <li><a href="#C" data-toggle="tab">Section 3</a></li>
			              </ul>
			            </div> <!-- /tabbable -->
         				</div>
<pre class="prettyprint linenums">
&lt;div class="tabbable tabs-below"&gt;
  &lt;div class="tab-content"&gt;
    ...
  &lt;/div&gt;
  &lt;ul class="simple-nav nav-tabs"&gt;
    ...
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			
			          <h5 class="bs-docs-heading">Tabs on the left</h5>
			          <p>Swap the class to put tabs on the left.</p>
			          <div class="bs-docs-example">
			            <div class="tabbable tabs-left">
			              <ul class="simple-nav nav-tabs">
			                <li class="active"><a href="#lA" data-toggle="tab">Section 1</a></li>
			                <li><a href="#lB" data-toggle="tab">Section 2</a></li>
			                <li><a href="#lC" data-toggle="tab">Section 3</a></li>
			              </ul>
			              <div class="tab-content">
			                <div class="tab-pane active" id="lA">
			                  <p>I'm in Section A.</p>
			                </div>
			                <div class="tab-pane" id="lB">
			                  <p>Howdy, I'm in Section B.</p>
			                </div>
			                <div class="tab-pane" id="lC">
			                  <p>What up girl, this is Section C.</p>
			                </div>
			              </div>
			            </div> <!-- /tabbable -->
			          </div>
<pre class="prettyprint linenums">
&lt;div class="tabbable tabs-left"&gt;
  &lt;ul class="simple-nav nav-tabs"&gt;
    ...
  &lt;/ul&gt;
  &lt;div class="tab-content"&gt;
    ...
  &lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h5 class="bs-docs-heading">Tabs on the right</h5>
			          <p>Swap the class to put tabs on the right.</p>
			          <div class="bs-docs-example">
			            <div class="tabbable tabs-right">
			              <ul class="simple-nav nav-tabs">
			                <li class="active"><a href="#rA" data-toggle="tab">Section 1</a></li>
			                <li><a href="#rB" data-toggle="tab">Section 2</a></li>
			                <li><a href="#rC" data-toggle="tab">Section 3</a></li>
			              </ul>
			              <div class="tab-content">
			                <div class="tab-pane active" id="rA">
			                  <p>I'm in Section A.</p>
			                </div>
			                <div class="tab-pane" id="rB">
			                  <p>Howdy, I'm in Section B.</p>
			                </div>
			                <div class="tab-pane" id="rC">
			                  <p>What up girl, this is Section C.</p>
			                </div>
			              </div>
			            </div> <!-- /tabbable -->
			          </div>
<pre class="prettyprint linenums">
&lt;div class="tabbable tabs-right"&gt;
  &lt;ul class="simple-nav nav-tabs"&gt;
    ...
  &lt;/ul&gt;
  &lt;div class="tab-content"&gt;
    ...
  &lt;/div&gt;
&lt;/div&gt;
</pre>
			
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Buttons
			================================================== -->
			          <section id="buttons" class="NotUpdatedYet">
			            <h2 class="bs-docs-heading">Buttons <small>bootstrap-button.js</small></h2>
			
			            <h3 class="bs-docs-heading">Example uses</h3>
			            <p>Do more with buttons. Control button states or create groups of buttons for more components like toolbars.</p>
			
			            <h5 class="bs-docs-heading">Stateful</h5>
			            <p>Add data-loading-text="Loading..." to use a loading state on a button.</p>
			            <div class="bs-docs-example" style="padding-bottom: 24px;">
			              <button type="button" id="fat-btn" data-loading-text="loading..." class="btn btn-primary">
			                Loading state
			              </button>
			            </div>
			            <pre class="prettyprint linenums">&lt;button type="button" class="btn btn-primary" data-loading-text="Loading..."&gt;Loading state&lt;/button&gt;</pre>
			
			            <h5 class="bs-docs-heading">Single toggle</h5>
			            <p>Add data-toggle="button" to activate toggling on a single button.</p>
			            <div class="bs-docs-example" style="padding-bottom: 24px;">
			              <button type="button" class="btn btn-primary" data-toggle="button">Single Toggle</button>
			            </div>
			            <pre class="prettyprint linenums">&lt;button type="button" class="btn" data-toggle="button"&gt;Single Toggle&lt;/button&gt;</pre>
			
			            <h5 class="bs-docs-heading">Checkbox</h5>
			            <p>Add data-toggle="buttons-checkbox" for checkbox style toggling on btn-group.</p>
			            <div class="bs-docs-example" style="padding-bottom: 24px;">
			              <div class="btn-group" data-toggle="buttons-checkbox">
			                <button type="button" class="btn btn-primary">Left</button>
			                <button type="button" class="btn btn-primary">Middle</button>
			                <button type="button" class="btn btn-primary">Right</button>
			              </div>
			            </div>
<pre class="prettyprint linenums">
&lt;div class="btn-group" data-toggle="buttons-checkbox"&gt;
  &lt;button type="button" class="btn"&gt;Left&lt;/button&gt;
  &lt;button type="button" class="btn"&gt;Middle&lt;/button&gt;
  &lt;button type="button" class="btn"&gt;Right&lt;/button&gt;
&lt;/div&gt;
</pre>
			
			            <h5 class="bs-docs-heading">Radio</h5>
			            <p>Add data-toggle="buttons-radio" for radio style toggling on btn-group.</p>
			            <div class="bs-docs-example" style="padding-bottom: 24px;">
			              <div class="btn-group" data-toggle="buttons-radio">
			                <button type="button" class="btn btn-primary">Left</button>
			                <button type="button" class="btn btn-primary">Middle</button>
			                <button type="button" class="btn btn-primary">Right</button>
			              </div>
			            </div>
<pre class="prettyprint linenums">
&lt;div class="btn-group" data-toggle="buttons-radio"&gt;
  &lt;button type="button" class="btn"&gt;Left&lt;/button&gt;
  &lt;button type="button" class="btn"&gt;Middle&lt;/button&gt;
  &lt;button type="button" class="btn"&gt;Right&lt;/button&gt;
&lt;/div&gt;
</pre>
			
			
			            <hr class="bs-docs-separator">
			
			
			            <h3 class="bs-docs-heading">Usage</h3>
			            <p>Enable buttons via JavaScript:</p>
			            <pre class="prettyprint linenums">$('.nav-tabs').button()</pre>
			
			            <h4 class="bs-docs-heading">Markup</h4>
			            <p>Data attributes are integral to the button plugin. Check out the example code below for the various markup types.</p>
			
			            <h4 class="bs-docs-heading">Options</h4>
			            <p><em>None</em></p>
			
			            <h4 class="bs-docs-heading">Methods</h4>
			            <h5 class="bs-docs-heading">$().button('toggle')</h5>
			            <p>Toggles push state. Gives the button the appearance that it has been activated.</p>
			            <div class="alert alert-info">
			              <strong>Heads up!</strong>
			              You can enable auto toggling of a button by using the <code>data-toggle</code> attribute.
			            </div>
			            <pre class="prettyprint linenums">&lt;button type="button" class="btn" data-toggle="button" &gt;…&lt;/button&gt;</pre>
			            <h5 class="bs-docs-heading">$().button('loading')</h5>
			            <p>Sets button state to loading - disables button and swaps text to loading text. Loading text should be defined on the button element using the data attribute <code>data-loading-text</code>.
			            </p>
			            <pre class="prettyprint linenums">&lt;button type="button" class="btn" data-loading-text="loading stuff..." &gt;...&lt;/button&gt;</pre>
			            <div class="alert alert-info">
			              <strong>Heads up!</strong>
			              <a href="https://github.com/twitter/bootstrap/issues/793">Firefox persists the disabled state across page loads</a>. A workaround for this is to use <code>autocomplete="off"</code>.
			            </div>
			            <h5 class="bs-docs-heading">$().button('reset')</h5>
			            <p>Resets button state - swaps text to original text.</p>
			            <h5 class="bs-docs-heading">$().button(string)</h5>
			            <p>Resets button state - swaps text to any data defined text state.</p>
<pre class="prettyprint linenums">&lt;button type="button" class="btn" data-complete-text="finished!" &gt;...&lt;/button&gt;
&lt;script&gt;
  $('.btn').button('complete')
&lt;/script&gt;
</pre>
			          </section>
			
			
			
			
			
			
			
			<!--==================================================
			 Collapse
			================================================== -->
			          <section id="collapse" class="NotUpdatedYet">
			            <h2 class="bs-docs-heading">Collapse <small>bootstrap-collapse.js</small></h2>
			
			            <h4 class="bs-docs-heading">About</h4>
			            <p>Get base styles and flexible support for collapsible components like accordions and navigation.</p>
			            <p class="muted"><strong>*</strong> Requires the Transitions plugin to be included.</p>
			
			            <h3 class="bs-docs-heading">Example accordion</h3>
			            <p>Using the collapse plugin, we built a simple accordion style widget:</p>
			
			            <div class="bs-docs-example">
			              <div class="accordion" id="accordion2">
			                <div class="accordion-group">
			                  <div class="accordion-heading">
			                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">
			                      Collapsible Group Item #1
			                    </a>
			                  </div>
			                  <div id="collapseOne" class="accordion-body collapse in">
			                    <div class="accordion-inner">
			                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
			                    </div>
			                  </div>
			                </div>
			                <div class="accordion-group">
			                  <div class="accordion-heading">
			                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseTwo">
			                      Collapsible Group Item #2
			                    </a>
			                  </div>
			                  <div id="collapseTwo" class="accordion-body collapse">
			                    <div class="accordion-inner">
			                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
			                    </div>
			                  </div>
			                </div>
			                <div class="accordion-group">
			                  <div class="accordion-heading">
			                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseThree">
			                      Collapsible Group Item #3
			                    </a>
			                  </div>
			                  <div id="collapseThree" class="accordion-body collapse">
			                    <div class="accordion-inner">
			                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
			                    </div>
			                  </div>
			                </div>
			              </div>
			            </div>
<pre class="prettyprint linenums">
&lt;div class="accordion" id="accordion2"&gt;
  &lt;div class="accordion-group"&gt;
    &lt;div class="accordion-heading"&gt;
      &lt;a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne"&gt;
        Collapsible Group Item #1
      &lt;/a&gt;
    &lt;/div&gt;
    &lt;div id="collapseOne" class="accordion-body collapse in"&gt;
      &lt;div class="accordion-inner"&gt;
        Anim pariatur cliche...
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="accordion-group"&gt;
    &lt;div class="accordion-heading"&gt;
      &lt;a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseTwo"&gt;
        Collapsible Group Item #2
      &lt;/a&gt;
    &lt;/div&gt;
    &lt;div id="collapseTwo" class="accordion-body collapse"&gt;
      &lt;div class="accordion-inner"&gt;
        Anim pariatur cliche...
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
...
</pre>
			            <p>You can also use the plugin without the accordion markup. Make a button toggle the expanding and collapsing of another element.</p>
<pre class="prettyprint linenums">
&lt;button type="button" class="btn btn-danger" data-toggle="collapse" data-target="#demo"&gt;
  simple collapsible
&lt;/button&gt;
			
&lt;div id="demo" class="collapse in"&gt; … &lt;/div&gt;
</pre>
			
			
			            <hr class="bs-docs-separator">
			
			
			            <h3 class="bs-docs-heading">Usage</h3>
			
			            <h4 class="bs-docs-heading">Via data attributes</h4>
			            <p>Just add <code>data-toggle="collapse"</code> and a <code>data-target</code> to element to automatically assign control of a collapsible element. The <code>data-target</code> attribute accepts a css selector to apply the collapse to. Be sure to add the class <code>collapse</code> to the collapsible element. If you'd like it to default open, add the additional class <code>in</code>.</p>
			            <p>To add accordion-like group management to a collapsible control, add the data attribute <code>data-parent="#selector"</code>. Refer to the demo to see this in action.</p>
			
			            <h4 class="bs-docs-heading">Via JavaScript</h4>
			            <p>Enable manually with:</p>
			            <pre class="prettyprint linenums">$(".collapse").collapse()</pre>
			
			            <h4 class="bs-docs-heading">Options</h4>
			            <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-parent=""</code>.</p>
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
			                 <td>parent</td>
			                 <td>selector</td>
			                 <td>false</td>
			                 <td>If selector then all collapsible elements under the specified parent will be closed when this collapsible item is shown. (similar to traditional accordion behavior)</td>
			               </tr>
			               <tr>
			                 <td>toggle</td>
			                 <td>boolean</td>
			                 <td>true</td>
			                 <td>Toggles the collapsible element on invocation</td>
			               </tr>
			              </tbody>
			            </table>
			
			
			            <h4 class="bs-docs-heading">Methods</h4>
			            <h5 class="bs-docs-heading">.collapse(options)</h5>
			            <p>Activates your content as a collapsible element. Accepts an optional options <code>object</code>.
<pre class="prettyprint linenums">
$('#myCollapsible').collapse({
  toggle: false
})
</pre>
			            <h5 class="bs-docs-heading">.collapse('toggle')</h5>
			            <p>Toggles a collapsible element to shown or hidden.</p>
			            <h5 class="bs-docs-heading">.collapse('show')</h5>
			            <p>Shows a collapsible element.</p>
			            <h5 class="bs-docs-heading">.collapse('hide')</h5>
			            <p>Hides a collapsible element.</p>
			
			            <h4 class="bs-docs-heading">Events</h4>
			            <p>Bootstrap's collapse class exposes a few events for hooking into collapse functionality.</p>
			            <table class="table table-bordered table-striped">
			              <thead>
			               <tr>
			                 <th style="width: 150px;">Event</th>
			                 <th>Description</th>
			               </tr>
			              </thead>
			              <tbody>
			               <tr>
			                 <td>show</td>
			                 <td>This event fires immediately when the <code>show</code> instance method is called.</td>
			               </tr>
			               <tr>
			                 <td>shown</td>
			                 <td>This event is fired when a collapse element has been made visible to the user (will wait for css transitions to complete).</td>
			               </tr>
			               <tr>
			                 <td>hide</td>
			                 <td>
			                  This event is fired immediately when the <code>hide</code> method has been called.
			                 </td>
			               </tr>
			               <tr>
			                 <td>hidden</td>
			                 <td>This event is fired when a collapse element has been hidden from the user (will wait for css transitions to complete).</td>
			               </tr>
			              </tbody>
			            </table>
<pre class="prettyprint linenums">
$('#myCollapsible').on('hidden', function () {
  // do something…
})</pre>
			          </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Alerts
			================================================== -->
			        <section id="alerts" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Alerts <small>Styles for success, warning, and error messages</small></h2>
			
			          <h3 class="bs-docs-heading">Default alert</h3>
			          <p>Wrap any text and an optional dismiss button in <code>.alert</code> for a basic warning alert message.</p>
			          <div class="bs-docs-example">
			            <div class="alert">
			              <button type="button" class="close" data-dismiss="alert">&times;</button>
			              <strong>Warning!</strong> Best check yo self, you're not looking too good.
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="alert"&gt;
  &lt;button type="button" class="close" data-dismiss="alert"&gt;&times;&lt;/button&gt;
  &lt;strong&gt;Warning!&lt;/strong&gt; Best check yo self, you're not looking too good.
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Dismiss buttons</h4>
			          <p>Mobile Safari and Mobile Opera browsers, in addition to the <code>data-dismiss="alert"</code> attribute, require an <code>href="#"</code> for the dismissal of alerts when using an <code>&lt;a&gt;</code> tag.</p>
			          <pre class="prettyprint linenums">&lt;a href="#" class="close" data-dismiss="alert"&gt;&times;&lt;/a&gt;</pre>
			          <p>Alternatively, you may use a <code>&lt;button&gt;</code> element with the data attribute, which we have opted to do for our docs. When using <code>&lt;button&gt;</code>, you must include <code>type="button"</code> or your forms may not submit.</p>
			          <pre class="prettyprint linenums">&lt;button type="button" class="close" data-dismiss="alert"&gt;&times;&lt;/button&gt;</pre>
			
			          <h4 class="bs-docs-heading">Dismiss alerts via javascript</h4>
			          <p>Use the <a href="./javascript.html#alerts">alerts jQuery plugin</a> for quick and easy dismissal of alerts.</p>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Options</h3>
			          <p>For longer messages, increase the padding on the top and bottom of the alert wrapper by adding <code>.alert-block</code>.</p>
			          <div class="bs-docs-example">
			            <div class="alert alert-block">
			              <button type="button" class="close" data-dismiss="alert">&times;</button>
			              <h5 class="bs-docs-heading">Warning!</h5>
			              <p>Best check yo self, you're not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</p>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="alert alert-block"&gt;
  &lt;button type="button" class="close" data-dismiss="alert"&gt;&times;&lt;/button&gt;
  &lt;h4&gt;Warning!&lt;/h4&gt;
  Best check yo self, you're not...
&lt;/div&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Contextual alternatives</h3>
			          <p>Add optional classes to change an alert's connotation.</p>
			
			          <h4 class="bs-docs-heading">Error or danger</h4>
			          <div class="bs-docs-example">
			            <div class="alert alert-error">
			              <button type="button" class="close" data-dismiss="alert">&times;</button>
			              <strong>Oh snap!</strong> Change a few things up and try submitting again.
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="alert alert-error"&gt;
  ...
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Success</h4>
			          <div class="bs-docs-example">
			            <div class="alert alert-success">
			              <button type="button" class="close" data-dismiss="alert">&times;</button>
			              <strong>Well done!</strong> You successfully read this important alert message.
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="alert alert-success"&gt;
  ...
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Information</h4>
			          <div class="bs-docs-example">
			            <div class="alert alert-info">
			              <button type="button" class="close" data-dismiss="alert">&times;</button>
			              <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="alert alert-info"&gt;
  ...
&lt;/div&gt;
</pre>
			
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Alert
			================================================== -->
			      <section id="alerts" class="NotUpdatedYet">
			        <h2 class="bs-docs-heading">Alert messages <small>bootstrap-alert.js</small></h2>
			
			
			        <h3 class="bs-docs-heading">Example alerts</h3>
			        <p>Add dismiss functionality to all alert messages with this plugin.</p>
			        <div class="bs-docs-example">
			          <div class="alert fade in">
			            <button type="button" class="close" data-dismiss="alert">&times;</button>
			            <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
			          </div>
			        </div>
			
			        <div class="bs-docs-example">
			          <div class="alert alert-block alert-error fade in">
			            <button type="button" class="close" data-dismiss="alert">&times;</button>
			            <h4 class="alert-heading">Oh snap! You got an error!</h5>
			            <p>Change this and that and try again. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum.</p>
			            <p>
			              <a class="btn btn-danger" href="#">Take this action</a> <a class="btn" href="#">Or do this</a>
			            </p>
			          </div>
			        </div>
			
			
			        <hr class="bs-docs-separator">
			
			
			        <h3 class="bs-docs-heading">Usage</h3>
			        <p>Enable dismissal of an alert via JavaScript:</p>
			        <pre class="prettyprint linenums">$(".alert").alert()</pre>
			
			        <h4 class="bs-docs-heading">Markup</h4>
			        <p>Just add <code>data-dismiss="alert"</code> to your close button to automatically give an alert close functionality.</p>
			        <pre class="prettyprint linenums">&lt;a class="close" data-dismiss="alert" href="#"&gt;&amp;times;&lt;/a&gt;</pre>
			
			        <h4 class="bs-docs-heading">Methods</h4>
			        <h5 class="bs-docs-heading">$().alert()</h5>
			        <p>Wraps all alerts with close functionality. To have your alerts animate out when closed, make sure they have the <code>.fade</code> and <code>.in</code> class already applied to them.</p>
			        <h5 class="bs-docs-heading">.alert('close')</h5>
			        <p>Closes an alert.</p>
			        <pre class="prettyprint linenums">$(".alert").alert('close')</pre>
			
			
			        <h4 class="bs-docs-heading">Events</h4>
			        <p>Bootstrap's alert class exposes a few events for hooking into alert functionality.</p>
			        <table class="table table-bordered table-striped">
			          <thead>
			           <tr>
			             <th style="width: 150px;">Event</th>
			             <th>Description</th>
			           </tr>
			          </thead>
			          <tbody>
			           <tr>
			             <td>close</td>
			             <td>This event fires immediately when the <code>close</code> instance method is called.</td>
			           </tr>
			           <tr>
			             <td>closed</td>
			             <td>This event is fired when the alert has been closed (will wait for css transitions to complete).</td>
			           </tr>
			          </tbody>
			        </table>
<pre class="prettyprint linenums">
$('#my-alert').bind('closed', function () {
  // do something…
})
</pre>
			      </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Modal
			================================================== -->
			        <section id="modals" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Modals <small>bootstrap-modal.js</small></h2>
			
			
			          <h3 class="bs-docs-heading">Examples</h3>
			          <p>Modals are streamlined, but flexible, dialog prompts with the minimum required functionality and smart defaults.</p>
			
			          <h4 class="bs-docs-heading">Static example</h4>
			          <p>A rendered modal with header, body, and set of actions in the footer.</p>
			          <div class="bs-docs-example" style="background-color: #f5f5f5;">
			            <div class="modal" style="position: relative; top: auto; left: auto; margin: 0 auto 20px; z-index: 1; max-width: 100%;">
			              <div class="modal-header">
			                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			                <h4 class="bs-docs-heading">Modal header</h4>
			              </div>
			              <div class="modal-body">
			                <p>One fine body…</p>
			              </div>
			              <div class="modal-footer">
			                <a href="#" class="btn btn-secondary">Close</a>
			                <a href="#" class="btn btn-primary">Save changes</a>
			              </div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="modal hide fade"&gt;
  &lt;div class="modal-header"&gt;
    &lt;button type="button" class="close" data-dismiss="modal" aria-hidden="true"&gt;&amp;times;&lt;/button&gt;
    &lt;h3&gt;Modal header&lt;/h3&gt;
  &lt;/div&gt;
  &lt;div class="modal-body"&gt;
    &lt;p&gt;One fine body…&lt;/p&gt;
  &lt;/div&gt;
  &lt;div class="modal-footer"&gt;
    &lt;a href="#" class="btn"&gt;Close&lt;/a&gt;
    &lt;a href="#" class="btn btn-primary"&gt;Save changes&lt;/a&gt;
  &lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Live demo</h4>
			          <p>Toggle a modal via JavaScript by clicking the button below. It will slide down and fade in from the top of the page.</p>
			          <!-- sample modal content -->
			          <div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			            <div class="modal-header">
			              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			              <h3 id="myModalLabel">Modal Heading</h4>
			            </div>
			            <div class="modal-body">
			              <h5 class="bs-docs-heading">Text in a modal</h5>
			              <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem.</p>
			
			              <h5 class="bs-docs-heading">Popover in a modal</h5>
			              <p>This <a href="#" role="button" class="btn popover-test" title="A Title" data-content="And here's some amazing content. It's very engaging. right?">button</a> should trigger a popover on hover.</p>
			
			              <h5 class="bs-docs-heading">Tooltips in a modal</h5>
			              <p><a href="#" class="tooltip-test" title="Tooltip">This link</a> and <a href="#" class="tooltip-test" title="Tooltip">that link</a> should have tooltips on hover.</p>
			
			              <hr>
			
			              <h5 class="bs-docs-heading">Overflowing text to show optional scrollbar</h5>
			              <p>We set a fixed <code>max-height</code> on the <code>.modal-body</code>. Watch it overflow with all this extra lorem ipsum text we've included.</p>
			              <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
			              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
			              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
			              <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
			              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
			              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
			            </div>
			            <div class="modal-footer">
			              <button class="btn" data-dismiss="modal">Close</button>
			              <button class="btn btn-primary">Save changes</button>
			            </div>
			          </div>
			          <div class="bs-docs-example" style="padding-bottom: 24px;">
			            <a data-toggle="modal" href="#myModal" class="btn btn-primary btn-large">Launch demo modal</a>
			          </div>
<pre class="prettyprint linenums">
&lt;-- Button to trigger modal --&gt;
&lt;a href="#myModal" role="button" class="btn" data-toggle="modal"&gt;Launch demo modal&lt;/a&gt;
			
&lt;-- Modal --&gt;
&lt;div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"&gt;
  &lt;div class="modal-header"&gt;
    &lt;button type="button" class="close" data-dismiss="modal" aria-hidden="true"&gt;&times;&lt;/button&gt;
    &lt;h3 id="myModalLabel"&gt;Modal header&lt;/h3&gt;
  &lt;/div&gt;
  &lt;div class="modal-body"&gt;
    &lt;p&gt;One fine body…&lt;/p&gt;
  &lt;/div&gt;
  &lt;div class="modal-footer"&gt;
    &lt;button class="btn" data-dismiss="modal" aria-hidden="true"&gt;Close&lt;/button&gt;
    &lt;button class="btn btn-primary"&gt;Save changes&lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Usage</h3>
			
			          <h4 class="bs-docs-heading">Via data attributes</h4>
			          <p>Activate a modal without writing JavaScript. Set <code>data-toggle="modal"</code> on a controller element, like a button, along with a <code>data-target="#foo"</code> or <code>href="#foo"</code> to target a specific modal to toggle.</p>
			          <pre class="prettyprint linenums">&lt;button type="button" data-toggle="modal" data-target="#myModal"&gt;Launch modal&lt;/button&gt;</pre>
			
			          <h4 class="bs-docs-heading">Via JavaScript</h4>
			          <p>Call a modal with id <code>myModal</code> with a single line of JavaScript:</p>
			          <pre class="prettyprint linenums">$('#myModal').modal(options)</pre>
			
			          <h4 class="bs-docs-heading">Options</h4>
			          <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-backdrop=""</code>.</p>
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
			               <td>backdrop</td>
			               <td>boolean</td>
			               <td>true</td>
			               <td>Includes a modal-backdrop element. Alternatively, specify <code>static</code> for a backdrop which doesn't close the modal on click.</td>
			             </tr>
			             <tr>
			               <td>keyboard</td>
			               <td>boolean</td>
			               <td>true</td>
			               <td>Closes the modal when escape key is pressed</td>
			             </tr>
			             <tr>
			               <td>show</td>
			               <td>boolean</td>
			               <td>true</td>
			               <td>Shows the modal when initialized.</td>
			             </tr>
			             <tr>
			               <td>remote</td>
			               <td>path</td>
			               <td>false</td>
			               <td><p>If a remote url is provided, content will be loaded via jQuery's <code>load</code> method and injected into the <code>.modal-body</code>. If you're using the data api, you may alternatively use the <code>href</code> tag to specify the remote source. An example of this is shown below:</p>
			              <pre class="prettyprint linenums"><code>&lt;a data-toggle="modal" href="remote.html" data-target="#modal"&gt;click me&lt;/a&gt;</code></pre></td>
			             </tr>
			            </tbody>
			          </table>
			
			          <h4 class="bs-docs-heading">Methods</h4>
			          <h5 class="bs-docs-heading">.modal(options)</h5>
			          <p>Activates your content as a modal. Accepts an optional options <code>object</code>.</p>
<pre class="prettyprint linenums">
$('#myModal').modal({
  keyboard: false
})
</pre>
			          <h5 class="bs-docs-heading">.modal('toggle')</h5>
			          <p>Manually toggles a modal.</p>
			          <pre class="prettyprint linenums">$('#myModal').modal('toggle')</pre>
			          <h5 class="bs-docs-heading">.modal('show')</h5>
			          <p>Manually opens a modal.</p>
			          <pre class="prettyprint linenums">$('#myModal').modal('show')</pre>
			          <h5 class="bs-docs-heading">.modal('hide')</h5>
			          <p>Manually hides a modal.</p>
			          <pre class="prettyprint linenums">$('#myModal').modal('hide')</pre>
			          <h4 class="bs-docs-heading">Events</h4>
			          <p>Bootstrap's modal class exposes a few events for hooking into modal functionality.</p>
			          <table class="table table-bordered table-striped">
			            <thead>
			             <tr>
			               <th style="width: 150px;">Event</th>
			               <th>Description</th>
			             </tr>
			            </thead>
			            <tbody>
			             <tr>
			               <td>show</td>
			               <td>This event fires immediately when the <code>show</code> instance method is called.</td>
			             </tr>
			             <tr>
			               <td>shown</td>
			               <td>This event is fired when the modal has been made visible to the user (will wait for css transitions to complete).</td>
			             </tr>
			             <tr>
			               <td>hide</td>
			               <td>This event is fired immediately when the <code>hide</code> instance method has been called.</td>
			             </tr>
			             <tr>
			               <td>hidden</td>
			               <td>This event is fired when the modal has finished being hidden from the user (will wait for css transitions to complete).</td>
			             </tr>
			            </tbody>
			          </table>
<pre class="prettyprint linenums">
$('#myModal').on('hidden', function () {
  // do something…
})
</pre>
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Pagination
			================================================== -->
			        <section id="pagination" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Pagination <small>Two options for paging through content</small></h2>
			
			          <h3 class="bs-docs-heading">Standard pagination</h3>
			          <p>Simple pagination inspired by Rdio, great for apps and search results. The large block is hard to miss, easily scalable, and provides large click areas.</p>
			          <div class="bs-docs-example">
			            <div class="pagination">
			              <ul>
			                <li><a href="#">&laquo;</a></li>
			                <li><a href="#">1</a></li>
			                <li><a href="#">2</a></li>
			                <li><a href="#">3</a></li>
			                <li><a href="#">4</a></li>
			                <li><a href="#">5</a></li>
			                <li><a href="#">&raquo;</a></li>
			              </ul>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="pagination"&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href="#"&gt;Prev&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;1&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;2&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;3&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;4&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href="#"&gt;Next&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Options</h3>
			
			          <h4 class="bs-docs-heading">Disabled and active states</h4>
			          <p>Links are customizable for different circumstances. Use <code>.disabled</code> for unclickable links and <code>.active</code> to indicate the current page.</p>
			          <div class="bs-docs-example">
			            <div class="pagination pagination-centered">
			              <ul>
			                <li class="disabled"><a href="#">&laquo;</a></li>
			                <li class="active"><a href="#">1</a></li>
			                <li><a href="#">2</a></li>
			                <li><a href="#">3</a></li>
			                <li><a href="#">4</a></li>
			                <li><a href="#">5</a></li>
			                <li><a href="#">&raquo;</a></li>
			             </ul>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="pagination"&gt;
  &lt;ul&gt;
    &lt;li class="disabled"&gt;&lt;a href="#"&gt;Prev&lt;/a&gt;&lt;/li&gt;
    &lt;li class="active"&gt;&lt;a href="#"&gt;1&lt;/a&gt;&lt;/li&gt;
    ...
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			          <p>You can optionally swap out active or disabled anchors for spans to remove click functionality while retaining intended styles.</p>
<pre class="prettyprint linenums">
&lt;div class="pagination"&gt;
  &lt;ul&gt;
    &lt;li class="disabled"&gt;&lt;span&gt;Prev&lt;/span&gt;&lt;/li&gt;
    &lt;li class="active"&gt;&lt;span&gt;1&lt;/span&gt;&lt;/li&gt;
    ...
  &lt;/ul&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Alignment</h4>
			          <p>Add one of two optional classes to change the alignment of pagination links: <code>.pagination-centered</code> and <code>.pagination-right</code>.</p>
			          <div class="bs-docs-example">
			            <div class="pagination pagination-centered">
			              <ul>
			                <li><a href="#">&laquo;</a></li>
			                <li><a href="#">1</a></li>
			                <li><a href="#">2</a></li>
			                <li><a href="#">3</a></li>
			                <li><a href="#">4</a></li>
			                <li><a href="#">5</a></li>
			                <li><a href="#">&raquo;</a></li>
			             </ul>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="pagination pagination-centered"&gt;
  ...
&lt;/div&gt;
</pre>
			          <div class="bs-docs-example">
			            <div class="pagination pagination-right">
			              <ul>
			                <li><a href="#">&laquo;</a></li>
			                <li><a href="#">1</a></li>
			                <li><a href="#">2</a></li>
			                <li><a href="#">3</a></li>
			                <li><a href="#">4</a></li>
			                <li><a href="#">5</a></li>
			                <li><a href="#">&raquo;</a></li>
			              </ul>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="pagination pagination-right"&gt;
  ...
&lt;/div&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Pager</h3>
			          <p>Quick previous and next links for simple pagination implementations with light markup and styles. It's great for simple sites like blogs or magazines.</p>
			
			          <h4 class="bs-docs-heading">Default example</h4>
			          <p>By default, the pager centers links.</p>
			          <div class="bs-docs-example">
			            <ul class="pager">
			              <li><a href="#">Previous</a></li>
			              <li><a href="#">Next</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="pager"&gt;
  &lt;li&gt;&lt;a href="#"&gt;Previous&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href="#"&gt;Next&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Aligned links</h4>
			          <p>Alternatively, you can align each link to the sides:</p>
			          <div class="bs-docs-example">
			            <ul class="pager">
			              <li class="previous"><a href="#">&larr; Older</a></li>
			              <li class="next"><a href="#">Newer &rarr;</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="pager"&gt;
  &lt;li class="previous"&gt;
    &lt;a href="#"&gt;&amp;larr; Older&lt;/a&gt;
  &lt;/li&gt;
  &lt;li class="next"&gt;
    &lt;a href="#"&gt;Newer &amp;rarr;&lt;/a&gt;
  &lt;/li&gt;
&lt;/ul&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Optional disabled state</h4>
			          <p>Pager links also use the general <code>.disabled</code> utility class from the pagination.</p>
			          <div class="bs-docs-example">
			            <ul class="pager">
			              <li class="previous disabled"><a href="#">&larr; Older</a></li>
			              <li class="next"><a href="#">Newer &rarr;</a></li>
			            </ul>
			          </div>
<pre class="prettyprint linenums">
&lt;ul class="pager"&gt;
  &lt;li class="previous disabled"&gt;
    &lt;a href="#"&gt;&amp;larr; Older&lt;/a&gt;
  &lt;/li&gt;
  ...
&lt;/ul&gt;
</pre>
			
			        </section><!-- END pagination --> 
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Progress bars
			================================================== -->
			        <section id="progress" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Progress bars <small>For loading, redirecting, or action status</small></h2>
			
			          <h3 class="bs-docs-heading">Examples and markup</h3>
			
			          <h4 class="bs-docs-heading">Basic</h4>
			          <p>Default progress bar with a vertical gradient.</p>
			          <div class="bs-docs-example">
			            <div class="progress">
			              <div class="bar" style="width: 60%;"></div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="progress"&gt;
  &lt;div class="bar" style="width: 60%;"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Striped</h4>
			          <p>Uses a gradient to create a striped effect. Not available in IE7-8.</p>
			          <div class="bs-docs-example">
			            <div class="progress progress-striped">
			              <div class="bar" style="width: 20%;"></div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="progress progress-striped"&gt;
  &lt;div class="bar" style="width: 20%;"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Animated</h4>
			          <p>Add <code>.active</code> to <code>.progress-striped</code> to animate the stripes right to left. Not available in all versions of IE.</p>
			          <div class="bs-docs-example">
			            <div class="progress progress-striped active">
			              <div class="bar" style="width: 45%"></div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="progress progress-striped active"&gt;
  &lt;div class="bar" style="width: 40%;"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Stacked</h4>
			          <p>Place multiple bars into the same <code>.progress</code> to stack them.</p>
			          <div class="bs-docs-example">
			            <div class="progress">
			              <div class="bar bar-success" style="width: 35%"></div>
			              <div class="bar bar-warning" style="width: 20%"></div>
			              <div class="bar bar-danger" style="width: 10%"></div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="progress"&gt;
  &lt;div class="bar bar-success" style="width: 35%;"&gt;&lt;/div&gt;
  &lt;div class="bar bar-warning" style="width: 20%;"&gt;&lt;/div&gt;
  &lt;div class="bar bar-danger" style="width: 10%;"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Options</h3>
			
			          <h4 class="bs-docs-heading">Additional colors</h4>
			          <p>Progress bars use some of the same button and alert classes for consistent styles.</p>
			          <div class="bs-docs-example">
			            <div class="progress progress-info" style="margin-bottom: 9px;">
			              <div class="bar" style="width: 20%"></div>
			            </div>
			            <div class="progress progress-success" style="margin-bottom: 9px;">
			              <div class="bar" style="width: 40%"></div>
			            </div>
			            <div class="progress progress-warning" style="margin-bottom: 9px;">
			              <div class="bar" style="width: 60%"></div>
			            </div>
			            <div class="progress progress-danger">
			              <div class="bar" style="width: 80%"></div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="progress progress-info"&gt;
  &lt;div class="bar" style="width: 20%"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="progress progress-success"&gt;
  &lt;div class="bar" style="width: 40%"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="progress progress-warning"&gt;
  &lt;div class="bar" style="width: 60%"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="progress progress-danger"&gt;
  &lt;div class="bar" style="width: 80%"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Striped bars</h4>
			          <p>Similar to the solid colors, we have varied striped progress bars.</p>
			          <div class="bs-docs-example">
			            <div class="progress progress-info progress-striped" style="margin-bottom: 9px;">
			              <div class="bar" style="width: 20%"></div>
			            </div>
			            <div class="progress progress-success progress-striped" style="margin-bottom: 9px;">
			              <div class="bar" style="width: 40%"></div>
			            </div>
			            <div class="progress progress-warning progress-striped" style="margin-bottom: 9px;">
			              <div class="bar" style="width: 60%"></div>
			            </div>
			            <div class="progress progress-danger progress-striped">
			              <div class="bar" style="width: 80%"></div>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;div class="progress progress-info progress-striped"&gt;
  &lt;div class="bar" style="width: 20%"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="progress progress-success progress-striped"&gt;
  &lt;div class="bar" style="width: 40%"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="progress progress-warning progress-striped"&gt;
  &lt;div class="bar" style="width: 60%"&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;div class="progress progress-danger progress-striped"&gt;
  &lt;div class="bar" style="width: 80%"&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>
			
			
			          <hr class="bs-docs-separator">
			
			
			          <h3 class="bs-docs-heading">Browser support</h3>
			          <p>Progress bars use CSS3 gradients, transitions, and animations to achieve all their effects. These features are not supported in IE7-9 or older versions of Firefox.</p>
			          <p>Versions earlier than Internet Explorer 10 and Opera 12 do not support animations.</p>
			
			        </section><!-- END progress-bars --> 
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Labels and badges
			================================================== -->
			        <section id="labels-badges" class="NotUpdatedYet">
			          <h2 class="bs-docs-heading">Labels and badges</h2>
			          <h4 class="bs-docs-heading">Labels</h4>
			          <table class="table table-bordered table-striped">
			            <thead>
			              <tr>
			                <th>Labels</th>
			                <th>Markup</th>
			              </tr>
			            </thead>
			            <tbody>
			              <tr>
			                <td>
			                  <span class="label">Default</span>
			                </td>
			                <td>
			                  <code>&lt;span class="label"&gt;Default&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  <span class="label label-success">Success</span>
			                </td>
			                <td>
			                  <code>&lt;span class="label label-success"&gt;Success&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  <span class="label label-warning">Warning</span>
			                </td>
			                <td>
			                  <code>&lt;span class="label label-warning"&gt;Warning&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  <span class="label label-important">Important</span>
			                </td>
			                <td>
			                  <code>&lt;span class="label label-important"&gt;Important&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  <span class="label label-info">Info</span>
			                </td>
			                <td>
			                  <code>&lt;span class="label label-info"&gt;Info&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  <span class="label label-inverse">Inverse</span>
			                </td>
			                <td>
			                  <code>&lt;span class="label label-inverse"&gt;Inverse&lt;/span&gt;</code>
			                </td>
			              </tr>
			            </tbody>
			          </table>
			
			          <h4 class="bs-docs-heading">Badges</h4>
			          <table class="table table-bordered table-striped">
			            <thead>
			              <tr>
			                <th>Name</th>
			                <th>Example</th>
			                <th>Markup</th>
			              </tr>
			            </thead>
			            <tbody>
			              <tr>
			                <td>
			                  Default
			                </td>
			                <td>
			                  <span class="badge">1</span>
			                </td>
			                <td>
			                  <code>&lt;span class="badge"&gt;1&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  Success
			                </td>
			                <td>
			                  <span class="badge badge-success">2</span>
			                </td>
			                <td>
			                  <code>&lt;span class="badge badge-success"&gt;2&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  Warning
			                </td>
			                <td>
			                  <span class="badge badge-warning">4</span>
			                </td>
			                <td>
			                  <code>&lt;span class="badge badge-warning"&gt;4&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  Important
			                </td>
			                <td>
			                  <span class="badge badge-important">6</span>
			                </td>
			                <td>
			                  <code>&lt;span class="badge badge-important"&gt;6&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  Info
			                </td>
			                <td>
			                  <span class="badge badge-info">8</span>
			                </td>
			                <td>
			                  <code>&lt;span class="badge badge-info"&gt;8&lt;/span&gt;</code>
			                </td>
			              </tr>
			              <tr>
			                <td>
			                  Inverse
			                </td>
			                <td>
			                  <span class="badge badge-inverse">10</span>
			                </td>
			                <td>
			                  <code>&lt;span class="badge badge-inverse"&gt;10&lt;/span&gt;</code>
			                </td>
			              </tr>
			            </tbody>
			          </table>
			
			        </section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			

<!--==================================================
 Typographic components
================================================== -->
        <section id="typography" class="NotUpdatedYet">
          <h2 class="bs-docs-heading">Typographic components</h2>

          <h3 class="bs-docs-heading">Hero unit</h3>
          <p>A lightweight, flexible component to showcase key content on your site. It works well on marketing and content-heavy sites.</p>
          <div class="bs-docs-example">
            <div class="hero-unit">
              <h2 class="bs-docs-heading">Hello, world!</h2>
              <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
              <p><a class="btn btn-primary btn-large">Learn more</a></p>
            </div>
          </div>
<pre class="prettyprint linenums">
&lt;div class="hero-unit"&gt;
  &lt;h1&gt;Heading&lt;/h1&gt;
  &lt;p&gt;Tagline&lt;/p&gt;
  &lt;p&gt;
    &lt;a class="btn btn-primary btn-large"&gt;
      Learn more
    &lt;/a&gt;
  &lt;/p&gt;
&lt;/div&gt;
</pre>

          <h3 class="bs-docs-heading">Page header</h3>
          <p>A simple shell for an <code>h1</code> to appropriately space out and segment sections of content on a page. It can utilize the <code>h1</code>'s default <code>small</code>, element as well most other components (with additional styles).</p>
          <div class="bs-docs-example">
            <div class="page-header">
              <h2 class="bs-docs-heading">Example page header <small>Subtext for header</small></h2>
            </div>
          </div>
<pre class="prettyprint linenums">
&lt;div class="page-header"&gt;
  &lt;h1&gt;Example page header &lt;small&gt;Subtext for header&lt;/small&gt;&lt;/h1&gt;
&lt;/div&gt;
</pre>

        </section>























<!--==================================================
 Miscellaneous
================================================== -->
        <section id="misc" class="NotUpdatedYet">
          <h2 class="bs-docs-heading">Miscellaneous <small>Lightweight utility components</small></h2>

          <h3 class="bs-docs-heading">Wells</h3>
          <p>Use the well as a simple effect on an element to give it an inset effect.</p>
          <div class="bs-docs-example">
            <div class="well">
              Look, I'm in a well!
            </div>
          </div>
<pre class="prettyprint linenums">
&lt;div class="well"&gt;
  ...
&lt;/div&gt;
</pre>
          <h4 class="bs-docs-heading">Optional classes</h4>
          <p>Control padding and rounded corners with two optional modifier classes.</p>
          <div class="bs-docs-example">
            <div class="well well-large">
              Look, I'm in a well!
            </div>
          </div>
<pre class="prettyprint linenums">
&lt;div class="well well-large"&gt;
  ...
&lt;/div&gt;
</pre>
          <div class="bs-docs-example">
            <div class="well well-small">
              Look, I'm in a well!
            </div>
          </div>
<pre class="prettyprint linenums">
&lt;div class="well well-small"&gt;
  ...
&lt;/div&gt;
</pre>

          <h3 class="bs-docs-heading">Close icon</h3>
          <p>Use the generic close icon for dismissing content like modals and alerts.</p>
          <div class="bs-docs-example">
            <p><button class="close" style="float: none;">&times;</button></p>
          </div>
          <pre class="prettyprint linenums">&lt;button class="close"&gt;&amp;times;&lt;/button&gt;</pre>
          <p>iOS devices require an href="#" for click events if you rather use an anchor.</p>
          <pre class="prettyprint linenums">&lt;a class="close" href="#"&gt;&amp;times;&lt;/a&gt;</pre>

          <h3 class="bs-docs-heading">Helper classes</h3>
          <p>Simple, focused classes for small display or behavior tweaks.</p>

          <h5 class="bs-docs-heading">.pull-left</h5>
          <p>Float an element left</p>
<pre class="prettyprint linenums">
class="pull-left"
</pre>
<pre class="prettyprint linenums">
.pull-left {
  float: left;
}
</pre>

          <h5 class="bs-docs-heading">.pull-right</h5>
          <p>Float an element right</p>
<pre class="prettyprint linenums">
class="pull-right"
</pre>
<pre class="prettyprint linenums">
.pull-right {
  float: right;
}
</pre>

          <h5 class="bs-docs-heading">.muted</h5>
          <p>Change an element's color to <code>#999</code></p>
<pre class="prettyprint linenums">
class="muted"
</pre>
<pre class="prettyprint linenums">
.muted {
  color: #999;
}
</pre>

          <h5 class="bs-docs-heading">.clearfix</h5>
          <p>Clear the <code>float</code> on any element</p>
<pre class="prettyprint linenums">
class="clearfix"
</pre>
<pre class="prettyprint linenums">
.clearfix {
  *zoom: 1;
  &:before,
  &:after {
    display: table;
    content: "";
  }
  &:after {
    clear: both;
  }
}
</pre>

        </section>




























<!--==================================================
 ScrollSpy
================================================== -->
        <section id="scrollspy" class="NotUpdatedYet">
          <h2 class="bs-docs-heading">ScrollSpy <small>bootstrap-scrollspy.js</small></h2>


          <h3 class="bs-docs-heading">Example in navbar</h3>
          <p>The ScrollSpy plugin is for automatically updating nav targets based on scroll position. Scroll the area below the navbar and watch the active class change. The dropdown sub items will be highlighted as well.</p>
          <div class="bs-docs-example">
            <div id="simple-navbarExample" class="simple-navbar simple-navbar-static">
              <div class="simple-navbar-inner">
                <div class="container" style="width: auto;">
                  <a class="brand" href="#">Project Name</a>
                  <ul class="simple-nav">
                    <li><a href="#fat">@fat</a></li>
                    <li><a href="#mdo">@mdo</a></li>
                    <li class="dropdown">
                      <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                      <ul class="dropdown-menu">
                        <li><a href="#one">one</a></li>
                        <li><a href="#two">two</a></li>
                        <li class="divider"></li>
                        <li><a href="#three">three</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div data-spy="scroll" data-target="#simple-navbarExample" data-offset="0" class="scrollspy-example">
              <h4 id="fat">@fat</h5>
              <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
              <h4 id="mdo">@mdo</h5>
              <p>Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard. Freegan beard aliqua cupidatat mcsweeney's vero. Cupidatat four loko nisi, ea helvetica nulla carles. Tattooed cosby sweater food truck, mcsweeney's quis non freegan vinyl. Lo-fi wes anderson +1 sartorial. Carles non aesthetic exercitation quis gentrify. Brooklyn adipisicing craft beer vice keytar deserunt.</p>
              <h4 id="one">one</h5>
              <p>Occaecat commodo aliqua delectus. Fap craft beer deserunt skateboard ea. Lomo bicycle rights adipisicing banh mi, velit ea sunt next level locavore single-origin coffee in magna veniam. High life id vinyl, echo park consequat quis aliquip banh mi pitchfork. Vero VHS est adipisicing. Consectetur nisi DIY minim messenger bag. Cred ex in, sustainable delectus consectetur fanny pack iphone.</p>
              <h4 id="two">two</h5>
              <p>In incididunt echo park, officia deserunt mcsweeney's proident master cleanse thundercats sapiente veniam. Excepteur VHS elit, proident shoreditch +1 biodiesel laborum craft beer. Single-origin coffee wayfarers irure four loko, cupidatat terry richardson master cleanse. Assumenda you probably haven't heard of them art party fanny pack, tattooed nulla cardigan tempor ad. Proident wolf nesciunt sartorial keffiyeh eu banh mi sustainable. Elit wolf voluptate, lo-fi ea portland before they sold out four loko. Locavore enim nostrud mlkshk brooklyn nesciunt.</p>
              <h4 id="three">three</h5>
              <p>Ad leggings keytar, brunch id art party dolor labore. Pitchfork yr enim lo-fi before they sold out qui. Tumblr farm-to-table bicycle rights whatever. Anim keffiyeh carles cardigan. Velit seitan mcsweeney's photo booth 3 wolf moon irure. Cosby sweater lomo jean shorts, williamsburg hoodie minim qui you probably haven't heard of them et cardigan trust fund culpa biodiesel wes anderson aesthetic. Nihil tattooed accusamus, cred irony biodiesel keffiyeh artisan ullamco consequat.</p>
              <p>Keytar twee blog, culpa messenger bag marfa whatever delectus food truck. Sapiente synth id assumenda. Locavore sed helvetica cliche irony, thundercats you probably haven't heard of them consequat hoodie gluten-free lo-fi fap aliquip. Labore elit placeat before they sold out, terry richardson proident brunch nesciunt quis cosby sweater pariatur keffiyeh ut helvetica artisan. Cardigan craft beer seitan readymade velit. VHS chambray laboris tempor veniam. Anim mollit minim commodo ullamco thundercats.
              </p>
            </div>
          </div>


          <hr class="bs-docs-separator">


          <h3 class="bs-docs-heading">Usage</h3>

          <h4 class="bs-docs-heading">Via data attributes</h4>
          <p>To easily add scrollspy behavior to your topbar navigation, just add <code>data-spy="scroll"</code> to the element you want to spy on (most typically this would be the body) and <code>data-target=".simple-navbar"</code> to select which nav to use. You'll want to use scrollspy with a <code>.simple-nav</code> component.</p>
          <pre class="prettyprint linenums">&lt;body data-spy="scroll" data-target=".simple-navbar"&gt;...&lt;/body&gt;</pre>

          <h4 class="bs-docs-heading">Via JavaScript</h4>
          <p>Call the scrollspy via JavaScript:</p>
          <pre class="prettyprint linenums">$('#simple-navbar').scrollspy()</pre>

          <div class="alert alert-info">
            <strong>Heads up!</strong>
            Navbar links must have resolvable id targets. For example, a <code>&lt;a href="#home"&gt;home&lt;/a&gt;</code> must correspond to something in the dom like <code>&lt;div id="home"&gt;&lt;/div&gt;</code>.
          </div>

          <h4 class="bs-docs-heading">Methods</h4>
          <h5 class="bs-docs-heading">.scrollspy('refresh')</h5>
          <p>When using scrollspy in conjunction with adding or removing of elements from the DOM, you'll need to call the refresh method like so:</p>
<pre class="prettyprint linenums">
$('[data-spy="scroll"]').each(function () {
  var $spy = $(this).scrollspy('refresh')
});
</pre>

          <h4 class="bs-docs-heading">Options</h4>
          <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-offset=""</code>.</p>
          <table class="table table-bordered table-striped">
            <thead>
             <tr>
               <th style="width: 100px;">Name</th>
               <th style="width: 100px;">type</th>
               <th style="width: 50px;">default</th>
               <th>description</th>
             </tr>
            </thead>
            <tbody>
             <tr>
               <td>offset</td>
               <td>number</td>
               <td>10</td>
               <td>Pixels to offset from top when calculating position of scroll.</td>
             </tr>
            </tbody>
          </table>

          <h4 class="bs-docs-heading">Events</h4>
          <table class="table table-bordered table-striped">
            <thead>
             <tr>
               <th style="width: 150px;">Event</th>
               <th>Description</th>
             </tr>
            </thead>
            <tbody>
             <tr>
               <td>activate</td>
               <td>This event fires whenever a new item becomes activated by the scrollspy.</td>
            </tr>
            </tbody>
          </table>
        </section>































<!--==================================================
 Tooltips
================================================== -->
        <section id="tooltips" class="NotUpdatedYet">
          <h2 class="bs-docs-heading">Tooltips <small>bootstrap-tooltip.js</small></h2>


          <h3 class="bs-docs-heading">Examples</h3>
          <p>Inspired by the excellent jQuery.tipsy plugin written by Jason Frame; Tooltips are an updated version, which don't rely on images, use CSS3 for animations, and data-attributes for local title storage.</p>
          <p>Hover over the links below to see tooltips:</p>
          <div class="bs-docs-example tooltip-demo">
            <p class="muted" style="margin-bottom: 0;">Tight pants next level keffiyeh <a href="#" rel="tooltip" title="Default tooltip">you probably</a> haven't heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney's fixie sustainable quinoa 8-bit american apparel <a href="#" rel="tooltip" title="Another tooltip">have a</a> terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko mcsweeney's cleanse vegan chambray. A really ironic artisan <a href="#" rel="tooltip" title="Another one here too">whatever keytar</a>, scenester farm-to-table banksy Austin <a href="#" rel="tooltip" title="The last tip!">twitter handle</a> freegan cred raw denim single-origin coffee viral.
            </p>
          </div>

          <h4 class="bs-docs-heading">Four directions</h4>
          <div class="bs-docs-example tooltip-demo">
            <ul class="bs-docs-tooltip-examples">
              <li><a href="#" rel="tooltip" data-placement="top" title="Tooltip on top">Tooltip on top</a></li>
              <li><a href="#" rel="tooltip" data-placement="right" title="Tooltip on right">Tooltip on right</a></li>
              <li><a href="#" rel="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</a></li>
              <li><a href="#" rel="tooltip" data-placement="left" title="Tooltip on left">Tooltip on left</a></li>
            </ul>
          </div>


          <hr class="bs-docs-separator">


          <h3 class="bs-docs-heading">Usage</h3>
          <p>Trigger the tooltip via JavaScript:</p>
          <pre class="prettyprint linenums">$('#example').tooltip(options)</pre>

          <h4 class="bs-docs-heading">Options</h4>
          <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-animation=""</code>.</p>
          <table class="table table-bordered table-striped">
            <thead>
             <tr>
               <th style="width: 100px;">Name</th>
               <th style="width: 100px;">type</th>
               <th style="width: 50px;">default</th>
               <th>description</th>
             </tr>
            </thead>
            <tbody>
             <tr>
               <td>animation</td>
               <td>boolean</td>
               <td>true</td>
               <td>apply a css fade transition to the tooltip</td>
             </tr>
             <tr>
               <td>html</td>
               <td>boolean</td>
               <td>true</td>
               <td>Insert html into the tooltip. If false, jquery's <code>text</code> method will be used to insert content into the dom. Use text if you're worried about XSS attacks.</td>
             </tr>
             <tr>
               <td>placement</td>
               <td>string|function</td>
               <td>'top'</td>
               <td>how to position the tooltip - top | bottom | left | right</td>
             </tr>
             <tr>
               <td>selector</td>
               <td>string</td>
               <td>false</td>
               <td>If a selector is provided, tooltip objects will be delegated to the specified targets.</td>
             </tr>
             <tr>
               <td>title</td>
               <td>string | function</td>
               <td>''</td>
               <td>default title value if `title` tag isn't present</td>
             </tr>
             <tr>
               <td>trigger</td>
               <td>string</td>
               <td>'hover'</td>
               <td>how tooltip is triggered - click | hover | focus | manual</td>
             </tr>
             <tr>
               <td>delay</td>
               <td>number | object</td>
               <td>0</td>
               <td>
                <p>delay showing and hiding the tooltip (ms) - does not apply to manual trigger type</p>
                <p>If a number is supplied, delay is applied to both hide/show</p>
                <p>Object structure is: <code>delay: { show: 500, hide: 100 }</code></p>
               </td>
             </tr>
            </tbody>
          </table>
          <div class="alert alert-info">
            <strong>Heads up!</strong>
            Options for individual tooltips can alternatively be specified through the use of data attributes.
          </div>

          <h4 class="bs-docs-heading">Markup</h4>
          <p>For performance reasons, the Tooltip and Popover data-apis are opt in. If you would like to use them just specify a selector option.</p>
          <pre class="prettyprint linenums">&lt;a href="#" rel="tooltip" title="first tooltip"&gt;hover over me&lt;/a&gt;</pre>

          <h4 class="bs-docs-heading">Methods</h4>
          <h5 class="bs-docs-heading">$().tooltip(options)</h5>
          <p>Attaches a tooltip handler to an element collection.</p>
          <h5 class="bs-docs-heading">.tooltip('show')</h5>
          <p>Reveals an element's tooltip.</p>
          <pre class="prettyprint linenums">$('#element').tooltip('show')</pre>
          <h5 class="bs-docs-heading">.tooltip('hide')</h5>
          <p>Hides an element's tooltip.</p>
          <pre class="prettyprint linenums">$('#element').tooltip('hide')</pre>
          <h5 class="bs-docs-heading">.tooltip('toggle')</h5>
          <p>Toggles an element's tooltip.</p>
          <pre class="prettyprint linenums">$('#element').tooltip('toggle')</pre>
          <h5 class="bs-docs-heading">.tooltip('destroy')</h5>
          <p>Hides and destroys an element's tooltip.</p>
          <pre class="prettyprint linenums">$('#element').tooltip('destroy')</pre>
        </section>






















<!--==================================================
 Popovers
================================================== -->
      <section id="popovers" class="NotUpdatedYet">
        <h2 class="bs-docs-heading">Popovers <small>bootstrap-popover.js</small></h2>

        <h3 class="bs-docs-heading">Examples</h3>
        <p>Add small overlays of content, like those on the iPad, to any element for housing secondary information. Hover over the button to trigger the popover. <strong>Requires <a href="#tooltips">Tooltip</a> to be included.</strong></p>

        <h4 class="bs-docs-heading">Static popover</h4>
        <p>Four options are available: top, right, bottom, and left aligned.</p>
        <div class="bs-docs-example bs-docs-example-popover">
          <div class="popover top">
            <div class="arrow"></div>
            <h3 class="popover-title">Popover top</h4>
            <div class="popover-content">
              <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
            </div>
          </div>

          <div class="popover right">
            <div class="arrow"></div>
            <h3 class="popover-title">Popover right</h4>
            <div class="popover-content">
              <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
            </div>
          </div>

          <div class="popover bottom">
            <div class="arrow"></div>
            <h3 class="popover-title">Popover bottom</h4>
            <div class="popover-content">
              <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
            </div>
          </div>

          <div class="popover left">
            <div class="arrow"></div>
            <h3 class="popover-title">Popover left</h4>
            <div class="popover-content">
              <p>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
            </div>
          </div>

          <div class="clearfix"></div>
        </div>
        <p>No markup shown as popovers are generated from JavaScript and content within a <code>data</code> attribute.</p>

        <h4 class="bs-docs-heading">Live demo</h4>
        <div class="bs-docs-example" style="padding-bottom: 24px;">
          <a href="#" class="btn btn-large btn-danger" rel="popover" title="A Title" data-content="And here's some amazing content. It's very engaging. right?">Click to toggle popover</a>
        </div>


        <hr class="bs-docs-separator">


        <h3 class="bs-docs-heading">Usage</h3>
        <p>Enable popovers via JavaScript:</p>
        <pre class="prettyprint linenums">$('#example').popover(options)</pre>

        <h4 class="bs-docs-heading">Options</h4>
        <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-animation=""</code>.</p>
        <table class="table table-bordered table-striped">
          <thead>
           <tr>
             <th style="width: 100px;">Name</th>
             <th style="width: 100px;">type</th>
             <th style="width: 50px;">default</th>
             <th>description</th>
           </tr>
          </thead>
          <tbody>
           <tr>
             <td>animation</td>
             <td>boolean</td>
             <td>true</td>
             <td>apply a css fade transition to the tooltip</td>
           </tr>
           <tr>
             <td>html</td>
             <td>boolean</td>
             <td>true</td>
             <td>Insert html into the popover. If false, jquery's <code>text</code> method will be used to insert content into the dom. Use text if you're worried about XSS attacks.</td>
           </tr>
           <tr>
             <td>placement</td>
             <td>string|function</td>
             <td>'right'</td>
             <td>how to position the popover - top | bottom | left | right</td>
           </tr>
           <tr>
             <td>selector</td>
             <td>string</td>
             <td>false</td>
             <td>if a selector is provided, tooltip objects will be delegated to the specified targets</td>
           </tr>
           <tr>
             <td>trigger</td>
             <td>string</td>
             <td>'click'</td>
             <td>how popover is triggered - click | hover | focus | manual</td>
           </tr>
           <tr>
             <td>title</td>
             <td>string | function</td>
             <td>''</td>
             <td>default title value if `title` attribute isn't present</td>
           </tr>
           <tr>
             <td>content</td>
             <td>string | function</td>
             <td>''</td>
             <td>default content value if `data-content` attribute isn't present</td>
           </tr>
           <tr>
             <td>delay</td>
             <td>number | object</td>
             <td>0</td>
             <td>
              <p>delay showing and hiding the popover (ms) - does not apply to manual trigger type</p>
              <p>If a number is supplied, delay is applied to both hide/show</p>
              <p>Object structure is: <code>delay: { show: 500, hide: 100 }</code></p>
             </td>
           </tr>
          </tbody>
        </table>
        <div class="alert alert-info">
          <strong>Heads up!</strong>
          Options for individual popovers can alternatively be specified through the use of data attributes.
        </div>

        <h4 class="bs-docs-heading">Markup</h4>
        <p>For performance reasons, the Tooltip and Popover data-apis are opt in. If you would like to use them just specify a selector option.</p>

        <h4 class="bs-docs-heading">Methods</h4>
        <h5 class="bs-docs-heading">$().popover(options)</h5>
        <p>Initializes popovers for an element collection.</p>
        <h5 class="bs-docs-heading">.popover('show')</h5>
        <p>Reveals an elements popover.</p>
        <pre class="prettyprint linenums">$('#element').popover('show')</pre>
        <h5 class="bs-docs-heading">.popover('hide')</h5>
        <p>Hides an elements popover.</p>
        <pre class="prettyprint linenums">$('#element').popover('hide')</pre>
        <h5 class="bs-docs-heading">.popover('toggle')</h5>
        <p>Toggles an elements popover.</p>
        <pre class="prettyprint linenums">$('#element').popover('toggle')</pre>
        <h5 class="bs-docs-heading">.popover('destroy')</h5>
        <p>Hides and destroys an element's popover.</p>
        <pre class="prettyprint linenums">$('#element').popover('destroy')</pre>
      </section>

























<!--==================================================
 Affix
================================================== -->
          <section id="affix" class="NotUpdatedYet">
            <h2 class="bs-docs-heading">Affix <small>bootstrap-affix.js</small></h2>

            <h3 class="bs-docs-heading">Example</h3>
            <p>The subnavigation on the left is a live demo of the affix plugin.</p>

            <hr class="bs-docs-separator">

            <h3 class="bs-docs-heading">Usage</h3>

            <h4 class="bs-docs-heading">Via data attributes</h4>
            <p>To easily add affix behavior to any element, just add <code>data-spy="affix"</code> to the element you want to spy on. Then use offsets to define when to toggle the pinning of an element on and off.</p>

            <pre class="prettyprint linenums">&lt;div data-spy="affix" data-offset-top="200"&gt;...&lt;/div&gt;</pre>

            <div class="alert alert-info">
              <strong>Heads up!</strong>
              You must manage the position of a pinned element and the behavior of its immediate parent. Position is controlled by <code>affix</code>, <code>affix-top</code>, and <code>affix-bottom</code>. Remember to check for a potentially collapsed parent when the affix kicks in as it's removing content from the normal flow of the page.
            </div>

            <h4 class="bs-docs-heading">Via JavaScript</h4>
            <p>Call the affix plugin via JavaScript:</p>
            <pre class="prettyprint linenums">$('#simple-navbar').affix()</pre>

            <h4 class="bs-docs-heading">Methods</h4>
            <h5 class="bs-docs-heading">.affix('refresh')</h5>
            <p>When using affix in conjunction with adding or removing of elements from the DOM, you'll want to call the refresh method:</p>
<pre class="prettyprint linenums">
$('[data-spy="affix"]').each(function () {
  $(this).affix('refresh')
});
</pre>
          <h4 class="bs-docs-heading">Options</h4>
          <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-offset-top="200"</code>.</p>
          <table class="table table-bordered table-striped">
            <thead>
             <tr>
               <th style="width: 100px;">Name</th>
               <th style="width: 100px;">type</th>
               <th style="width: 50px;">default</th>
               <th>description</th>
             </tr>
            </thead>
            <tbody>
             <tr>
               <td>offset</td>
               <td>number | function | object</td>
               <td>10</td>
               <td>Pixels to offset from screen when calculating position of scroll. If a single number is provide, the offset will be applied in both top and left directions. To listen for a single direction, or multiple unique offsets, just provided an object <code>offset: { x: 10 }</code>. Use a function when you need to dynamically provide an offset (useful for some responsive designs).</td>
             </tr>
            </tbody>
          </table>
        </section>


























			<!--==================================================
			 Typeahead
			================================================== -->
			          <section id="typeahead" class="NotUpdatedYet">
			            <h2 class="bs-docs-heading">Typeahead <small>bootstrap-typeahead.js</small></h2>


			            <h3 class="bs-docs-heading">Example</h3>
			            <p>A basic, easily extended plugin for quickly creating elegant typeaheads with any form text input.</p>
			            <div class="bs-docs-example" style="background-color: #f5f5f5;">
			              <input type="text" class="span3" style="margin: 0 auto;" data-provide="typeahead" data-items="4" data-source='["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]'>
			            </div>
			            <pre class="prettyprint linenums">&lt;input type="text" data-provide="typeahead"&gt;</pre>


			            <hr class="bs-docs-separator">


			            <h3 class="bs-docs-heading">Usage</h3>

			            <h4 class="bs-docs-heading">Via data attributes</h4>
			            <p>Add data attributes to register an element with typeahead functionality as shown in the example above.</p>

			            <h4 class="bs-docs-heading">Via JavaScript</h4>
			            <p>Call the typeahead manually with:</p>
			            <pre class="prettyprint linenums">$('.typeahead').typeahead()</pre>

			            <h4 class="bs-docs-heading">Options</h4>
			            <p>Options can be passed via data attributes or JavaScript. For data attributes, append the option name to <code>data-</code>, as in <code>data-source=""</code>.</p>
			            <table class="table table-bordered table-striped">
			              <thead>
			               <tr>
			                 <th style="width: 100px;">Name</th>
			                 <th style="width: 50px;">type</th>
			                 <th style="width: 100px;">default</th>
			                 <th>description</th>
			               </tr>
			              </thead>
			              <tbody>
			                <tr>
			                 <td>source</td>
			                 <td>array, function</td>
			                 <td>[ ]</td>
			                 <td>The data source to query against. May be an array of strings or a function. The function is passed two arguments, the <code>query</code> value in the input field and the <code>process</code> callback. The function may be used synchronously by returning the data source directly or asynchronously via the <code>process</code> callback's single argument.</td>
			               </tr>
			               <tr>
			                 <td>items</td>
			                 <td>number</td>
			                 <td>8</td>
			                 <td>The max number of items to display in the dropdown.</td>
			               </tr>
			               <tr>
			                 <td>minLength</td>
			                 <td>number</td>
			                 <td>1</td>
			                 <td>The minimum character length needed before triggering autocomplete suggestions</td>
			               </tr>
			               <tr>
			                 <td>matcher</td>
			                 <td>function</td>
			                 <td>case insensitive</td>
			                 <td>The method used to determine if a query matches an item. Accepts a single argument, the <code>item</code> against which to test the query. Access the current query with <code>this.query</code>. Return a boolean <code>true</code> if query is a match.</td>
			               </tr>
			               <tr>
			                 <td>sorter</td>
			                 <td>function</td>
			                 <td>exact match,<br> case sensitive,<br> case insensitive</td>
			                 <td>Method used to sort autocomplete results. Accepts a single argument <code>items</code> and has the scope of the typeahead instance. Reference the current query with <code>this.query</code>.</td>
			               </tr>
			               <tr>
			                 <td>highlighter</td>
			                 <td>function</td>
			                 <td>highlights all default matches</td>
			                 <td>Method used to highlight autocomplete results. Accepts a single argument <code>item</code> and has the scope of the typeahead instance. Should return html.</td>
			               </tr>
			              </tbody>
			            </table>

			            <h4 class="bs-docs-heading">Methods</h4>
			            <h5 class="bs-docs-heading">.typeahead(options)</h5>
			            <p>Initializes an input with a typeahead.</p>
			          </section>
			
			
			
			
			      </div>{{! /span9 }}
			    </div>{{! row}}
			
			  </div>{{! /.container }}

			  

		{{partial 'includes/docs_foot.html'}}
	</body>
</html>