(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["global-header-footer.html"] = function(__obj) {
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
        var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
      
        __out.push('<!DOCTYPE html>\n<!--[if lt IE 8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->\n<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->\n<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->\n<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->\n\t<head>\n\t\t');
      
        __out.push(this.partial('includes/meta.html'));
      
        __out.push('\n');
      
        if (__indexOf.call(this.getEnvironments(), 'debug') >= 0) {
          __out.push(' \n\t\t');
          __out.push(this.partial('includes/css_debug.html.eco', {
            "this": this
          }));
          __out.push('\n');
        } else {
          __out.push('\n\t\t');
          __out.push(this.partial('includes/css_deploy.html'));
          __out.push('\n');
        }
      
        __out.push('\n\t\t');
      
        __out.push(this.partial('includes/js_head.html'));
      
        __out.push('\t\n\n\n  \t<script src="js/libs/jquery.throttle-debounce.min.js"></script>\n\t\t<!-- This should be moved into js_footer files once completed: --> \n\t\t<script src="js/bundle/require/global-nav.js" type="text/javascript"></script>\n\t\t<script src="js/bundle/require/global-footer.js" type="text/javascript"></script>\n\t\t<script src="js/libs/bootstrap-dropdown.js" type="text/javascript"></script>\n\t\t\n\t</head>\n\t<body style="background:url(img/FPO-Homepage-bg.jpg) no-repeat 50% 0;">\n\t\t<div class="page-wrap-outer">\n\t\t\t<div id="page-wrap-inner" class="page-wrap-inner XXshow-mobile-menu">\n\n\t\t<!-- include your module markup templates here -->\n\t\t');
      
        __out.push(this.partial('modules/global_header.html.eco', {
          mode: 'two',
          content: {
            a: '3',
            b: '4'
          }
        }));
      
        __out.push('\n\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 0, 125); padding:80px;">test</section>\n    \t<section class="container" style="background:rgb(0, 70, 0); padding:80px;">test</section>\n\n\t\t');
      
        __out.push(this.partial('modules/global_footer.html.eco', {
          mode: 'two',
          content: {
            a: '3',
            b: '4'
          }
        }));
      
        __out.push('\n\n');
      
        if (__indexOf.call(this.getEnvironments(), 'debug') >= 0) {
          __out.push('\n\t\t');
          __out.push(this.partial('includes/js_footer_debug.html.eco', {
            "this": this
          }));
          __out.push('\n');
        } else {
          __out.push('\n\t\t');
          __out.push(this.partial('includes/js_footer_deploy.html.eco', {
            "this": this
          }));
          __out.push('\n');
        }
      
        __out.push('\n\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
