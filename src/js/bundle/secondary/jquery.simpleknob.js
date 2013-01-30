
// jQuery SimpleKnob
// -----------------
//
// * **Class:** SimpleKnob
// * **Version:** 0.1
// * **Modified by:** George Pantazis
// * **Modified:** 01/30/2013
// * **Dependencies:** Tested with jQuery 1.9
//
// *Notes:*
// This is a simplified version of jQuery Knob, by Anthony Terrien.
// Licensing and other notes on the original source, located
// [here](https://raw.github.com/aterrien/jQuery-Knob/master/js/jquery.knob.js).
//
// This version minifes to about 5KB, a 40% savings over the original version,
// mostly from removing touch interactions / bindings and other options.
// Refer to the options block below for available configurations.

(function ($) {

  "use strict";

  var k = {},
    max = Math.max,
    min = Math.min;

  k.c = {};
  k.c.d = $(document);

  k.o = function () {
    var s = this;

    this.o = null; // array of options
    this.$ = null; // jQuery wrapped element
    this.i = null; // mixed HTMLInputElement or array of HTMLInputElement
    this.g = null; // 2D graphics context for 'pre-rendering'
    this.v = null; // value ; mixed array or integer
    this.cv = null; // change value ; not commited value
    this.x = 0; // canvas x position
    this.y = 0; // canvas y position
    this.$c = null; // jQuery canvas element
    this.c = null; // rendered canvas context
    this.isInit = false;
    this.fgColor = null; // main color
    this.dH = null; // draw hook
    this.cH = null; // change hook
    this.eH = null; // cancel hook
    this.rH = null; // release hook

    this.run = function () {
      var cf = function (e, conf) {
        var k;
        for (k in conf) {
          s.o[k] = conf[k];
        }
        s.init();
        s._configure()
          ._draw();
      };

      if (this.$.data('kontroled')) {
        return;
      }
      this.$.data('kontroled', true);

      this.extend();

      this.o = $.extend({

        // Available Options
        // -----------------

        min: this.$.data('min') || 0,
        max: this.$.data('max') || 100,
        stopper: true,
        readOnly: this.$.data('readonly'),
        thickness: this.$.data('thickness') || 0.4,
        lineCap: this.$.data('linecap') || 'butt',
        width: this.$.data('width') || 200,
        height: this.$.data('height') || 200,
        displayInput: this.$.data('displayinput') === null || this.$.data('displayinput'),
        fgColor: this.$.data('fgcolor') || '#87CEEB',
        inputColor: this.$.data('inputcolor') || this.$.data('fgcolor') || '#87CEEB',
        inline: false,

      }, this.o);

      this.i = this.$;
      this.v = this.$.val();
      (this.v === '') && (this.v = this.o.min);

      this.$.bind(
        'change', function () {
        s.val(s.$.val());
      });

      (!this.o.displayInput) && this.$.hide();

      this.$c = $('<canvas width="' + this.o.width + 'px" height="' + this.o.height + 'px"></canvas>');
      this.c = this.$c[0].getContext("2d");

      this.$.wrap($('<div style="' + (this.o.inline ? 'display:inline;' : '') +
        'width:' + this.o.width + 'px;height:' + this.o.height + 'px;"></div>'))
        .before(this.$c);

      if (this.v instanceof Object) {
        this.cv = {};
        this.copy(this.v, this.cv);
      } else {
        this.cv = this.v;
      }

      this.$.bind("configure", cf)
        .parent()
        .bind("configure", cf);

      this._configure()
        ._xy()
        .init();

      this.isInit = true;

      this._draw();

      return this;
    };

    this._draw = function () {
      var d = true,
        c = document.createElement('canvas');

      c.width = s.o.width;
      c.height = s.o.height;
      s.g = c.getContext('2d');
      s.clear();
      s.dH && (d = s.dH());

      (d !== false) && s.draw();

      s.c.drawImage(c, 0, 0);
      c = null;
    };

    this._xy = function () {
      var o = this.$c.offset();
      this.x = o.left;
      this.y = o.top;
      return this;
    };

    this._configure = function () {
      this.fgColor = this.o.fgColor;
      return this;
    };

    this._clear = function () {
      this.$c[0].width = this.$c[0].width;
    };

    // Abstract methods
    this.listen = function () {}; // on start, one time
    this.extend = function () {}; // each time configure triggered
    this.init = function () {}; // each time configure triggered
    this.change = function (v) {}; // on change
    this.val = function (v) {}; // on release
    this.xy2val = function (x, y) {}; //
    this.draw = function () {}; // on change / on release
    this.clear = function () {
      this._clear();
    };

    this.h2rgba = function (h, a) {
      var rgb;
      h = h.substring(1, 7);
      rgb = [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
      return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
    };

    this.copy = function (f, t) {
      for (var i in f) {
        t[i] = f[i];
      }
    };
  };

  k.Dial = function () {
    k.o.call(this);

    this.startAngle = null;
    this.xy = null;
    this.radius = null;
    this.lineWidth = null;
    this.w2 = null;
    this.PI2 = 2 * Math.PI;

    this.extend = function () {
      this.o = $.extend({
        bgColor: this.$.data('bgcolor') || '#EEEEEE',
        angleOffset: this.$.data('angleoffset') || 0,
        angleArc: this.$.data('anglearc') || 360,
        inline: true
      }, this.o);
    };

    this.val = function (v) {
      if (null !== v) {
        this.cv = this.o.stopper ? max(min(v, this.o.max), this.o.min) : v;
        this.v = this.cv;
        this.$.val(this.v);
        this._draw();
      } else {
        return this.v;
      }
    };

    this.xy2val = function (x, y) {
      var a, ret;

      a = Math.atan2(
      x - (this.x + this.w2), -(y - this.y - this.w2)) - this.angleOffset;

      if (this.angleArc != this.PI2 && (a < 0) && (a > -0.5)) {
        a = 0;
      } else if (a < 0) {
        a += this.PI2;
      }

      ret = ~~ (0.5 + (a * (this.o.max - this.o.min) / this.angleArc)) + this.o.min;

      this.o.stopper && (ret = max(min(ret, this.o.max), this.o.min));

      return ret;
    };

    this.init = function () {

      if ( this.v < this.o.min || this.v > this.o.max) {
        this.v = this.o.min;
      }

      this.$.val(this.v);
      this.w2 = this.o.width / 2;
      this.xy = this.w2;
      this.lineWidth = this.xy * this.o.thickness;
      this.lineCap = this.o.lineCap;
      this.radius = this.xy - this.lineWidth / 2;

      this.o.angleOffset && (this.o.angleOffset = isNaN(this.o.angleOffset) ? 0 : this.o.angleOffset);

      this.o.angleArc && (this.o.angleArc = isNaN(this.o.angleArc) ? this.PI2 : this.o.angleArc);

      this.angleOffset = this.o.angleOffset * Math.PI / 180;
      this.angleArc = this.o.angleArc * Math.PI / 180;

      this.startAngle = 1.5 * Math.PI + this.angleOffset;
      this.endAngle = 1.5 * Math.PI + this.angleOffset + this.angleArc;

      var s = max(
      String(Math.abs(this.o.max)).length, String(Math.abs(this.o.min)).length, 2) + 2;

      this.o.displayInput && this.i.css({
        'width': ((this.o.width / 2 + 4) >> 0) + 'px',
        'height': ((this.o.width / 3) >> 0) + 'px',
        'position': 'absolute',
        'vertical-align': 'middle',
        'margin-top': ((this.o.width / 3) >> 0) + 'px',
        'margin-left': '-' + ((this.o.width * 3 / 4 + 2) >> 0) + 'px',
        'border': 0,
        'background': 'none',
        'font': 'bold ' + ((this.o.width / s) >> 0) + 'px Arial',
        'text-align': 'center',
        'color': this.o.inputColor || this.o.fgColor,
        'padding': '0px',
        '-webkit-appearance': 'none'
      }) || this.i.css({
        'width': '0px',
        'visibility': 'hidden'
      });
    };

    this.change = function (v) {
      this.cv = v;
      this.$.val(v);
    };

    this.angle = function (v) {
      return (v - this.o.min) * this.angleArc / (this.o.max - this.o.min);
    };

    this.draw = function () {

      var c = this.g,
        a = this.angle(this.cv),
        sat = this.startAngle,
        eat = sat + a,
        sa, ea,
        r = 1;

      c.lineWidth = this.lineWidth;
      c.lineCap = this.lineCap;

      c.beginPath();
      c.strokeStyle = this.o.bgColor;
      c.arc(this.xy, this.xy, this.radius, this.endAngle, this.startAngle, true);
      c.stroke();
      c.beginPath();
      c.strokeStyle = r ? this.o.fgColor : this.fgColor;
      c.arc(this.xy, this.xy, this.radius, sat, eat, false);
      c.stroke();
    };

    this.cancel = function () {
      this.val(this.v);
    };
  };

  $.fn.simpleKnob = function (o) {
    return this.each(

    function () {
      var d = new k.Dial();
      d.o = o;
      d.$ = $(this);
      d.run();
    }).parent();
  };

})(jQuery);