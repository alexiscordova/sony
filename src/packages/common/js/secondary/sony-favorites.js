// Favorites Helper
// --------------------------------------------
//
// * **Class:** Favorites
// * **Version:** 1.0
// * **Modified:** 05/01/2013
// * **Author:** Glen Cheney
// * **Dependencies:** jQuery 1.7+, SONY Settings, bootstrap tooltip
//
// *Notes:*
//
// *Example Usage:*
//
//      new Favorites( $container )
//

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap'),
      Settings = require('require/sony-global-settings');

  var Favorites = function( $parent, options ) {
    var self = this;

    options = options || {};

    $.extend( self, Favorites.options, options, Favorites.settings );

    self.$parent = $parent;
    self.$favorites = self.$parent.find('.js-favorite');
    self.initTooltips();
  };

  Favorites.prototype = {

    constructor: Favorites,

    initTooltips : function( $favorites ) {
      var self = this;

      $favorites = $favorites || self.$favorites;

      // Favorite the gallery item immediately on touch devices
      if ( self.hasTouch ) {

        $favorites
          .on('touchend', $.proxy( self.onFavorite, self ))
          .on('click', false);

      // Show a tooltip on hover before favoriting on desktop devices
      } else {
        $favorites.on('click', $.proxy( self.onFavorite, self ));

        // Optionally give a tooltip
        if ( self.tooltip ) {
          $favorites.tooltip({
            placement: 'offsettop',
            title: function() {
              var $jsFavorite = $(this);
              return self.getFavoriteContent( $jsFavorite, $jsFavorite.hasClass('active') );
            },
            template: '<div class="tooltip gallery-tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
          });
        }
      }

      // Update our favorites
      self.$favorites = self.$parent.find('.js-favorite');

      return self;
    },

    onFavorite : function( e ) {
      var self = this,
          $jsFavorite = $(e.delegateTarget),
          isAdding = !$jsFavorite.hasClass('active'),
          content = self.hasTouch || !self.tooltip ? '' : self.getFavoriteContent( $jsFavorite, isAdding, true );

      $jsFavorite.toggleClass('active');

      // Show the tooltip if it isn't a touch device
      if ( self.tooltip && !self.hasTouch ) {
        $('.gallery-tooltip .tooltip-inner')
          .html( content )
          .tooltip('show');
      }

      // Stop event from bubbling to <a> tag
      e.preventDefault();
      e.stopPropagation();

      // Pass off the gallery item and a boolean indicating that favorited state
      self.handleFavorite( $jsFavorite.closest( self.itemSelector ), isAdding );
    },

    getFavoriteContent : function( $jsFavorite, isActive, isClicked ) {
      var titles = $jsFavorite.data(),
          title;

      if ( isActive ) {
        title = isClicked ? titles.defaultClickedTitle : titles.favoritedTitle;
      } else {
        title = isClicked ? titles.favoritedClickedTitle : titles.defaultTitle;
      }

      return title;
    },

    // possibly https://github.com/ScottHamper/Cookies ?
    handleFavorite : function( $item, isAdded ) {
      var self = this,
          favs = [];

      // Save data
      if ( isAdded ) {

        // Save to account with ajax?
        if ( Settings.isLoggedIn ) {
          // TODO
          $.getJSON( 'path/to/server', { add: true } );

        // Store in cookie
        } else {

          // Check to make sure the browser can parse JSON ( IE7 )
          if ( window.JSON ) {
            // Browser support JSON parsing
          }

          // TODO
          // Get the cookies (string) and convert it to an array
          // favs = JSON.parse( Cookies.get( 'favorites' ) );
          // Add this one to it
          // favs.push( $item.attr('data-id') );
          // Make it a string again
          // favs = JSON.stringify( favs );
          // Save it
          // Cookies.set( 'favorites', favs );
        }


        // Fire event saying this has been added
        self.$parent.trigger( 'favoriteadded', [ $item, self ] );

      // Remove data
      } else {

        if ( Settings.isLoggedIn ) {
          // TODO
          $.getJSON( 'path/to/server', { add: false } );

        // Remove from stored cookie
        } else {

          // Check to make sure the browser can parse JSON ( IE7 )
          if ( window.JSON ) {
            // Browser support JSON parsing
          }

          // TODO
          // Remove the id from the cookie
        }

        // Fire event saying this has been removed
        self.$parent.trigger( 'favoriteremoved', [ $item, self ] );

      }

      return self;
    }
  };

  // Options that could be customized per module instance
  Favorites.options = {
    itemSelector: '.gallery-item',
    tooltip: true
  };

  // These are not overridable when instantiating the module
  Favorites.settings = {
    hasTouch: Settings.hasTouchEvents || Settings.hasPointerEvents
  };

  return Favorites;
});
