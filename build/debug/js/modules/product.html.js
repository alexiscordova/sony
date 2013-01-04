(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["product.html"] = function(__obj) {
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
        var color, detail, img, meta, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      
        __out.push('\n');
      
        if (this.data.view === "basic") {
          __out.push('\n<a class="gallery-item\n  ');
          if (this.data.layout === "large") {
            __out.push('\n    span3 large\n  ');
          } else if (this.data.layout === "promo") {
            __out.push('\n    span2 promo\n  ');
          } else {
            __out.push('\n    span1 normal\n  ');
          }
          __out.push('"\n  data-priority="');
          __out.push(this.data.priority);
          __out.push('" href="');
          if (this.data.href) {
            __out.push(this.data.href);
          } else {
            __out.push('#');
          }
          __out.push('">\n  <div class="gallery-item-inner">\n    ');
          if (this.data.label) {
            __out.push('\n    <span class="label label-success">');
            __out.push(this.data.label);
            __out.push('</span>\n    ');
          }
          __out.push('\n    ');
          if (this.data.layout === "promo") {
            __out.push('\n    <div class="product-img">\n      <div class="iq-img" data-src="');
            __out.push(this.data.img.src);
            __out.push('"></div>\n      <div class="product-content">\n        <p class="text-promo-title">\n          <strong>');
            __out.push(this.data.title);
            __out.push('</strong>&nbsp;');
            __out.push(this.data.emphasis);
            __out.push('<i class="icon-ui2-chevron-18-blue"></i>\n        </p>\n        ');
            if (this.data.count) {
              __out.push('\n        <p class="text-count">\n          <span class="number l2">');
              __out.push(this.data.count.number);
              __out.push('</span>&nbsp;\n          <span class="text l3">');
              __out.push(this.data.count.text);
              __out.push('</span>\n        </p>\n        ');
            }
            __out.push('\n      </div>\n    </div>\n    ');
          } else {
            __out.push('\n    <div class="product-img">\n      <div class="product-img-wrap ghost-center-wrap">\n        <div class="ghost-center">\n          ');
            if (this.data.imgCarousel && this.data.layout === "largeASDFASDFASDFASDFASDFASDFASDFASDF") {
              __out.push('\n            ');
              _ref = this.data.imgCarousel;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                img = _ref[_i];
                __out.push('\n            <img class="iq-img" alt="');
                __out.push(img.alt);
                __out.push('" data-src="');
                __out.push(img.src);
                __out.push('">\n            <noscript>\n              <img src="');
                __out.push(img.noscriptsrc);
                __out.push('" alt="');
                __out.push(img.alt);
                __out.push('">\n            </noscript>\n            ');
              }
              __out.push('\n          ');
            } else if (this.data.layout === "large") {
              __out.push('\n          <img class="iq-img" alt="');
              __out.push(this.data.imgLarge.alt);
              __out.push('" data-src="');
              __out.push(this.data.imgLarge.src);
              __out.push('">\n          <noscript>\n            <img src="');
              __out.push(this.data.imgLarge.noscriptsrc);
              __out.push('" alt="');
              __out.push(this.data.imgLarge.alt);
              __out.push('">\n          </noscript>\n          ');
            } else {
              __out.push('\n          <img class="iq-img" alt="');
              __out.push(this.data.imgSmall.alt);
              __out.push('" data-src="');
              __out.push(this.data.imgSmall.src);
              __out.push('">\n          <noscript>\n            <img src="');
              __out.push(this.data.imgSmall.noscriptsrc);
              __out.push('" alt="');
              __out.push(this.data.imgSmall.alt);
              __out.push('">\n          </noscript>\n          ');
              if (this.data.imgSmall.colors) {
                __out.push('\n            ');
                _ref1 = this.data.imgSmall.colors;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  img = _ref1[_j];
                  __out.push('\n            <img class="iq-img hidden" itemprop="image" data-color="');
                  __out.push(img.color);
                  __out.push('" alt="');
                  __out.push(img.alt);
                  __out.push('" data-src="');
                  __out.push(img.src);
                  __out.push('">\n            <noscript>\n              <img class="hidden" itemprop="image" src="');
                  __out.push(img.noscriptsrc);
                  __out.push('" alt="');
                  __out.push(img.alt);
                  __out.push('">\n            </noscript>\n            ');
                }
                __out.push('\n          ');
              }
              __out.push('\n          ');
            }
            __out.push('\n        </div>\n      </div>\n      ');
            if (this.data.img && this.data.img.colors) {
              __out.push('\n      <div class="color-swatches clearfix">\n        ');
              _ref2 = this.data.img.colors;
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                color = _ref2[_k];
                __out.push('<span class="mini-swatch swatch-');
                __out.push(color.color);
                __out.push(' pull-left" data-color="');
                __out.push(color.color);
                __out.push('" itemprop="color">');
                __out.push(color.color);
                __out.push('</span>');
              }
              __out.push('\n      </div>\n      ');
            } else if (this.data.imgSmall && this.data.imgSmall.colors) {
              __out.push('\n      <div class="color-swatches clearfix">\n        ');
              _ref3 = this.data.img.colors;
              for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                color = _ref3[_l];
                __out.push('<span class="mini-swatch swatch-');
                __out.push(color.color);
                __out.push(' pull-left" data-color="');
                __out.push(color.color);
                __out.push('" itemprop="color">');
                __out.push(color.color);
                __out.push('</span>');
              }
              __out.push('\n      </div>\n      ');
            }
            __out.push('\n    </div>\n    <div class="product-content">\n      <p class="p3 product-name">');
            __out.push(this.data.name);
            __out.push('</p>\n      <div class="product-price">\n        <p class="price"><span class="p5">Starting at</span> <span class="l2">$');
            __out.push(this.data.price);
            __out.push('</span> <span class="p5 msrp">MSRP</span></p>\n      </div>\n    </div>\n  ');
          }
          __out.push('\n\n  </div>\n</a>\n\n');
        } else if (this.data.view === "detailed") {
          __out.push('\n\n\n<a class="span4 gallery-item" data-filter-set=\'');
          __out.push(JSON.stringify(this.data.filterSet));
          __out.push('\' data-priority="');
          __out.push(this.data.priority);
          __out.push('" itemscope itemtype="http://schema.org/Product" itemprop="url" href="');
          if (this.data.href) {
            __out.push(this.data.href);
          } else {
            __out.push('#');
          }
          __out.push('">\n  <div class="gallery-item-inner">\n    ');
          if (this.data.label) {
            __out.push('\n    <span class="label label-success">');
            __out.push(this.data.label);
            __out.push('</span>\n    ');
          }
          __out.push('\n    <div class="product-img">\n      <div class="product-img-wrap ghost-center-wrap js-product-imgs">\n        <div class="ghost-center">\n          <img class="iq-img js-product-img-main" itemprop="image" alt="');
          __out.push(this.data.img.alt);
          __out.push('" data-src="');
          __out.push(this.data.img.src);
          __out.push('">\n          <noscript>\n            <img src="');
          __out.push(this.data.img.noscriptsrc);
          __out.push('" itemprop="image" alt="');
          __out.push(this.data.img.alt);
          __out.push('">\n          </noscript>\n          ');
          _ref4 = this.data.img.colors;
          for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
            img = _ref4[_m];
            __out.push('\n          <img class="iq-img hidden" itemprop="image" data-color="');
            __out.push(img.color);
            __out.push('" alt="');
            __out.push(img.alt);
            __out.push('" data-src="');
            __out.push(img.src);
            __out.push('">\n          <noscript>\n            <img class="hidden" itemprop="image" src="');
            __out.push(img.noscriptsrc);
            __out.push('" alt="');
            __out.push(img.alt);
            __out.push('">\n          </noscript>\n          ');
          }
          __out.push('\n        </div>\n      </div>\n      ');
          if (this.data.img.colors) {
            __out.push('\n      <div class="color-swatches clearfix">\n        ');
            _ref5 = this.data.img.colors;
            for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
              color = _ref5[_n];
              __out.push('<span class="mini-swatch swatch-');
              __out.push(color.color);
              __out.push(' pull-left" data-color="');
              __out.push(color.color);
              __out.push('" itemprop="color">');
              __out.push(color.color);
              __out.push('</span>');
            }
            __out.push('\n      </div>\n      ');
          }
          __out.push('\n    </div>\n    <div class="product-content">\n      <div class="p3 product-name" itemprop="name">');
          __out.push(this.data.name);
          __out.push('</div>\n      <div class="p5 product-model" itemprop="model">');
          __out.push(this.data.model);
          __out.push('</div>\n      <div class="p5 product-rating" data-stars="');
          __out.push(this.data.rating.stars);
          __out.push('" itemprop="reviews" itemscope itemtype="http://schema.org/AggregateRating">\n        <meta itemprop="ratingValue" content="');
          __out.push(this.data.rating.stars);
          __out.push('">\n        <i class="icon-ui-star"></i\n        ><i class="icon-ui-star"></i\n        ><i class="icon-ui-star"></i\n        ><i class="icon-ui-star"></i\n        ><i class="icon-ui-star"></i>\n        ( <span itemprop="ratingCount">');
          __out.push(this.data.rating.reviews);
          __out.push('</span> user reviews)\n      </div>\n      <ul class="p3 product-meta">\n        ');
          _ref6 = this.data.meta;
          for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
            meta = _ref6[_o];
            __out.push('\n        <li>');
            __out.push(meta.value);
            __out.push(' <span class="product-meta-name">');
            __out.push(meta.name);
            __out.push('</span></li>\n        ');
          }
          __out.push('\n      </ul>\n      <div class="product-price">\n        <p class="price"><span class="p5">Starting at</span> <span class="l2" itemprop="price">$');
          __out.push(this.data.price);
          __out.push('</span> <span class="p5 msrp">MSRP</span></p>\n      </div>\n      <div class="detail-group hidden">\n        ');
          if (this.data.details) {
            __out.push('\n        ');
            _ref7 = this.data.details;
            for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
              detail = _ref7[_p];
              __out.push('\n        <div class="detail" itemprop="');
              __out.push(detail.slug);
              __out.push('">\n          ');
              if (detail.value.check) {
                __out.push('\n            ');
                if (detail.value.checked) {
                  __out.push('\n            <div class="icon-ui-check"></div>');
                  __out.push(detail.value.text);
                  __out.push('\n            ');
                } else {
                  __out.push('\n            <div class="icon-ui-ban"></div>NOPE\n            ');
                }
                __out.push('\n          ');
              } else if (detail.value.box) {
                __out.push('\n              <p class="compare-box">');
                __out.push(detail.value.box);
                __out.push('</p>\n              <p>');
                __out.push(detail.value.lineOne);
                __out.push('</p>\n              ');
                if (detail.value.lineTwo) {
                  __out.push('<p>');
                  __out.push(detail.value.lineTwo);
                  __out.push('</p>');
                }
                __out.push('\n              ');
                if (detail.value.lineThree) {
                  __out.push('<p>');
                  __out.push(detail.value.lineThree);
                  __out.push('</p>');
                }
                __out.push('\n          ');
              } else if (detail.value.lineOne) {
                __out.push('\n            <p>');
                __out.push(detail.value.lineOne);
                __out.push('</p>\n            ');
                if (detail.value.lineTwo) {
                  __out.push('<p>');
                  __out.push(detail.value.lineTwo);
                  __out.push('</p>');
                }
                __out.push('\n            ');
                if (detail.value.lineThree) {
                  __out.push('<p>');
                  __out.push(detail.value.lineThree);
                  __out.push('</p>');
                }
                __out.push('\n          ');
              } else if (detail.value[0].description) {
                __out.push('\n            <ul class="media-list">\n              ');
                _ref8 = detail.value;
                for (_q = 0, _len8 = _ref8.length; _q < _len8; _q++) {
                  value = _ref8[_q];
                  __out.push('\n              <li class="media">\n                <div class="pull-left">\n                  <i class="media-object icon-bestfor-');
                  __out.push(detail.icon);
                  __out.push('"></i>\n                </div>\n                <div class="media-body">\n                  <p class="media-heading p3 text-dark">');
                  __out.push(detail.label);
                  __out.push('</p>\n                  <p class="p3">');
                  __out.push(detail.description);
                  __out.push('</p>\n                </div>\n              </li>\n              ');
                }
                __out.push('\n            </ul>\n          ');
              } else {
                __out.push('\n            ');
                __out.push(detail.value);
                __out.push('\n          ');
              }
              __out.push('\n        </div>\n        ');
            }
            __out.push('\n        ');
          }
          __out.push('\n      </div>\n    </div>\n  </div>\n</a>\n\n');
        } else {
          __out.push('\n<i>on noes</i>\n');
        }
      
        __out.push('\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
