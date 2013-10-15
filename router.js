(function() {
  var Route = require('./route.js'),
      self = this;

  var routes = {
    'GET':    {},
    'POST':   {},
    'PUT':    {},
    'DELETE': {},
    'HEAD':   {}
  };

  var router = {
    add: function add(method, name, route) {
      method = method.toUpperCase();

      if (!routes.hasOwnProperty(method)) {
        throw new Error('Invalid method "' + method + '"');
      }

      route = _resolveRoute(route);
      routes[method][name] = route;
      return router;
    },

    resolve: function resolve(method, url) {
      method = method.toUpperCase();

      if (!routes.hasOwnProperty(method)) {
        return false;
      }

      for (var name in routes[method]) {
        var params = routes[method][name].resolve(url);

        if (params !== false) {
          return params;
        }
      }

      return false;
    },

    reverse: function reverse(method, name, params) {
      method = method.toUpperCase();

      if (!routes.hasOwnProperty(method) || !routes[method].hasOwnProperty(name)) {
        console.log('a');
        return false;
      }

      return routes[method][name].reverse(params);
    },

    get: function get(name, route) {
      return this.add('GET', name, route);
    },

    post: function post(name, route) {
      return this.add('POST', name, route);
    }
  }

  function _resolveRoute(route) {
    if (route instanceof Route) {
      return route;
    }

    if (typeof route === 'string' || route instanceof String) {
      return new Route(route);
    }

    throw new Error('Could not resolve route');
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = router;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return router;
      });
    } else {
      window.router = router;
    }
  }
})();
