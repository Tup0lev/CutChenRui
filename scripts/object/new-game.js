define("scripts/object/new-game.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var rotation = require("scripts/rotation");
  var layout = require("scripts/layout");
  var fruitManager = require("scripts/fruit-manager");

  var image, component
  var sideLength = 195;
  var imageX, imageY;

  var icon, iconWidth, iconHeight, iconX, iconY;

  function getImageXY() {
    imageX = layout.centerX(sideLength);
    imageY = layout.bottom(50, sideLength);
  }

  function getIconXY() {
    iconX = layout.centerX();
    iconY = layout.bottom(50, iconHeight);
  }

  exports.setIcon = function(groupName, w, h, callback) {
    if (icon)
      return;
    iconWidth = w;
    iconHeight = h;
    getIconXY();
    icon = fruitManager.create(groupName, iconX, iconY, true);
    icon.onSlice = function(fruit, angle) {
      icon.break(angle);
      icon = null;
      callback();
    }
  };

  exports.set = function() {
    getImageXY();
    image = layer.createImage("default", "images/new-game.png", imageX, imageY, sideLength, sideLength).hide();
    component = rotation.create(image);
  };

  exports.show = function() {
    component.show();
    if (icon) {
      icon.show();
    }
  };

  exports.hide = function() {
    component.hide();
  };

  exports.resize = function() {
    getImageXY();
    image.attr({
      x: imageX,
      y: imageY
    });

    if (icon) {
      getIconXY();
      icon.setPos(iconX, iconY);
    }
  };

});
