define("scripts/layout.js", function(exports, require, module) {
  "use strict";

  var elem = document.getElementById("container");

  var minWidth = 240;
  var minHeight = 240;

  exports.x = function() {
    return elem.offsetLeft;
  };

  exports.y = function() {
    return elem.offsetTop;
  };

  exports.width = function() {
    var w = elem.offsetWidth;
    if (w < minWidth)
      w = minWidth;
    return w;
  };

  exports.height = function() {
    var h = elem.offsetHeight;
    if (h < minHeight)
      h = minHeight;
    return h;
  };

  exports.left = function(n) {
    n = n || 0;
    return n;
  };

  exports.top = function(n) {
    n = n || 0;
    return n;
  };

  exports.right = function(n, w) {
    n = n || 0;
    w = w || 0;
    return exports.width() - n - w;
  };

  exports.bottom = function(n, h) {
    n = n || 0;
    h = h || 0;
    return exports.height() - n - h;
  };

  exports.centerX = function(w) {
    w = w || 0;
    return (exports.width() >> 1) - (w >> 1);
  };

  exports.centerY = function(h) {
    h = h || 0;
    return (exports.height() >> 1) - (h >> 1);
  };

});
