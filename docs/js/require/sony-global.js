// Sony Global Class
// -----------------
//
// * **Class:** SONY.Global

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      enquire = require('enquire'),
      Router = require('require/sony-global-router'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment');

  var self = {

    init: function(config) {

      if ( !Settings.isLTIE10 ){
        window.enquire.listen(100);
      }

      Router.init();

      Environment.trigger('global:ready');

      log('SONY : Global : Initialized');
    }

  };

  self.init();

  return self;

});