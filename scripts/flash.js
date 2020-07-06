define("scripts/flash.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var timeline = require("scripts/timeline").use("flash").init(10);
  var tween = require("scripts/lib/tween");

  var image;

  var anim = tween.quadratic.cio;
  var anims = [];
  var dur = 100;

  function createImage() {
    image = layer.createImage("flash", "images/flash.png", 0, 0, 358, 20).hide();
  }

  function onTimeUpdate(time, a, b, z) {
    image.scale(z = anim(time, a, b - a, dur), z);
  }

  exports.showAt = function(x, y, an) {
    if (!image)
      createImage();

    image.rotate(an, true).scale(1e-5, 1e-5).attr({
      x: x,
      y: y
    }).show();

    anims.clear && anims.clear();

    timeline.createTask({
      start: 0,
      duration: dur,
      data: [1e-5, 1],
      object: this,
      onTimeUpdate: onTimeUpdate,
      recycle: anims
    });

    timeline.createTask({
      start: dur,
      duration: dur,
      data: [1, 1e-5],
      object: this,
      onTimeUpdate: onTimeUpdate,
      recycle: anims
    });
  };

});
