(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["css_debug.html"] = function(__obj) {
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
        var name, _i, _len, _ref;
      
        __out.push('\t\t<link rel="stylesheet" href="css/bootstrap.css">\n\t\t<link rel="stylesheet" href="css/responsive.css">\n\n  <!--[if lt IE 9]>  <link rel="stylesheet" href="css/fonts/eot.css"> <![endif]-->\n  <!--[if (gte IE 9)|!(IE)]><!-->\n    <script type="text/javascript">\n      // Android needs otf/ttf fonts.\n      var fontType = navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? "otf" : "woff";\n      document.write(unescape("%3Clink rel=\'stylesheet\' href=\'css/fonts/"+fontType+".css\'%3E"));\n    </script>\n  <!--<![endif]-->\n\n  <!-- FONTS.COM -->\n  <!-- <script type="text/javascript" src="http://fast.fonts.com/jsapi/448c9b40-894e-4f1b-99c2-1d531d005244.js"></script> -->\n\n\t');
      
        _ref = this["this"].modulescss();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          __out.push('\n\t\t<link rel="stylesheet" href="css/modules/');
          __out.push(__sanitize(name.replace(/.scss/g, '.css')));
          __out.push('">');
        }
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
