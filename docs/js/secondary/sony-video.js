// Sony Video Module
// --------------------------------------------
//
// * **Class:** SonyVideo
// * **Version:** 1.0
// * **Modified:** 05/01/2013
// * **Author:** Tyler Madison
// * **Dependencies:** jQuery 1.7+, SONY (Environment|Settings)
//
// *Notes:*
//
// *Example Usage:*
//
//      SonyVideo.init();
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings');

  var SonyVideo = (function () {

    // Instance stores a reference to the Singleton
    var _instance = null;

    function init() {

      // private vars
      var _videoCollection     = [],
          _totalVideos         = 0,
          _currentPlayer       = null;

      // Private methods
      function _privateMethod(){}

      // Public methods and variables
      return {
        initVideos: function ( $el , options ) {

            

        }
      };
    }

    return {
      // Get the Singleton _instance if one exists
      getInstance: function () {
        if ( !_instance ) {
          _instance = init();
        }
        return _instance;
      }
    };

  })();

  return SonyVideo.getInstance();
});


