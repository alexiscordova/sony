<!DOCTYPE html>
<!--[if lt IE8]>  <html class="no-js ie oldie lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie oldie lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie ie9" lang="en"> <![endif]-->
<!--[if gt IE 9]> <html class="no-js ie gt-ie9 modern" lang="en"> <![endif]-->
<!--[!(IE)]><!--><html class="no-js notIE modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs_head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs_nav.html'}}
			
			<!-- Masthead
			================================================== -->
			<header class="jumbotron subhead" id="overview">
			  <div class="container">
			    <h2 class="bs-docs-heading">Customize and download</h2>
			    <p class="p1"><a href="https://github.com/twitter/bootstrap/zipball/master">Download Bootstrap</a> or customize variables, components, javascript plugins, and more.</p>
			  </div>
			</header>
			
			
			  <div class="container">
			
			    <!-- Docs nav
			    ================================================== -->
			    <div class="row">
			      <div class="span3 bs-docs-sidebar">
			        <ul class="nav nav-list bs-docs-sidenav">
			          <li><a href="#components"><i class="icon-chevron-right"></i> 1. Choose components</a></li>
			          <li><a href="#plugins"><i class="icon-chevron-right"></i> 2. Select jQuery plugins</a></li>
			          <li><a href="#variables"><i class="icon-chevron-right"></i> 3. Customize variables</a></li>
			          <li><a href="#download"><i class="icon-chevron-right"></i> 4. Download</a></li>
			        </ul>
			      </div>
			      <div class="span9">
			
			
			        <!-- Customize form
			        ================================================== -->
			        <form>
			          <section class="download" id="components">
			            <div class="page-header">
			              <a class="btn btn-small pull-right toggle-all" href="#">Toggle all</a>
			              <h2 class="bs-docs-heading">
			                1. Choose components
			              </h2>
			            </div>
			            <div class="row download-builder">
			              <div class="span3">
			                <h4 class="bs-docs-heading">Scaffolding</h4>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="reset.less"> Normalize and reset</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="scaffolding.less"> Body type and links</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="grid.less"> Grid system</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="layouts.less"> Layouts</label>
			                <h4 class="bs-docs-heading">Base CSS</h4>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="type.less"> Headings, body, etc</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="code.less"> Code and pre</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="labels-badges.less"> Labels and badges</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="tables.less"> Tables</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="forms.less"> Forms</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="buttons.less"> Buttons</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="sprites.less"> Icons</label>
			              </div><!-- /span -->
			              <div class="span3">
			                <h4 class="bs-docs-heading">Components</h4>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="button-groups.less"> Button groups and dropdowns</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="navs.less"> Navs, tabs, and pills</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="navbar.less"> Navbar</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="breadcrumbs.less"> Breadcrumbs</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="pagination.less"> Pagination</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="pager.less"> Pager</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="thumbnails.less"> Thumbnails</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="alerts.less"> Alerts</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="progress-bars.less"> Progress bars</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="hero-unit.less"> Hero unit</label>
			                <h4 class="bs-docs-heading">JS Components</h4>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="tooltip.less"> Tooltips</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="popovers.less"> Popovers</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="modals.less"> Modals</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="dropdowns.less"> Dropdowns</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="accordion.less"> Collapse</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="carousel.less"> Carousel</label>
			              </div><!-- /span -->
			              <div class="span3">
			                <h4 class="bs-docs-heading">Miscellaneous</h4>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="wells.less"> Wells</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="close.less"> Close icon</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="utilities.less"> Utilities</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="component-animations.less"> Component animations</label>
			                <h4 class="bs-docs-heading">Responsive</h4>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="responsive-utilities.less"> Visible/hidden classes</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="responsive-767px-max.less"> Narrow tablets and below (<767px)</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="responsive-768px-979px.less"> Tablets to desktops (767-979px)</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="responsive-1200px-min.less"> Large desktops (>1200px)</label>
			                <label class="checkbox"><input checked="checked" type="checkbox" value="responsive-navbar.less"> Responsive navbar</label>
			              </div><!-- /span -->
			            </div><!-- /row -->
			          </section>
			
			          <section class="download" id="plugins">
			            <div class="page-header">
			              <a class="btn btn-small pull-right toggle-all" href="#">Toggle all</a>
			              <h2 class="bs-docs-heading">
			                2. Select jQuery plugins
			              </h2>
			            </div>
			            <div class="row download-builder">
			              <div class="span3">
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-transition.js">
			                  Transitions <small>(required for any animation)</small>
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-modal.js">
			                  Modals
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-dropdown.js">
			                  Dropdowns
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-scrollspy.js">
			                  Scrollspy
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-tab.js">
			                  Togglable tabs
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-tooltip.js">
			                  Tooltips
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-popover.js">
			                  Popovers <small>(requires Tooltips)</small>
			                </label>
			              </div><!-- /span -->
			              <div class="span3">
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-affix.js">
			                  Affix
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-alert.js">
			                  Alert messages
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-button.js">
			                  Buttons
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-collapse.js">
			                  Collapse
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-carousel.js">
			                  Carousel
			                </label>
			                <label class="checkbox">
			                  <input type="checkbox" checked="true" value="bootstrap-typeahead.js">
			                  Typeahead
			                </label>
			              </div><!-- /span -->
			              <div class="span3">
			                <h4 class="muted">Heads up!</h5>
			                <p class="muted">All checked plugins will be compiled into a single file, bootstrap.js. All plugins require the latest version of <a href="http://jquery.com/" target="_blank">jQuery</a> to be included.</p>
			              </div><!-- /span -->
			            </div><!-- /row -->
			          </section>
			
			
			          <section class="download" id="variables">
			            <div class="page-header">
			              <a class="btn btn-small pull-right toggle-all" href="#">Reset to defaults</a>
			              <h2 class="bs-docs-heading">
			                3. Customize variables
			              </h2>
			            </div>
			            <div class="row download-builder">
			              <div class="span3">
			                <h4 class="bs-docs-heading">Scaffolding</h4>
			                <label>@bodyBackground</label>
			                <input type="text" class="span3" placeholder="@white">
			                <label>@textColor</label>
			                <input type="text" class="span3" placeholder="@grayDark">
			
			                <h4 class="bs-docs-heading">Links</h4>
			                <label>@linkColor</label>
			                <input type="text" class="span3" placeholder="#08c">
			                <label>@linkColorHover</label>
			                <input type="text" class="span3" placeholder="darken(@linkColor, 15%)">
			                <h4 class="bs-docs-heading">Colors</h4>
			                <label>@blue</label>
			                <input type="text" class="span3" placeholder="#049cdb">
			                <label>@green</label>
			                <input type="text" class="span3" placeholder="#46a546">
			                <label>@red</label>
			                <input type="text" class="span3" placeholder="#9d261d">
			                <label>@yellow</label>
			                <input type="text" class="span3" placeholder="#ffc40d">
			                <label>@orange</label>
			                <input type="text" class="span3" placeholder="#f89406">
			                <label>@pink</label>
			                <input type="text" class="span3" placeholder="#c3325f">
			                <label>@purple</label>
			                <input type="text" class="span3" placeholder="#7a43b6">
			
			                <h4 class="bs-docs-heading">Sprites</h4>
			                <label>@iconSpritePath</label>
			                <input type="text" class="span3" placeholder="'../img/glyphicons-halflings.png'">
			                <label>@iconWhiteSpritePath</label>
			                <input type="text" class="span3" placeholder="'../img/glyphicons-halflings-white.png'">
			
			                <h4 class="bs-docs-heading">Grid system</h4>
			                <label>@gridColumns</label>
			                <input type="text" class="span3" placeholder="12">
			                <label>@gridColumnWidth</label>
			                <input type="text" class="span3" placeholder="60px">
			                <label>@gridGutterWidth</label>
			                <input type="text" class="span3" placeholder="20px">
			                <label>@gridColumnWidth1200</label>
			                <input type="text" class="span3" placeholder="70px">
			                <label>@gridGutterWidth1200</label>
			                <input type="text" class="span3" placeholder="30px">
			                <label>@gridColumnWidth768</label>
			                <input type="text" class="span3" placeholder="42px">
			                <label>@gridGutterWidth768</label>
			                <input type="text" class="span3" placeholder="20px">
			
			              </div><!-- /span -->
			              <div class="span3">
			
			                <h4 class="bs-docs-heading">Typography</h4>
			                <label>@sansFontFamily</label>
			                <input type="text" class="span3" placeholder="'Helvetica Neue', Helvetica, Arial, sans-serif">
			                <label>@serifFontFamily</label>
			                <input type="text" class="span3" placeholder="Georgia, 'Times New Roman', Times, serif">
			                <label>@monoFontFamily</label>
			                <input type="text" class="span3" placeholder="Menlo, Monaco, 'Courier New', monospace">
			                <label>@baseFontSize</label>
			                <input type="text" class="span3" placeholder="14px">
			                <label>@baseFontFamily</label>
			                <input type="text" class="span3" placeholder="@sansFontFamily">
			                <label>@baseLineHeight</label>
			                <input type="text" class="span3" placeholder="20px">
			                <label>@altFontFamily</label>
			                <input type="text" class="span3" placeholder="@serifFontFamily">
			                <label>@headingsFontFamily</label>
			                <input type="text" class="span3" placeholder="inherit">
			                <label>@headingsFontWeight</label>
			                <input type="text" class="span3" placeholder="bold">
			                <label>@headingsColor</label>
			                <input type="text" class="span3" placeholder="inherit">
			                <label>@heroUnitBackground</label>
			                <input type="text" class="span3" placeholder="@grayLightFieldLarge">
			                <label>@heroUnitHeadingColor</label>
			                <input type="text" class="span3" placeholder="inherit">
			                <label>@heroUnitLeadColor</label>
			                <input type="text" class="span3" placeholder="inherit">
			
			                <h4 class="bs-docs-heading">Tables</h4>
			                <label>@tableBackground</label>
			                <input type="text" class="span3" placeholder="transparent">
			                <label>@tableBackgroundAccent</label>
			                <input type="text" class="span3" placeholder="#f9f9f9">
			                <label>@tableBackgroundHover</label>
			                <input type="text" class="span3" placeholder="#f5f5f5">
			                <label>@tableBorder</label>
			                <input type="text" class="span3" placeholder="#ddd">
			
			                <h4 class="bs-docs-heading">Forms</h4>
			                <label>@placeholderText</label>
			                <input type="text" class="span3" placeholder="@grayLight">
			                <label>@inputBackground</label>
			                <input type="text" class="span3" placeholder="@white">
			                <label>@inputBorder</label>
			                <input type="text" class="span3" placeholder="#ccc">
			                <label>@inputBorderRadius</label>
			                <input type="text" class="span3" placeholder="3px">
			                <label>@inputDisabledBackground</label>
			                <input type="text" class="span3" placeholder="@grayLightFieldSmall">
			                <label>@formActionsBackground</label>
			                <input type="text" class="span3" placeholder="#f5f5f5">
			                <label>@btnSpecialBackground</label>
			                <input type="text" class="span3" placeholder="@linkColor">
			                <label>@btnSpecialBackgroundHighlight</label>
			                <input type="text" class="span3" placeholder="darken(@white, 10%);">
			
			              </div><!-- /span -->
			              <div class="span3">
			
			                <h4 class="bs-docs-heading">Form states &amp; alerts</h4>
			                <label>@warningText</label>
			                <input type="text" class="span3" placeholder="#c09853">
			                <label>@warningBackground</label>
			                <input type="text" class="span3" placeholder="#fcf8e3">
			                <label>@errorText</label>
			                <input type="text" class="span3" placeholder="#b94a48">
			                <label>@errorBackground</label>
			                <input type="text" class="span3" placeholder="#f2dede">
			                <label>@successText</label>
			                <input type="text" class="span3" placeholder="#468847">
			                <label>@successBackground</label>
			                <input type="text" class="span3" placeholder="#dff0d8">
			                <label>@infoText</label>
			                <input type="text" class="span3" placeholder="#3a87ad">
			                <label>@infoBackground</label>
			                <input type="text" class="span3" placeholder="#d9edf7">
			
			                <h4 class="bs-docs-heading">Navbar</h4>
			                <label>@navbarHeight</label>
			                <input type="text" class="span3" placeholder="40px">
			                <label>@navbarBackground</label>
			                <input type="text" class="span3" placeholder="@grayDarkerFieldSmall">
			                <label>@navbarBackgroundHighlight</label>
			                <input type="text" class="span3" placeholder="@grayDark">
			                <label>@navbarText</label>
			                <input type="text" class="span3" placeholder="@grayLight">
			                <label>@navbarBrandColor</label>
			                <input type="text" class="span3" placeholder="@navbarLinkColor">
			                <label>@navbarLinkColor</label>
			                <input type="text" class="span3" placeholder="@grayLight">
			                <label>@navbarLinkColorHover</label>
			                <input type="text" class="span3" placeholder="@white">
			                <label>@navbarLinkColorActive</label>
			                <input type="text" class="span3" placeholder="@navbarLinkColorHover">
			                <label>@navbarLinkBackgroundHover</label>
			                <input type="text" class="span3" placeholder="transparent">
			                <label>@navbarLinkBackgroundActive</label>
			                <input type="text" class="span3" placeholder="@navbarBackground">
			                <label>@navbarSearchBackground</label>
			                <input type="text" class="span3" placeholder="lighten(@navbarBackground, 25%)">
			                <label>@navbarSearchBackgroundFocus</label>
			                <input type="text" class="span3" placeholder="@white">
			                <label>@navbarSearchBorder</label>
			                <input type="text" class="span3" placeholder="darken(@navbarSearchBackground, 30%)">
			                <label>@navbarSearchPlaceholderColor</label>
			                <input type="text" class="span3" placeholder="#ccc">
			
			                <h4 class="bs-docs-heading">Dropdowns</h4>
			                <label>@dropdownBackground</label>
			                <input type="text" class="span3" placeholder="@white">
			                <label>@dropdownBorder</label>
			                <input type="text" class="span3" placeholder="rgba(0,0,0,.2)">
			                <label>@dropdownLinkColor</label>
			                <input type="text" class="span3" placeholder="@grayDark">
			                <label>@dropdownLinkColorHover</label>
			                <input type="text" class="span3" placeholder="@white">
			                <label>@dropdownLinkBackgroundHover</label>
			                <input type="text" class="span3" placeholder="@linkColor">
			              </div><!-- /span -->
			            </div><!-- /row -->
			          </section>
			
			          <section class="download" id="download">
			            <div class="page-header">
			              <h2 class="bs-docs-heading">
			                4. Download
			              </h2>
			            </div>
			            <div class="download-btn">
			              <a class="btn btn-special" href="#" {{#production}}onclick="_gaq.push(['_trackEvent', 'Customize', 'Download', 'Customize and Download']);"{{/production}}>Customize and Download</a>
			              <h5 class="bs-docs-heading">What's included?</h5>
			              <p>Downloads include compiled CSS, compiled and minified CSS, and compiled jQuery plugins, all nicely packed up into a zipball for your convenience.</p>
			            </div>
			          </section><!-- /download -->
			        </form>
			
			
			
			      </div>
			    </div>
			
			  </div>
		{{partial 'includes/docs_foot.html'}}
	</body>
</html>