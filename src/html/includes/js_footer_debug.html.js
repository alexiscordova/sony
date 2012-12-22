(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["js_footer_debug.html"] = function(__obj) {
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
        var name, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
      
        __out.push('\n\t\t');
      
        _ref = this["this"].require();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          __out.push('\n\t\t<script src="js/bundle/require/');
          __out.push(__sanitize(name));
          __out.push('"></script>');
        }
      
        __out.push('\n\t\t\n\t\t');
      
        _ref1 = this["this"].secondary();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          name = _ref1[_j];
          __out.push('\n\t\t<script src="js/bundle/secondary/');
          __out.push(__sanitize(name));
          __out.push('"></script>');
        }
      
        __out.push('\n\t\t\n\t\t');
      
        _ref2 = this["this"].defer();
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          name = _ref2[_k];
          __out.push('\n\t\t<script src="js/bundle/defer/');
          __out.push(__sanitize(name));
          __out.push('"></script>');
        }
      
        __out.push('\n\n\t\t<!--[if lt IE 9 ]>');
      
        _ref3 = this["this"].polyfills();
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          name = _ref3[_l];
          __out.push('\n\t\t\t<script src="js/libs/polyfill/');
          __out.push(__sanitize(name));
          __out.push('"></script>');
        }
      
        __out.push('\n\t\t<![endif]-->\n\t\t\n\t\t\n\t\t');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
