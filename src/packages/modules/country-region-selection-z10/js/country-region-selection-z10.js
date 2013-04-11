/*global define, Modernizr, log*/

// -------- Sony Country Region Selection -------
// Module: Country Region Selection
// Version: 1.0
// Author: Chris Pickett
// Date: 04/10/13
// Dependencies: jQuery 1.7+, sony-iscroll
// --------------------------------------

define(function(require){

  'use strict';

  var $ = require('jquery'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment'),
      sonyIScroll = require('plugins/sony-iscroll'),
      enquire = require('enquire');

  var CountryRegionSelection = {
    init: function() {
      $('.scrollable').attr('id', 'scrollable');
      var scroll = new IScrol('scrollable', {
        onScrollMove: logEvent
      });
    }
  };

  return CountryRegionSelection;
});
