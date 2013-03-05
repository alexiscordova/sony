/*global jQuery, brightcove*/


// Brightcove video
// ---------------------------------------------------------------
//
// * **Class:** ActivateBrightcove
// * **Version:** 1.0
// * **Modified:** 01/10/2013
// * **Author:** Pierre Paquet
// * **Dependencies:**  jQuery 1.7+, Brightcove

(function( $ ) {
  
  'use strict';

  var ActivateBrightcove = function( $element, options ) {
    var self = this;

    self.$el =                $element;
    self.$elGroup =           $('.action-video');
    self.$videoModule =       $element.parents('section[data-module-name="video-module"]');
    self.$targetPlaceholder = $( document.getElementById( self.$el.attr('data-target') ) );

    self.videoProp = $.parseJSON( self.$targetPlaceholder.attr('data-media').replace( /'/g, '"' ) || {} );

    if ( !self.videoProp.videoWidth || !self.videoProp.videoHeight ) {
      $.extend( self.videoProp, {
        'videoWidth' : '480',
        'videoHeight' : '270'
      } );
    }

    self.moduleID = {'name':'videoBrigthCove','ID': self.videoProp.videoID};
    self.autoStart = (self.videoProp.autoStart) || true;
    self.containerClass = self.videoProp.containerClass || '';

    self.imgMissingVideoID =    (self.videoProp.imgMissingVideoID) ? self.videoProp.imgMissingVideoID : 'img/modules/brightcovevideo/poster-missing-video.png';
    self.imgMissingVideoID =    '<img src="' + self.imgMissingVideoID + '" class="iq-img video-poster video-missing-poster" alt="video unavailable" >';

    self.videoIdMissing =       (!self.videoProp.videoID) ? true : false;
    self.videoResponsiveStyle = (parseInt( self.videoProp.videoHeight, 10 ) / parseInt( self.videoProp.videoWidth, 10 )) * 100 + '%';

    // create video html markup
    self.videoMarkup =
                                '<div class="vbc-container ' + self.containerClass + '" style="padding-bottom:' + self.cssVideoPadding + ';">' + 
                                '   <div class="videoWrapper">' +
                                '       <object id="myExperience' + self.videoProp.videoID + '" class="BrightcoveExperience">' +
                                '           <param name="includeAPI" value="true" />' +
                                '           <param name="htmlFallback" value="false" />' +
                                '           <param name="bgcolor" value="#000000" />' +
                                '           <param name="dynamicStreaming" value="true" />' +
                                '           <param name="width" value="' + self.videoProp.videoWidth + '" />' +
                                '           <param name="height" value="' + self.videoProp.videoHeight + '" />' +
                                '           <param name="playerID" value="' + self.videoProp.playerID + '" />' +
                                '           <param name="playerKey" value="' + self.videoProp.playerKey + '" />' +
                                '           <param name="templateLoadHandler" value="myTemplateLoaded" />' +
                                '           <param name="isVid" value="true" />' +
                                '           <param name="isUI" value="true" />' +
                                '           <param name="dynamicStreaming" value="true" />' +
                                '           <param name="autoStart" value="' + self.autoStart + '" />' +
                                '           <param name="includeAPI" value="true" />' +
                                '           <param name="@videoPlayer" value="ref:' + self.videoProp.videoID + '" />' +
                                '       </object>' +
                                '   </div>' +
                                '</div>';

    self.$elGroup.addClass('video-inactive');
    
    self.init();
  };

  ActivateBrightcove.prototype = {

    'constructor' : ActivateBrightcove,

    'init' : function() {
      var self = this;
      self.actionBtn();
    },
    'actionBtn' : function() {

      var self = this;

      self.$el.on( 'click', function(e) {

        e.preventDefault( );

        self.removeAll( );

        if ( !self.videoIdMissing ) {
          $( self.$targetPlaceholder ).find('img').before( self.videoMarkup ).addClass('visuallyhidden');
          brightcove.createExperiences( );
        } else {
          $( self.$targetPlaceholder ).find('img').before( self.imgMissingVideoID ).addClass('visuallyhidden');
        }

        // change cssClass video-inactive to video-active
        self.$el.toggleClass('video-active video-inactive');
      } );
    },
    'removeAll' : function() {
      // remove all video instance and show poster image
      $( '.vbc-container, .video-missing-poster' ).remove();
      $( '.video-container figure img' ).removeClass('visuallyhidden');
    }

  };

    
  jQuery.fn.activateBrightcove = function( options ) {

    var args = Array.prototype.slice.call( arguments, 1 );

    return this.each( function() {
      var self = $( this ), activateBrightcove = self.data( 'activateBrightcove' );

      if ( !activateBrightcove ) {
        activateBrightcove = new ActivateBrightcove( self, options );
        self.data( 'activateBrightcove', activateBrightcove );
      }

      if ( typeof options === 'string' ) {
        activateBrightcove[options].apply( activateBrightcove, args );
      }
    } );

  };


  $( function() {
    $('.action-video').activateBrightcove();
  } );

})(jQuery);
