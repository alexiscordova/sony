define(function(require){

  'use strict';

  var $ = require('jquery');

  var module = {
    init: function () {
      var self = this;
      self.$el = $('.search-results');
      self.$loadmore = self.$el.find('.search-more');
      self.$results = self.$el.find('.results-list');
      self.$clearBtn = self.$el.find('.clear-search');
      self.$search = self.$el.find('input.search');
      self.$searchVal = self.$search.val();
      self.bind();
    },

    bind: function () {
      var self = this;
      self.$loadmore.on('click', function () {
        self.loadMore();
      });
      self.$clearBtn.on({
        click: function ( evt ) {
          evt.preventDefault();
          self.clearSearch(event);
        }
      });
      self.$search.on({
        click: function () {
          self.clearSearch();
        },
        blur: function () {
          self.resetSearch();
        }
      });
    },

    loadMore: function(){
      var self = this;
      self.$results.children().clone().appendTo(self.$results);
    },

    clearSearch: function (event) {
      var self = this;
      if (self.$search.val() == self.$searchVal || event) {
        self.$search.first().focus().val('');
      }
    },

    resetSearch: function () {
      var self = this;
      if (self.$search.val() === '') {
        self.$search.val(self.$searchVal);
      }
    }
  };

  return module;
});
