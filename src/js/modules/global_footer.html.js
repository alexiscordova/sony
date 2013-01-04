(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["global_footer.html"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('---\nname: \'global footer\'\nmeta_data: {a:\'foo\', b:\'bar\'}\n---\n\n');
      
        this.document;
      
        __out.push('\n\t\n    <footer class="container full-bleed-no-max footer-wrapper">\n    \t<div class="container">\n\t    \t<div class="footer-store-locator span3 footer-mobile-section mobile-container-padded">\n\t    \t\t<h5>Find a Store</h5>\n\t    \t\t<div class="store-locator-input-w">\n\t    \t\t\t<form method="post" action="" class="footer-store-locator-form footer-form-border">\n\t\t\t        <i class="fonticon-ui-reg-gps"></i>\n\t\t\t        <input type="text" name="store-locatorSearch" id="store-locatorSearch" class="footer-store-locator-input footer-input" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;London" >\n\t\t\t        <button type="submit" class="btn store-locator-submit-btn footer-btn">Search</button>\n\t\t\t    \t</form>\n\t    \t\t</div>\n\t    \t\t<p class="footer-store-locator-caption">Change location</p>\n\t    \t</div>\n    \t\t<div class="footer-stores span3 footer-mobile-section mobile-container-padded">\n    \t\t\t<h5>Shop Online</h5>\n    \t\t\t<ul class="footer-links-list">\n    \t\t\t\t<li class="footer-link-li"><a href="#">Sony Store Online</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Store Help</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Education Store</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Business Store</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Outlet Store</a></li>\n    \t\t\t</ul>\n    \t\t</div>\n    \t\t<div class="footer-communities span3 footer-mobile-section mobile-container-padded">\n    \t\t\t<h5>Our Communities</h5>\n    \t\t\t<ul class="footer-links-list">\n    \t\t\t\t<li class="footer-link-li"><a href="#">Photography</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Reading</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Film &amp; 3D</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Computing</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">Music</a></li>\n    \t\t\t</ul>\n    \t\t</div>\n    \t\t<div class="footer-news span3 footer-mobile-section mobile-container-padded">\n    \t\t\t<h5>In the News</h5>\n    \t\t\t<ul class="footer-links-list">\n    \t\t\t\t<li class="footer-link-li"><a href="#">Press Center</a></li>\n    \t\t\t\t<li class="footer-link-li"><a href="#">RSS Feeds</a></li>\n    \t\t\t</ul>\n\t  \t\t\t<div class="footer-newsletter">\n\t  \t\t\t\t<h6>Newsletter Sign Up</h6>\n\t  \t\t\t\t<form method="post" action="" class="footer-newsletter-form footer-form-border">\n\t\t\t        <input type="text" name="newsletterInput" id="newsletterInput" class="footer-email-input footer-input" value="Email" >\n\t\t\t        <button type="submit" class="btn location-submit-btn footer-btn">Submit</button>\n\t\t\t    \t</form>\n\t  \t\t\t</div>\n    \t\t</div>\n\n\n\t    \t<div class="footer-ex">\n\t    \t\t<div class="footer-contact span6 mobile-container-padded"><!-- footer-contact and footer-language are flipped in order for mobile. floats make them display in the correct order on desktop. --> \n\t    \t\t\t<p>\n\t\t    \t\t\t<a href="#">For Professionals</a>\n\t\t    \t\t\t<a href="#">Contact Us</a>\n\t\t    \t\t</p>\n\t    \t\t\t<div class="footer-social-links">\n\t    \t\t\t\t<a href="#" class="footer-social-twitter icon-uibig-twitter"><span class="visuallyhidden">Twitter</span></a>\n\t    \t\t\t\t<a href="#" class="footer-social-facebook icon-uibig-facebook"><span class="visuallyhidden">Facebook</span></a>\n\t    \t\t\t\t<a href="#" class="footer-social-gplus icon-uibig-gplus"><span class="visuallyhidden">Google+</span></a>\n\t    \t\t\t\t<a href="#" class="footer-social-youtube icon-uibig-youtube"><span class="visuallyhidden">YouTube</span></a>\n\t    \t\t\t</div>\n\t    \t\t</div>\n\t    \t\t<div class="footer-language span6 mobile-container-padded">\n\t    \t\t\t<div class="btn-group l11n-selector">\n\t\t\t\t\t\t  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-l11n-uk"></i><span class="dropdown-label">United Kingdom</span><i class="icon-ui-arrowhead-down-gray"></i></a>\n\t\t\t\t\t\t  <ul class="dropdown-menu">\n\t\t\t\t\t\t    <li><a href="#"><i class="icon-l11n-us"></i><span class="dropdown-label">United States</span></a></li>\n\t\t\t\t\t\t    <li><a href="#"><i class="icon-l11n-xx"></i><span class="dropdown-label">LocalizationX</span></a></li>\n\t\t\t\t\t\t    <li><a href="#"><i class="icon-l11n-yy"></i><span class="dropdown-label">LocalizationY</span></a></li>\n\t\t\t\t\t\t  </ul>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="btn-group lang-selector">\n\t\t\t\t\t\t  <a class="btn dropdown-toggle" data-toggle="dropdown" href="#"><span class="dropdown-label">EN</span><i class="icon-ui-arrowhead-down-gray"></i></a>\n\t\t\t\t\t\t  <ul class="dropdown-menu">\n\t\t\t\t\t\t    <li><a href="#"><i class="icon-lang-us"></i><span class="dropdown-label">SP</span></a></li>\n\t\t\t\t\t\t    <li><a href="#"><i class="icon-lang-xx"></i><span class="dropdown-label">XX</span></a></li>\n\t\t\t\t\t\t    <li><a href="#"><i class="icon-lang-yy"></i><span class="dropdown-label">YY</span></a></li>\n\t\t\t\t\t\t  </ul>\n\t\t\t\t\t\t</div>\n\t    \t\t</div>\n\t    \t</div>\n\t    </div><!-- .container -->\n\t    <div class="container full-bleed-no-max footer-signature-w  mobile-container-padded">\n\t    \t<div class="container">\n\t\t    \t<div class="footer-signature">\n\t\t    \t\t<span class="sprite-reg-nav-sony-logo"><span class="visuallyhidden">Sony</span></span>\n\n\t\t    \t\t<p class="footer-legal-links">\n\t\t\t    \t\t<a href="#">Privacy Statement &amp; Cookies</a>\n\t\t\t    \t\t<a href="#">Terms &amp; Conditions of Sales</a>\n\t\t\t    \t\t<a href="#">Terms &amp; Conditions of Website Use</a>\n\t\t\t    \t\t<a href="#">Recalls</a>\n\t\t\t    \t</p>\n\t\t\t    \t\n\t\t    \t\t<span class="footer-copyright">&copy;2013 Copyright Sony Europe Limited.</span>\n\n\t\t    \t</div>\n\t\t    </div>\n\t\t  </div>\n  \t</footer><!-- end .footer-wrapper --> \n\n\n<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
