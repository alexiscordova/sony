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
			<header class="jumbotron subhead" id="overview">
			  <div class="container">
			    <h1>Base CSS</h1>
			    <p class="p1">Fundamental HTML element styles</p>
			  </div>
			</header>
			
			
			  <div class="container">
			
			<!--==================================================
			 Docs nav
			================================================== -->
			    <div class="row">
			      <div class="span3 bs-docs-sidebar">
			        <ul class="simple-nav nav-list bs-docs-sidenav">
			          <li><a href="#typography"><i class="icon-chevron-right"></i> Typography</a></li>
			          <li><a href="#buttons"><i class="icon-chevron-right"></i> Buttons</a></li>
			          <li><a href="#colors"><i class="icon-chevron-right"></i> Colors</a></li>			
			          <li><a href="#forms"><i class="icon-chevron-right"></i> Forms</a></li>
			          <li><a href="#utilities"><i class="icon-chevron-right"></i> Utility Classes</a></li>
			          <li><a href="#icons"><i class="icon-chevron-right"></i> Icons</a></li>
			        </ul>
			      </div>
			      <div class="span9">
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Typography
			================================================== -->
			        <section id="typography">
			
			          {{! Headings }}
			          <h2 class="bs-docs-heading" id="headings">Typography</h2>
			          <div class="bs-docs-example bs-docs-example-headings">
			
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>&lt;h1&gt;</strong> — Major features</p>
			                <h1>Pocket professional</h1>
			              </div>
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>&lt;h2&gt;</strong> — Hero</p>
			                <h2>Small size, large&nbsp;impact</h2>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>&lt;h3&gt;</strong> — Feature heads</p>
			                <h3>Mini body, mega&nbsp;sensor</h3>
			              </div>
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>&lt;h4&gt;</strong> — Sub-head 1</p>
			                <h4>Pick your lens</h4>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>&lt;h5&gt;</strong> — Sub-head 2</p>
			                <h5>Print your shots5</h5>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>&lt;h6&gt;</strong> — Sub-head 3</p>
			                <h6>Exmor<sup>&trade;</sup> APS HD CMOS&nbsp;sensor</h6>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>.l1</strong> — Label 1 — Section</p>
			                <p class="l1">Details</p>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>.l2</strong> — Label 2 — Hero</p>
			                <p class="l2">α NEX-6 camera</p>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>.l3</strong> — Label 3 — Callout strong</p>
			                <p class="l3">3.0” Tiltable LCD&nbsp;Screen</p>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>.l4</strong> — Label 4 — Callout subtle</p>
			                <p class="l4">View Angles</p>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>.p1</strong> — Body Copy 1 — Supports major features</p>
			                <p class="p1">The NEX-6 is as fast as the world you're trying to capture. It epitomizes the leanest of technology.</p>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>&lt;p&gt;, .p2</strong> — Body Copy 2 — Supports features</p>
			                <p   >The bigger the sensor, the better the picture. Experience the quality and performance of a DSLR in about half the size and half the weight of one. The NEX is the smallest interchangeable lens digital camera capable of handling a mega-sized Exmor&trade; sensor.</p>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>.p3</strong> — Body Copy 3 — Supports subheads</p>
			                <p class="p3">Amazing resolution and high contrast prints with massive color and depth.</p>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>.p4</strong> — Body Copy 4 — Subtext 1</p>
			                <p class="p4">Lead Product Design</p>
			              </div>
			            </div>            
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>.p5</strong> — Body Copy 5 — Subtext 2</p>
			                <p class="p5">Starting at</p>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>blockquote.bq1 > p</strong> — Special content — Personal quote 1</p>
			                <blockquote class="bq1"><p>I can now get extreme detail in low light situations. Night shooting is now a reality.</p></blockquote>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>blockquote.bq2 > p</strong> — Special content — Personal quote 2</p>
			                <blockquote class="bq2"><p>Our first step is to think about where people are when they hold it.</p></blockquote>
			              </div>
			            </div>
			            
			            <div class="row">
			              <div class="span4 big-bottom-margin">
			                <p class="title-docs"><strong>.text-number-callout-large</strong> — Special content — Number callout</p>
			                <p class="text-number-callout-large">01</p>
			              </div>
			              <div class="span4 big-bottom-margin">           
			                <p class="title-docs"><strong>.text-promo-title</strong> — Special content — Promo title</p>
			                <p class="text-promo-title"><strong>Exmor<br></strong> Technology</p>
			              </div>
			            </div>
			
			
			          </div>
			
			          {{! Body copy }}
			          <div class="sub-section">
			            <h2 class="bs-docs-heading" id="body-copy">Body copy</h2>
			            <p>For standard body content, such as for supporting features and subheads.</p>
			
			
			            {{! Body copy .p1 }}
			            <h3 class="bs-docs-heading">Body Copy 1 (large)</h3>
			            <p class="bs-docs-heading">Supports major features </hp>
			            <div class="bs-docs-example">
			              <p class="p1">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.</p>
			            </div>
<pre class="prettyprint">&lt;p class="p1"&gt;...&lt;/p&gt;</pre>
			
			            {{! Body copy default }}
			            <h3 class="bs-docs-heading">Body Copy 2 - Default</h3>
			            <p class="bs-docs-heading">Standard paragraphs, Supports features</p>
			            <div class="bs-docs-example">
			              <p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>
			              <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.</p>
			              <p>Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
			            </div>
<pre class="prettyprint">&lt;p&gt;...&lt;/p&gt;</pre>
			
			            {{! Body copy .p3 }}
			            <h3 class="bs-docs-heading">Body Copy 3 (small)</h3>
			            <p class="bs-docs-heading">Supports subheads</p>
			            <div class="bs-docs-example">
			              <p class="p3">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.</p>
			            </div>
