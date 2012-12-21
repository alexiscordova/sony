(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["global_header.html"] = function(__obj) {
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
      
        __out.push('---\nname: \'global header\'\nmeta_data: {a:\'foo\', b:\'bar\'}\n---\n\n');
      
        this.document;
      
        __out.push('\n\n      <nav class="container full-bleed-no-max nav-wrapper">\n\n      \t<div class="container navbar">\n      \t\t<a class="btn btn-mobile-nav" href="#"><i class="icon-ui-mobile-menu-btn"></i></a>\n\t        <a class="brand hidden-text sprite-reg-nav-sony-logo" href="#">SONY make.believe</a>\n\t        <ul class="nav nav-primary">\n\t          <li class="nav-li nav-li-store"><a class="nav-li-link" href="#">Store</a></li>\n\t          <li class="nav-li nav-li-electronics"><a class="nav-li-link nav-dropdown-toggle nav-dropdown-toggle-text" data-target="navtray-w-electronics" href="#">Electronics<i class="icon-ui-arrowhead-down-gray"></i></a><span class="global-nav-indicator-bar"></span></li>\n\t          <li class="nav-li nav-li-entertainment"><a class="nav-li-link nav-dropdown-toggle nav-dropdown-toggle-text" data-target="navtray-w-entertainment" href="#">Entertainment<i class="icon-ui-arrowhead-down-gray"></i></a><span class="global-nav-indicator-bar for-navtray-short"></span></li>\n\t          <li class="nav-li nav-li-support"><a class="nav-li-link" href="#">Support</a></li>\n\t        </ul>\n\t        <ul class="nav nav-utility">\n\t          <li class="nav-li nav-li-account">\n\t          \t<a class="nav-li-link nav-dropdown-toggle nav-dropdown-toggle-text" data-target="navmenu-w-account" href="#">Account<i class="icon-ui-arrowhead-down-gray"></i></a>\n\n\t\t\t\t\t    <div class="navmenu-w navmenu-w-account logged-in">\n\t\t\t\t\t    \t<i class="sprite-mini-global-nav-indicator"></i>\n\t\t\t\t\t    \t<a href="#" class="btn btn-login">Log in</a>\n\t\t\t\t        <ul class="navmenu-list navmenu-list-prefixed">\n\t\t\t\t        \t<li class="navmenu-line navmenu-li-cart"><a href="#" class="tl"><i class="icon-ui-navmenu-cart"></i>Cart<span class="cart-count">2</span></a></li>\n\t\t\t\t        \t<li class="navmenu-line navmenu-li-favorites"><a href="#" class="tl"><i class="icon-ui-navmenu-favorite"></i>Favorites</a></li>\n\t\t\t\t        </ul>\n\t\t\t\t        <ul class="navmenu-list navmenu-list-main">\n\t\t\t\t        \t<li class="navmenu-line navmenu-li-account"><a href="#" class="tl"><i class="icon-ui-navmenu-account"></i>Account Info</a></li>\n\t\t\t\t        \t<li class="navmenu-line navmenu-li-orders"><a href="#" class="tl"><i class="icon-ui-navmenu-orders"></i>Orders</a></li>\n\t\t\t\t        \t<li class="navmenu-line navmenu-li-newsletter"><a href="#" class="tl"><i class="icon-ui-navmenu-newsletter"></i>Newsletter Subscriptions</a></li>\n\t\t\t\t        \t<li class="navmenu-line navmenu-li-registered-products"><a href="#" class="tl"><i class="icon-ui-navmenu-reg-prod"></i>Registered Products</a></li>\n\t\t\t\t        </ul>\n\t\t\t\t\t    \t<a href="#" class="btn btn-logout">Sign Out</a>\n\t\t\t\t      </div><!-- end #navmenu-w-account -->\n\n\t          </li>\n\t          <li class="nav-li nav-li-favorites"><a class="nav-li-link btn-nav-iconed iconTrigger-ui-favorite" data-target="navtray-w-favorites" href="#"><i class="icon-ui-favorite"></i><span class="visuallyhidden">Favorites</span></a></li>\n\t          <li class="nav-li nav-li-cart"><a class="nav-li-link btn-nav-iconed iconTrigger-ui-cart disabled" data-target="navtray-w-cart" href="#"><i class="icon-ui-cart"></i>2</a></li>\n\t          <li class="nav-li nav-li-search">\n\t          \t<a class="nav-li-link btn-nav-block nav-dropdown-toggle nav-dropdown-toggle-btn iconTrigger-ui-search" data-target="navtray-w-search" href="#"><span class="navtray-label">Search</span><i class="icon-ui-search"></i></a>\n\n\t\t\t\t\t    <div class="navmenu-w navmenu-w-search Xsearching">\n\t          \t \t<i class="sprite-mini-global-nav-indicator"></i>\t\t\t\t\t    \t\n\t\t\t\t\t    \t<i class="sprite-mini-nav-search-input"></i>\n\t\t\t\t\t    \t<form method="post" action="" class="navmenu-search-section-input">\n\t\t\t\t\t\t        <input type="text" name="navSearch" id="navSearch" value="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search"/>\n\t\t\t\t\t    \t</form>\n\t\t\t\t\t    \t<a href="#" class="btn-clear-search-input iconTrigger-ui2-x-14-blue"><i class="icon-ui2-x-14-blue"></i></a>\n\t\t\t\t        <div class="navmenu-search-section-results">\n\t\t\t\t\t        <div class="navmenu-search-popular-searches">\n\t\t\t\t\t        \t<p class="l3">Popular Searches</p>\n\t\t\t\t\t\t        <ul class="navmenu-list navmenu-list-extended">\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">Laptops </a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">VAIO</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">Headphones</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">PSP</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">Playstation</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">NEX</a></li>\n\t\t\t\t\t\t        </ul>\n\t\t\t\t\t      \t</div>\n\t\t\t\t\t      \t<div class="navmenu-search-results">\n\t\t\t\t\t\t        <ul class="navmenu-list navmenu-list-results">\n\t\t\t\t\t\t        \t<li class="search-result-line">\n\t\t\t\t\t\t        \t\t<a href="#">\n\t\t\t\t\t\t        \t\t\t<img src="img/global/global-nav/search-results-images/nex-6.png" alt="α NEX-6" width="83" height="64">\n\t\t\t\t\t\t        \t\t\t<span class="search-result-p">\n\t\t\t\t\t\t\t        \t\t\t<span class="search-result-headline">α NEX-6</span>\n\t\t\t\t\t\t\t        \t\t\t<span class="search-result-descript">The Future of Photography.</span>\n\t\t\t\t\t\t\t        \t\t</span>\n\t\t\t\t\t\t\t        \t\t<i class="icon-ui2-chevron-18-blue"></i>\n\t\t\t\t\t\t\t        \t</a>\n\t\t\t\t\t\t\t        </li>\n\t\t\t\t\t\t        \t<li class="search-result-line">\n\t\t\t\t\t\t        \t\t<a href="#">\n\t\t\t\t\t\t        \t\t\t<img src="img/global/global-nav/search-results-images/nex-5.png" alt="α NEX-5" width="83" height="64">\n\t\t\t\t\t\t        \t\t\t<span class="search-result-p">\n\t\t\t\t\t\t\t        \t\t\t<span class="search-result-headline">α NEX-5</span>\n\t\t\t\t\t\t\t        \t\t\t<span class="search-result-descript">Pocket DSLR</span>\n\t\t\t\t\t\t\t        \t\t</span>\n\t\t\t\t\t\t\t        \t\t<i class="icon-ui2-chevron-18-blue"></i>\n\t\t\t\t\t\t\t        \t</a>\n\t\t\t\t\t\t\t        </li>\n\t\t\t\t\t\t        \t<li class="search-result-line search-result-canned">\n\t\t\t\t\t\t        \t\t<a href="#">\n\t\t\t\t\t\t        \t\t\t<i class="icon-uibig-support"></i>\n\t\t\t\t\t\t        \t\t\t<span class="search-result-p">\n\t\t\t\t\t\t        \t\t\t\t<span class="search-result-headline">α NEX Support</span>\n\t\t\t\t\t\t        \t\t\t</span>\n\t\t\t\t\t\t\t        \t\t<i class="icon-ui2-chevron-18-blue"></i>\n\t\t\t\t\t\t\t        \t</a>\n\t\t\t\t\t\t\t        </li>\n\t\t\t\t\t\t        </ul>\n\t\t\t\t\t\t        <ul class="navmenu-list-extended">\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">α NEX-3</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">α NEX Accessories</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">α NEX Lenses</a></li>\n\t\t\t\t\t\t        \t<li class="search-result-line"><a href="#" class="tl">α NEX</a></li>\n\t\t\t\t\t\t        </ul>\n\t\t\t\t\t\t\t    \t<a href="#" class="btn btn-show-all-results">Show All Results</a>\n\t\t\t\t\t\t\t    </div>\n\t\t\t\t\t\t    </div>\n\t\t\t\t\t    </li>\n\t\t\t\t\t  <li class="nav-li nav-li-universal"><a class="nav-li-link btn-nav-block nav-dropdown-toggle-btn" href="#">Sony Sites<i class="icon-ui-plus-tiny"></i></a></li>\n\t        </ul>\n\t\t    </div><!-- end .navbar -->\n\n\t\t    <div class="navtray-w navtray-w-fullwidth-3-4 navtray-w-electronics navtray-w-tall">\n\t\t    \t<div class="navtray">\n\t      \t\t<div class="navtray-section navtray-section-main navtray-section-main-w-all-btn">\n\t\t\t        <ul class="navtray-list-main">\n\t\t\t        \t<li class="navtray-li navtray-li-cameras"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-cameras.png" alt="Cameras"><span class="nav-label">Cameras</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-mobile"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-mobile.png" alt="Mobile &amp; Tablets"><span class="nav-label">Mobile &amp; Tablets</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-playstation"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-playstation.png" alt="PlayStation"><span class="nav-label">PlayStation</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-computers"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-computers.png" alt="Computers"><span class="nav-label">Computers</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-video-cameras"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-video-cameras.png" alt="Video Cameras"><span class="nav-label">Video Cameras</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-televisions"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-televisions.png" alt="Televisions"><span class="nav-label">Televisions &amp;<br>Home Cinema</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-audio"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-audio.png" alt="Audio"><span class="nav-label">Audio</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-car"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-car.png" alt="Car &amp; Marine"><span class="nav-label">Car &amp; Marine</span></a></li>\n\t\t\t        </ul>\n\t\t\t        <a class="btn btn-small btn-alt btn-icon-ui-left btn-nav-view-all" href="#"><i class="icon-ui-grid"></i>All Electronics</a>\n\t\t\t      </div>\n\t\t        <div class="navtray-section navtray-section-featured">\n\t\t        \t<h6 class="l2">Community</h6>\n\t\t        \t<ul class="navtray-list-secondary">\n\t\t        \t\t<li class="navtray-li navtray-li-photography"><a href="#" class="navtray-li-link tl">Photography</a></li>\n\t\t        \t\t<li class="navtray-li navtray-li-reading"><a href="#" class="navtray-li-link tl">Reading</a></li>\n\t\t        \t\t<li class="navtray-li navtray-li-film"><a href="#" class="navtray-li-link tl">Film &amp; 3D</a></li>\n\t\t        \t\t<li class="navtray-li navtray-li-computing"><a href="#" class="navtray-li-link tl">Computing</a></li>\n\t\t        \t\t<li class="navtray-li navtray-li-music"><a href="#" class="navtray-li-link tl">Music</a></li>\n\t\t        \t</ul>\n\t\t        \t<p class="navtray-secondary-promo">\n\t\t        \t\t<a href="#">\n\t\t        \t\t\t<img src="img/global/global-nav/promo-header-electronics.jpg" alt="">\n\t\t        \t\t\t<span class="p2">Play.Watch.Listen.Create.</span>\n\t\t        \t\t\t<span class="p3">Enjoy your photos and videos across any devices</span>\n\t\t        \t\t</a>\n\t\t        \t</p>\n\t\t        </div>\n\t\t      </div>\n\t      </div><!-- end #navtray-electronics --> \n\n\t\t    <div class="navtray-w navtray-w-fullwidth-3-4 navtray-w-entertainment navtray-w-short">\n\t\t    \t<div class="navtray">\n\t      \t\t<div class="navtray-section navtray-section-main">\n\t\t\t        <ul class="navtray-list-main">\n\t\t\t        \t<li class="navtray-li navtray-li-cameras"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-games.png" alt="Games"><span class="nav-label">Games</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-mobile"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-moviestv.png" alt="Movies &amp; TV Shows"><span class="nav-label">Movies &amp; TV Shows</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-playstation"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-music.png" alt="Music"><span class="nav-label">Music</span></a></li>\n\t\t\t        \t<li class="navtray-li navtray-li-computers"><a href="#" class="navtray-li-link tl"><img src="img/global/global-nav/tray-ebooks.png" alt="eBooks"><span class="nav-label">eBooks</span></a></li>\n\t\t\t        </ul>\n\t\t\t      </div>\n\t\t        <div class="navtray-section navtray-section-featured navtray-section-featured-short">\n\t\t        \t<p class="navtray-secondary-promo navtray-secondary-promo-short">\n\t\t        \t\t<a href="#">\n\t\t        \t\t\t<img src="img/global/global-nav/promo-header-entertainment.jpg" alt="">\n\t\t        \t\t\t<span class="p2">Play.Watch.Listen.Create.</span>\n\t\t        \t\t\t<span class="p3">Enjoy your photos and videos across any devices</span>\n\t\t        \t\t</a>\n\t\t        \t</p>\n\t\t        </div>\n\t\t      </div>\n\t      </div><!-- end #navtray-entertainment -->\n\n\t      \n    \t</nav><!-- end .nav-wrapper --> \n\n\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(125, 0, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(125, 0, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(125, 0, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(125, 0, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(125, 0, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(125, 0, 0); padding:80px;">test</section>\n\n\n\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
