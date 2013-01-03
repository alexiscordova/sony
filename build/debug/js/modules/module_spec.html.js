(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["module_spec.html"] = function(__obj) {
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
        var batteryAndPowerSpec, batterySettings, communications, displayDescription, hardDriveNote, hardware, i, inTheBox, ports, processorConfig, productTable, _aa, _ab, _ac, _ad, _i, _j, _k, _l, _len, _len1, _len10, _len11, _len12, _len13, _len14, _len15, _len16, _len17, _len18, _len19, _len2, _len20, _len21, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t, _u, _v, _w, _x, _y, _z;
      
        __out.push('<div class="container">\n\t<section class="spec">\n\t\t<div class="clearfix fixed-header">\n\t\t\t<div class="spec-title">\n\t\t\t\t<p class="title-link">\n\t\t\t\t\t<a href="#">Vaio Z</a>\n\t\t\t\t</p>\n\t\t\t\t<h1>VAIO E Details</h1>\n\n\t\t\t\t<div class="clearfix">\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<a class="active" href="#">Specifications</a>\n\t\t\t\t\t</p>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<a href="details_module.html">Features</a>\n\t\t\t\t\t</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="sonyRecommends">\n\t\t\t\t<p>\n\t\t\t\t\tSony recommends\n\t\t\t\t</p>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<!-- <a href="#" id="button">test</a> -->\n\n\t\t<div class="tab-strip gallery-tabs">\n\n\t\t\t<div class="tableContainer clearfix">\n\t\t\t\t<table class="specsTable">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th>&nbsp;</th>\n\t\t\t\t\t\t\t');
      
        if (this.data.productTable.length) {
          __out.push('\n\t\t\t\t\t\t\t');
          _ref = this.data.productTable;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            productTable = _ref[_i];
            __out.push('\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<th>');
            if (productTable.productTitle) {
              __out.push(' <h2>\n\t\t\t\t\t\t\t\t');
              __out.push(__sanitize(productTable.productTitle));
              __out.push(' </h2>\n\t\t\t\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\t\t\t');
            if (productTable.productTitleDescription) {
              __out.push(' \n\t\t\t\t\t\t\n\t\t\t\t\t\t\t<p>');
              __out.push(__sanitize(productTable.productTitleDescription));
              __out.push(' \n\t\t\t\t\t\t\t</p>');
            }
            __out.push('</th>\n\n\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\tProcessor\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t');
      
        _ref1 = this.data.productTable;
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          productTable = _ref1[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td class="intel7">\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.processor) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.processor);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<p class="infoTitle">\n\t\t\t\t\t\t\t\t\t\t\tConfigurable options\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t');
          _ref2 = productTable.processorConfig;
          for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
            processorConfig = _ref2[i];
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\t');
            __out.push(productTable.processorConfig[i]);
            __out.push('</p>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\tOperating System\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t');
      
        _ref3 = this.data.productTable;
        for (i = _l = 0, _len3 = _ref3.length; _l < _len3; i = ++_l) {
          productTable = _ref3[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.operatingSystem) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.operatingSystem);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.operatingSystemNote) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.operatingSystemNote);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tDimensions\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\t\t\t\t\t\t\t');
      
        _ref4 = this.data.productTable;
        for (i = _m = 0, _len4 = _ref4.length; _m < _len4; i = ++_m) {
          productTable = _ref4[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t');
          if (productTable.productImage) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<div class="img-respons center imgMarginBottom"><img class="iq-img" data-base="img/spec/" data-src="');
            __out.push(productTable.productImage);
            __out.push('">\n\t\t\t\t\t\t\t\t\t\t<noscript>\n\t\t\t\t\t\t\t\t\t\t\t<img src="img/spec/');
            __out.push(productTable.productImage);
            __out.push('">\n\t\t\t\t\t\t\t\t\t\t</noscript>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t\t\t\t');
          if (productTable.dimensions.width) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\tWidth:\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.dimensions.width);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t');
          if (productTable.dimensions.height) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\tHeight:\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.dimensions.height);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t');
          if (productTable.dimensions.depth) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\tDepth:\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.dimensions.depth);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t\t');
          if (productTable.dimensions.weight) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\tWeight:\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.dimensions.weight);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</p></td>\n\t\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tDisplay\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\t\t\t\t\t\t\t');
      
        _ref5 = this.data.productTable;
        for (i = _n = 0, _len5 = _ref5.length; _n < _len5; i = ++_n) {
          productTable = _ref5[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t');
          __out.push(productTable.display);
          __out.push('\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t');
          if (productTable.displayDescription) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<ul class="listNoTitle">\n\t\t\t\t\t\t\t\t\t\t');
            _ref6 = productTable.displayDescription;
            for (i = _o = 0, _len6 = _ref6.length; _o < _len6; i = ++_o) {
              displayDescription = _ref6[i];
              __out.push('\n\t\t\t\t\t\t\t\t\t\t<li><p>');
              __out.push(productTable.displayDescription[i]);
              __out.push('</p></li>\n\t\t\t\t\t\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tColor Options\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\t\t\t\t\t\t\t');
      
        _ref7 = this.data.productTable;
        for (i = _p = 0, _len7 = _ref7.length; _p < _len7; i = ++_p) {
          productTable = _ref7[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<div class="clearfix">\n\t\t\t\t\t\t\t\t\t\t');
          __out.push(productTable.colorOptions);
          __out.push('\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tMemory\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\t\t\t\t\t\t\t');
      
        _ref8 = this.data.productTable;
        for (i = _q = 0, _len8 = _ref8.length; _q < _len8; i = ++_q) {
          productTable = _ref8[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t');
          if (productTable.memory) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.memory);
            __out.push('\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t');
          if (productTable.memoryNote) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<p class="infoTitle">\n\t\t\t\t\t\t\t\t\t\tConfigurable to:\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.memoryNote);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\tHard Drive\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t');
      
        _ref9 = this.data.productTable;
        for (i = _r = 0, _len9 = _ref9.length; _r < _len9; i = ++_r) {
          productTable = _ref9[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t');
          if (productTable.emphasisInfo) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<div class="clearfix">\n\t\t\t\t\t\t\t\t\t\t<div class="emphasis-info">\n\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.emphasisInfo);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t');
          if (productTable.hardDrive) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.hardDrive);
            __out.push('\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t');
          if (productTable.hardDriveNote) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<p class="infoTitle">\n\t\t\t\t\t\t\t\t\t\tConfigurable to:\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t');
            _ref10 = productTable.hardDriveNote;
            for (i = _s = 0, _len10 = _ref10.length; _s < _len10; i = ++_s) {
              hardDriveNote = _ref10[i];
              __out.push('\n\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t');
              __out.push(productTable.hardDriveNote[i]);
              __out.push('\n\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\tCommunications\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t');
      
        _ref11 = this.data.productTable;
        for (i = _t = 0, _len11 = _ref11.length; _t < _len11; i = ++_t) {
          productTable = _ref11[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t');
          _ref12 = productTable.communications;
          for (i = _u = 0, _len12 = _ref12.length; _u < _len12; i = ++_u) {
            communications = _ref12[i];
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.communications[i]);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tHardware\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\n\t\t\t\t\t\t\t\t');
      
        _ref13 = this.data.productTable;
        for (i = _v = 0, _len13 = _ref13.length; _v < _len13; i = ++_v) {
          productTable = _ref13[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t');
          _ref14 = productTable.hardware;
          for (i = _w = 0, _len14 = _ref14.length; _w < _len14; i = ++_w) {
            hardware = _ref14[i];
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.hardware[i]);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tPorts\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\t\t\t\t\t\t\t');
      
        _ref15 = this.data.productTable;
        for (i = _x = 0, _len15 = _ref15.length; _x < _len15; i = ++_x) {
          productTable = _ref15[i];
          __out.push('\n\t\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t');
          if (productTable.portsImg) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<div class="img-respons imgMarginTop">\n\t\t\t\t\t\t\t\t\t\t<img class="iq-img" data-base="img/spec/" data-src="');
            __out.push(productTable.portsImg);
            __out.push('">\n\t\t\t\t\t\t\t\t\t\t<noscript>\n\t\t\t\t\t\t\t\t\t\t\t<img src="img/spec/');
            __out.push(productTable.portsImg);
            __out.push('">\n\t\t\t\t\t\t\t\t\t\t</noscript>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<p class="tableZoom">\n\t\t\t\t\t\t\t\t\t\t<a href="#myModal');
          __out.push(productTable.id);
          __out.push('" role="button" class="enlarge" data-toggle="modal">Enlarge</a>\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t<div id="myModal');
          __out.push(productTable.id);
          __out.push('" class="modal hide" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n\t\n\t\t\t\t\t\t\t\t\t\t<div class="modal-body">\n\t\t\t\t\t\t\t\t\t\t\t');
          if (productTable.productTitle) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\t<h2>');
            __out.push(productTable.productTitle);
            if (productTable.productTitleDescription) {
              __out.push(' - ');
              __out.push(productTable.productTitleDescription);
            }
            __out.push('</h2>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\n\t\t\t\t\t\t\t\t\t\t\t');
          if (productTable.portsBigImg) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<div class="img-respons"><img class="iq-img" data-base="img/spec/" data-src="');
            __out.push(productTable.portsBigImg);
            __out.push('">\n\t\t\t\t\t\t\t\t\t\t\t\t<noscript>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<img src="img/spec/');
            __out.push(productTable.portsBigImg);
            __out.push('">\n\t\t\t\t\t\t\t\t\t\t\t\t</noscript>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<button class="close" data-dismiss="modal" aria-hidden="true">\n\t\t\t\t\t\t\t\t\t\t\t\tx\n\t\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t');
          if (productTable.ports) {
            __out.push('\n\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t');
            _ref16 = productTable.ports;
            for (i = _y = 0, _len16 = _ref16.length; _y < _len16; i = ++_y) {
              ports = _ref16[i];
              __out.push('\n\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t');
              __out.push(productTable.ports[i]);
              __out.push('\n\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t</div></td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tBattery and Power\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t');
      
        _ref17 = this.data.productTable;
        for (i = _z = 0, _len17 = _ref17.length; _z < _len17; i = ++_z) {
          productTable = _ref17[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.batteryAndPower) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.batteryAndPower);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.batteryAndPowerDescription) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t<span>');
            __out.push(productTable.batteryAndPowerDescription);
            __out.push('</span>\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.batteryAndPowerSpec) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t');
            _ref18 = productTable.batteryAndPowerSpec;
            for (i = _aa = 0, _len18 = _ref18.length; _aa < _len18; i = ++_aa) {
              batteryAndPowerSpec = _ref18[i];
              __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t');
              __out.push(productTable.batteryAndPowerSpec[i]);
              __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t\t');
          if (productTable.batterySettings) {
            __out.push('\n\t\t\t\t\t\t\t\t\t\t<p class="infoTitle">\n\t\t\t\t\t\t\t\t\t\t\tDefault settings:\n\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t');
            _ref19 = productTable.batterySettings;
            for (i = _ab = 0, _len19 = _ref19.length; _ab < _len19; i = ++_ab) {
              batterySettings = _ref19[i];
              __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t');
              __out.push(productTable.batterySettings[i]);
              __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>\n\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\tIn the Box\n\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t</div></th>\n\t\n\t\t\t\t\t\t\t\t');
      
        _ref20 = this.data.productTable;
        for (i = _ac = 0, _len20 = _ref20.length; _ac < _len20; i = ++_ac) {
          productTable = _ref20[i];
          __out.push('\n\t\t\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t\t\t');
          _ref21 = productTable.inTheBox;
          for (i = _ad = 0, _len21 = _ref21.length; _ad < _len21; i = ++_ad) {
            inTheBox = _ref21[i];
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t\t\t\t\t\t\t');
            __out.push(productTable.inTheBox[i]);
            __out.push('\n\t\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t');
        }
      
        __out.push('\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\n\t\t');
      
        if (this.data.computersFeatures) {
          __out.push('\n\t\t\t<h2 class="h2-bigger">Features</h2>\n\t\n\t\t\t<div class="grid no-border full-bleed">\n\t\t\t\t<div class="span4">\n\t\t\t\t\t');
          if (this.data.computersFeatures.a) {
            __out.push('\n\t\t\t\t\t\t<h3>');
            __out.push(this.data.computersFeatures.a.title);
            __out.push('</h3>\n\t\t\t\t\t\t<p>');
            __out.push(this.data.computersFeatures.a.description);
            __out.push('</p>\n\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class="span4">\n\t\t\t\t\t');
          if (this.data.computersFeatures.b) {
            __out.push('\n\t\t\t\t\t<h3>');
            __out.push(this.data.computersFeatures.b.title);
            __out.push('</h3>\n\t\t\t\t\t<p>');
            __out.push(this.data.computersFeatures.b.description);
            __out.push('</p>\n\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class="span4">\n\t\t\t\t\t');
          if (this.data.computersFeatures.c) {
            __out.push('\n\t\t\t\t\t<h3>');
            __out.push(this.data.computersFeatures.c.title);
            __out.push('</h3>\n\t\t\t\t\t<p>');
            __out.push(this.data.computersFeatures.c.description);
            __out.push('</p>\n\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t</div>\n\t\t\t</div>\n\t\n\t\t\t<div class="grid no-border full-bleed">\n\t\t\t\t<div class="span4">\n\t\t\t\t\t');
          if (this.data.computersFeatures.d) {
            __out.push('\n\t\t\t\t\t<h3>');
            __out.push(this.data.computersFeatures.d.title);
            __out.push('</h3>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t');
            __out.push(this.data.computersFeatures.d.description);
            __out.push('\n\t\t\t\t\t</p>\n\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class="span4">\n\t\t\t\t\t');
          if (this.data.computersFeatures.e) {
            __out.push('\n\t\t\t\t\t<h3>');
            __out.push(this.data.computersFeatures.e.title);
            __out.push('</h3>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t');
            __out.push(this.data.computersFeatures.e.description);
            __out.push('\n\t\t\t\t\t</p>\n\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t</div>\n\t\n\t\t\t\t<div class="span4">\n\t\t\t\t\t');
          if (this.data.computersFeatures.f) {
            __out.push('\n\t\t\t\t\t<h3>');
            __out.push(this.data.computersFeatures.f.title);
            __out.push('</h3>\n\t\t\t\t\t<p>');
            __out.push(this.data.computersFeatures.f.description);
            __out.push('</p>\n\t\t\t\t\t');
          }
          __out.push('\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t');
        }
      
        __out.push('\n\n\t</section>\n</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
