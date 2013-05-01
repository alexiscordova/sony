
requirejs.config({

  baseUrl: 'js',

  paths: {

    // libraries
    bootstrap: 'libs/bootstrap',
    modernizr: 'libs/modernizr',
    enquire: 'libs/enquire',
    iQ: 'libs/iq',
    jquery: 'libs/jquery'
  },

  shim: {

    enquire: {
      deps: ['jquery'],
      exports: 'enquire'
    },

    bootstrap: {
      deps: ['jquery']
    },

    modernizr: {
      exports: 'Modernizr'
    }
  },

  // IE8 and 7 sometimes time out when set to 30sec
  waitSeconds: 45

});

define(function(require){

  var bootstrap = require('bootstrap'),
      jquery = require('jquery'),
      modernizr = require('modernizr'),
      enquire = require('enquire'),
      iQ = require('iQ');
});

