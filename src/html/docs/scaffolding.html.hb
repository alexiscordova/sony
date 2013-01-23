<!DOCTYPE html>
<!--[if lt IE8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs-head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs-nav.html'}}

      <!-- Subhead
      ================================================== -->
      <header class="jumbotron subhead" id="overview">
        <div class="container">
          <h2 class="bs-docs-heading">Scaffolding</h2>
          <p class="p1">The system is built on responsive 12-column grids, layouts, and components, with 2 primary left &amp; right margins.</p>
        </div>
      </header>
      
      <div class="main docs-scaffolding" id="docs-scaffolding"> 
      

        <!-- Content and grid (wrappers)
        ================================================== -->
        
        <div class="container" id="show-hidden-sections-btn-w" style="margin-bottom:-40px; display:none;">
        	<a href="#" class="btn btn-special" style="width:260px;">Show Hidden Sections</a>
      	</div>
        

        <div id="pre-small-screen">
        <section id="root-level-page-structure">

          <div class="container">
            <h2 class="bs-docs-heading">Root-level page structure</h2>

            <h3 class="bs-docs-heading">Page structure overview</h3>
            <p>The blue "#page-wrap-inner" section of the page is 100% wide with no margins or padding.</p>

            <div class="docs-page-structure-page overall-page-demo">
              <div class="docs-page-structure-nav"><pre class="prettyprint"><span class="tag">nav</span></pre></div>  
              <div class="docs-page-structure-main"><pre class="prettyprint">#page-wrap-inner</pre></div> 
              <div class="docs-page-structure-footer"><pre class="prettyprint"><span class="tag">footer</span></pre></div>                    
            </div>


            <h3 class="bs-docs-heading">Page sections</h3>
            <p>Directly inside of "#page-wrap-inner" are the major <code>.container</code> sections of the page, each its own 'row' of content. All "root-level" modules should be wrapped in one of these <code>&lt;section class="container"&gt;</code>. </p>
            <p>Each container has left &amp; right margins*, which may be different at each breakpoint. To remove the side margins, add <code>.full-bleed</code> to the <code>.container</code>.</p>
            <p class="p3">*They're margins in theory, but not in css. margin-left and margin-right are actually auto, and the container has a set (percent) width, which is calculated, based on the size the margins should be.</p>

            <div class="docs-page-structure-page">
              <div class="docs-page-structure-nav"><pre class="prettyprint"><span class="tag">nav</span></pre></div>  
              <div class="docs-page-structure-main">
                <section class="container"><pre class="prettyprint">.container</pre></section>
                <section class="container full-bleed"><pre class="prettyprint">.container.full-bleed</pre></section>
                <section class="container"><pre class="prettyprint">.container</pre></section>
              </div>
              <div class="docs-page-structure-footer"><pre class="prettyprint"><span class="tag">footer</span></pre></div>                  
            </div>




            <h3 class="bs-docs-heading">Max-width</h3>
            <p>The <code>.container</code> sections have a max-width, so they won't expand past a certain width. If you need a container to be full bleed no matter how wide the browser window is (for instance for full-browser-width background), add <code>.full-bleed-no-max</code> to your <code>.container</code></p>

            <div class="docs-page-structure-page docs-page-structure-page-max">
              <!-- <div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>   -->
              <div class="docs-page-structure-main">
                <section class="container"><pre class="prettyprint">.container</pre></section>
                <div class="docs-docs-page-structure-maxWidth-outline"></div>
                <section class="container full-bleed"><pre class="prettyprint">.container.full-bleed</pre></section>
                <section class="container full-bleed full-bleed-no-max"><pre class="prettyprint">.container.full-bleed-no-max</pre></section>
                <section class="container"><pre class="prettyprint">.container</pre></section>
              </div>
              <!-- <div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div>     -->              
            </div>
            <p class="p4">The red lines indicate the "max-width" setting.</p>




            <h3 class="bs-docs-heading">Nesting containers</h3>
            <p>If you need a full-bleed for a background, but still need the regular margins for content, you can nest a <code>.container</code> section inside of a <code>.full-bleed</code> and/or <code>.full-bleed-no-max</code>  section.</p>

            <div class="docs-page-structure-page docs-page-structure-page-max" style="margin-bottom:10px;">
              <!-- <div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>   -->
              <div class="docs-page-structure-main">
                <section class="container"><pre class="prettyprint">.container</pre></section>
                
                <section class="container full-bleed nesting-demo-parent">
                  <div class="container">
<pre class="prettyprint">
.container.full-bleed
<span class="invisibles-column">|</span> .container
</pre>
                  </div>                        
                </section>

                <section class="container full-bleed full-bleed-no-max nesting-demo-parent">
                  <div class="container full-bleed nesting-demo-parent">
                    <div class="container">
<pre class="prettyprint">
.container.full-bleed-no-max
<span class="invisibles-column">|</span> .container.full-bleed
<span class="invisibles-column">| |</span> .container
</pre>
                    </div>                        
                  </div>
                </section>
                <div class="docs-docs-page-structure-maxWidth-outline"></div>
                <section class="container"><pre class="prettyprint">.container</pre></section>
              </div>
              <!-- <div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div> -->
            </div>


           <h5 class="bs-docs-heading">Same layout at 'normal' (no maxed out) width</h5>

            <div class="docs-page-structure-page" style="margin-bottom:10px;">
              <!-- <div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>   -->
              <div class="docs-page-structure-main">
                <section class="container"><pre class="prettyprint">.container</pre></section>
                
                <section class="container full-bleed nesting-demo-parent">
                  <div class="container">
<pre class="prettyprint">
.container.full-bleed
<span class="invisibles-column">|</span> .container
</pre>
                  </div>                        
                </section>

                <section class="container full-bleed full-bleed-no-max nesting-demo-parent">
                  <div class="container full-bleed nesting-demo-parent">
                    <div class="container">
<pre class="prettyprint">
.container.full-bleed-no-max
<span class="invisibles-column">|</span> .container.full-bleed
<span class="invisibles-column">| |</span> .container
</pre>
                    </div>                        
                  </div>
                </section>
                <div class="docs-docs-page-structure-maxWidth-outline"></div>
                <section class="container"><pre class="prettyprint">.container</pre></section>
              </div>
              <!-- <div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div> -->
            </div>





            <h3 class="bs-docs-heading">Grid container &amp; margins</h3>
            <p>To utilize the standard grid, add a <code>.grid</code> div inside of <code>.container</code>. The grid has its own margins, in addition to the <code>.container</code> margins.</p>

            <div class="docs-page-structure-page">
              <!-- <div class="docs-page-structure-nav"><pre class="prettyprint">&lt;nav /&gt;</pre></div>   -->
              <div class="docs-page-structure-main">
                <section class="container"><pre class="prettyprint">.container</pre></section>
                
                <section class="container nesting-demo-parent">
                  <div class="grid show-grid">
<pre class="prettyprint tall">
.container
<span class="invisibles-column">|</span> .grid
</pre>
                  </div>
                </section>
              
                <section class="container full-bleed nesting-demo-parent">
                  <div class="container nesting-demo-parent">
                    <div class="grid show-grid">
<pre class="prettyprint tall">
.container.full-bleed
<span class="invisibles-column">|</span> .container
<span class="invisibles-column">| |</span> .grid
</pre>
                    </div>
                  </div>
                </section>
                <section class="container"><pre class="prettyprint">.container</pre></section>
              </div>
              <!-- <div class="docs-page-structure-footer"><pre class="prettyprint">&lt;footer /&gt;</pre></div> -->
            </div>
          </div>
        </section><!-- end root-level-page-structure --> 





        <section class="container" style="padding-bottom:20px; padding-top:0; border-top:0;">
          <h3 class="bs-docs-heading">Examples</h3>
          <p>Resize your browser to see how the <code>.container</code> and <code>.grid</code> respond with the <code>.full-bleed</code> and <code>.full-bleed-no-max</code> classes.</p>
          <p><small>Note: You need a display wider than 1400px to see any difference between <code>.full-bleed</code> and <code>full-bleed-no-max</code>.</small></p>
        </section>

        <div class="docs-page-structure-page full-size">
          <div class="docs-page-structure-main">
            <section class="container">
              <pre class="prettyprint">.container</pre>
            </section>

            <section class="container full-bleed">
              <pre class="prettyprint">.container.full-bleed</pre>
            </section>

            <section class="container full-bleed-no-max">
              <pre class="prettyprint">.container.full-bleed-no-max</pre>
            </section>

            <section class="container nesting-demo-parent">
              <div class="grid show-grid">
<pre class="prettyprint tall">
.container
<span class="invisibles-column">|</span> .grid
</pre>
              </div>
            </section>

            <section class="container full-bleed nesting-demo-parent">
              <div class="container nesting-demo-parent">
                <div class="grid show-grid">
<pre class="prettyprint tall">
.container.full-bleed
<span class="invisibles-column">|</span> .container
<span class="invisibles-column">| |</span> .grid
</pre>
                </div>
              </div>
            </section>

            <section class="container full-bleed-no-max nesting-demo-parent">
              <div class="container full-bleed nesting-demo-parent">
                <div class="container nesting-demo-parent">
                  <div class="grid show-grid">
<pre class="prettyprint tall">
.container.full-bleed-no-max
<span class="invisibles-column">|</span> .container.full-bleed
<span class="invisibles-column">| |</span> .container
<span class="invisibles-column">| | |</span> .grid
</pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>




        <!-- The grid
        ================================================== -->

        <section class="container" style="padding-bottom:20px; padding-top:50px; border-top:0;">
          <h2 class="bs-docs-heading">The Grid</h2>
          <h3 class="bs-docs-heading">Standard Grid example</h3>
          <p>The default grid system utilizes <strong>12 fluid columns</strong>. Column widths and gutters are percent based, and flex with the width of the parent <code>.grid</code> element. They are also responsive, and change at different breakpoints, ensuring proper proportions across screen resolutions and devices.</p>
        </section>

        <div class="docs-page-structure-page full-size grid-examples">
          <div class="docs-page-structure-main">
            <section class="container nesting-demo-parent">
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
            </section>
          </div>
        </div>







        <section class="container" style="padding-bottom:20px; padding-top:0; border-top:0;">
          <h4 class="bs-docs-heading">Basic grid HTML</h4>
          <p>For a simple two column layout, create a <code>.grid</code> and add the appropriate number of <code>.span*</code> columns. As this is a 12-column grid, each <code>.span*</code> spans a number of those 12 columns, and should always add up to 12 for each grid row.</p>

          <div class="bs-docs-grid">
            <div class="grid show-grid">
              <div class="span4">4</div>
              <div class="span8">8</div>
            </div>
          </div>
        

<div class="grid">
<pre class="prettyprint">
.container
<span class="invisibles-column">|</span> .grid
<span class="invisibles-column">| |</span> .span4
<span class="invisibles-column">| |</span> .span8
</pre>
</div>

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

          <p class="p4" style="padding-top:15px;">For the rest of this document, the code samples will assume all <code>.grid</code>'s are contained withing a <code>.container</code>.</p>

<div class="grid">
<pre class="prettyprint">
.grid
<span class="invisibles-column">|</span> .span6
<span class="invisibles-column">|</span> .span6
.grid
<span class="invisibles-column">|</span> .span12
</pre>
</div>



          <h3 class="bs-docs-heading">Offsetting columns</h3>
          <p>Move columns to the right using <code>.offset*</code> classes. Each class increases the left margin of a column by a whole column. For example, <code>.offset2</code> moves <code>.span4</code> over two columns.</p>
          <div class="bs-docs-grid">
            <div class="grid show-grid">
              <div class="span3">3</div>
              <div class="span4 offset2">4/2</div>
              <div class="span3">3</div>
            </div>
          </div>

<div class="grid">
<pre class="prettyprint">
.grid
<span class="invisibles-column">|</span> .span3
<span class="invisibles-column">|</span> .span4.offset2
<span class="invisibles-column">|</span> .span3
</pre>
</div>
        </section>








        <section class="container" style="padding-bottom:20px; padding-top:50px; border-top:0;">
          <h2 class="bs-docs-heading">Slim Grid</h2>
          <p>The slim grid utilizes the same <strong>12 fluid columns</strong> as the Standard grid, but with skinnier gutters and wider columns.</p>
        
          <div class="bs-docs-grid">
            <div class="slimgrid show-grid">
              <div class="span3">3</div>
              <div class="span3">3</div>
              <div class="span3">3</div>
              <div class="span3">3</div>
            </div>
          </div>

<div class="grid">
<pre class="prettyprint">
.slimgrid
<span class="invisibles-column">|</span> .span3
<span class="invisibles-column">|</span> .span3
<span class="invisibles-column">|</span> .span3
<span class="invisibles-column">|</span> .span3
</pre>
</div>

          <p>The slim grid is usually used in concert with <a href="http://masonry.desandro.com/">masonary</a>. Javascript can be used to change the number of columns dynamically at different breakpoints.</p>
          <p>To implement the slim grid, use <code>.slimgrid</code> in place of <code>.grid</code>.</p>


          <h4 class="bs-docs-heading">5 Column Slim Grid</h4>
          <p>The slim grid has a 5-column option, which can be implemented using <code>.slimgrid5</code>. The number of columns needs to add up to 5.</p>
        
          <div class="bs-docs-grid">
            <div class="slimgrid5 show-grid">
              <div class="span2">2</div>
              <div class="span1">1</div>
              <div class="span1">1</div>
              <div class="span1">1</div>
            </div>
          </div>

<div class="grid">
<pre class="prettyprint">
.slimgrid5
<span class="invisibles-column">|</span> .span2
<span class="invisibles-column">|</span> .span1
<span class="invisibles-column">|</span> .span1
<span class="invisibles-column">|</span> .span1
</pre>
</div>

        </section>
      	</div> <!-- end pre-small-screen --> 






        <section class="container" id="small-screens-section" style="padding-bottom:20px; padding-top:50px; border-top:0;">
          <h2 class="bs-docs-heading" id="small-screen-grids">Small Screen Grids</h2>

          <p>There are 2 different options for grids below the 768 breakpoint: <strong>Mobile-Grid</strong> and <strong>No-Grid</strong>. The small-screen grid will override the <code>.grid</code>, <code>.slimgrid</code> or <code>.slimgrid5</code> classes, and should be used in addition to them.</code>.</p>

          <h4 class="bs-docs-heading">Mobile-Grid</h4>
          <p>The mobile-grid utilizes <strong>6 fluid columns</strong>. To implement, add the appropriate m-grid class <strong>in addition</strong> to your primary <code>.grid</code> class. Class options are <code>.m-grid-at-767</code>, <code>.m-grid-at-567</code>, <code>.m-grid-at-479</code> or <code>.m-grid</code> (same as <code>.m-grid-at-767</code>);
            and add the appropriate <code>.m-span</code> and (optionally) <code>.m-offset</code> class to each column - again, in addition to the primary <code>.span</code> class. The total mobile spans/offsets need to add up to 6.</p>
          <p class="p4">Resize your browser to below 768px wide to see the mobile grid take effect.<br>Hover over any of the columns to see the actual class names that affect it.</p>
        	
          <p class="well" id="hide-pre-small-screen-content-w"><span class="label label-info">Check it out!</span> - You can <a href="#">hide prior content on this page</a>, and limit the paragraph widths, so the content doesn't jump around so much when you're resizing.</p>

          <div class="bs-docs-grid">
            <div class="grid m-grid-at-767 show-grid">
              <div class="span4 m-span1">4 m1</div>
              <div class="span4 m-span2">4 m2</div>
              <div class="span4 m-span2 m-offset1">4 m2/1</div>
            </div>
          </div>

<div class="grid">
<pre class="prettyprint">
.grid.m-grid-at-767
<span class="invisibles-column">|</span> .span4.m-span1
<span class="invisibles-column">|</span> .span4.m-span2
<span class="invisibles-column">|</span> .span4.m-span2.m-offset1
</pre>
</div>





          <h4 class="bs-docs-heading">No-Grid</h4>
          <p>The <strong>no-grid</strong> option collapses all grid spans into stacked rows, ignoring all <code>.span</code>'s, <code>.offset</code>'s, <code>.m-span</code>'s and <code>.m-offset</code>'s. To implement, add the appropriate no-grid class <strong>in addition</strong> to your primary <code>.grid</code> class. Possible classes are <code>.no-grid-at-767</code>, <code>.no-grid-at-567</code>, and <code>.no-grid-at-479</code>.
        
          <div class="bs-docs-grid">
            <div class="grid no-grid-at-767 show-grid">
              <div class="span4">4</div>
              <div class="span4">4</div>
              <div class="span4">4</div>
            </div>
          </div>

<div class="grid">
<pre class="prettyprint">
.grid.no-grid-at-767
<span class="invisibles-column">|</span> .span4
<span class="invisibles-column">|</span> .span4
<span class="invisibles-column">|</span> .span4
</pre>
</div>




          <h4 class="bs-docs-heading">Using both m-grid and no-grid</h4>
          <p>You can use the mobile-grid for a range of breakpoints, and switch to the no-grid below a certain breakpoint. Simply add the appropriate <code>.m-grid-at</code> and <code>.no-grid-at</code> classes for the target breakpoints.</p>
          <p class="p4">Resize your browser to below 768px wide, and then to below 568 wide, to see the mobile-grid and no-grid take effect.</p>
        
          <div class="bs-docs-grid">
            <div class="grid m-grid-at-767 no-grid-at-567 show-grid">
              <div class="span4 m-span1">4 m1</div>
              <div class="span4 m-span2">4 m2</div>
              <div class="span4 m-span2 m-offset1">4 m2/1</div>
            </div>
          </div>

<div class="grid">
<pre class="prettyprint">
.grid.m-grid-at-767.no-grid-at-567
<span class="invisibles-column">|</span> .span4.m-span1
<span class="invisibles-column">|</span> .span4.m-span2
<span class="invisibles-column">|</span> .span4.m-span2.m-offset1
</pre>
</div>




          <h4 class="bs-docs-heading">Full-bleed on small screens</h4>
          <p>By default, margins are applied to small screens the same as desktop. The <code>.full-bleed</code> (and <code>.full-bleed-no-max</code>) classes will affect all resolution sizes. To apply full-bleed below 768px, when not used on desktop, use <code>.full-bleed-at-767</code>, <code>.full-bleed-at-567</code>, <code>.full-bleed-at-479</code>, or <code>.m-full-bleed</code> (same as <code>.full-bleed-at-767</code>).</p>
          <p>Currently, there's no way to override a <code>.full-bleed</code> to add margins back for mobile. If you need this, let me (Christoper) know &amp; we'll see...</p>

        </section>






  
  
        <!-- Responsive design
        ================================================== -->
        <section id="responsive" class="container">
          <h2 class="bs-docs-heading">Responsive design</h2>

          <img src="img/responsive-illustrations.png" alt="Responsive devices" style="float: right; margin: 0 0 20px 20px;">
          <p>Media queries allow for custom CSS based on a number of conditions&mdash;ratios, widths, display type, etc&mdash;but usually focuses around <code>min-width</code> and <code>max-width</code>.</p>
          <p>All modules have been designed to display on any width screen from 320px up, and may have any number of independent breakpoints. There are some primary breakpoints that most modules respond to.</p>
          <p>This chart shows the primary breakpoints used on the site, with other relevant information such as grids and popular devices.</p>
          
          <img src="img/responsive-chart.png" alt="Responsive chart" class="responsive-chart">

          <p class="p3">*A device's 'effective pixels,' or 'css pixels,' may be different from its 'device pixels.' For instance, the iPhone 5 has a device pixel width of 640, but an effective pixel width of 320.</p>

          <p>As you can see, the range from 568px to 768px can be targeted as either tablet or phone.</p>


          <h3 class="bs-docs-heading">Responsive utility classes</h3>
          <p>For faster mobile-friendly development, use these utility classes for showing and hiding content by device. Below is a table of the available classes and their effect on a given media query layout (labeled by device).</p>
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

          <h4 class="bs-docs-heading">Overrides for phone/tablet</h4>
          <p>On a per-module bases, the <strong>phone/tablet</strong> breakpoints can be overridden, so that <strong>phone</strong> won't apply until a lower breakpoint. You can trigger the phone layout at a lower breakpoint by adding <code>.phone-at-567</code> or <code>.phone-at-479</code>.</p>

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
  {{partial 'includes/docs-foot.html'}}
</body>
</html>
