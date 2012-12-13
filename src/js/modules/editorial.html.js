(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["editorial.html"] = function(__obj) {
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
        var col, i, _i, _j, _len, _len1, _ref, _ref1;
      
        __out.push('<div class="editorial container clearfix">\n\n');
      
        if (this.data.layout.media === "full") {
          __out.push('\n\t');
          if (this.data.layout.inner) {
            __out.push('\n\t<div class="row-fluid">\n\t\t<div class="span12">\n\t\t\t');
            __out.push(this["this"].partial('modules/' + this.data.submodules[0].type, {
              "this": this["this"],
              data: this["this"].data(this.data.submodules[0].data)
            }));
            __out.push('\n\t\t\t<div class="row-fluid">\n\t\t\t');
            if (this.data.layout.text === "left") {
              __out.push('\n\t\t\t\t<div class="span');
              __out.push(this.data.layout.columns[0]);
              __out.push('">\n\t\t\t');
            } else if (this.data.layout.text === "right") {
              __out.push('\n\t\t\t\t<div class="span');
              __out.push(this.data.layout.columns[1]);
              __out.push(' offset');
              __out.push(this.data.layout.columns[0]);
              __out.push('">\n\t\t\t');
            }
            __out.push('\n\t\t\t\t\t');
            if (this.data.h2) {
              __out.push('<h2>');
              __out.push(this.data.h2);
              __out.push('</h2>');
            }
            __out.push('\n\t\t\t\t\t');
            if (this.data.h3) {
              __out.push('<h3>');
              __out.push(this.data.h3);
              __out.push('</h3>');
            }
            __out.push('\n\t\t\t\t\t');
            if (this.data.body) {
              __out.push('<p>');
              __out.push(this.data.body);
              __out.push('</p>');
            }
            __out.push('\n\t\t\t\t\t');
            if (this.data.link) {
              __out.push('<a class="');
              __out.push(this.data.link.type);
              __out.push('" href="');
              __out.push(this.data.link.url);
              __out.push('">');
              __out.push(this.data.link.text);
              __out.push('</a>');
            }
            __out.push('\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t');
          } else {
            __out.push('\n\t<div class="row-fluid">\n\t\t<div class="span12">\n\t\t\t');
            if (this.data.h2) {
              __out.push('<h2>');
              __out.push(this.data.h2);
              __out.push('</h2>');
            }
            __out.push('\n\t\t\t');
            if (this.data.h3) {
              __out.push('<h3>');
              __out.push(this.data.h3);
              __out.push('</h3>');
            }
            __out.push('\n\t\t\t');
            if (this.data.body) {
              __out.push('<p>');
              __out.push(this.data.body);
              __out.push('</p>');
            }
            __out.push('\n\t\t\t');
            if (this.data.link) {
              __out.push('<a class="');
              __out.push(this.data.link.type);
              __out.push('" href="');
              __out.push(this.data.link.url);
              __out.push('">');
              __out.push(this.data.link.text);
              __out.push('</a>');
            }
            __out.push('\n\t\t</div>\n\t</div>\n\t<div class="row-fluid">\n\t\t<div class="span12">\n\t\t');
            __out.push(this["this"].partial('modules/' + this.data.submodules[0].type, {
              "this": this["this"],
              data: this["this"].data(this.data.submodules[0].data)
            }));
            __out.push('\n\t\t</div>\n\t</div>\n\t');
          }
          __out.push('\n\n');
        } else if (this.data.layout.media === "mediaright") {
          __out.push('\n\t<div class="row-fluid">\n\t\t<div class="span');
          __out.push(this.data.layout.columns[0]);
          __out.push('">\n\t\t\t');
          if (this.data.h2) {
            __out.push('<h2>');
            __out.push(this.data.h2);
            __out.push('</h2>');
          }
          __out.push('\n\t\t\t');
          if (this.data.h3) {
            __out.push('<h3>');
            __out.push(this.data.h3);
            __out.push('</h3>');
          }
          __out.push('\n\t\t\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t');
          if (this.data.link) {
            __out.push('<a class="');
            __out.push(this.data.link.type);
            __out.push('" href="');
            __out.push(this.data.link.url);
            __out.push('">');
            __out.push(this.data.link.text);
            __out.push('</a>');
          }
          __out.push('\n\t\t</div>\n\t\t<div class="span');
          __out.push(this.data.layout.columns[1]);
          __out.push('">\n\t\t\t');
          __out.push(this["this"].partial('modules/' + this.data.submodules[0].type, {
            "this": this["this"],
            data: this["this"].data(this.data.submodules[0].data)
          }));
          __out.push('\n\t\t</div>\n\t</div>\n\t\n');
        } else if (this.data.layout.media === "medialeft") {
          __out.push('\t\n\t<div class="row-fluid">\n\t\t<div class="span');
          __out.push(this.data.layout.columns[0]);
          __out.push('">\n\t\t\t');
          __out.push(this["this"].partial('modules/' + this.data.submodules[0].type, {
            "this": this["this"],
            data: this["this"].data(this.data.submodules[0].data)
          }));
          __out.push('\n\t\t</div>\n\t\t<div class="span');
          __out.push(this.data.layout.columns[1]);
          __out.push('">\n\t\t\t');
          if (this.data.h2) {
            __out.push('<h2>');
            __out.push(this.data.h2);
            __out.push('</h2>');
          }
          __out.push('\n\t\t\t');
          if (this.data.h3) {
            __out.push('<h3>');
            __out.push(this.data.h3);
            __out.push('</h3>');
          }
          __out.push('\n\t\t\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t');
          if (this.data.link) {
            __out.push('<a class="');
            __out.push(this.data.link.type);
            __out.push('" href="');
            __out.push(this.data.link.url);
            __out.push('">');
            __out.push(this.data.link.text);
            __out.push('</a>');
          }
          __out.push('\n\t\t</div>\n\t</div>\n\n');
        } else if (this.data.layout.media === "full3up") {
          __out.push('\n\t');
          if (this.data.h2) {
            __out.push('<h2>');
            __out.push(this.data.h2);
            __out.push('</h2>');
          }
          __out.push('\n\t');
          if (this.data.h3) {
            __out.push('<h3>');
            __out.push(this.data.h3);
            __out.push('</h3>');
          }
          __out.push('\n\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t');
          if (this.data.link) {
            __out.push('<a class="');
            __out.push(this.data.link.type);
            __out.push('" href="');
            __out.push(this.data.link.url);
            __out.push('">');
            __out.push(this.data.link.text);
            __out.push('</a>');
          }
          __out.push('\n\t\n\t');
          __out.push(this["this"].partial('modules/' + this.data.submodules[0].type, {
            "this": this["this"],
            data: this["this"].data(this.data.submodules[0].data)
          }));
          __out.push('\n\n\t<div class="row-fluid">\n\t\t');
          _ref = this.data.layout.columns;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            col = _ref[i];
            __out.push('\n\t\t\t<div class="span');
            __out.push(this.data.layout.columns[i]);
            __out.push('">\n\t\t\t\t');
            __out.push(this["this"].partial('modules/' + this.data.submodules[i + 1].type, {
              "this": this["this"],
              data: this["this"].data(this.data.submodules[i + 1].data)
            }));
            __out.push('\n\t\t\t\t');
            __out.push(this.data.columns[i]);
            __out.push('\n\t\t\t</div>\n\t\t');
          }
          __out.push('\n\t</div>\n\t\n');
        } else if (this.data.layout.media === "3up" || this.data.layout.media === "2up") {
          __out.push('\n\t');
          if (this.data.h2) {
            __out.push('<h2>');
            __out.push(this.data.h2);
            __out.push('</h2>');
          }
          __out.push('\n\t');
          if (this.data.h3) {
            __out.push('<h3>');
            __out.push(this.data.h3);
            __out.push('</h3>');
          }
          __out.push('\n\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t');
          if (this.data.link) {
            __out.push('<a class="');
            __out.push(this.data.link.type);
            __out.push('" href="');
            __out.push(this.data.link.url);
            __out.push('">');
            __out.push(this.data.link.text);
            __out.push('</a>');
          }
          __out.push('\n\t\n\t');
          if (this.data.layout.inner) {
            __out.push('\n\t\t!!!!:TODO\n\t\t\n\t');
          } else {
            __out.push('\n\t\t<div class="row-fluid">\n\t\t\t');
            _ref1 = this.data.layout.columns;
            for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
              col = _ref1[i];
              __out.push('\n\t\t\t<div class="span');
              __out.push(this.data.layout.columns[i]);
              __out.push('">\n\t\t\t\t');
              __out.push(this["this"].partial('modules/' + this.data.submodules[i].type, {
                "this": this["this"],
                data: this["this"].data(this.data.submodules[i].data)
              }));
              __out.push('\n\t\t\t\t');
              __out.push(this.data.columns[i]);
              __out.push('\n\t\t\t</div>\n\t\t\t');
            }
            __out.push('\n\t\t</div>\n\t');
          }
          __out.push('\n\n');
        } else if (this.data.layout.media === "textonly") {
          __out.push('\n\t<div class="row-fluid">\n\t\t');
          if (this.data.layout.text === "left") {
            __out.push('\n\t\t<div class="span');
            __out.push(this.data.layout.columns[0]);
            __out.push('">\n\t\t\n\t\t');
          } else if (this.data.layout.text === "right") {
            __out.push('\n\t\t<div class="span');
            __out.push(this.data.layout.columns[1]);
            __out.push(' offset');
            __out.push(this.data.layout.columns[0]);
            __out.push('">\n\t\t\n\t\t');
          } else if (this.data.layout.text === "center") {
            __out.push('\n\t\t<div class="span');
            __out.push(this.data.layout.columns[1]);
            __out.push(' offset');
            __out.push(this.data.layout.columns[0]);
            __out.push('">\n\t\t');
          }
          __out.push('\n\n\t\t\t');
          if (this.data.h2) {
            __out.push('<h2>');
            __out.push(this.data.h2);
            __out.push('</h2>');
          }
          __out.push('\n\t\t\t');
          if (this.data.h3) {
            __out.push('<h3>');
            __out.push(this.data.h3);
            __out.push('</h3>');
          }
          __out.push('\n\t\t\t');
          if (this.data.body) {
            __out.push('<p>');
            __out.push(this.data.body);
            __out.push('</p>');
          }
          __out.push('\n\t\t\t');
          if (this.data.link) {
            __out.push('<a class="');
            __out.push(this.data.link.type);
            __out.push('" href="');
            __out.push(this.data.link.url);
            __out.push('">');
            __out.push(this.data.link.text);
            __out.push('</a>');
          }
          __out.push('\n\t\t</div>\n\t</div>\n\t\n');
        }
      
        __out.push('\n\t\n</div>\n\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