<pre class="prettyprint big-bottom-margin">&lt;p class="p3"&gt;...&lt;/p&gt;</pre>
			          </div><!-- end sub-section --> 
			
			
			
			
			
			          {{! TextLinks }}
			          <div class="sub-section">
			
			            <h2 class="bs-docs-heading" id="textlinks">TextLinks</h2>			
			            <h3 class="bs-docs-heading">TextLink within body copy</h3>
			            <p>Default in-paragraph links are smaller than the paragraph text.</p>
			            <div class="bs-docs-example">
			              <p>Lorem ipsum dolor sit amet. <a class="tl" href="#"> Learn more</a></p>
			            </div>
<pre class="prettyprint linenums">
&lt;p&gt;Lorem ipsum dolor sit amet. &lt;a class="tl" href="#"&gt;Learn more&lt;/a&gt;&lt;/p&gt;
</pre>
			
			            <h3 class="bs-docs-heading">Isolated TextLinks</h3>
			           	<h5 class="bs-docs-heading">Standard Isolated TextLink with arrow</h5>
			            <div class="bs-docs-example">
			              <p><a class="tl tl-arrow-right" href="#">Learn from Sony Support</a></p>
			            </div>
<pre class="prettyprint linenums">
&lt;p&gt;&lt;a class="tl tl-arrow-right" href="#"&gt;Learn from Sony Support&lt;/a&gt;&lt;/p&gt;
</pre>
								<h5 class="bs-docs-heading">Large Isolated TextLink with arrow</h5>
			            <div class="bs-docs-example">
			              <p><a class="tl tl-large tl-arrow-right" href="#">Shop All E-mount Lenses</a></p>
			            </div>
<pre class="prettyprint linenums">
&lt;p&gt;&lt;a class="tl tl-large tl-arrow-right" href="#"&gt;Shop All E-mount Lenses&lt;/a&gt;&lt;/p&gt;
</pre>
			          </div><!-- end sub-section --> 
			
			
			
			
			
			
			
			
			          {{! Blockquotes }}
			          <div class="sub-section">
			
			            <h2 class="bs-docs-heading" id="blockquotes">Blockquotes</h2>
			            <p>For quoting blocks of content from external sources such as reviews.</p>
			
			            <h5 class="bs-docs-heading">Personal Quote 1 - Large</h5>
			            <div class="bs-docs-example">
			              <blockquote class="bq1">
			                <p>I can now get extreme detail in low light situations. Night shooting is now a reality.</p>
			              </blockquote>
			            </div>
<pre class="prettyprint linenums">
&lt;blockquote class="bq1"&gt;
  &lt;p&gt;...&lt;/p&gt;
&lt;/blockquote&gt;
</pre >
			
			            <h5 class="bs-docs-heading">Personal quote 2 - Default</h5>
			            <div class="bs-docs-example">
			              <blockquote>
			                <p>Our first step is to think about where people are when they hold it.</p>
			              </blockquote>
			            </div>
<pre class="prettyprint linenums">
&lt;blockquote class="bq2"&gt;
  &lt;p&gt;...&lt;/p&gt;
&lt;/blockquote&gt;
</pre>
			          </div><!-- end sub-section --> 
			
			
			</section>
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			<!--==================================================
			 Colors
			================================================== -->
			        <section id="colors">
			          <h2 class="bs-docs-heading">Colors</h2>
			          <p>Use these variables for colors when possible</p>
								


		          	<h4>Grays<small> for text and general components</small></h4>
								<div class="bs-docs-example">

			            <div class="row">
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--black"></div>
			                <p>$black</p>
			                <p>(0,0,0)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayDark"></div>
			                <p>$grayDark</p>
			                <p>(47,53,61)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--gray"></div>
			                <p>$gray</p>
			                <p>(131,131,143)</p>
			              </div>
			            </div>
			
			            <div class="row">
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayLight"></div>
			                <p>$grayLight</p>
			                <p>(188,188,204)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayLighter color-swatch-outlined"></div>
			                <p>$grayLighter</p>
			                <p>(228,231,235)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--white color-swatch-outlined"></div>
			                <p>$white</p>
			                <p>(255,255,255)</p>
			              </div>
			            </div>

			          </div>


			          <h4>Background Tones<small> </small></h4>
								<div class="bs-docs-example">

			            <div class="row">
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayDarkerFieldLarge"></div>
			                <p>$grayDarkerFieldLarge</p>
			                <p>(31,32,36)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayDarkFieldLarge"></div>
			                <p>$grayDarkFieldLarge</p>
			                <p>(64,66,71)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayLightFieldLarge color-swatch-outlined"></div>
			                <p>$grayLightFieldLarge</p>
			                <p>(243,244,246)</p>
			              </div>
			            </div>
			
			            <div class="row">
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayDarkerFieldSmall"></div>
			                <p>$grayDarkerFieldSmall</p>
			                <p>(33,37,48)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayDarkFieldSmall"></div>
			                <p>$grayDarkFieldSmall</p>
			                <p>(114,110,122)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--grayLightFieldSmall color-swatch-outlined"></div>
			                <p>$grayLightFieldSmall</p>
			                <p>(241,245,249)</p>
			              </div>
			            </div>

			          </div>


			          <h4>Highlight Colors<small> </small></h4>
								<div class="bs-docs-example">

			            <div class="row">
            				<div class="span2 color-swatch-span">
	            				<div class="color-swatch--highlightColor"></div>
			                <p>$highlightColor</p>
			                <p>rgb(243, 84, 41)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
            				<div class="color-swatch--highlightColorHover"></div>
			                <p>$highlightColorHover</p>
			                <p>lighten($highlightColor, 5%)</p>
			                <p>rgb(244, 103, 65)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--highlightColorActive"></div>
			                <p>$highlightColorActive</p>
			                <p>($highlightColor)</p>
			                <p>rgb(243, 84, 41)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--highlightColorDark"></div>
			                <p>$highlightColorDark</p>
			                <p>rgb(219, 76, 37)</p>
			              </div>
			            </div>
			          </div>


			          <h4>Button &amp; Link Colors<small> </small></h4>
								<div class="bs-docs-example">

			            <div class="row">
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--linkColor"></div>
			                <p>$linkColor</p>
			                <p>(69,113,236)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--linkColorHover"></div>
			                <p>$linkColorHover</p>
			                <p>(87,135,244)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--btnBackground"></div>
			                <p>$btnBackground</p>
			                <p>(87,135,244)</p>
			              </div>
	            			<div class="span2 color-swatch-span">
	            				<div class="color-swatch--btnBackgroundHover"></div>
			                <p>$btnBackgroundHover</p>
			                <p>(100,142,245)</p>
			              </div>
			            </div>
			          </div>


			        </section>




			<!--==================================================
			 Buttons
			================================================== -->
			        <section id="buttons">
			          <h2 class="bs-docs-heading">Buttons</h2>
			
			          <h3 class="bs-docs-heading">Default buttons</h3>
			          <p>Button styles can be applied to anything with the <code>.btn</code> class applied. However, typically you'll want to apply these to only <code>&lt;a&gt;</code>, <code>&lt;button&gt;</code> or <code>&lt;input&gt;</code> elements.</p>
			          <p>In most cases <code>&lt;a&gt;</code> buttons will be most appropriate.</p>
			
			
			          <h5 class="bs-docs-heading">Standard Button</h5>
			          <div class="bs-docs-example">
			            <p>
			                <a class="btn">Get Sony Support</a>
			            </p>
			          </div>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn"&gt;...&lt;/a&gt;
