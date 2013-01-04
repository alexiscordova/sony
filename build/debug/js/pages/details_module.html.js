(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["details_module.html"] = function(__obj) {
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
      
        __out.push('---\ntitle: Details Module\ndescription: This is the details module.\n---\n\n\n<!DOCTYPE html>\n<!--[if lt IE8 ]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->\n<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->\n<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->\n<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->\n\t<head>\n\t\t');
      
        __out.push(this.partial('includes/meta.html'));
      
        __out.push('\n\t\t\n');
      
        if (__indexOf.call(this.getEnvironments(), 'debug') >= 0) {
          __out.push(' \n');
          " !! if you want to manually include your css for debugging instead of relying on the auto include comment this out and replace with bootstrap.css, responsive.css and your css ";
      
          __out.push('\n\t\t');
          __out.push(this.partial('includes/css_debug.html.eco', {
            "this": this
          }));
          __out.push('\n');
        } else {
          __out.push('\n\t\t');
          __out.push(this.partial('includes/css_deploy.html'));
          __out.push('\n');
        }
      
        __out.push('\n\t\t<link rel="stylesheet" href="css/modules/specAndDetails.css">\n\t\t');
      
        __out.push(this.partial('includes/js_head.html'));
      
        __out.push('\n\t\n\t</head>\n\t<body class="module-spec">\n\t\t<!--\n\t\t\t***------Exemples------***\n\t\t\t/details/default.json\n\t\t\t/details-lens/default.json\n\t\t-->\n\t\t');
      
        __out.push(this.partial('modules/module_details.html.eco', {
          "this": this,
          data: this.data('details/default.json')
        }));
      
        __out.push('\n\t\t\n');
      
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
      
        __out.push('\n\n<!-- include your module js here -->\n\t\t<script src="js/bundle/defer/spec.js"></script>\n\t\t\n\t</body>\n</html>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
