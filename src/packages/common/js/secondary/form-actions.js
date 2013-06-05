// ------------ FormActions ------------
// Module: FormActions
// Version: 0.1
// Modified: 01/05/2013 by Christopher J Mischler
// Modified: 06/05/2013 by Glen Cheney
// Dependencies: jQuery 1.7+, Modernizr
//
// -------------------------------------------------------------------------

define(function(require) {

  'use strict';

  var $ = require('jquery'),
      // Modernizr = require('modernizr'),
      Settings = require('require/sony-global-settings'),
      Environment = require('require/sony-global-environment');

  var module = {
    init: function() {
      var $formActionsInit = $('body').formActions(),

      $formActions = $formActionsInit.data('formActions');
      $formActions.initInput( $('#nav-search-input') );
      $formActions.initInput( $('#store-locator-search-input') );
      // $formActions.initTouchToggles($('.touch-toggle, .dropdown-toggle, .dropdown-hover-toggle'));
      $formActions.initTouchToggles( $('.dropdown-hover-toggle') );
    }
  };

  // Start module
  var FormActions = function() {
  };

  FormActions.prototype = {
    constructor: FormActions,

    initInput : function( $input ) {
      var self = this;

      var inputObj = self.makeInputObj( $input );
      inputObj.watermarkText = $input.val();

      $input.data('formActions', self);

      self.listenForEvents( inputObj );
    },

    listenForEvents : function( inputObj ) {
      var self = this;

      inputObj.$input
        .on( 'focus', inputObj, $.proxy( self.onInputFocus, self ) )
        .on( 'blur', inputObj, $.proxy( self.onInputBlur, self ) )
        .on( 'mouseup keyup change cut paste', module.onSearchInputChange );

      inputObj.$inputIcon
        .on( 'click',function() {
          inputObj.$input.focus();
        });

      inputObj.$inputClearBtn
        .on( 'click', inputObj, $.proxy( self.onClearButton, self ) );
    },

    // clear watermarkText on focus
    onInputFocus : function( evt ) {
      var self = this,
          $input = $( evt.delegateTarget ),
          inputObj = evt.data;

      // If the input is focused and its value is
      // the initial watermark text, hide the watermark
      if ( $input.val() === inputObj.watermarkText ) {
        self.hideWatermark( inputObj );
      }
    },

    onInputBlur : function( evt ) {
      var self = this,
          $input = $( evt.delegateTarget ),
          inputObj = evt.data;

      // If the input loses focus and is empty, show the watermark
      if ( $input.val() === '' ) {
        self.showWatermark( inputObj );
      }
    },

    onClearButton : function( evt ) {
      var self = this,
          inputObj = evt.data;

      evt.preventDefault();

      // Shows the watermark and removes `searching` class
      self.clearSearchResults( inputObj );

      // If not a touch device and not at the mobile breakpoint, focus on the input again
      if ( !Settings.hasTouchEvents && !$('html').hasClass('bp-nav-mobile') ) {
        inputObj.$input.focus();
      }
    },

    showWatermark : function( inputObj ) {
      console.log('show watermark');
      inputObj.$input.val( inputObj.watermarkText );
      inputObj.$inputIcon.show();
      inputObj.$input.parent().removeClass('child-input-active');
    },

    hideWatermark : function( inputObj ) {
      console.log('hide watermark');
      inputObj.$input.val('');
      inputObj.$input.parent().addClass('child-input-active');

      // don't hide search icon on mobile
      if (!($('html').hasClass('bp-nav-mobile') && inputObj.$inputGroup.hasClass('navmenu-search-section-input'))) {
        inputObj.$inputIcon.hide();
      }
    },

    makeInputObj: function($input) {
      var iObj = {};
      iObj.$input = $input;
      iObj.$inputGroup = $input.closest('.input-group');
      iObj.$inputWrapper = $input.closest('.input-outer-wrapper');
      iObj.$inputIcon = iObj.$inputGroup.find('.input-icon');
      iObj.$inputBtn = iObj.$inputGroup.find('.input-btn');
      iObj.$inputClearBtn = iObj.$inputGroup.find('.input-clear-btn');
      return iObj;
    },

    doSearch: function( inputObj ) {
      var self = this;
      var queryStr = inputObj.$input.val();

      switch ( inputObj.$input.attr('id') ) {

        case 'store-locator-search-input':
          // need to call this after the search results have been returned & are displayed (because that'll change the height of the iscroll).
          // if (!$('html').hasClass('bp-nav-mobile')) {
          //   Environment.trigger('SONY:Navigation:initMobileNavIScroll');
          // }
          break;

        case 'nav-search-input':
          break;

        default:
        break;

      }
    },

    clearSearchResults: function( inputObj ) {
      var self = this;
      // Devices with touch events fire the blur event before the clear
      // button receives the click event. The keyboard will disappear,
      // so the input can't be focused. Instead, the input should have the watermark shown.
      self.showWatermark( inputObj );
      inputObj.$inputWrapper.removeClass('searching');
    },

    // this just resets the actual results without clearing the input, for instance when the search term had been deleted & is blank.
    resetSearchResults: function( inputObj ) {
      inputObj.$inputWrapper.removeClass('searching');
    },

    initTouchToggles: function( $touchToggles ) {
      $touchToggles.each(function() {
        $(this).on('click',function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).parent().toggleClass('active');
        });
      });
    }
  };




  // Plugin definition
  $.fn.formActions = function( options ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function() {
      var self = $(this),
        formActions = self.data('formActions');

      // If we don't have a stored formActions, make a new one and save it
      if ( !formActions ) {
          formActions = new FormActions( self, options );
          self.data( 'formActions', formActions );
      }

      if ( typeof options === 'string' ) {
        formActions[ options ].apply( formActions, args );
      }
    });
  };

  // Event triggered when this tab is about to be shown
  module.onSearchInputChange = function( evt ) {
    if ($('html').hasClass('bp-nav-mobile')) {
      Environment.trigger('SONY:Navigation:initMobileNavIScroll');
    }
    var $input = $(evt.target),
      formActions = $input.data('formActions'),
      inputObj = formActions.makeInputObj($input);


    if (!inputObj.$inputWrapper.hasClass('searching')) {
      if (!($input.val() === '' || $input.val() === inputObj.watermarkText)) {
        inputObj.$inputWrapper.addClass('searching');
        formActions.doSearch( inputObj );
      }
    } else if ($input.val() === '') {
      formActions.resetSearchResults( inputObj );
    } else {
      formActions.doSearch( inputObj );
    }

  };

  module.init();

  return module;
});
