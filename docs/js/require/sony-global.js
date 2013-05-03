
// Sony Global Class
// -----------------
//
// * **Class:** SONY.Global

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      enquire = require('enquire'),
      router = require('require/sony-global-router'),
      settings = require('require/sony-global-settings'),
      environment = require('require/sony-global-environment');

  var self = {

    'init': function(config) {

      if ( !settings.$html.hasClass('lt-ie10') ){
        window.enquire.listen(100);
      }

      router.init();

      environment.trigger('global:ready');

      log('SONY : Global : Initialized');
    }

  };

  // Because iQ is super-global, we need to leave this in the global area.
  // We should refactor iQ to be more modular / event-driven.

  window.iQ = {
    options: {
      speedTestExpireMinutes: 30,
      asyncDistance: 600, // needs to be at least 600 for the nav images to load, since they're off the top of the viewport when iQ loads.
      throttleSpeed: 300,
      updateOnResize: true,
      speedTestUri: 'img/speedtest.jpg'
    }
  };

  self.init();

  return self;

});