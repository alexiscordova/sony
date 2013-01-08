(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["primary_tout.html"] = function(__obj) {
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
        var link, _i, _j, _len, _len1, _ref, _ref1;
      
        __out.push('<section class="primary-tout container full-bleed ');
      
        __out.push(this.data.mode);
      
        __out.push('">\n\t');
      
        __out.push(this["this"].partial('modules/image.html.eco', {
          "this": this["this"],
          data: this.data.image
        }));
      
        __out.push('\n\t<div class="container">\n\t');
      
        if (this.data.mode === "primaryTout") {
          __out.push('\n\t\t<div class="inner grid">\n\t\t\t<div class="span5 titleplate ');
          __out.push(this.data.style);
          __out.push('">\n\t\t\t\t');
          if (this.data.kicker) {
            __out.push('<p class="kicker">');
            __out.push(this.data.kicker);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t\t');
          if (this.data.headline) {
            __out.push('<h1>');
            __out.push(this.data.headline);
            __out.push('</h1>');
          }
          __out.push('\n\t\t\t\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t\t');
          if (this.data.links) {
            __out.push('\n\t\t\t\t\t');
            _ref = this.data.links;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              link = _ref[_i];
              __out.push('\n\t\t\t\t\t\t<a class="');
              __out.push(link.type);
              __out.push('" href="');
              __out.push(link.url);
              __out.push('">');
              __out.push(link.text);
              __out.push('</a>\n\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t');
          }
          __out.push('\n\t\t\t</div>\n\t\t</div>\n\t');
        } else if (this.data.mode === "productIntroPlate") {
          __out.push('\n\t\t<div class="inner grid">\n\t\t\t<div class="span5 titleplate ');
          __out.push(this.data.style);
          __out.push('">\n\t\t\t\t');
          if (this.data.kicker) {
            __out.push('<p class="kicker">');
            __out.push(this.data.kicker);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t\t');
          if (this.data.headline) {
            __out.push('<h1>');
            __out.push(this.data.headline);
            __out.push('</h1>');
          }
          __out.push('\n\t\t\t\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t\t');
          if (this.data.links) {
            __out.push('\n\t\t\t\t\t');
            _ref1 = this.data.links;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              link = _ref1[_j];
              __out.push('\n\t\t\t\t\t\t<a class="');
              __out.push(link.type);
              __out.push('" href="');
              __out.push(link.url);
              __out.push('">');
              __out.push(link.text);
              __out.push('</a>\n\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t');
          }
          __out.push('\n\t\t\t</div>\n\t\t</div>\n\t');
        }
      
        __out.push('\n</section>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
