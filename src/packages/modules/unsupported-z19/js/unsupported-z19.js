define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap');

  var module = {
    init: function() {
      $('.launch-modal').on('click', function(){
        $('#unsupported-browser-modal').modal();
      });
    }
  };

  return module;

});
