(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["related_products.html"] = function(__obj) {
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
        var d, i, module, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
      
        __out.push('---\ndesc: \'Here are some modules with unique data:\'\nlayout1: [ "medium" , "normal" ,"plate" , "normal" ,  "normal" , "normal"]\nlayout2: [ "medium" , "normal" , "plate" , "normal" , "normal" , "normal"]\n---\n<div class="container grid5">\n  <div class="rpGrid grid grid-small">\n    <section class="related-products">\n      <div class="rpOverflow" id="rpOverflow">\n        <div class="rpContainer">\n          <div class="rpSlide">\n            ');
      
        i = 0;
      
        __out.push(' \n            ');
      
        _ref = this.data.submodules;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          module = _ref[_i];
          __out.push('\n              ');
          d = this["this"].data(module.data);
          __out.push('\n              ');
          if (d.featured && d.type === "product") {
            __out.push('\n                ');
            d.layout = this.document[this.data.featured.layout[0]][i++];
            __out.push('\n                ');
            d.view = "basic";
            __out.push('\n                ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n              ');
          }
          __out.push('\n            ');
        }
      
        __out.push('     \n          </div>\n          <div class="rpSlide">\n            ');
      
        i = 0;
      
        __out.push(' \n            ');
      
        _ref1 = this.data.submodules;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          module = _ref1[_j];
          __out.push('\n              ');
          d = this["this"].data(module.data);
          __out.push('\n              ');
          if (d.featured && d.type === "product") {
            __out.push('\n                ');
            d.layout = this.document[this.data.featured.layout[1]][i++];
            __out.push('\n                ');
            d.view = "basic";
            __out.push('\n                ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n              ');
          }
          __out.push('\n            ');
        }
      
        __out.push('     \n          </div>\n          <div class="rpSlide">\n            ');
      
        i = 0;
      
        __out.push(' \n            ');
      
        _ref2 = this.data.submodules;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          module = _ref2[_k];
          __out.push('\n              ');
          d = this["this"].data(module.data);
          __out.push('\n              ');
          if (d.featured && d.type === "product") {
            __out.push('\n                ');
            d.layout = this.document[this.data.featured.layout[0]][i++];
            __out.push('\n                ');
            d.view = "basic";
            __out.push('\n                ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n              ');
          }
          __out.push('\n            ');
        }
      
        __out.push('     \n          </div>\n          <div class="rpSlide">\n            ');
      
        i = 0;
      
        __out.push('\n            ');
      
        _ref3 = this.data.submodules;
        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
          module = _ref3[_l];
          __out.push('\n                ');
          d = this["this"].data(module.data);
          __out.push('\n                ');
          if (d.featured && d.type === "product") {
            __out.push('\n                ');
            d.layout = this.document[this.data.featured.layout[1]][i++];
            __out.push('\n                ');
            d.view = "basic";
            __out.push('\n                ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n              ');
          }
          __out.push('\n            ');
        }
      
        __out.push('     \n          </div>\n          <div class="rpSlide">\n            ');
      
        i = 0;
      
        __out.push(' \n            ');
      
        _ref4 = this.data.submodules;
        for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
          module = _ref4[_m];
          __out.push('\n                ');
          d = this["this"].data(module.data);
          __out.push('\n                ');
          if (d.featured && d.type === "product") {
            __out.push('\n                ');
            d.layout = this.document[this.data.featured.layout[0]][i++];
            __out.push('\n                ');
            d.view = "basic";
            __out.push('\n               ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n              ');
          }
          __out.push('\n            ');
        }
      
        __out.push('     \n          </div>\n        </div>\n      </div>\n    </section>\n  </div>\n</div>\n\n<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>\n<script src="js/libs/bootstrap-transition.js"></script>\n ');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