&lt;/p&gt;
</pre>
			
			          <h5 class="bs-docs-heading">'Special' Button<small> &ndash; Generally used for store links</small></h5>
			          <div class="bs-docs-example">
			            <p>
			              <a class="btn btn-special">Where to Buy</a>
			            </p>
			          </div>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn btn-special"&gt;...&lt;/a&gt;
&lt;/p&gt;
</pre>
			
			
			          <h5 class="bs-docs-heading">'Alt' Button</h5>
			          <div class="bs-docs-example">
			            <p>
			              <a class="btn btn-alt">Alt Button</a>
			            </p>
			          </div>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn btn-alt"&gt;...&lt;/a&gt;
&lt;/p&gt;
</pre>
			
			
			          <h5 class="bs-docs-heading">'Alt' Button small w/icon left of text</h5>
			          <div class="bs-docs-example">
			            <p>
			              <a class="btn btn-small btn-alt btn-icon-mini-left"><i class="icon-mini-grid"></i>All Electronics</a>
			            </p>
			          </div>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn btn-small btn-alt btn-icon-mini-left"&gt;&lt;i class="icon-mini-grid"&gt;&lt;/i&gt;...&lt;/a&gt;
&lt;/p&gt;
</pre>
			
			
			          <h5 class="bs-docs-heading">'Promo' Button<small> &ndash; Used for promotions</small></h5>
			          <div class="bs-docs-example">
			            <p>
			              <a class="btn btn-promo text-promo-title"><strong>Exmor<br></strong> Technology<i class="icon-mini-arrow-right-white-boxed"></i></a>
			            </p>
			          </div>
			<pre class="prettyprint linenums">
			&lt;p&gt;
			  &lt;a class="btn btn-promo"&gt;...&lt;i class="icon-mini-arrow-right-white-boxed"&gt;&lt;/i&gt;&lt;/a&gt;
			&lt;/p&gt;
			</pre>
			
			
			          <h3 class="bs-docs-heading">Button sizes</h3>
			          <p>Fancy larger or smaller buttons? Add <code>.btn-large</code>, <code>.btn-small</code>, or <code>.btn-mini</code> for additional sizes.</p>
			          <div class="bs-docs-example">
			            <p>
			              <a class="btn btn-large">Large button</a>
			              <a class="btn btn-large btn-special">Large special btn</a>
			            </p>
			            <p>
			              <a class="btn">Default button</a>
			              <a class="btn btn-special">Default special btn</a>
			            </p>
			            <p>
			              <a class="btn btn-small">Small button</a>
			              <a class="btn btn-small btn-special">Small special btn</a>
			            </p>
			            <p>
			              <a class="btn btn-mini">Mini button</a>
			              <a class="btn btn-mini btn-special">Mini special btn</a>
			            </p>
			          </div>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn btn-large"&gt;Large button&lt;/a&gt;
  &lt;a class="btn btn-large btn-special"&gt;Large special btn&lt;/a&gt;
&lt;/p&gt;
&lt;p&gt;
  &lt;a class="btn"&gt;Default button&lt;/a&gt;
  &lt;a class="btn btn-special"&gt;Default special btn&lt;/a&gt;
&lt;/p&gt;
&lt;p&gt;
  &lt;a class="btn btn-small"&gt;Small button&lt;/a&gt;
  &lt;a class="btn btn-small btn-special"&gt;Small special btn&lt;/a&gt;
&lt;/p&gt;
&lt;p&gt;
  &lt;a class="btn btn-mini"&gt;Mini button&lt;/a&gt;
  &lt;a class="btn btn-mini btn-special"&gt;Mini special btn&lt;/a&gt;
&lt;/p&gt;
</pre>
			          <h3 class="bs-docs-heading">Block level buttons</h3>
			          <p>Create block level buttons&mdash;those that span the full width of a parent&mdash; by adding <code>.btn-block</code>.</p>
			          <div class="bs-docs-example">
			            <div class="well">
			              <a class="btn btn-block">Block level button</a>
			              <a class="btn btn-block btn-special">Block level special button</a>
			            </div>
			          </div>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn btn-block"&gt;Block level button&lt;/a&gt;
  &lt;a class="btn btn-block btn-special"&gt;Block level special button&lt;/a&gt;
&lt;/p&gt;
</pre>
			
			
			          <h3 class="bs-docs-heading">Disabled state</h3>
			          <p>Make buttons look unclickable by fading them back 50%.</p>
			
			          <h4 class="bs-docs-heading">Anchor element</h4>
			          <p>Add the <code>.disabled</code> class to <code>&lt;a&gt;</code> buttons.</p>
			          <p class="bs-docs-example">
			            <a href="#" class="btn disabled">Link</a>
			            <a href="#" class="btn btn-special disabled">Special link</a>
			          </p>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a href="#" class="btn disabled"&gt;Link&lt;/a&gt;
  &lt;a href="#" class="btn btn-special disabled"&gt;Special link&lt;/a&gt;
