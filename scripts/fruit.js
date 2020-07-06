define("scripts/fruit.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var tools = require("scripts/tools");
  var timeline = require("scripts/timeline").use("fruit").init(1);
  var timeline2 = require("scripts/timeline").use("fruit-apart").init(1);
  var tween = require("scripts/lib/tween");
  var juice = require("scripts/juice");
  var flash = require("scripts/flash");
  var light = require("scripts/light");
  var layout = require("scripts/layout");

  /**
   * 水果模块模型
   */

  var zoomAnim = tween.exponential.co;
  var linearAnim = tween.linear;
  var dropAnim = tween.quadratic.ci;
  var fallOffAnim = tween.quadratic.co;

  var random = tools.randomNumber;
  var min = Math.min;
  var average = function(a, b) {
    return ((a + b) / 2) >> 0;
  };
  var sign = [-1, 1];

  var dropXScope = 200,
    shadowPos = 50;

  function ClassFruit(x, y, info, hide) {
    this.x = x;
    this.y = y;

    this.img = info.img;
    this.width = info.width;
    this.height = info.height;
    this.radius = info.radius;
    this.fixAngle = info.fixAngle || 0;
    this.isStatic = info.isStatic;
    this.isBomb = info.isBomb;
    this.color = info.color;
    if (this.color === undefined)
      this.color = this.isBomb ? "#fff" : "#c00";
    this.dropTime = info.dropTime || 1000;

    this.anims = [];

    var imgSrc = "images/fruit/" + this.img + ".png";
    x = this.x - (this.width >> 1);
    y = this.y - (this.height >> 1);
    this.shadow = layer.createImage("fruit", "images/shadow.png", x, y + shadowPos, 106, 77);
    this.image = layer.createImage("fruit", imgSrc, x, y, this.width, this.height);

    if (hide) {
      this.image.hide();
      this.shadow.hide();
    }
  }

  ClassFruit.prototype.show = function() {
    timeline.createTask({
      start: 0,
      duration: 500,
      object: this,
      onTimeStart: function() {
        this.image.scale(1e-5, 1e-5);
        this.image.show();
      },
      onTimeUpdate: function(time, z) {
        this.image.scale(z = zoomAnim(time, 1e-5, 1 - 1e-5, 500), z);
      },
      recycle: this.anims
    });
  };

  ClassFruit.prototype.setPos = function(x, y) {
    if (x === this.x && y === this.y)
      return;

    this.x = x;
    this.y = y;

    this.image.attr({
      x: x -= (this.width >> 1),
      y: y -= (this.height >> 1)
    });
    this.shadow.attr({
      x: x,
      y: y + shadowPos
    });

  };

  ClassFruit.prototype.rotate = function(speed) {
    this.rotateAnim = timeline.createTask({
      start: 0,
      duration: -1,
      object: this,
      onTimeUpdate: function(time) {
        this.image.rotate((speed * time / 1e3) % 360, true);
      },
      recycle: this.anims
    });
  };

  ClassFruit.prototype.break = function(angle, callback) {
    if (this.isBroken)
      return;
    this.isBroken = true;

    if (!this.isBomb) {
      flash.showAt(this.x, this.y, angle);
      juice.create(this.x, this.y, this.color);
      this._split(angle, callback);
    } else {
      this._explode(callback);
    }
  };

  // private
  ClassFruit.prototype._split = function(angle, callback) {
    this.anims.clear();
    this.image.hide();
    this.shadow.hide();

    var dropTime = this.dropTime;
    var startX = this.x;
    var startY = this.y;
    var targetX1 = -(random(dropXScope) + 75);
    var targetY1 = layout.height() + 120;
    var targetX2 = random(dropXScope + 75);
    var targetY2 = targetY1;

    var bImage1RotateAngle = -random(150) - 50;
    var bImage2RotateAngle = random(150) + 50;

    var imgSrc1 = "images/fruit/" + this.img + "-1.png";
    var imgSrc2 = "images/fruit/" + this.img + "-2.png";

    angle = ((angle % 180) + 360 + this.fixAngle) % 360;

    var x = startX - (this.width >> 1);
    var y = startY - (this.height >> 1);
    this.bImage1 = layer.createImage("fruit", imgSrc1, x, y, this.width, this.height);
    this.bImage2 = layer.createImage("fruit", imgSrc2, x, y, this.width, this.height);

    this.bImage1.rotate(angle);
    this.bImage2.rotate(angle);

    timeline2.createTask({
      start: 0,
      duration: dropTime,
      object: this,

      onTimeUpdate: function(time) {
        this.bImage1.attr({
          x: linearAnim(time, x, targetX1, dropTime),
          y: dropAnim(time, y, targetY1 - y, dropTime)
        }).rotate(linearAnim(time, angle, bImage1RotateAngle, dropTime), true);

        this.bImage2.attr({
          x: linearAnim(time, x, targetX2, dropTime),
          y: dropAnim(time, y, targetY2 - y, dropTime)
        }).rotate(linearAnim(time, angle, bImage2RotateAngle, dropTime), true);
      },

      onTimeEnd: function() {
        if (callback)
          callback();
        this.remove();
      },
      recycle: this.anims
    });
  };

  // private
  ClassFruit.prototype._explode = function(callback) {
    this.anims.clear();
    var fruit = this;
    light.start(fruit, function() {
      if (callback)
        callback();
      fruit.remove();
    });
  };

  ClassFruit.prototype.stop = function() {
    if (this.isBroken)
      return;
    this.anims.clear();
  };

  ClassFruit.prototype.throw = function(callback) {
    var fallTargetX = random(layout.width());
    var fallTargetY = layout.height() + 120;

    var dropTime = this.dropTime;
    var startX = this.x;
    var startY = this.y;
    var endX = average(startX, fallTargetX);
    var endY = min(startY - random(startY - 100), 100);

    timeline.createTask({
      start: 0,
      duration: dropTime,
      object: this,
      onTimeUpdate: function(time) {
        this.setPos(
          linearAnim(time, startX, endX - startX, dropTime),
          fallOffAnim(time, startY, endY - startY, dropTime)
        );
      },
      onTimeEnd: function() {
        this._fallOff(fallTargetX, fallTargetY, callback);
      },
      recycle: this.anims
    });

    if (!this.isStatic)
      this.rotate((random(180) + 90) * sign[random(2)]);
  };

  // private
  ClassFruit.prototype._fallOff = function(endX, endY, callback) {
    if (this.isBroken)
      return;

    var startX = this.x;
    var startY = this.y;
    var dropTime = this.dropTime;
    var y;
    var isOutside = false;

    timeline.createTask({
      start: 0,
      duration: dropTime,
      object: this,

      onTimeUpdate: function(time) {
        this.setPos(
          linearAnim(time, startX, endX - startX, dropTime),
          y = dropAnim(time, startY, endY - startY, dropTime)
        );
        if (!isOutside) {
          if (y > layout.height() + (this.height >> 1)) {
            isOutside = true;
            if (callback)
              callback();
          }
        }
      },

      onTimeEnd: function() {
        if (!isOutside) {
          isOutside = true;
          if (callback)
            callback();
        }
        this.remove();
      },

      recycle: this.anims
    });
  };

  ClassFruit.prototype.remove = function() {
    var index;

    this.anims.clear();

    if (this.rotateAnim) {
      this.rotateAnim.stop();
    }

    if (this.image) {
      this.image.remove();
      this.shadow.remove();
    }

    if (this.bImage1) {
      this.bImage1.remove();
      this.bImage2.remove();
    }

    for (var name in this) {
      if (typeof this[name] === "function") {
        this[name] = function(name) {
          return function() {
            throw new Error("method " + name + " has been removed");
          };
        }(name);
      } else {
        delete this[name];
      }
    }
  };

  exports.create = function(x, y, info, hide) {
    return new ClassFruit(x, y, info, hide);
  };

});
