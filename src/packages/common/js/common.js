
requirejs.config({

  baseUrl: 'js',

  paths: {

    // libraries
    bootstrap: 'libs/bootstrap',
    modernizr: 'libs/modernizr',
    enquire: 'libs/enquire',
    iQ: 'libs/iq',
    jquery: 'libs/jquery',
    soundManager: 'libs/soundmanager',
    jasmine: 'libs/jasmine',
    'jasmine-html': 'libs/jasmine-html'
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
    },

    soundManager: {
      exports: 'soundManager'
    },

    jasmine: {
      exports: 'jasmine'
    },

    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
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
      soundManager = require('soundManager'),
      iQ = require('iQ');
});