&lt;/p&gt;
</pre>
			          <p>
			            <span class="label label-info">Heads up!</span>
			            We use <code>.disabled</code> as a utility class here, similar to the common <code>.active</code> class, so no prefix is required. Also, this class is only for aesthetic; you must use custom JavaScript to disable links here.
			          </p>
			
			          <h4 class="bs-docs-heading">Button element</h4>
			          <p>Add the <code>disabled</code> attribute to <code>&lt;button&gt;</code> buttons.</p>
			          <p class="bs-docs-example">
			            <button type="button" class="btn" disabled>Button</button>
			            <button type="button" class="btn btn-special disabled" disabled="disabled">Special button</button>
			          </p>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;button type="button" class="btn" disabled&gt;Button&lt;/button&gt;
  &lt;button type="button" class="btn btn-special disabled" disabled="disabled"&gt;Special button&lt;/button&gt;
&lt;/p&gt;
</pre>
			
			
			          <h3 class="bs-docs-heading">One class, multiple tags</h3>
			          <p>Use the <code>.btn</code> class on an <code>&lt;a&gt;</code>, <code>&lt;button&gt;</code>, or <code>&lt;input&gt;</code> element.</p>
			          <form class="bs-docs-example">
			            <a class="btn" href="">Link</a>
			            <button class="btn" type="submit">Button</button>
			            <input class="btn" type="button" value="Input">
			            <input class="btn" type="submit" value="Submit">
			          </form>
<pre class="prettyprint linenums">
&lt;p&gt;
  &lt;a class="btn" href=""&gt;Link&lt;/a&gt;
  &lt;button class="btn" type="submit"&gt;Button&lt;/button&gt;
  &lt;input class="btn" type="button" value="Input"&gt;
  &lt;input class="btn" type="submit" value="Submit"&gt;
&lt;/p&gt;
</pre>
			          <p>As a best practice, try to match the element for your context to ensure matching cross-browser rendering. Usually you'll make an <code>a</code> anchor link. If you have an <code>input</code>, use an <code>&lt;input type="submit"&gt;</code> for your button. If you have a <code>button</code>, use <code>&lt;button type="button"&gt;</code>.</p>
			
			        </section>
			
			






			        <section class="NotUpdatedYet" style="padding:10px 20px"><h6>Sections with a light blue background have not been styled or updated yet. If you update them, remove the class "NotUpdatedYet" from the parent container of the section, and from the "bs-docs-example" container as well.</h6></section>

			







			
			<!--==================================================
			 Forms
			================================================== -->
			        <section id="forms">
			          <h2 class="bs-docs-heading">Forms</h2>
			
			          <h3 class="bs-docs-heading">Default styles</h3>
			          <p>Individual form controls receive styling, but without any required base class on the <code>&lt;form&gt;</code> or large changes in markup. Results in stacked, left-aligned labels on top of form controls.</p>
			          <form class="bs-docs-example NotUpdatedYet">
			            <legend>Legend</legend>
			            <label>Label name</label>
			            <input type="text" placeholder="Type something…">
			            <span class="help-block">Example block-level help text here.</span>
			            <label class="checkbox">
			              <input type="checkbox"> Check me out
			            </label>
			            <button type="submit" class="btn">Submit</button>
			          </form>
<pre class="prettyprint linenums">
&lt;form&gt;
  &lt;legend&gt;Legend&lt;/legend&gt;
  &lt;label&gt;Label name&lt;/label&gt;
  &lt;input type="text" placeholder="Type something…"&gt;
  &lt;span class="help-block"&gt;Example block-level help text here.&lt;/span&gt;
  &lt;label class="checkbox"&gt;
    &lt;input type="checkbox"&gt; Check me out
  &lt;/label&gt;
  &lt;button type="submit" class="btn"&gt;Submit&lt;/button&gt;
&lt;/form&gt;
</pre>
			


			<h4 class="bs-docs-heading">Supported form controls</h4>
			          <p>Examples of standard form controls supported in an example form layout.</p>
			
			          <h3>Inputs</h3>
			          <p>Most common form control, text-based input fields. Includes support for all HTML5 types: text, password, datetime, datetime-local, date, month, time, week, number, email, url, search, tel, and color.</p>
			          <p>Requires the use of a specified <code>type</code> at all times.</p>
			          <form class="bs-docs-example form-inline">
			            <input type="text" placeholder="City or Postal Code">
			          </form>
<pre class="prettyprint linenums">
&lt;input type="text" placeholder="City or Postal Code"&gt;
</pre>
			
			          <h4 class="bs-docs-heading">Textarea</h4>
			          <p>Form control which supports multiple lines of text. Change <code>rows</code> attribute as necessary.</p>
			          <form class="bs-docs-example form-inline">
			            <textarea rows="3"></textarea>
			          </form>
<pre class="prettyprint linenums">
&lt;textarea rows="3"&gt;&lt;/textarea&gt;
</pre>
							
							<div class="NotUpdatedYet">
			          <h4 class="bs-docs-heading">Checkboxes and radios</h4>
			          <p>Checkboxes are for selecting one or several options in a list while radios are for selecting one option from many.</p>
			          <h4>Default (stacked)</h4>
			          <form class="bs-docs-example NotUpdatedYet">
			            <label class="checkbox">
			              <input type="checkbox" value="">
			              Option one is this and that&mdash;be sure to include why it's great
			            </label>
			            <br>
			            <label class="radio">
			              <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
			              Option one is this and that&mdash;be sure to include why it's great
			            </label>
			            <label class="radio">
			              <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
			              Option two can be something else and selecting it will deselect option one
			            </label>
			          </form>
<pre class="prettyprint linenums">
&lt;label class="checkbox"&gt;
  &lt;input type="checkbox" value=""&gt;
  Option one is this and that&mdash;be sure to include why it's great
