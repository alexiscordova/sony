// Light Compare Module.
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 05/05/2013
// * **Author:** Mark Ernst
// * **Dependencies:** jQuery 1.7+, Bootstrap

define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      sonyStickyTabs = require('secondary/index').sonyStickyTabs;

  var module = {
    'init': function() {
      $('.launch-modal').on('click', function(){
        $('#light-compare-modal').modal();
      });

      log('SONY : LightCompare : Initialized');
    }
  };

  return module;
});
