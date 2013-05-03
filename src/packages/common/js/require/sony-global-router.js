
// Sony Router Class
// -----------------
//
// * **Class:** SONY.Router
//

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      Environment = require('require/sony-global-environment'),
      Settings = require('require/sony-global-settings');

  var _router;

  var router = {
    'init': function() {
      _router = new Router();
    },

    'on': function(route, cb) {
      _router.addRoute(route, cb);
    },

    'off': function(route) {
      _router.removeRoute(route);
    }
  };

  var Router = function(element){
    var self = this;

    self.routeStripper = /^[#\/]|\s+$/g;
    self.init();
  };

  Router.prototype = {

    constructor: Router,

    init: function() {

      var self = this;

      self.routes = [];

      if ( ('onhashchange' in window) && !$('html').hasClass('lt-ie8') ) {
        $(window).on('hashchange', function(){
          self.checkUrl();
        });
      } else {
        self._checkUrlInterval = setInterval(function(){
          self.checkUrl();
        }, 100);
      }

      self.checkUrl();

      log('SONY : Global : Router : Initialized');
    },

    addRoute: function(route, cb) {

      var self = this;

      if ( typeof route === 'string' && typeof cb === 'function' ) {
        self.routes.push({
          'route': route,
          'cb': cb
        });
      }
    },

    removeRoute: function(route) {

      var self = this;

      for ( var i = 0; i < self.routes.length; i++ ) {

        if ( self.routes[i].route === route ) {
          self.routes.splice(i, 1);
        }
      }
    },

    checkUrl: function(e) {

      var self = this;

      var current = self.getFragment();

      if (current === this.fragment) {
        return false;
      }

      for ( var i = 0; i < self.routes.length; i++ ) {
        var match = current.match(self.routeToRegExp(self.routes[i].route));

        if ( match ) {
          self.routes[i].cb.apply(window, match.slice(1));
        }
      }

      this.fragment = current;
    },

    getFragment: function(fragment) {
      var self = this;

      if (!fragment) {
        fragment = this.getHash();
      }
      return fragment.replace(self.routeStripper, '');
    },

    getHash: function() {
      var match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    routeToRegExp: function(route) {

      var optionalParam = /\((.*?)\)/g;
      var namedParam    = /(\(\?)?:\w+/g;
      var splatParam    = /\*\w+/g;
      var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');

      return new RegExp('^' + route + '$');
    }

  };

  return router;

});