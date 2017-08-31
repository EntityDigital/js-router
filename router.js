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
      if (typeof(method) !== 'object') {
        method = [method];
      }

      method.map(function(m, i, a) {
        a[i] = m.toUpperCase();
      });

      for (var i in method) {
        if (!routes.hasOwnProperty(method[i])) {
          throw new Error('Invalid method "' + method[i] + '"');
        }

        route = _routify(route);
        routes[method[i]][name] = {
          'route':   route,
          'handler': callback
        };
      }
      return router;
    },

    resolve: function resolve(method, url) {
      method = method.toUpperCase();

      if (!routes.hasOwnProperty(method)) {
        return false;
      }

      for (var name in routes[method]) {
        var params = routes[method][name].route.resolve(url);

        if (params !== false) {
          return routes[method][name].handler(params);
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
    },

    put: function post(name, route, callback) {
      return this.add('PUT', name, route, callback);
    },

    delete: function post(name, route, callback) {
      return this.add('DELETE', name, route, callback);
    },

    head: function post(name, route, callback) {
      return this.add('HEAD', name, route, callback);
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
