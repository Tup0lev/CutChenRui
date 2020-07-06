define("scripts/juice.js", function(exports, require, module) {
  "use strict";

  /**
   * 果汁
   */
  var tools = require("scripts/tools");
  var layer = require("scripts/layer").getLayer("juice");
  var timeline = require("scripts/timeline").use("juice").init(10);
  var tween = require("scripts/lib/tween");

  var random = tools.randomNumber;
  var dur = 1500;
  var anim = tween.exponential.co;
  var dropAnim = tween.quadratic.co;
  var sin = Math.sin;
  var cos = Math.cos;

  var num = 10;
  var radius = 10;

  function ClassJuice(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;

    this.distance = random(200) + 100;
    this.radius = radius;
    this.dir = random(360) * Math.PI / 180;
  }

  ClassJuice.prototype.render = function() {
    this.circle = layer.circle(this.x, this.y, this.radius).attr({
      fill: this.color,
      stroke: "none"
    });
  };

  ClassJuice.prototype.sputter = function() {
    timeline.createTask({
      start: 0,
      duration: dur,
      object: this,
      onTimeUpdate: this.onTimeUpdate,
      onTimeEnd: this.onTimeEnd
    });
  };

  ClassJuice.prototype.onTimeUpdate = function(time) {
    var distance, x, y, z;

    distance = anim(time, 0, this.distance, dur);
    x = this.x + distance * cos(this.dir);
    y = this.y + distance * sin(this.dir) + dropAnim(time, 0, 200, dur);
    z = anim(time, 1, -1, dur);

    this.circle.attr({
      cx: x,
      cy: y
    }).scale(z, z);
  };

  ClassJuice.prototype.onTimeEnd = function() {
    this.circle.remove();
    tools.unsetObject(this);
  };

  exports.create = function(x, y, color) {
    for (var i = 0; i < num; i++)
      this.createOne(x, y, color);
  };

  exports.createOne = function(x, y, color) {
    if (!color)
      return;

    var juice = new ClassJuice(x, y, color);
    juice.render();
    juice.sputter();
  };

});
