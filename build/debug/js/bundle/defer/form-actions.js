// ------------ FormActions ------------
// Module: FormActions
// Version: 0.1
// Modified: 01/05/2013 by Christopher J Mischler
// Dependencies: jQuery 1.7+, Modernizr
//
// -------------------------------------------------------------------------


(function($, Modernizr, window, undefined) {

  'use strict';

  // Start module
  var FormActions = function( element, options ){
    var self = this;
    $.extend(self, {}, $.fn.formActions.defaults, options, $.fn.formActions.settings);

  };


  // Sample module method
  FormActions.prototype = {
    constructor: FormActions,

    initInput : function( $input ) {
      var self = this;

      var inputObj = self.makeInputObj($input);
      inputObj.watermarkText = $input.val();
      inputObj.clearBtnClicked = false;

      $input.data('formActions',self);

      $input.on('focus', function(){
        // clear watermarkText on focus

        if ($input.val() === inputObj.watermarkText){
          $input.val('');

          // don't hide search icon on mobile
          if (!$('html').hasClass('bp-nav-mobile')){
            inputObj.$inputIcon.hide();
          }
        }
      }).on('blur', function(){
        if ($input.val() === ''){
          $input.val(inputObj.watermarkText);
          inputObj.$inputIcon.show();
        }
      }).on('mouseup keyup change cut paste', SONY.onSearchInputChange);

      inputObj.$inputIcon.on('click',function(){
        $input.focus();
      });

      inputObj.$inputClearBtn.on('click',function(){
        inputObj.clearBtnClicked = true;
        self.clearSearchResults( inputObj );

        if (!$('html').hasClass('bp-nav-mobile')){
          inputObj.$input.focus();
        }
      }).on('mouseleave',function(){
        inputObj.clearBtnClicked = false; // just make sure it's cleared
      });
    },

    makeInputObj: function($input){
      var iObj = {};  
      iObj.$input = $input;
      iObj.$inputGroup = $input.closest('.input-group');
      iObj.$inputWrapper = $input.closest('.input-outer-wrapper');
      iObj.$inputIcon = iObj.$inputGroup.find('.input-icon');
      iObj.$inputBtn = iObj.$inputGroup.find('.input-btn');
      iObj.$inputClearBtn = iObj.$inputGroup.find('.input-clear-btn');
      return iObj;
    },

    doSearch: function( inputObj ){
      var self = this;
      var queryStr = inputObj.$input.val();

      switch( inputObj.$input.attr('id') ){

        case 'store-locator-search-input':
          // need to call this after the search results have been returned & are displayed (because that'll change the height of the iscroll).
          // need a global way to talk between modules
          // if (!$('html').hasClass('bp-nav-mobile')){
          //   self.initMobileNavIScroll();
          // }
          break;

        case 'nav-search-input':
          break;

        default:
        break;

      }
    },

    clearInput: function( inputObj ){
      inputObj.$input.val('');

      // if (!$('html').hasClass('bp-nav-mobile')){
        inputObj.$inputIcon.hide();
      // }
    },

    clearSearchResults: function( inputObj ){
      var self = this;
      self.clearInput(inputObj);
      inputObj.$inputWrapper.removeClass('searching');
    },

    // this just resets the actual results without clearing the input, for instance when the search term had been deleted & is blank.
    resetSearchResults: function( inputObj ){
      inputObj.$inputWrapper.removeClass('searching');
    },

    initTouchToggles: function( $touchToggles ) {
      $touchToggles.each(function(){
        $(this).on('touchstart click',function(){
          $(this).toggleClass('active');
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


  // Defaults options for your module
  $.fn.formActions.defaults = {
    sampleOption: 0
  };

  // Non override-able settings
  $.fn.formActions.settings = {
    isTouch: !!( 'ontouchstart' in window ),
    isInitialized: false
  };

  // Event triggered when this tab is about to be shown
  SONY.onSearchInputChange = function( evt ) {
    SONY.initMobileNavIScroll();
    console.log("onSearchInputChange");
    var $input = $(evt.target),
      formActions = $input.data('formActions'),
      inputObj = formActions.makeInputObj($input);
    

    if (!inputObj.$inputWrapper.hasClass('searching')){
      if (!($input.val() === '' || $input.val() === inputObj.watermarkText)){
        inputObj.$inputWrapper.addClass('searching');
        formActions.doSearch( inputObj );
      }
    } else if ($input.val() === ''){
      formActions.resetSearchResults( inputObj );
    } else {
      formActions.doSearch( inputObj );
    }
      


    // var $prevPane;

    // if ( evt ) {
    //   $prevPane = evt.prevPane;
    // }

  };

})(jQuery, Modernizr, window, undefined);


$(function() {
   var $formActionsInit = $('body').formActions(),
    $formActions = $formActionsInit.data('formActions');

   $formActions.initInput($('#store-locator-search-input'));
   $formActions.initInput($('#nav-search-input'));

   $formActions.initTouchToggles($('.touch-toggle, .dropdown-toggle, .dropdown-hover-toggle'));
});




