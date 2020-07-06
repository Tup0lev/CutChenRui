define("scripts/rotation.js", function(exports, require, module) {
  "use strict";

  var timeline = require("scripts/timeline");
  var randomNumber = require("scripts/tools").randomNumber;
  var tween = require("scripts/lib/tween");

  var anim = tween.exponential.co;
  /**
   * 旋转类模块模型
   */

  exports.create = function(object) {
    var module = {};
    var rotateDire = [12, -12][randomNumber(2)];
    var defaultAngle = randomNumber(360);

    module.anims = [];

    module.show = function() {
      object.rotate(defaultAngle, true);
      object.show();

      timeline.createTask({
        start: 0,
        duration: -1,
        object: this,
        onTimeUpdate: module.onRotating,
        recycle: this.anims
      });
    };

    module.hide = function() {
      this.anims.clear();
      object.hide();
    };

    module.onRotating = function() {
      var lastTime = 0,
        an = defaultAngle;
      return function(time) {
        an = (an + (time - lastTime) / 1e3 * rotateDire) % 360;
        object.rotate(an, true);
        lastTime = time;
      }
    }();

    return module;
  };

});
