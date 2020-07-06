define("scripts/object/game-over.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var layout = require("scripts/layout");
  var scale = require("scripts/animation").scale;

  var image;

  exports.set = function() {
    image = layer.createImage("default", "images/game-over.png",
      layout.centerX(490), layout.centerY(85), 490, 85*2).hide().scale(1e-5, 1e-5);
  };

  exports.show = function() {
    image.show();
    scale(image, 1e-5, 1, 500);
  };

  exports.hide = function() {
    scale(image, 1, 1e-5, 500, image.hide);
  };

  exports.resize = function() {
    image.attr({
      "x": layout.centerX(image.attrs.width),
      "y": layout.centerY(image.attrs.height)
    });
  };

});
