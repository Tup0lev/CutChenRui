define("scripts/animation.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var timeline = require("scripts/timeline");
  var tween = require("scripts/lib/tween");

  var anim = tween.exponential.co;

  exports.translateX = function(object, from, to, duration, callback) {
    return timeline.createTask({
      start: 0,
      duration: duration,
      object: object,

      onTimeUpdate: function(time) {
        object.attr({
          x: anim(time, from, to - from, duration)
        });
      },

      onTimeEnd: callback
    });
  };

  exports.translateY = function(object, from, to, duration, callback) {
    return timeline.createTask({
      start: 0,
      duration: duration,
      object: object,

      onTimeUpdate: function(time) {
        object.attr({
          y: anim(time, from, to - from, duration)
        });
      },

      onTimeEnd: callback
    });
  };

  exports.scale = function(object, from, to, duration, callback) {
    return timeline.createTask({
      start: 0,
      duration: duration,
      object: object,

      onTimeUpdate: function(time, zoom) {
        object.scale(zoom = anim(time, from, to - from, duration), zoom);
      },

      onTimeEnd: callback
    });
  };

});
