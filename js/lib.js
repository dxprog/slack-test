'use strict';

// A hacky promise type thing
window.Promise = (function(undefined) {

  var NOOP = function(){};
  var ST_EXECUTING = 0;
  var ST_RESOLVED = 1;
  var ST_REJECTED = 1;

  return function(fn) {

    var self = this;

    var resolve = function(arg) {
      self.retVal = arg;
      self.state = ST_RESOLVED;
      self.success(self.retVal);
    };

    var reject = function(arg) {
      self.retVal = arg;
      self.state = ST_REJECTED;
      self.failure(self.retVal);
    };

    self.state = ST_EXECUTING;
    self.retVal = undefined;
    self.success = NOOP;
    self.failure = NOOP;

    setTimeout(function() { fn(resolve, reject) }, 1);

    return {
      then: function(success, failure) {
        self.success = success;
        self.failure = failure || NOOP;

        // If the code has somehow already executed, invoke the correct method
        if (self.state === ST_RESOLVED) {
          self.success(self.retVal);
        } else if (self.state === ST_REJECTED) {
          self.failure(self.retVal);
        }

        // Sorry, guys. Not chainable :(
      }
    };
  };

}());

/**
 * Simple ajax wrapper for GET'ing stuff
 *
 * @param {String} url The URL to fetch
 * @param {String} type The type of request. Supported: json (default), jsonp, plain
 * @param {String} jsonpCallback The name of the jsonpCallback
 * @return {Promise} Promise that resolves to parsed response
 */
window.ajax = function(url, type, jsonpCallback) {
  type = typeof type === 'undefined' ? 'json' : type;
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = xhr.responseText;
          switch (type) {
            case 'json':
              try {
                data = JSON.parse(data);
              } catch (exc) {
                reject(exc);
                return;
              }
              break;
            case 'xml':
              data = xhr.responseXML;
              break;
            case 'jsonp':
              data = eval(data);
              delete window[jsonpCallback];
              break;
          }
          resolve(data);
        } else {
          reject(xhr);
        }
      }
    };

    xhr.onerror = function() {
      reject(xhr);
    };

    if (type === 'jsonp') {
      jsonpCallback = jsonpCallback || 'jsonpCallback' + Date.now();
      url += (url.indexOf('?') > -1 ? '&' : '?') + 'callback=' + jsonpCallback;
      window[jsonpCallback] = function(data) {
        return data;
      };
    }

    xhr.open('GET', url, true);
    xhr.send();
  });
};

// A hackey implementation of require
window.require = (function() {
  var codeCache = {};

  return function require(scripts, cb) {
    scripts = Array.isArray(scripts) ? scripts : [ scripts ];

    var promises = 0;
    var loadedScripts = {};

    var checkLoadedScripts = function() {
      if (promises <= 0) {
        var includes = [];
        // Put the includes in the proper order
        for (var i = 0, count = scripts.length; i < count; i++) {
          includes.push(loadedScripts[scripts[i]]);
        }

        cb.apply(null, includes);
      }
    };

    var scriptLoaded = function(script, code) {
      // My gut says eval is evil, but this is code that was included
      // to be executed anyways. The extra code does have the upside of:
      // - providing a CJS type interface
      // - preventing the included code from pissing in the global scope
      var fn = '(function(undefined) {\nvar module = { exports: undefined };\n' + code + ';\nreturn module.exports;\n}());';
      codeCache[script] = eval(fn);
      loadedScripts[script] = codeCache[script];

      promises--;
      checkLoadedScripts();
    };

    var script;
    for (var i = 0, count = scripts.length; i < count; i++) {
      script = scripts[i];

      // I'm grossed out by this usage, but it does what I need
      if (!codeCache[script]) {
        (function(script) {
          promises++;
          ajax(script, 'plain').then(function(code) {
            scriptLoaded(script, code);
          }, function(xhr) {
            throw new Error('Unable to load script: ' + script);
          });
        }(script));
      } else {
        loadedScripts[script] = codeCache[script];
      }
    }

    checkLoadedScripts();
  };
}());

// Even cheaper event thingy
window.mixinEvents = function(fn) {
  fn.prototype.on = function(event, cb) {
    if (typeof cb !== 'function') {
      throw new Error('callback must be a function');
    }
    // Initialize in case it hasn't already happened
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(cb);
  };

  fn.prototype.fire = function(event, data) {
    if (this._events[event]) {
      for (var i = 0, count = this._events[event].length; i < count; i++) {
        this._events[event][i](data);
      }
    }
  }
};