define("scripts/light.js", function(exports, require, module) {
  "use strict";

  /**
   * 炸弹爆炸时的光线
   */

  var layer = require("scripts/layer");

  var maskLayer = layer.getLayer("mask");
  layer = layer.getLayer("light");

  var tools = require("scripts/tools");
  var timeline = require("scripts/timeline");
  var layout = require("scripts/layout");

  var random = tools.randomNumber;

  var pi = Math.PI;
  var sin = Math.sin;
  var cos = Math.cos;

  var lights = [];
  var indexes = [];
  var lightsNum = 10;

  for (var i = 0; i < lightsNum; i++)
    indexes[i] = i;

  function removeLights() {
    for (var i = 0, l = lights.length; i < l; i++)
      lights[i].remove();
    lights.length = 0;
  }

  function build(x, y, r, color) {
    var l = layout.width() + layout.height();
    var a1, a2, x1, y1, x2, y2;

    a1 = r * 36 + random(10);
    a2 = a1 + 5;

    a1 = pi * a1 / 180;
    a2 = pi * a2 / 180;

    x1 = x + l * cos(a1);
    y1 = y + l * sin(a1);

    x2 = x + l * cos(a2);
    y2 = y + l * sin(a2);

    var light = layer.path(["M", x, y, "L", x1, y1, "L", x2, y2, "Z"]).attr({
      stroke: "none",
      fill: color
    });

    lights.push(light);
  }

  exports.start = function(fruit, callback) {
    var x = fruit.x,
      y = fruit.y,
      time = 0,
      idx = tools.randomArray(indexes);

    var i = lightsNum,
      b = function() {
        build(x, y, idx[this], fruit.color);
      };

    while (i--)
      setTimeout(b.bind(i), time += 100);

    setTimeout(function() {
      removeLights();
      callback();
    }, time + 100);
  };

  exports.showWhiteLight = function(callback) {
    var dur = 4e3;
    var mask = maskLayer.rect(0, 0, layout.width(), layout.height()).attr({
      fill: "#fff",
      stroke: "none"
    });
    var control = {
      onTimeUpdate: function(time) {
        mask.attr("opacity", 1 - time / dur);
      },

      onTimeEnd: function() {
        mask.remove();
        if (callback)
          callback();
      }
    };

    timeline.createTask({
      start: 0,
      duration: dur,
      object: control,
      onTimeUpdate: control.onTimeUpdate,
      onTimeEnd: control.onTimeEnd
    });
  };

});
