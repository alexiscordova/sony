<!DOCTYPE html>
<!--[if lt IE8]>  <html class="no-js ie oldie lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie oldie lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie ie9" lang="en"> <![endif]-->
<!--[if gt IE 9]> <html class="no-js ie gt-ie9 modern" lang="en"> <![endif]-->
<!--[!(IE)]><!--><html class="no-js notIE modern" lang="en"> <!--<![endif]-->

	{{partial 'includes/docs_head.html'}}
	<body data-spy="scroll" data-target=".bs-docs-sidebar">
		{{partial 'includes/docs_nav.html'}}

		<div class="jumbotron masthead">
		  <div class="container">
		    <h2 class="bs-docs-heading">Bootstrap</h2>
		    <p>Sleek, intuitive, and powerful front-end framework for faster and easier web development.</p>
		    <p><a href="bootstrap.zip" class="btn btn-special btn-large" {{#production}}onclick="_gaq.push(['_trackEvent', 'Jumbotron actions', 'Download', 'Download 2.1.1']);"{{/production}}>Download Bootstrap</a></p>
		    <ul class="masthead-links">
		      <li><a href="http://github.com/twitter/bootstrap" {{#production}}onclick="_gaq.push(['_trackEvent', 'Jumbotron actions', 'Jumbotron links', 'GitHub project']);"{{/production}}>GitHub project</a></li>
		      <li><a href="./extend.html" {{#production}}onclick="_gaq.push(['_trackEvent', 'Jumbotron actions', 'Jumbotron links', 'Extend']);"{{/production}}>Extend</a></li>
		      <li>Version 2.1.1</li>
		    </ul>
		  </div>
		</div>
		
		<div class="bs-docs-social">
		  <div class="container">
		    <ul class="bs-docs-social-buttons">
		      <li>
		        <iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user=twitter&repo=bootstrap&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="100px" height="20px"></iframe>
		      </li>
		      <li>
		        <iframe class="github-btn" src="http://ghbtns.com/github-btn.html?user=twitter&repo=bootstrap&type=fork&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="98px" height="20px"></iframe>
		      </li>
		      <li class="follow-btn">
		        <a href="https://twitter.com/twbootstrap" class="twitter-follow-button" data-link-color="#0069D6" data-show-count="true">Follow @twbootstrap</a>
		      </li>
		      <li class="tweet-btn">
		        <a href="https://twitter.com/share" class="twitter-share-button" data-url="http://twitter.github.com/bootstrap/" data-count="horizontal" data-via="twbootstrap" data-related="mdo:Creator of Twitter Bootstrap">Tweet</a>
		      </li>
		    </ul>
		  </div>
		</div>
		
		<div class="container">
		
		  <div class="marketing">
		
		    <h2 class="bs-docs-heading">Introducing Bootstrap.</h2>
		    <p class="marketing-byline">Need reasons to love Bootstrap? Look no further.</p>
		
		    <div class="row-fluid">
		      <div class="span4">
		        <img src="img/bs-docs-twitter-github.png">
		        <h3 class="bs-docs-heading">By nerds, for nerds.</h3>
		        <p>Built at Twitter by <a href="http://twitter.com/mdo">@mdo</a> and <a href="http://twitter.com/fat">@fat</a>, Bootstrap utilizes <a href="http://lesscss.org">LESS CSS</a>, is compiled via <a href="http://nodejs.org">Node</a>, and is managed through <a href="http://github.com">GitHub</a> to help nerds do awesome stuff on the web.</p>
		      </div>
		      <div class="span4">
		        <img src="img/bs-docs-responsive-illustrations.png">
		        <h3 class="bs-docs-heading">Made for everyone.</h3>
		        <p>Bootstrap was made to not only look and behave great in the latest desktop browsers (as well as IE7!), but in tablet and smartphone browsers via <a href="./scaffolding.html#responsive">responsive CSS</a> as well.</p>
		      </div>
		      <div class="span4">
		        <img src="img/bs-docs-bootstrap-features.png">
		        <h3 class="bs-docs-heading">Packed with features.</h3>
		        <p>A 12-column responsive <a href="./scaffolding.html#grid">grid</a>, dozens of components, <a href="./javascript.html">javascript plugins</a>, typography, form controls, and even a <a href="./customize.html">web-based Customizer</a> to make Bootstrap your own.</p>
		      </div>
		    </div>
		
		    <hr class="soften">
		
		    <h2 class="bs-docs-heading">Built with Bootstrap.</h2>
		    <p class="marketing-byline">For even more sites built with Bootstrap, <a href="http://builtwithbootstrap.tumblr.com/" target="_blank">visit the unofficial Tumblr</a> or <a href="./getting-started.html#examples">browse the examples</a>.</p>
		    <div class="row-fluid">
		      <ul class="thumbnails example-sites">
		        <li class="span3">
		          <a class="thumbnail" href="http://soundready.fm/" target="_blank">
		            <img src="img/example-sites/soundready.png" alt="SoundReady.fm">
		          </a>
		        </li>
		        <li class="span3">
		          <a class="thumbnail" href="http://kippt.com/" target="_blank">
		            <img src="img/example-sites/kippt.png" alt="Kippt">
		          </a>
		        </li>
		        <li class="span3">
		          <a class="thumbnail" href="http://www.fleetio.com/" target="_blank">
		            <img src="img/example-sites/fleetio.png" alt="Fleetio">
		          </a>
		        </li>
		        <li class="span3">
		          <a class="thumbnail" href="http://www.jshint.com/" target="_blank">
		            <img src="img/example-sites/jshint.png" alt="JS Hint">
		          </a>
		        </li>
		      </ul>
		     </div>
		
		  </div>
		
		</div>
		
		{{partial 'includes/docs_foot.html'}}
	</body>
</html>
