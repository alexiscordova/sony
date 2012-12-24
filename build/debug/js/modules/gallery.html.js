(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["gallery.html"] = function(__obj) {
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
        var accessory, count, d, detail, filter, filterSet, i, module, sort, tab, _i, _j, _k, _l, _len, _len1, _len10, _len11, _len12, _len13, _len14, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _s, _t, _u, _v, _w;
      
        __out.push('---\ndesc: \'Here are some modules with unique data:\'\nlayout1: [ "large", "promo", "normal", "normal", "normal", "normal", "normal", "normal", "normal" ]\nlayout2: [ "normal", "normal", "large", "promo", "normal", "normal", "normal", "normal", "normal" ]\nlayout3: "normal"\n---\n\n<div class="hero">\n  <div class="hero-img-wrap">\n    <img src="img/cyber-shot-hero.jpg" alt="">\n  </div>\n  <div class="ghost-center-wrap hero-text-wrap">\n    <div class="hero-text ghost-center">\n      <hgroup class="container">\n        <p class="primary-tout-subtitle l3 hidden-phone">Cameras</p>\n        <h2 class="primary-tout-title">Cyber-shot<sup><small>&reg;</small></sup></h2>\n      </hgroup>\n    </div>\n  </div>\n</div>\n\n<div class="tab-strip gallery-tabs">\n\n  <div class="tab-nav-wrap container">\n    <nav class="tab-nav-btns">\n      <div class="tab-nav tab-nav-prev"></div>\n      <div class="tab-nav tab-nav-next"></div>\n    </nav>\n  </div>\n\n  <div class="tabs-container container">\n    <div class="tabs">\n      ');
      
        _ref = this.data.tabs;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          tab = _ref[i];
          __out.push('<div class="tab ghost-center-wrap');
          if (i === 0) {
            __out.push(' active');
          }
          __out.push('" data-target="');
          __out.push(tab.slug);
          __out.push('" data-toggle="tab" data-hash="true">\n        <div class="ghost-center">\n          <div class="holder-for-icon"><i class="icon-tab-');
          __out.push(tab.icon);
          __out.push('"></i></div>\n          <div class="l3 tab-label">');
          __out.push(tab.label);
          __out.push('</div>\n        </div>\n      </div>');
        }
      
        __out.push('\n    </div>\n  </div>\n\n</div>\n\n<div class="tab-content">\n\n  <div class="tab-pane fade active in" data-tab="');
      
        __out.push(this.data.tabs[0].slug);
      
        __out.push('">\n\n    ');
      
        i = 0;
      
        __out.push('\n\n    <section class="container fade gallery" data-mode="');
      
        __out.push(this.data.featured.mode);
      
        __out.push('">\n      <h6>');
      
        __out.push(this.data.featured.title);
      
        __out.push('</h6>\n      <div class="products grid full-bleed">\n          ');
      
        _ref1 = this.data.submodules;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          module = _ref1[_j];
          __out.push('\n            ');
          d = this["this"].data(module.data);
          __out.push('\n            ');
          if (d.featured && d.type === "product") {
            __out.push('\n              ');
            d.layout = this.document[this.data.featured.layout][i++];
            __out.push('\n              ');
            d.view = "basic";
            __out.push('\n              ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n            ');
          }
          __out.push('\n          ');
        }
      
        __out.push('\n      </div>\n\n      <div class="see-all">\n        <a class="btn btn-wide" href="#">');
      
        __out.push(this.data.featured.callout);
      
        __out.push('</a>\n      </div>\n    </section>\n\n    ');
      
        i = 0;
      
        __out.push('\n\n    <section class="container fade gallery" data-mode="');
      
        __out.push(this.data.featured2.mode);
      
        __out.push('">\n      <h6>');
      
        __out.push(this.data.featured2.title);
      
        __out.push('</h6>\n      <div class="products grid full-bleed">\n          ');
      
        _ref2 = this.data.submodules;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          module = _ref2[_k];
          __out.push('\n            ');
          d = this["this"].data(module.data);
          __out.push('\n            ');
          if (d.featured && d.type === "accessory") {
            __out.push('\n              ');
            d.layout = this.document[this.data.featured2.layout][i++];
            __out.push('\n              ');
            d.view = "basic";
            __out.push('\n              ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n            ');
          }
          __out.push('\n          ');
        }
      
        __out.push('\n      </div>\n\n      <div class="see-all">\n        <a class="btn btn-wide" href="#">');
      
        __out.push(this.data.featured2.callout);
      
        __out.push('</a>\n      </div>\n    </section>\n\n  </div>\n\n  <div class="tab-pane fade" data-tab="');
      
        __out.push(this.data.tabs[1].slug);
      
        __out.push('">\n    <section class="gallery" id="');
      
        __out.push(this.data.productCards.name);
      
        __out.push('-gallery" data-mode="');
      
        __out.push(this.data.productCards.mode);
      
        __out.push('">\n      ');
      
        if (this.data.productCards.filterSet) {
          __out.push('\n\n      <div class="container filter-display-bar slide-toggle-parent">\n        ');
          if (this.data.productCards.sortSet) {
            __out.push('\n        <div class="sort-options pull-right">\n          <span class="l4">Sort By:&nbsp;</span>\n          <div class="dropdown dropdown-alt ib hidden-phone">\n            <button class="btn btn-small dropdown-toggle dropdown-toggle-alt" data-toggle="dropdown">\n              <span class="js-toggle-text">');
            __out.push(this.data.productCards.sortSet[0].label);
            __out.push('</span> <i class="icon-ui-arrowheads-up-down-gray"></i>\n            </button>\n            <ul class="dropdown-menu dropdown-menu-alt pull-right" role="menu">\n            ');
            _ref3 = this.data.productCards.sortSet;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              sort = _ref3[_l];
              __out.push('\n              <li><a data-value="');
              __out.push(sort.name);
              __out.push('" data-reverse="');
              __out.push(sort.reverse);
              __out.push('" tabindex="-1" href="#">');
              __out.push(sort.label);
              __out.push('</a></li>\n            ');
            }
            __out.push('\n            </ul>\n          </div>\n\n          <select class="native-dropdown visible-phone">\n            ');
            _ref4 = this.data.productCards.sortSet;
            for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
              sort = _ref4[_m];
              __out.push('\n            <option value="');
              __out.push(sort.name);
              __out.push('" data-reverse="');
              __out.push(sort.reverse);
              __out.push('">');
              __out.push(sort.label);
              __out.push('</option>\n            ');
            }
            __out.push('\n          </select>\n        </div>\n        ');
          }
          __out.push('\n\n        <p class="ib product-count-wrap"><span class="text-dark product-count">');
          __out.push(this.data.productCards.total);
          __out.push('</span> Products</p>\n        <button class="btn btn-alt-special slide-toggle collapsed" data-toggle="collapse" data-target="#');
          __out.push(this.data.productCards.name);
          __out.push('-filters">Filter</button>\n        <button class="btn btn-alt-special btn-alt-plus js-compare-toggle" data-target="#compare-tool">Compare</button>\n      </div>\n\n      <div class="container slide-arrow-under fade">\n        <div class="relative">\n          <div class="slide-toggle-arrow"></div>\n        </div>\n      </div>\n      <div class="container slide-arrow-over fade">\n        <div class="relative">\n          <div class="slide-toggle-arrow"></div>\n        </div>\n      </div>\n\n      <div class="collapse slide-toggle-target" id="');
          __out.push(this.data.productCards.name);
          __out.push('-filters">\n        <div class="filter-options container">\n          <div class="grid full-bleed">\n            <div class="span8 regular-filters">\n            ');
          _ref5 = this.data.productCards.filterSet;
          for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
            filterSet = _ref5[_n];
            __out.push('\n\n              ');
            if (filterSet.type.color) {
              __out.push('\n              <div class="span6 filter-container">\n                <p class="l3">');
              __out.push(filterSet.label);
              __out.push('</p>\n                <ul class="unstyled color-swatches" data-filter="');
              __out.push(filterSet.name);
              __out.push('" data-filter-type="color">\n                  ');
              _ref6 = filterSet.filters;
              for (_o = 0, _len6 = _ref6.length; _o < _len6; _o++) {
                filter = _ref6[_o];
                __out.push('<li class="swatch-');
                __out.push(filter.value);
                __out.push('" data-label="');
                __out.push(filter.label);
                __out.push('" data-');
                __out.push(filterSet.name);
                __out.push('="');
                __out.push(filter.value);
                __out.push('"></li>');
              }
              __out.push('\n                </ul>\n              </div>\n\n              ');
            } else if (filterSet.type.range) {
              __out.push('\n              <div class="span6 filter-container">\n                <p class="l3">');
              __out.push(filterSet.label);
              __out.push('</p>\n                <div class="range-output-container">\n                  <div class="range-output-min"></div>\n                  <div class="range-output-max"></div>\n                </div>\n                <div class="range-control-wrap">\n                  <div class="range-control" data-label="');
              __out.push(filterSet.label);
              __out.push('" data-filter="');
              __out.push(filterSet.name);
              __out.push('" data-filter-type="range" data-min="');
              __out.push(filterSet.min);
              __out.push('" data-max="');
              __out.push(filterSet.max);
              __out.push('"></div>\n                </div>\n              </div>\n\n              ');
            } else if (filterSet.type.button) {
              __out.push('\n              <div class="span6 filter-container">\n                <p class="l3">');
              __out.push(filterSet.label);
              __out.push('</p>\n                <ul class="unstyled btn-group" data-filter="');
              __out.push(filterSet.name);
              __out.push('" data-filter-type="button">\n                  ');
              _ref7 = filterSet.filters;
              for (_p = 0, _len7 = _ref7.length; _p < _len7; _p++) {
                filter = _ref7[_p];
                __out.push('<li class="btn btn-square" data-label="');
                __out.push(filter.label);
                __out.push('" data-');
                __out.push(filterSet.name);
                __out.push('="');
                __out.push(filter.value);
                __out.push('">');
                __out.push(filter.label);
                __out.push('</li>');
              }
              __out.push('\n                </ul>\n              </div>\n\n              ');
            } else if (filterSet.type.checkbox) {
              __out.push('\n              <div class="span6 filter-container">\n                <p class="l3">');
              __out.push(filterSet.label);
              __out.push('</p>\n                <ul class="unstyled" data-filter="');
              __out.push(filterSet.name);
              __out.push('" data-filter-type="checkbox">\n                  ');
              _ref8 = filterSet.filters;
              for (_q = 0, _len8 = _ref8.length; _q < _len8; _q++) {
                filter = _ref8[_q];
                __out.push('\n                  <li class="control-inline">\n                    <input class="styled-checkbox" id="');
                __out.push(filterSet.name);
                __out.push('-');
                __out.push(filter.value);
                __out.push('" data-label="');
                __out.push(filter.label);
                __out.push('" type="checkbox" value="');
                __out.push(filter.value);
                __out.push('">\n                    <label for="');
                __out.push(filterSet.name);
                __out.push('-');
                __out.push(filter.value);
                __out.push('">');
                __out.push(filter.label);
                __out.push('</label>\n                  </li>\n                  ');
              }
              __out.push('\n                </ul>\n              </div>\n              ');
            }
            __out.push('\n            ');
          }
          __out.push('\n            </div>\n\n            ');
          _ref9 = this.data.productCards.filterSet;
          for (_r = 0, _len9 = _ref9.length; _r < _len9; _r++) {
            filterSet = _ref9[_r];
            __out.push('\n            ');
            if (filterSet.type.group) {
              __out.push('\n            <div class="span4 best-for filter-container">\n              <p class="l3">');
              __out.push(filterSet.label);
              __out.push('</p>\n              <ul class="media-list" data-filter="');
              __out.push(filterSet.name);
              __out.push('" data-filter-type="group">\n                ');
              _ref10 = filterSet.filters;
              for (_s = 0, _len10 = _ref10.length; _s < _len10; _s++) {
                filter = _ref10[_s];
                __out.push('\n                <li class="media clearfix" data-label="');
                __out.push(filter.label);
                __out.push('" data-');
                __out.push(filterSet.name);
                __out.push('="');
                __out.push(filter.value);
                __out.push('">\n                  <div class="pull-left">\n                    <button class="btn btn-square media-object"><i class="icon-bestfor-');
                __out.push(filter.icon);
                __out.push('"></i></button>\n                  </div>\n                  <div class="media-body">\n                    <p class="media-heading p3 text-dark">');
                __out.push(filter.label);
                __out.push('</p>\n                    <p class="p3">');
                __out.push(filter.description);
                __out.push('</p>\n                  </div>\n                </li>\n                ');
              }
              __out.push('\n              </ul>\n            </div>\n            ');
            }
            __out.push('\n            ');
          }
          __out.push('\n\n          </div>\n        </div>\n      </div>\n      ');
        }
      
        __out.push('\n\n\n      <div class="container active-filters"></div>\n\n      <div class="container">\n        <div class="products grid full-bleed">\n          ');
      
        _ref11 = this.data.submodules;
        for (_t = 0, _len11 = _ref11.length; _t < _len11; _t++) {
          module = _ref11[_t];
          __out.push('\n            ');
          d = this["this"].data(module.data);
          __out.push('\n            ');
          if (d.type === "product" && !d.promo) {
            __out.push('\n              ');
            d.layout = null;
            __out.push('\n              ');
            d.view = "detailed";
            __out.push('\n              ');
            __out.push(this["this"].partial('modules/' + module.type, {
              "this": this["this"],
              data: d
            }));
            __out.push('\n            ');
          }
          __out.push('\n          ');
        }
      
        __out.push('\n        </div>\n      </div>\n\n      <div class="comparables hidden">\n        <div class="compare-name">');
      
        __out.push(this.data.productCards.galleryName);
      
        __out.push('</div>\n      ');
      
        _ref12 = this.data.productCards.comparable;
        for (_u = 0, _len12 = _ref12.length; _u < _len12; _u++) {
          detail = _ref12[_u];
          __out.push('\n        <div class="l3 detail-label detail" data-slug="');
          __out.push(detail.slug);
          __out.push('" data-label="');
          __out.push(detail.label);
          __out.push('"></div>\n      ');
        }
      
        __out.push('\n      </div>\n\n      ');
      
        if (this.data.productCards.nextLink) {
          __out.push('\n      <div class="navigation invisible">\n        <a href="');
          __out.push(this.data.productCards.nextLink);
          __out.push('">Camera Overflow</a>\n      </div>\n      <div class="infscr-holder text-center"></div>\n      ');
        }
      
        __out.push('\n    </section>\n  </div>\n\n  <div class="tab-pane fade" data-tab="');
      
        __out.push(this.data.tabs[2].slug);
      
        __out.push('">\n    <section>\n      <div class="slide-toggle-parent container">\n        <button class="btn btn-alt-special slide-toggle collapsed" data-toggle="collapse" data-target="#IDGOESHERE">Accessory Finder</button>\n      </div>\n\n      <div class="container slide-arrow-under fade">\n        <div class="relative">\n          <div class="slide-toggle-arrow"></div>\n        </div>\n      </div>\n      <div class="container slide-arrow-over fade">\n        <div class="relative">\n          <div class="slide-toggle-arrow"></div>\n        </div>\n      </div>\n\n      <div class="collapse slide-toggle-target" id="IDGOESHERE">\n        <div class="container">\n          <h1>Collapse</h1>\n          <h2>Collapse</h2>\n          <h3>Collapse</h3>\n          <h4>Collapse</h4>\n          <h5>Collapse</h5>\n          <h6>Collapse</h6>\n        </div>\n      </div>\n\n      <div class="grid5 container">\n\n        ');
      
        _ref13 = this.data.accessories;
        for (_v = 0, _len13 = _ref13.length; _v < _len13; _v++) {
          accessory = _ref13[_v];
          __out.push('\n        <div class="product-strip-wrap">\n          <a class="tl pull-right" href="#">');
          __out.push(accessory.callout);
          __out.push('</a>\n          <h6 class="product-strip-heading">');
          __out.push(accessory.title);
          __out.push('</h6>\n          <div class="product-strip grid full-bleed">\n            ');
          count = 0;
          __out.push('\n            ');
          _ref14 = this.data.submodules;
          for (_w = 0, _len14 = _ref14.length; _w < _len14; _w++) {
            module = _ref14[_w];
            __out.push('\n              ');
            d = this["this"].data(module.data);
            __out.push('\n              ');
            if (d.type === "accessory" && d.subtype === accessory.subtype && count < 5) {
              __out.push('\n                ');
              d.layout = this.document.layout3;
              __out.push('\n                ');
              d.view = "basic";
              __out.push('\n                ');
              __out.push(this["this"].partial('modules/' + module.type, {
                "this": this["this"],
                data: d
              }));
              __out.push('\n                ');
              count += 1;
              __out.push('\n              ');
            }
            __out.push('\n            ');
          }
          __out.push('\n          </div>\n        </div>\n        ');
        }
      
        __out.push('\n      </div>\n    </section>\n  </div>\n\n  ');
      
        if (this.data.tabs[3]) {
          __out.push('\n  <div class="tab-pane fade" data-tab="');
          __out.push(this.data.tabs[3].slug);
          __out.push('">\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n  ');
        }
      
        __out.push('\n\n  ');
      
        if (this.data.tabs[4]) {
          __out.push('\n  <div class="tab-pane fade" data-tab="');
          __out.push(this.data.tabs[4].slug);
          __out.push('">\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n  ');
        }
      
        __out.push('\n\n  ');
      
        if (this.data.tabs[5]) {
          __out.push('\n  <div class="tab-pane fade" data-tab="');
          __out.push(this.data.tabs[5].slug);
          __out.push('">\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n  ');
        }
      
        __out.push('\n\n  ');
      
        if (this.data.tabs[6]) {
          __out.push('\n  <div class="tab-pane fade" data-tab="');
          __out.push(this.data.tabs[6].slug);
          __out.push('">\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n  ');
        }
      
        __out.push('\n\n  ');
      
        if (this.data.tabs[7]) {
          __out.push('\n  <div class="tab-pane fade" data-tab="');
          __out.push(this.data.tabs[7].slug);
          __out.push('">\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n  ');
        }
      
        __out.push('\n\n  ');
      
        if (this.data.tabs[8]) {
          __out.push('\n  <div class="tab-pane fade" data-tab="');
          __out.push(this.data.tabs[8].slug);
          __out.push('">\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\n    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\n    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\n    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\n    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n  ');
        }
      
        __out.push('\n\n</div>\n\n<div id="compare-tool" class="modal takeover hide fade" tabindex="-1" role="dialog" aria-labelledby="compare-tool-label" aria-hidden="true">\n  <div class="modal-header container" data-reset-label="Reset">\n    <h3 class="pull-left" id="compare-tool-label">Compare</h3>\n    <button class="box-close" data-dismiss="modal" aria-hidden="true"><i class="icon-ui-x-tiny"></i></button>\n  </div>\n  <div class="modal-body"></div>\n</div>\n\n\n\n<div style="padding-bottom:100px"></div>\n\n<!-- include your module js here -->\n<script src="js/libs/jquery.throttle-debounce.min.js"></script>\n<script src="js/libs/jquery.infinitescroll.js"></script>\n<script src="js/libs/bootstrap-transition.js"></script>\n<script src="js/libs/bootstrap-button.js"></script>\n<script src="js/libs/bootstrap-dropdown.js"></script>\n<script src="js/libs/bootstrap-collapse.js"></script>\n<script src="js/libs/bootstrap-modal.js"></script>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
