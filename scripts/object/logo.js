define("scripts/object/logo.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var layout = require("scripts/layout");
  var translateY = require("scripts/animation").translateY;

  var homeMask, logo, ninja;
  var width = [0, 150, 240];
  var height = [183, 126, 90];

  var x = [0, 0, 0];
  var y = [-183, -182, -140];
  var y2 = [0, 10, 20];

  function getPos() {
    width[0] = layout.width();
    x[1] = layout.centerX(width[1]) - 125;
    x[2] = x[1] + 160;
  }

  function createImage(imageSrc, x, y, width, height) {
    return layer.createImage("default", imageSrc, x, y, width, height).hide();
  }

  exports.set = function() {
    getPos();
    homeMask = createImage("images/home-mask.png", x[0], y[0], width[0], height[0]);
    logo = createImage("images/logo.png", x[1], y[1], width[1], height[1]);
    ninja = createImage("images/ninja.png", x[2], y[2], width[2], height[2]);
  };

  exports.show = function() {
    homeMask.show();
    logo.show();
    ninja.show();
    translateY(homeMask, y[0], y2[0], 1000);
    translateY(logo, y[1], y2[1], 1000);
    translateY(ninja, y[2], y2[2], 1000);
  };

  exports.hide = function() {
    translateY(homeMask, y2[0], y[0], 1000, homeMask.hide);
    translateY(logo, y2[1], y[1], 1000, logo.hide);
    translateY(ninja, y2[2], y[2], 1000, ninja.hide);
  };

  exports.resize = function() {
    getPos();
    homeMask.attr({width: width[0]});
    logo.attr({x: x[1]});
    ninja.attr({x: x[2]});
  };
});
