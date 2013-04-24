define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap');

  var module = {
    init: function() {
      $('.launch-modal').on('click', function(){
        $('#light-compare-modal').modal();
      });
      this.tabhide();
    },

    // temp tab behavior, remove this after integrating tabs
    tabhide: function(){
      var $modal = $('.light-compare-modal');
      $('.tab').hide().first().show();
    }

  };

  return module;

});
