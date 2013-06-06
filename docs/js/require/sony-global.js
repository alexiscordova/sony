
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

  self.init();

  return self;

});