// Search Results (SearchResults) Module.
// ---------------------------------------
//
// * **Version:** 0.1
// * **Modified:** 05/05/2013
// * **Author:** Mark Ernst, Chris Pickett, Sam Carlton
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery');

  var module = {
    'init': function() {
      var searchResults = $('.search-results');
      if ( searchResults ) {
        new SearchResultsModule(searchResults);
      }
    }
  };

  var SearchResultsModule = function(element){
    var self = this;
    self.$el = $(element);

    self.init();

    log('SONY : SearchResults : Initialized');
  };

  SearchResultsModule.prototype = {

    constructor: SearchResultsModule,

    init: function() {
      var self = this;
      self.$loadmore = self.$el.find('.search-more');
      self.$results = self.$el.find('.results-list');
      self.$clearBtn = self.$el.find('.clear-search');
      self.$search = self.$el.find('input.search');
      self.$searchIcon = self.$el.find('.search-label');
      self.initialSearchValue = self.$search.val();
      self.bind();
    },

    bind: function() {
      var self = this;

      self.$loadmore.on('click', $.proxy(self.loadMore, self));

      self.$clearBtn.on({
        click: function(evt) {
          evt.preventDefault();
          self.resetSearch(true);
        }
      });

      self.searchval = self.$search.val();

      self.clearSearch();
      self.activateSearch();
      // Sets cursor to end of search string
      self.$search.focus().val(self.searchval);

      self.$search.on({
        click: function() {
          self.clearSearch();
          self.activateSearch();
        },
        blur: function() {
          self.resetSearch();
        }

      });
    },

    loadMore: function(event) {

      var self = this,
          $resultsList = $(event.currentTarget).parent().siblings('.results-list'),
          request;

      // An ajax request - use this when making a real ajax request
      // request = $.ajax({
      //   url: 'somepage.php',
      //   data: { start: 5, length: 10 }, // fake
      //   success: $.proxy( self.updateResultsView, self ),
      //   dataType: 'html'
      // });

      // Faking it by cloning things - remove this when making a real ajax request
      request = new $.Deferred();

      // Success
      request.done( $.proxy( self.updateResultsView, self ) );

      // Error
      request.fail( $.proxy( self.updateResultsView, self ) );

      // Faking it by cloning things - remove this when making a real ajax request
      self.$results = $resultsList;
      request.resolve( self.$results.children().clone() );
    },

    // Assuming ajax request will return a chunk of html, which, when dataType:html
    // is specified, jQuery wraps it in a jQuery object already
    updateResultsView: function( $moreResults ) {
      this.$results.append( $moreResults );
    },

    clearSearch: function(evt) {
      var self = this;
      self.$searchIcon.addClass('hidden');
      if (self.$search.val() === 'Search') {
        self.$search.first().focus().val('');
      }
    },

    activateSearch: function(){
      var self = this;
      self.$search.addClass('active-search-input');
    },

    // If the search field is blank, reset it to the initial value
    resetSearch: function(force) {
      var self = this;
      if ( self.$search.val() === '' || force === true) {
        self.$search.val( 'Search' );
        self.$searchIcon.removeClass('hidden');
        self.$search.removeClass('active-search-input');
      }
    }
  };

  return module;
});
