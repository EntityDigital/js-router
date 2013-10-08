(function() {
  var XRegExp   = XRegExp || require('xregexp').XRegExp,
      _         = _ || require('underscore'),
      RE_PARTS  = /:[a-zA-Z0-9]+|([!$&-\/0-9;=@A-Z_a-z~]|%[0-9A-Za-z]{2})+/g,
      RE_KEYS   = /:([a-zA-Z0-9]+)/,
      RE_PATH   = /([!$&-\.0-9:;=@A-Z_a-z~]|%[0-9A-Za-z]{2})+/;

  function Route(routePattern, rules, defaults) {
    this.routePattern = routePattern;
    this.rules = rules || {};
    this.defaults = defaults || {};
    this.keys = [];
    this.parts = {};
    this.regex = '';
    this.mandatoryCount = 0;
    this.compile(routePattern);
    this.regex = null;
  }

  Route.prototype.resolve = function(url) {
    var r = XRegExp('^' + this.getRegex() + '$'),
        matches = XRegExp.exec(url, r),
        params = {};

    if (matches) {
      for (var i in matches) {
        if (this.keys.indexOf(':' + i) !== -1 && matches[i]) {
          params[i] = matches[i];
        }
      }

      return _.extend(this.defaults, params);
    }

    return false;
  }

  Route.prototype.reverse = function(params, validate) {
    var url = '',
        remaining = this.mandatoryCount,
        validate = (validate === undefined) ? true : validate;

    for (var i in this.parts) {
      if (this.parts[i] instanceof Route) {
        url += this.parts[i].reverse(params, false);
      } else if (typeof this.parts[i] === 'object') {
        if (params.hasOwnProperty(this.parts[i].name)) {
          -- remaining;
          url += encodeURIComponent(params[this.parts[i].name]);
        }
      } else {
        url += this.parts[i];
      }
    }

    if (!remaining) {
      var valid = true;
      var validateRe = XRegExp('^' + this.getRegex() + '$');

      if (validate && !XRegExp.exec(url, validateRe)) {
        valid = false;
      }

      if (valid) {
        return url;
      }
    }

    return false;
  }

  Route.prototype.getRegex = function() {
    if (!this.regex) {
      regex = '';

      for (var i in this.parts) {
        if (this.parts[i] instanceof Route) {
          regex += '(' + this.parts[i].getRegex() + ')?';
        } else if (typeof this.parts[i] === 'object') {
          regex = regex
                + '(?<' + this.parts[i]['name'] + '>'
                + this.parts[i]['regex'].source.replace(/^\//, '').replace(/\$/, '') + ')';
        } else {
          regex += XRegExp.escape(this.parts[i]);
        }
      }

      this.regex = regex;
    }

    return this.regex;
  }

  Route.prototype.compile = function(routePattern) {
    var self = this;
    this.keys = routePattern.match(new RegExp(RE_KEYS.source, 'g')) || [];

    function compilePart(part) {
      var matches = part.match(RE_PARTS);

      if (matches) {
        var j, len = matches.length;
        for (j = 0; j < len; j ++) {
          var key = matches[j].match(RE_KEYS);

          if (matches[j].match(RE_KEYS)) {
            var regex = self.rules.hasOwnProperty(key[1]) ? self.rules[key[1]] : RE_PATH;
            ++ self.mandatoryCount;

            self.parts[key[1]] = {
              'name':  key[1],
              'regex': regex
            };
          } else {
            self.parts['_' + j] = matches[j];
          }
        }
      }
    }

    if (routePattern.indexOf('(') === -1) {
      compilePart(routePattern);
      return;
    }

    var routeLength = routePattern.length,
        buffer = '',
        startPos = 0,
        endPos = 0,
        openBr = 0,
        current = '',
        i;

    for (i = 0; i < routeLength; i ++) {
      current = routePattern.charAt(i);

      if (current === '(') {
        openBr ++;

        if (openBr === 1) {
          startPos = i;
        }
      } else if (current === ')') {
        openBr --;

        if (openBr === 0) {
          compilePart(buffer);
          buffer = '';
          endPos = i;
          subRoute = routePattern.substr(startPos + 1, endPos - startPos - 1);
          this.parts['_' + i] = new Route(subRoute, this.rules);
        }
      } else if (openBr === 0) {
        buffer += current;
      }
    }

    compilePart(buffer);
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Route;
  } else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return Route;
      });
    } else {
      window.Route = Route;
    }
  }
})();
