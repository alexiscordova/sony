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
      flowplayer = require('plugins/jquery.flowplayer'),
      Settings = require('require/sony-global-settings');

  var SonyVideo = (function () {

    // Instance stores a reference to the Singleton
    var _instance = null;

    function init() {

      // private vars
      var _videoCollection = [],
      _totalIntanceCount   = 0,
      _currentPlayer       = null,
      _fp                  = window.flowplayer;

      _fp.conf = {
        //swf: 'swf/flowplayer.swf',
        swfFallback: 'swf/flash9fallback.swf',
        swf: 'swf/flowplayer.swf',
        splash: true,
        embed: false,
        tooltip: false,
        engine: 'flash'
      };

      // Private methods
      function toggleCurrentlyPlaying( currentPlayingAPI ){
        var api = null;
        for (var i = _videoCollection.length - 1; i >= 0; i--) {
          api = _videoCollection[i];

          if( api !== currentPlayingAPI && api.playing ){
            api.pause(); //pauses all other instances
          }
        }
      }

      // Public methods and variables
      return {

        pauseAllVideos: function() {
          toggleCurrentlyPlaying();
        },

        pauseCurrentVideo: function() {
          if ( _currentPlayer && _currentPlayer.playing ) {
            _currentPlayer.pause();
          }
        },

        getTotalInstanceCount: function(){
          return _totalIntanceCount;
        },

        //pass your video elements as a jquery selector
        initVideos: function ( $videos , options ) {
          //init each instace of player
          var api = null;

          $videos.each(function(){
            api = _videoCollection[ _totalIntanceCount ] =  _fp( ( $( this ).flowplayer() ).get( 0 ) );


           api.bind( 'resume' , function(e , a){
            _currentPlayer = api;
           } );

           _totalIntanceCount++;

          });

          return api;
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

  Environment.on('pausevideo', function() {
    SonyVideo.getInstance().pauseCurrentVideo();
  });

  return SonyVideo.getInstance();
});