&lt;/label&gt;

&lt;label class="radio"&gt;
  &lt;input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked&gt;
  Option one is this and that&mdash;be sure to include why it's great
&lt;/label&gt;
&lt;label class="radio"&gt;
  &lt;input type="radio" name="optionsRadios" id="optionsRadios2" value="option2"&gt;
  Option two can be something else and selecting it will deselect option one
&lt;/label&gt;
</pre>				
							</div>
			
							<div class="NotUpdatedYet">
			          <h5 class="bs-docs-heading">Inline checkboxes</h5>
			          <p>Add the <code>.inline</code> class to a series of checkboxes or radios for controls appear on the same line.</p>
			          <form class="bs-docs-example NotUpdatedYet">
			            <label class="checkbox inline">
			              <input type="checkbox" id="inlineCheckbox1" value="option1"> 1
			            </label>
			            <label class="checkbox inline">
			              <input type="checkbox" id="inlineCheckbox2" value="option2"> 2
			            </label>
			            <label class="checkbox inline">
			              <input type="checkbox" id="inlineCheckbox3" value="option3"> 3
			            </label>
			          </form>
<pre class="prettyprint linenums">
&lt;label class="checkbox inline"&gt;
  &lt;input type="checkbox" id="inlineCheckbox1" value="option1"&gt; 1
&lt;/label&gt;
&lt;label class="checkbox inline"&gt;
  &lt;input type="checkbox" id="inlineCheckbox2" value="option2"&gt; 2
&lt;/label&gt;
&lt;label class="checkbox inline"&gt;
  &lt;input type="checkbox" id="inlineCheckbox3" value="option3"&gt; 3
&lt;/label&gt;
</pre>
							</div>


							<div class="NotUpdatedYet">
			          <h4 class="bs-docs-heading">Selects</h4>
			          <p>Use the default option or specify a <code>multiple="multiple"</code> to show multiple options at once.</p>
			          <form class="bs-docs-example NotUpdatedYet">
			            <select>
			              <option>1</option>
			              <option>2</option>
			              <option>3</option>
			              <option>4</option>
			              <option>5</option>
			            </select>
			            <br>
			            <select multiple="multiple">
			              <option>1</option>
			              <option>2</option>
			              <option>3</option>
			              <option>4</option>
			              <option>5</option>
			            </select>
			          </form>
<pre class="prettyprint linenums">
&lt;select&gt;
  &lt;option&gt;1&lt;/option&gt;
  &lt;option&gt;2&lt;/option&gt;
  &lt;option&gt;3&lt;/option&gt;
  &lt;option&gt;4&lt;/option&gt;
  &lt;option&gt;5&lt;/option&gt;
&lt;/select&gt;
			
&lt;select multiple="multiple"&gt;
  &lt;option&gt;1&lt;/option&gt;
  &lt;option&gt;2&lt;/option&gt;
  &lt;option&gt;3&lt;/option&gt;
  &lt;option&gt;4&lt;/option&gt;
  &lt;option&gt;5&lt;/option&gt;
&lt;/select&gt;
</pre>
							</div>

			
			
			
			          <h3 class="bs-docs-heading">Optional layouts</h3>
			          <p>Included with Bootstrap are three optional form layouts for common use cases.</p>
			
			          <h5 class="bs-docs-heading">Fused Submit Form</h5>
			          <p>Add <code>.form-fused</code> to the <code>&lt;form&gt;</code> for a fused input/button combo. In this particular case, make sure there is no whitespace in the code between the <code>&lt;input&gt;</code> and the <code>&lt;button&gt;</code> to avoid extra spacing between them.</p>
			          <form class="bs-docs-example form-fused">
			            <input type="text" class="input-medium" placeholder="City or Postal Code"><button type="submit">Submit<i class="icon-mini-arrow-right-white-boxed-bordered1"></i></button>
			          </form>
<pre class="prettyprint linenums">
&lt;form class="form-fused"&gt;
  &lt;input type="text" class="input-medium" placeholder="City or Postal Code"&gt;&lt;button type="submit"&gt;Submit&lt;i class="icon-mini-arrow-right-blue-boxed-bordered1"&gt;&lt;/i&gt;&lt;/button&gt;
&lt;/form&gt;
</pre>
			
			          <h5>Fused Submit Form (Alternate)</h5>
			          <p>Add <code>.form-fused-alt</code> to the <code>&lt;form&gt;</code> for an alternate fused input/button combo. In this particular case, make sure there is no whitespace in the code between the <code>&lt;input&gt;</code> and the <code>&lt;button&gt;</code> to avoid extra spacing between them.</p>
			          <form class="bs-docs-example form-fused-alt">
			            <input type="text" class="input-medium" placeholder="Your Email"><button type="submit">Submit<i class="icon-mini-arrow-right-blue-boxed-bordered2"></i></button>
			          </form>
<pre class="prettyprint linenums">
&lt;form class="form-fused-alt"&gt;
  &lt;input type="text" class="input-medium" placeholder="Your Email"&gt;&lt;button type="submit"&gt;Submit&lt;i class="icon-mini-arrow-right-blue-boxed-bordered2"&gt;&lt;/i&gt;&lt;/button&gt;
&lt;/form&gt;
</pre>
							

							<div class="NotUpdatedYet">
			          <h4 class="bs-docs-heading">Inline form</h4>
			          <p>Add <code>.form-inline</code> for left-aligned labels and inline-block controls for a compact layout.</p>
			          <form class="bs-docs-example form-inline NotUpdatedYet">
			            <input type="text" class="input-small" placeholder="Email">
			            <input type="password" class="input-small" placeholder="Password">
			            <label class="checkbox">
			              <input type="checkbox"> Remember me
			            </label>
			            <button type="submit" class="btn">Sign in</button>
			          </form>
<pre class="prettyprint linenums">
&lt;form class="form-inline"&gt;
  &lt;input type="text" class="input-small" placeholder="Email"&gt;
  &lt;input type="password" class="input-small" placeholder="Password"&gt;
  &lt;label class="checkbox"&gt;
    &lt;input type="checkbox"&gt; Remember me
  &lt;/label&gt;
  &lt;button type="submit" class="btn"&gt;Sign in&lt;/button&gt;
