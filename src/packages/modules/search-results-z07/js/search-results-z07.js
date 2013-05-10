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
      self.$searchVal = self.$search.val();
      self.bind();
    },

    bind: function() {
      var self = this;
      self.$loadmore.on('click', function() {
        self.loadMore();
      });
      self.$clearBtn.on({
        click: function(evt) {
          evt.preventDefault();
          self.clearSearch(evt);
        }
      });
      self.$search.on({
        click: function() {
          self.clearSearch();
        },
        blur: function() {
          self.resetSearch();
        }
      });
    },

    loadMore: function(){
      var self = this;
      self.$results.children().clone().appendTo(self.$results);
    },

    clearSearch: function(evt) {
      var self = this;
      if ( self.$search.val() == self.$searchVal || evt ) {
        self.$search.first().focus().val('');
      }
    },

    resetSearch: function() {
      var self = this;
      if ( self.$search.val() === '' ) {
        self.$search.val(self.$searchVal);
      }
    }
  };

  return module;
});
