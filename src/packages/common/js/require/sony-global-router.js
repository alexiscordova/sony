
// Sony Router Class
// -----------------
//
// * **Class:** SONY.Router
//

define(function (require) {

  'use strict';

  var $ = require('jquery'),
      Modernizr = require('modernizr'),
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

      if ( Modernizr.hashchange && !Settings.isLTIE8 ) {
        Settings.$window.on('hashchange', function(){
          self.checkUrl();
        });
      } else {
        self._checkUrlInterval = setInterval(function(){
          self.checkUrl();
        }, 500);
      }

      self.checkUrl();

      log('SONY : Global : Router : Initialized');
    },

    addRoute: function(route, cb) {

      var self = this,
          routeData;

      if ( typeof route === 'string' && typeof cb === 'function' ) {

        routeData = {
          'route': route,
          'cb': cb
        };

        self.routes.push(routeData);

        self.checkUrl(routeData);
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

    // Check the current URL and

    checkUrl: function(routeData) {

      var self = this,
          current = self.getFragment(),
          match;

      if (current === self.fragment && !routeData) {
        return false;
      }

      if ( routeData ) {
        match = current.match(self.routeToRegExp(routeData.route));
        if ( match ) {
          routeData.cb.apply(window, match.slice(1));
        }
        return;
      }

      for ( var i = 0; i < self.routes.length; i++ ) {
        match = current.match(self.routeToRegExp(self.routes[i].route));
        if ( match ) {
          self.routes[i].cb.apply(window, match.slice(1));
        }
      }

      self.fragment = current;
    },

    // Strips route from hash if present (x-browser smoothing).

    getFragment: function(fragment) {

      var self = this;

      if (!fragment) {
        fragment = self.getHash();
      }
      return fragment.replace(self.routeStripper, '');
    },

    // Get current window hash.

    getHash: function() {
      var match = window.location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Converts routes into regular expressions that can be used by `.match()`

    routeToRegExp: function(route) {

      var optionalParam = /\((.*?)\)/g,
          namedParam    = /(\(\?)?:\w+/g,
          splatParam    = /\*\w+/g,
          escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){ return optional ? match : '([^\/]+)'; })
                   .replace(splatParam, '(.*?)');

      return new RegExp('^' + route + '$');
    }

  };

  return router;

});