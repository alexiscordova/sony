define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      sonyStickyTabs = require('secondary/index').sonyStickyTabs;

  var module = {
    init: function() {
      $('.launch-modal').on('click', function(){
        $('#light-compare-modal').modal();
      });
    }
  };

  return module;
});