&lt;/form&gt;
</pre>
							</div>



							<div class="NotUpdatedYet">			
			          <h4 class="bs-docs-heading">Horizontal form</h4>
			          <p>Right align labels and float them to the left to make them appear on the same line as controls. Requires the most markup changes from a default form:</p>
			          <ul>
			            <li>Add <code>.form-horizontal</code> to the form</li>
			            <li>Wrap labels and controls in <code>.control-group</code></li>
			            <li>Add <code>.control-label</code> to the label</li>
			            <li>Wrap any associated controls in <code>.controls</code> for proper alignment</li>
			          </ul>
			          <form class="bs-docs-example form-horizontal NotUpdatedYet">
			            <legend>Legend</legend>
			            <div class="control-group">
			              <label class="control-label" for="inputEmail">Email</label>
			              <div class="controls">
			                <input type="text" id="inputEmail" placeholder="Email">
			              </div>
			            </div>
			            <div class="control-group">
			              <label class="control-label" for="inputPassword">Password</label>
			              <div class="controls">
			                <input type="password" id="inputPassword" placeholder="Password">
			              </div>
			            </div>
			            <div class="control-group">
			              <div class="controls">
			                <label class="checkbox">
			                  <input type="checkbox"> Remember me
			                </label>
			                <button type="submit" class="btn">Sign in</button>
			              </div>
			            </div>
			          </form>
<pre class="prettyprint linenums">
&lt;form class="form-horizontal"&gt;
  &lt;div class="control-group"&gt;
    &lt;label class="control-label" for="inputEmail"&gt;Email&lt;/label&gt;
    &lt;div class="controls"&gt;
      &lt;input type="text" id="inputEmail" placeholder="Email"&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="control-group"&gt;
    &lt;label class="control-label" for="inputPassword"&gt;Password&lt;/label&gt;
    &lt;div class="controls"&gt;
      &lt;input type="password" id="inputPassword" placeholder="Password"&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="control-group"&gt;
    &lt;div class="controls"&gt;
      &lt;label class="checkbox"&gt;
        &lt;input type="checkbox"&gt; Remember me
      &lt;/label&gt;
      &lt;button type="submit" class="btn"&gt;Sign in&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/form&gt;
</pre>
							</div>
			
			
			
			          
			
							<div class="NotUpdatedYet">
			          <h5 class="bs-docs-heading">Search form</h5>
			          <form class="bs-docs-example form-search NotUpdatedYet">
			            <div class="input-append">
			              <input type="text" class="span2 search-query">
			              <button type="submit" class="btn">Search</button>
			            </div>
			            <div class="input-prepend">
			              <button type="submit" class="btn">Search</button>
			              <input type="text" class="span2 search-query">
			            </div>
			          </form>
<pre class="prettyprint linenums">
&lt;form class="form-search"&gt;
  &lt;div class="input-append"&gt;
    &lt;input type="text" class="span2 search-query"&gt;
    &lt;button type="submit" class="btn"&gt;Search&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class="input-prepend"&gt;
    &lt;button type="submit" class="btn"&gt;Search&lt;/button&gt;
    &lt;input type="text" class="span2 search-query"&gt;
  &lt;/div&gt;
&lt;/form&gt;
</pre>
							</div>


			
			          <h4 class="bs-docs-heading">Form actions</h4>
			          <p>If you want a button to be less important than another, include <code>.btn-secondary</code>
			          <form class="bs-docs-example">
		              <button type="submit" class="btn">Save changes</button>
		              <button type="button" class="btn btn-secondary">Cancel</button>
			          </form>
<pre class="prettyprint linenums">
&lt;form&gt;
  &lt;button type="submit" class="btn"&gt;Save changes&lt;/button&gt;
  &lt;button type="button" class="btn btn-secondary"&gt;Cancel&lt;/button&gt;
&lt;/form&gt;
</pre>




			
			          <h4 class="bs-docs-heading">Control sizing</h4>
			          <p>Use relative sizing classes like <code>.input-large</code> or match your inputs to the grid column sizes using <code>.span*</code> classes.</p>
			
			          <h5 class="bs-docs-heading">Relative sizing</h5>
			          <form class="bs-docs-example" style="padding-bottom: 15px;">
			            <div class="controls docs-input-sizes">
			              <input class="input-mini" type="text" placeholder=".input-mini">
			              <input class="input-small" type="text" placeholder=".input-small">
			              <input class="input-medium" type="text" placeholder=".input-medium">
			              <input class="input-large" type="text" placeholder=".input-large">
			              <input class="input-xlarge" type="text" placeholder=".input-xlarge">
			              <input class="input-xxlarge" type="text" placeholder=".input-xxlarge">
			            </div>
			          </form>
<pre class="prettyprint linenums">
&lt;input class="input-mini" type="text" placeholder=".input-mini"&gt;
&lt;input class="input-small" type="text" placeholder=".input-small"&gt;
&lt;input class="input-medium" type="text" placeholder=".input-medium"&gt;
&lt;input class="input-large" type="text" placeholder=".input-large"&gt;
&lt;input class="input-xlarge" type="text" placeholder=".input-xlarge"&gt;
&lt;input class="input-xxlarge" type="text" placeholder=".input-xxlarge"&gt;
</pre>
			          <p>
			            <span class="label label-info">Heads up!</span> In future versions, we'll be altering the use of these relative input classes to match our button sizes. For example, <code>.input-large</code> will increase the padding and font-size of an input.
			          </p>
			
			          <h5 class="bs-docs-heading">Grid sizing</h5>
			          <p>Use <code>.span1</code> to <code>.span12</code> for inputs that match the same sizes of the grid columns.</p>
			          <form class="bs-docs-example" style="padding-bottom: 15px;">
			            <div class="controls docs-input-sizes">
			              <input class="span1" type="text" placeholder=".span1">
			              <input class="span2" type="text" placeholder=".span2">
			              <input class="span3" type="text" placeholder=".span3">
			              <select class="span1">
			                <option>1</option>
			                <option>2</option>
			                <option>3</option>
			                <option>4</option>
			                <option>5</option>
			              </select>
			              <select class="span2">
			                <option>1</option>
			                <option>2</option>
			                <option>3</option>
			                <option>4</option>
			                <option>5</option>
			              </select>
			              <select class="span3">
			                <option>1</option>
			                <option>2</option>
			                <option>3</option>
			                <option>4</option>
			                <option>5</option>
			              </select>
			            </div>
			          </form>
