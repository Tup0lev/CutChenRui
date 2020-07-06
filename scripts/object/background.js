define("scripts/object/background.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var layout = require("scripts/layout");
  var random = require("scripts/tools").randomNumber;

  var image, timer;

  exports.set = function() {
    image = layer.createImage("default", "images/background.jpg", 0, 0, layout.width(), layout.height());
  };

  exports.resize = function() {
    image.attr({
      width: layout.width(),
      height: layout.height()
    });
  };

  exports.wobble = function() {
    if (timer)
      return;
    timer = setInterval(wobble, 50);
  };

  exports.stop = function() {
    clearInterval(timer);
    timer = null;
    image.attr({
      x: 0,
      y: 0
    });
  };

  function wobble() {
    var x, y;
    x = random(12) - 6;
    y = random(12) - 6;
    image.attr({
      x: x,
      y: y
    });
  };

});
