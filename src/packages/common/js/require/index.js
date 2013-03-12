
define(function (require) {

  'use strict';

  var Global = require('require/sony-global'),
      Utilities = require('require/sony-global-utilities'),
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings');

  Environment.init();
  Global.init();

  return {
    Utilities: Utilities,
    Settings: Settings
  };
});