<pre class="prettyprint linenums">
&lt;input class="span1" type="text" placeholder=".span1"&gt;
&lt;input class="span2" type="text" placeholder=".span2"&gt;
&lt;input class="span3" type="text" placeholder=".span3"&gt;
&lt;select class="span1"&gt;
  ...
&lt;/select&gt;
&lt;select class="span2"&gt;
  ...
&lt;/select&gt;
&lt;select class="span3"&gt;
  ...
&lt;/select&gt;
</pre>
			
			          <p>For multiple grid inputs per line, <strong>use the <code>.controls-row</code> modifier class for proper spacing</strong>. It floats the inputs to collapse white-space, sets the proper margins, and the clears the float.</p>
			          <form class="bs-docs-example" style="padding-bottom: 15px;">
			            <div class="controls">
			              <input class="span5" type="text" placeholder=".span5">
			            </div>
			            <div class="controls controls-row">
			              <input class="span4" type="text" placeholder=".span4">
			              <input class="span1" type="text" placeholder=".span1">
			            </div>
			            <div class="controls controls-row">
			              <input class="span3" type="text" placeholder=".span3">
			              <input class="span2" type="text" placeholder=".span2">
			            </div>
			            <div class="controls controls-row">
			              <input class="span2" type="text" placeholder=".span2">
			              <input class="span3" type="text" placeholder=".span3">
			            </div>
			            <div class="controls controls-row">
			              <input class="span1" type="text" placeholder=".span1">
			              <input class="span4" type="text" placeholder=".span4">
			            </div>
			          </form>
<pre class="prettyprint linenums">
&lt;div class="controls"&gt;
  &lt;input class="span5" type="text" placeholder=".span5"&gt;
&lt;/div&gt;
&lt;div class="controls controls-row"&gt;
  &lt;input class="span4" type="text" placeholder=".span4"&gt;
  &lt;input class="span1" type="text" placeholder=".span1"&gt;
&lt;/div&gt;
...
</pre>
			
			          <h4 class="bs-docs-heading">Uneditable inputs</h4>
			          <p>Present data in a form that's not editable without using actual form markup.</p>
			          <form class="bs-docs-example">
			            <span class="input-xlarge uneditable-input">Some value here</span>
			          </form>
<pre class="prettyprint linenums">
&lt;span class="input-xlarge uneditable-input"&gt;Some value here&lt;/span&gt;
</pre>
							
							<div class="NotUpdatedYet">
			          <h4 class="bs-docs-heading">Help text</h4>
			          <p>Inline and block level support for help text that appears around form controls.</p>
			          <h5 class="bs-docs-heading">Inline help</h5>
			          <form class="bs-docs-example form-inline NotUpdatedYet">
			            <input type="text"> <span class="help-inline">Inline help text</span>
			          </form>
<pre class="prettyprint linenums">
&lt;input type="text"&gt;&lt;span class="help-inline"&gt;Inline help text&lt;/span&gt;
</pre>				
							</div>



							<div class="NotUpdatedYet">			
			          <h5 class="bs-docs-heading">Block help</h5>
			          <form class="bs-docs-example form-inline NotUpdatedYet">
			            <input type="text">
			            <span class="help-block">A longer block of help text that breaks onto a new line and may extend beyond one line.</span>
			          </form>
<pre class="prettyprint linenums">
&lt;input type="text"&gt;&lt;span class="help-block"&gt;A longer block of help text that breaks onto a new line and may extend beyond one line.&lt;/span&gt;
</pre>
							</div>
			
			
			
							<div class="NotUpdatedYet">
			          <h3 class="bs-docs-heading">Form control states</h3>
			          <p>Provide feedback to users or visitors with basic feedback states on form controls and labels.</p>
			
			          <h4 class="bs-docs-heading">Input focus</h4>
			          <p>We remove the default <code>outline</code> styles on some form controls and apply a <code>box-shadow</code> in its place for <code>:focus</code>.</p>
			          <form class="bs-docs-example form-inline NotUpdatedYet">
			            <input class="input-xlarge focused" id="focusedInput" type="text" value="This is focused...">
			          </form>
<pre class="prettyprint linenums">
&lt;input class="input-xlarge" id="focusedInput" type="text" value="This is focused..."&gt;
</pre>
							</div>
			
			          <h4 class="bs-docs-heading">Disabled inputs</h4>
			          <p>Add the <code>disabled</code> attribute on an input to prevent user input and trigger a slightly different look.</p>
			          <form class="bs-docs-example form-inline">
			            <input class="input-xlarge" id="disabledInput" type="text" placeholder="Disabled input here…" disabled>
			          </form>
<pre class="prettyprint linenums">
&lt;input class="input-xlarge" id="disabledInput" type="text" placeholder="Disabled input here..." disabled&gt;
</pre>
			

							<div class="NotUpdatedYet">
			          <h4 class="bs-docs-heading">Validation states</h4>
			          <p>Bootstrap includes validation styles for error, warning, info, and success messages. To use, add the appropriate class to the surrounding <code>.control-group</code>.</p>
			
			          <form class="bs-docs-example form-horizontal NotUpdatedYet">
			            <div class="control-group warning">
			              <label class="control-label" for="inputWarning">Input with warning</label>
			              <div class="controls">
			                <input type="text" id="inputWarning">
			                <span class="help-inline">Something may have gone wrong</span>
			              </div>
			            </div>
			            <div class="control-group error">
			              <label class="control-label" for="inputError">Input with error</label>
			              <div class="controls">
			                <input type="text" id="inputError">
			                <span class="help-inline">Please correct the error</span>
			              </div>
			            </div>
			            <div class="control-group info">
			              <label class="control-label" for="inputError">Input with info</label>
			              <div class="controls">
			                <input type="text" id="inputError">
			                <span class="help-inline">Username is taken</span>
			              </div>
			            </div>
			            <div class="control-group success">
			              <label class="control-label" for="inputSuccess">Input with success</label>
			              <div class="controls">
			                <input type="text" id="inputSuccess">
			                <span class="help-inline">Woohoo!</span>
			              </div>
			            </div>
			          </form>
