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

      var inputObj = {};
      inputObj.$input = $input;
      inputObj.$inputGroup = $input.closest('.input-group');
      inputObj.$inputWrapper = $input.closest('.input-outer-wrapper');
      inputObj.$inputIcon = inputObj.$inputGroup.find('.input-icon');
      inputObj.$inputBtn = inputObj.$inputGroup.find('.input-btn');
      inputObj.$inputClearBtn = inputObj.$inputGroup.find('.input-clear-btn');
      inputObj.watermarkText = $input.val();
      inputObj.clearBtnClicked = false;

      $input.on('focus', function(){
        // clear watermarkText on focus
        // console.log("input: focus");

        if ($input.val() === inputObj.watermarkText){
          $input.val('');
          inputObj.$inputIcon.hide();
        }
      }).on('blur', function(){
        
        // console.log("input: blur");

        if ($input.val() === ''){
          $input.val(inputObj.watermarkText);
          inputObj.$inputIcon.show();
        }
      }).on('mouseup keyup change cut paste', function(){

        // console.log("input: touch mouseup keyup change cut paste");

        if (!inputObj.$inputWrapper.hasClass('searching')){
          if (!($input.val() === '' || $input.val() === inputObj.watermarkText)){
            inputObj.$inputWrapper.addClass('searching');
            self.doSearch( inputObj );
          }
        } else if ($input.val() === ''){
          self.resetSearchResults( inputObj );
        } else {
          self.doSearch( inputObj );
        }
      });

      inputObj.$inputIcon.on('click',function(){
        $input.focus();
      });

      inputObj.$inputClearBtn.on('click',function(){
        inputObj.clearBtnClicked = true;
        self.clearSearchResults( inputObj );
        inputObj.$input.focus();
      }).on('mouseleave',function(){
        inputObj.clearBtnClicked = false; // just make sure it's cleared
      });
    },

    doSearch: function( inputObj ){
      var queryStr = inputObj.$input.val();

      switch( inputObj.$input.attr('id') ){
        case 'footer-email-input':
          // console.log('footer-email-input, queryStr: ' + queryStr);
          break;

        case 'store-locator-search-input':
          //console.log('store-locator-search-input, queryStr: ' + queryStr);
          break;

        case 'nav-search-input':
          //console.log('nav-search-input, queryStr: ' + queryStr);
          break;

        default:
        break;

      }
    },

    clearInput: function( inputObj ){
      inputObj.$input.val('');
      inputObj.$inputIcon.hide();
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

 })(jQuery, Modernizr, window, undefined);


$(function() {
   var $formActionsInit = $('body').formActions(),
    $formActions = $formActionsInit.data('formActions');

   $formActions.initInput($('#store-locator-search-input'));
   $formActions.initInput($('#footer-email-input'));
   $formActions.initInput($('#nav-search-input'));

   $formActions.initTouchToggles($('.touch-toggle, .dropdown-toggle, .dropdown-hover-toggle'));
});




