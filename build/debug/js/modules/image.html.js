(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["image.html"] = function(__obj) {
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
      
        __out.push('<div class="image-module">\n\t<img class="iq-img ');
      
        __out.push(this.data.classes);
      
        __out.push('" alt="');
      
        __out.push(this.data.alt);
      
        __out.push('" data-src="');
      
        __out.push(this.data.src);
      
        __out.push('" data-base="');
      
        __out.push(this.data.base);
      
        __out.push('">\n    <noscript>\n        <img src="');
      
        __out.push(this.data.noscriptsrc);
      
        __out.push('">\n    </noscript>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
