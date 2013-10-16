(function() {
  var Route = require('./route.js'),
      url   = require('url'),
      self  = this;

  var routes = {
    'GET':    {},
    'POST':   {},
    'PUT':    {},
    'DELETE': {},
    'HEAD':   {}
  };

  var router = {
    add: function add(method, name, route, callback) {
      method = method.toUpperCase();

      if (!routes.hasOwnProperty(method)) {
        throw new Error('Invalid method "' + method + '"');
      }

      route = _routify(route);
      routes[method][name] = {
        'route':   route,
        'handler': callback
      };
      return router;
    },

    resolve: function resolve(req, res) {
      method = req.method.toUpperCase();

      if (!routes.hasOwnProperty(method)) {
        return false;
      }

      for (var name in routes[method]) {
        var params = routes[method][name].route.resolve(url.parse(req.url).pathname);

        if (params !== false) {
          return routes[method][name].handler(req, res, params);
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

      return routes[method][name].route.reverse(params);
    },

    get: function get(name, route, callback) {
      return this.add('GET', name, route, callback);
    },

    post: function post(name, route, callback) {
      return this.add('POST', name, route, callback);
    }
  }

  function _routify(route) {
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