<pre class="prettyprint linenums">
&lt;div class="control-group warning"&gt;
  &lt;label class="control-label" for="inputWarning"&gt;Input with warning&lt;/label&gt;
  &lt;div class="controls"&gt;
    &lt;input type="text" id="inputWarning"&gt;
    &lt;span class="help-inline"&gt;Something may have gone wrong&lt;/span&gt;
  &lt;/div&gt;
&lt;/div&gt;
&lt;div class="control-group error"&gt;
  &lt;label class="control-label" for="inputError"&gt;Input with error&lt;/label&gt;
  &lt;div class="controls"&gt;
    &lt;input type="text" id="inputError"&gt;
    &lt;span class="help-inline"&gt;Please correct the error&lt;/span&gt;
  &lt;/div&gt;
&lt;/div&gt;
&lt;div class="control-group success"&gt;
  &lt;label class="control-label" for="inputSuccess"&gt;Input with success&lt;/label&gt;
  &lt;div class="controls"&gt;
    &lt;input type="text" id="inputSuccess"&gt;
    &lt;span class="help-inline"&gt;Woohoo!&lt;/span&gt;
  &lt;/div&gt;
&lt;/div&gt;
</pre>
				</div>



			</section>
			
			
			<!--==================================================
			 Utilities
			================================================== -->
			<section id="utilities">
				<h2 class="bs-docs-heading">Utility Classes</h2>

				<p>A collection of utility class so you don't have to keep writing them!</p>

				<h3 class="bs-docs-heading">Vertical centering</h3>

				<p>Option 1 - table-cell centering</p>

				<div class="bs-docs-example">
					<div class="table-center-wrap" style="background:#f2f2f2;height:200px;">
						<p class="table-center">Some vertically centered content</p>
					</div>
				</div>
<pre class="prettyprint linenums">
&lt;div class="table-center-wrap"&gt;
	&lt;p class="table-center"&gt;Some vertically centered content&lt;/p&gt;
&lt;/div&gt;
</pre>


				<p>Option 2 - ghost element. Reference: <a class="tl tl-arrow" href="http://css-tricks.com/centering-in-the-unknown/">Centering the Unknown</a>. Use this when display:table is causing you problems.</p>
				<div class="bs-docs-example">
					<div class="ghost-center-wrap" style="background:#f2f2f2;height:200px;">
						<p class="ghost-center">Some vertically centered content</p>
					</div>
				</div>
<pre class="prettyprint linenums">
&lt;div class="ghost-center-wrap"&gt;
	&lt;p class="ghost-center"&gt;Some vertically centered content&lt;/p&gt;
&lt;/div&gt;
</pre>

			</section>
			
			
			<!--==================================================
			 Icons
			================================================== -->
			<section id="icons">
				<h2 class="bs-docs-heading">Icons</h2>

				<p>Sony Icons (SVG!)</p>
<pre class="prettyprint linenums">
&lt;i class="icon-grid"&gt;&lt;/i&gt;
</pre>

				<ul class="the-icons clearfix">
					<li><i class="icon-grid"></i> <span class="icons-desc">icon-grid</span></li>
					<li><i class="icon-grid-alt"></i> <span class="icons-desc">icon-grid-alt</span></li>
					<li><i class="icon-headphones"></i> <span class="icons-desc">icon-headphones</span></li>
					<li><i class="icon-earbuds"></i> <span class="icons-desc">icon-earbuds</span></li>
					<li><i class="icon-earclips"></i> <span class="icons-desc">icon-earclips</span></li>
					<li><i class="icon-neckphones"></i> <span class="icons-desc">icon-neckphones</span></li>
					<li><i class="icon-star"></i> <span class="icons-desc">icon-star</span></li>
					<li><i class="icon-tv"></i> <span class="icons-desc">icon-tv</span></li>
					<li><i class="icon-laptop"></i> <span class="icons-desc">icon-laptop</span></li>
					<li><i class="icon-tablet"></i> <span class="icons-desc">icon-tablet</span></li>
					<li><i class="icon-memory-stick"></i> <span class="icons-desc">icon-memory-stick</span></li>
					<li><i class="icon-projector"></i> <span class="icons-desc">icon-projector</span></li>
					<li><i class="icon-water-drop"></i> <span class="icons-desc">icon-water-drop</span></li>
					<li><i class="icon-mic"></i> <span class="icons-desc">icon-mic</span></li>
					<li><i class="icon-dongle"></i> <span class="icons-desc">icon-dongle</span></li>
					<li><i class="icon-cd"></i> <span class="icons-desc">icon-cd</span></li>
					<li><i class="icon-handycam"></i> <span class="icons-desc">icon-handycam</span></li>
					<li><i class="icon-video-camera"></i> <span class="icons-desc">icon-video-camera</span></li>
				</ul>

				<script>
					$('.the-icons li').hover(function() {
						this.querySelector('i').classList.add('active');
					}, function() {
						this.querySelector('i').classList.remove('active');
					});
				</script>

				<p>Each of the above also have an active state. Just add <code>.active</code> to the class list</p>
				<p>There is a fallback .png for older browsers. If we need something to be raster, we can create another spritesheet for raster specific icons.</p>
			</section>
			
			
			
			
			
			      </div>
			    </div>
			
			  </div>
			  

		{{partial 'includes/docs_foot.html'}}
	</body>
</html>
