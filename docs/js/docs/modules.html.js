(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["modules.html"] = function(__obj) {
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
      
        __out.push('<!DOCTYPE html>\n<!--[if lt IE8]>  <html class="ie lt-ie10 lt-ie9 lt-ie8" lang="en"> <![endif]-->\n<!--[if IE 8]>    <html class="ie lt-ie10 lt-ie9" lang="en"> <![endif]-->\n<!--[if IE 9]>    <html class="ie lt-ie10" lang="en"> <![endif]-->\n<!--[if (gt IE 9)|!(IE)]><!--> <html class="modern" lang="en"> <!--<![endif]-->\n\n\t');
      
        __out.push(this.partial('includes/docs_head.html'));
      
        __out.push('\n\t<body data-spy="scroll" data-target=".bs-docs-sidebar">\n\t\t');
      
        __out.push(this.partial('includes/docs_nav.html'));
      
        __out.push('\n\n\t\t<div class="jumbotron subhead">\n\t\t  <div class="container">\n\t\t    <h2 class="bs-docs-heading">Modules</h2>\n\t\t  </div>\n\t\t</div>\n\t\t\n\t\t<div class="container">\n\t\t\t<ul>\n\t\t\t');
      
        _ref = this.modulepages();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          __out.push('\n\t\t\t\t');
          if (name !== 'index.html.eco' && name.indexOf('_module.html') !== -1) {
            __out.push('\n\t\t\t\t\t<li><a href=\'../build/debug/');
            __out.push(__sanitize(name.replace(/(.eco|.hb)/g, '')));
            __out.push('\'>');
            __out.push(__sanitize(this.title(name) || name.replace(/(.html.eco|.html.hb)/g, '').replace(/(_|-)/g, ' ')));
            __out.push('</a>: ');
            __out.push(__sanitize(this.desc(name)));
            __out.push('</li>');
          }
        }
      
        __out.push('\n\t\t\t</ul>\n\t\t</div>\n\t\t\n\t\t');
      
        __out.push(this.partial('includes/docs_foot.html'));
      
        __out.push('\n\t</body>\n</html>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
