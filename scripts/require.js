void function(global) {
  "use strict";

  var modules = {};

  var require = function(id) {
    if (!/\.js$/.test(id))
      id += ".js";
    var module = modules[id];
    if (!module.exports) {
      module.exports = {};
      module.call(this, module.exports, require, module);
    }
    return module.exports;
  };

  global.define = function(id, func) {
    modules[id] = func;
  };
  global.require = require;
}(this);
