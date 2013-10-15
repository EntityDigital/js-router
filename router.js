(function() {
  var Route = require('./route.js');
  var routes = {
    'GET': {},
    'POST': {},
    'PUT': {},
    'DELETE': {},
    'HEAD': {}
  };

  function add(method, name, route) {
    method = method.toUpperCase();

    if (!validMethods.hasOwnProperty(method)) {
      throw new Error('Invalid method "' + method + '"');
    }

    route = _resolveRoute(route);
    routes[method][name] = route;
  }

  function resolve(method, url) {
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
  }

  function reverse(method, name, params) {
    if (!routes.hasOwnProperty(method) || !routes[method].hasOwnProperty(name)) {
      return false;
    }

    return routes[method][name].reverse(params);
  }

  function get(name, route) {
    return add('GET', name, route);
  }

  function post(name, route) {
    return add('POST', name, route);
  }

  function put(name, route) {
    return add('PUT', name, route);
  }

  function delete(name, route) {
    return add('DELETE', name, route);
  }

  function head(name, route) {
    return add('HEAD', name, route);
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

  var router = {
    "add":      add,
    "resolve":  resolve,
    "reverse":  reverse
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
