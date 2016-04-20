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
        self.failure = failure;

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

// A hackey implementation of require
window.require = (function() {

  var codeCache = {};

}());