define(function(require){

  'use strict';

  var $ = require('jquery');

  var module = {
    init: function () {
      $('.search-more').on('click', function () {
        $('.results-list').children().clone().appendTo($('.results-list'));
      });
    }
  };

  return module;
});
