(function() {
  this.ecoTemplates || (this.ecoTemplates = {});
  this.ecoTemplates["module_details.html"] = function(__obj) {
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
        var i, infos, productDetails, _i, _j, _len, _len1, _ref, _ref1;
      
        __out.push('<div class="container">\n\t');
      
        if (this.data.productDetails.length) {
          __out.push('\n\t');
          _ref = this.data.productDetails;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            productDetails = _ref[_i];
            __out.push('\n\t\t<div class="clearfix fixed-header">\n\t\t\t<div class="spec-title">\n\t\t\t\t<p class="title-link"><a href="#">');
            __out.push(__sanitize(productDetails.productName));
            __out.push('</a></p>\n\t\t\t\t\n\t\t\t\t');
            if (productDetails.productName) {
              __out.push('\n\t\t\t\t<h1>');
              __out.push(__sanitize(productDetails.productName));
              __out.push(' Details</h1>\n\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\n\t\t\t\t<div class="clearfix">\n\t\t\t\t\t<p><a href="spec_module.html">Specifications</a></p>\n\t\t\t\t\t<p><a class="active" href="#">Features</a></p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t\n\t\t<section class="details">\n\t\t\t<div class="grid full-bleed">\n\t\t\t\t\n\t\t\t\t');
            if (productDetails.infos) {
              __out.push('\n\t\t\t\t<div class="span4">\n\t\t\t\t\t<h2>What\'s in the Box</h2>\n\t\t\t\t\t\n\t\t\t\t\t<ul>\n\t\t\t\t\t');
              _ref1 = productDetails.infos;
              for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
                infos = _ref1[i];
                __out.push('\n\t\t\t\t\t\t<li>');
                __out.push(productDetails.infos[i]);
                __out.push('</li>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t');
            }
            __out.push('\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<h2>Size and Weight</h2>\n\t\t\t\t<table>\n\t\t\t\t\t');
            if (productDetails.dimension) {
              __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Dimension:</h3></th>\n\t\t\t\t\t\t<td><p>');
              __out.push(productDetails.dimension);
              __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
            if (productDetails.weight) {
              __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Weight:</h3></th>\n\t\t\t\t\t\t<td><p>');
              __out.push(productDetails.weight);
              __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
            }
            __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t\n\t\t');
            if (productDetails.lens) {
              __out.push('\n\t\t<h2>Optics/Lens</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t\n\t\t\t');
              if (productDetails.lens.rows1) {
                __out.push('\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
                if (productDetails.lens.rows1.lensType) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Lens Type:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.lensType);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.lensMountType) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Lens Mount Type:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.lensMountType);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.aperture) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Aperture:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.aperture);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.apertureMax) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Aperture (Max.):</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.apertureMax);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.apertureMin) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Aperture (Min.):</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.apertureMin);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.focalLength) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Focal Length:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.focalLength);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.shotMode) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Steady Shot Mode:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.shotMode);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.opticalZoom) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Optical Zoom:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.opticalZoom);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows1.digitalZoom) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Digital Zoom:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows1.digitalZoom);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t');
              }
              __out.push('\n\t\t\t\n\t\t\t');
              if (productDetails.lens.rows2) {
                __out.push('\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
                if (productDetails.lens.rows2.focalLength) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Focal Length:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.focalLength);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.filterDiameter) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Filter Diameter:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.filterDiameter);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.lensGroup) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Lens Groups- Elements:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.lensGroup);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.minimumFocus) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Minimum Focus Distance:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.minimumFocus);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.angleOfView) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Angle of View:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.angleOfView);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.lensConstruction) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Lens Construction:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.lensConstruction);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.apertureBlade) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Aperture Blade:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.apertureBlade);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows2.clearImageZoom) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Clear Image Zoom: </h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows2.clearImageZoom);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t');
              }
              __out.push('\n\t\t\t\n\t\t\t');
              if (productDetails.lens.rows3) {
                __out.push('\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
                if (productDetails.lens.rows3.focalDistance) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Focal Distance:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.focalDistance);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows3.asphericElements) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Aspheric Elements:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.asphericElements);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows3.distanceEncoder) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Distance Encoder:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.distanceEncoder);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows3.exteriorFinish) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Exterior Finish:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.exteriorFinish);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows3.internalMotor) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Internal Motor:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.internalMotor);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows3.maximumMagnification) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Maximum Magnification:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.maximumMagnification);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t\t');
                if (productDetails.lens.rows3.steadyShotMode) {
                  __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Steady Shot Mode:</h3></th>\n\t\t\t\t\t\t<td><p>');
                  __out.push(productDetails.lens.rows3.steadyShotMode);
                  __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
                }
                __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t');
              }
              __out.push('\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.exposure) {
              __out.push('\n\t\t<h2>Exposure System</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.exposure.meteringModes) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Metering Modes:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.meteringModes);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.exposure.exposureCompensation) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>exposure Compensation:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.exposureCompensation);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.exposure.sceneMode) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Scene mode:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.sceneMode);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.exposure.rangeOptimizer) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>D-Range Optimizer:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.rangeOptimizer);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.exposure.creativeStyle) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Creative Style:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.creativeStyle);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.exposure.whiteBalanceMode) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>White Balance Mode:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.whiteBalanceMode);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.exposure.isoSensitivity) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>ISO Sensitivity (Movie):</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.isoSensitivity);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.exposure.pictureEffect) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Picture Effect:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.exposure.pictureEffect);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\n\t\t');
            if (productDetails.sensor) {
              __out.push('\n\t\t<h2>Imaging Sensor</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.sensor.imagingSensor) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Imaging Sensor:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.sensor.imagingSensor);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.sensor.pixelGross) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Pixel Gross:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.sensor.pixelGross);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.sensor.creativeStyle) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Picture Resolution:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.sensor.pictureResolution);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t\n\t\t');
            if (productDetails.lcdDisplay) {
              __out.push('\n\t\t<h2>LCD Display</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.lcdDisplay.type) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>LCD Type:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.lcdDisplay.type);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.lcdDisplay.brightness) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Brightness Control:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.lcdDisplay.brightness);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.driveSystem) {
              __out.push('\n\t\t<h2>Drive System</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.driveSystem.shutterType) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Shutter Type:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.driveSystem.shutterType);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.driveSystem.shootingSpeed) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Shooting Speed:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.driveSystem.shootingSpeed);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.driveSystem.selfTimer) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Self-timer:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.driveSystem.selfTimer);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.advancedFeatures) {
              __out.push('\n\t\t<h2>Advanced Features</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span3">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.advancedFeatures.sweepPanorama) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Sweep Panorama:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.advancedFeatures.sweepPanorama);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.advancedFeatures.faceDetection) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Face Detection:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.advancedFeatures.faceDetection);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.advancedFeatures.imageStabilization) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Image Stabilization:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.advancedFeatures.imageStabilization);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span3">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.advancedFeatures.intelligentAuto) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Intelligent Auto:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.advancedFeatures.intelligentAuto);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.advancedFeatures.superiorAuto) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Superior Auto:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.advancedFeatures.superiorAuto);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.advancedFeatures.PhotoCreativity) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Photo Creativity:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.advancedFeatures.PhotoCreativity);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.Recording) {
              __out.push('\n\t\t<h2>Recording</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.Recording.mediaType) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Media Type:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.mediaType);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.Recording.imageMode) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Still Image Mode:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.imageMode);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.Recording.imageSize169) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Still Image Size 16:9:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.imageSize169);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.Recording.imageSize32) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Still Image Size 3:2:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.imageSize32);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.Recording.imageSize43) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Still Image Size 4:3:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.imageSize43);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.Recording.videoFormat) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Video Format:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.videoFormat);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.Recording.panoramaImageSize) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Panorama Image Size:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.panoramaImageSize);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.Recording.videoMode) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Video Mode:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.videoMode);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.Recording.photoCapture) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Photo Capture (Movie):</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.Recording.photoCapture);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.focusControl) {
              __out.push('\n\t\t<h2>Focus Control</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.focusControl.focusSystem) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Focus System:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.focusControl.focusSystem);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.focusControl.afModes) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>AF Modes:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.focusControl.afModes);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.power) {
              __out.push('\n\t\t<h2>Power</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.power.batteryType) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Battery Type:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.power.batteryType);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails.power.powerConsumption) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Power Consumption:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.power.powerConsumption);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails["interface"]) {
              __out.push('\n\t\t<h2>Interface</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails["interface"].memoryCardSlot) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Memory Card Slot:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails["interface"].memoryCardSlot);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t\t\n\t\t\t\t\t');
              if (productDetails["interface"].hdOutput) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>HD Output:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails["interface"].hdOutput);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails["interface"].usbPorts) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>USB Port(s):</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails["interface"].usbPorts);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.convenienceFeatures) {
              __out.push('\n\t\t<h2>Convenience Features</h2>\n\t\t<div class="grid full-bleed">\n\t\t\t<div class="span4">\n\t\t\t\t<table>\n\t\t\t\t\t');
              if (productDetails.convenienceFeatures.imagePlayback) {
                __out.push('\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<th><h3>Still Image Playback:</h3></th>\n\t\t\t\t\t\t<td><p>');
                __out.push(productDetails.convenienceFeatures.imagePlayback);
                __out.push('</p></td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t');
              }
              __out.push('\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t\t');
            if (productDetails.features) {
              __out.push('\n\t\t<h2 class="h2-bigger">Features</h2>\n\t\t\n\t\t<div class="grid full-bleed no-border">\n\t\t\t<div class="span4">\n\t\t\t\t');
              if (productDetails.features.a) {
                __out.push('\n\t\t\t\t<h3>');
                __out.push(productDetails.features.a.title);
                __out.push('</h3>\n\t\t\t\t<p>');
                __out.push(productDetails.features.a.description);
                __out.push('</p>\n\t\t\t\t');
              }
              __out.push('\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t');
              if (productDetails.features.b) {
                __out.push('\n\t\t\t\t<h3>');
                __out.push(productDetails.features.b.title);
                __out.push('</h3>\n\t\t\t\t<p>');
                __out.push(productDetails.features.b.description);
                __out.push('</p>\n\t\t\t\t');
              }
              __out.push('\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t');
              if (productDetails.features.c) {
                __out.push('\n\t\t\t\t<h3>');
                __out.push(productDetails.features.c.title);
                __out.push('</h3>\n\t\t\t\t<p>');
                __out.push(productDetails.features.c.description);
                __out.push('</p>\n\t\t\t\t');
              }
              __out.push('\n\t\t\t</div>\n\t\t</div>\n\t\t\n\t\t<div class="grid full-bleed no-border">\n\t\t\t<div class="span4">\n\t\t\t\t');
              if (productDetails.features.d) {
                __out.push('\n\t\t\t\t<h3>');
                __out.push(productDetails.features.d.title);
                __out.push('</h3>\n\t\t\t\t<p>');
                __out.push(productDetails.features.d.description);
                __out.push('</p>\n\t\t\t\t');
              }
              __out.push('\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t');
              if (productDetails.features.e) {
                __out.push('\n\t\t\t\t<h3>');
                __out.push(productDetails.features.e.title);
                __out.push('</h3>\n\t\t\t\t<p>');
                __out.push(productDetails.features.e.description);
                __out.push('</p>\n\t\t\t\t');
              }
              __out.push('\n\t\t\t</div>\n\t\t\t\n\t\t\t<div class="span4">\n\t\t\t\t');
              if (productDetails.features.f) {
                __out.push('\n\t\t\t\t<h3>');
                __out.push(productDetails.features.f.title);
                __out.push('</h3>\n\t\t\t\t<p>');
                __out.push(productDetails.features.f.description);
                __out.push('</p>\n\t\t\t\t');
              }
              __out.push('\n\t\t\t</div>\n\t\t</div>\n\t\t');
            }
            __out.push('\n\t\t\n\t</section>\n\t');
          }
          __out.push('\n</div>');
        }
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
