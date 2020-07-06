define("scripts/object/mistake.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var tween = require("scripts/lib/tween");
  var timeline = require("scripts/timeline");
  var layout = require("scripts/layout");
  var random = require("scripts/tools").randomNumber;

  function getImageSrc(size, checked) {
    return "images/" + size + (checked ? "f.png" : ".png");
  }

  function ClassMistake(x, y, w, h, size, checked) {
    this.size = size || "x";
    this.checked = !!checked;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.image = layer.createImage("default", getImageSrc(this.size, this.checked), x, y, w, h).hide();
  }

  ClassMistake.prototype.show = function() {
    this.image.show();
  };

  ClassMistake.prototype.hide = function() {
    this.image.hide();
  };

  ClassMistake.prototype.check = function() {
    this.checked = true;
    layer.replaceImage(this.image, getImageSrc(this.size, this.checked));
  };

  ClassMistake.prototype.uncheck = function() {
    this.checked = false;
    layer.replaceImage(this.image, getImageSrc(this.size, this.checked));
  };

  var mistakes = [];
  var number = 0, limit = 3, count = 30;

  function setPos() {
    var x = layout.width() - 1, y = 6;
    var width = 31, height = 32;
    x -= width;
    mistakes[0].image.attr({x: x, y: y});

    width = 27, height = 26;
    x -= width, y = 5;
    mistakes[1].image.attr({x: x, y: y});

    width = 22, height = 19;
    x -= width;
    mistakes[2].image.attr({x: x, y: y});

    var a = [-2, -1, 0, 1, 2];
    for (var i = 3; i < count; i++) {
      x -= width;
      y += a[random(a.length)];
      if (y < 0) y = 0;
      mistakes[i].image.attr({x: x, y: y});
    }
  }

  exports.set = function() {
    var width = 31, height = 32, x = 0, y = 0;
    mistakes.push(new ClassMistake(x, y, width, height, "xxx"));

    width = 27, height = 26;
    mistakes.push(new ClassMistake(x, y, width, height, "xx"));

    width = 22, height = 19;
    mistakes.push(new ClassMistake(x, y, width, height, "x"));

    for (var i = 3; i < count; i++) {
      mistakes.push(new ClassMistake(x, y, width, height));
    }
    setPos();
  };

  function reset() {
    number = 0, limit = 3;
    for (var i = 0; i < mistakes.length; i++) {
      mistakes[i].uncheck();
    }
  }

  exports.show = function() {
    reset();
    for (var i = 0; i < limit; i++)
      mistakes[i].show();
  };

  exports.hide = function() {
    for (var i = 0; i < mistakes.length; i++) {
      mistakes[i].hide();
    }
  };

  exports.add = function() {
    number++;
    if (number > limit) {
      number = limit;
      return;
    }

    mistakes[limit - number].check();
  };

  exports.subtract = function() {
    number--;
    if (number < 0) {
      number = 0;
      return;
    }

    mistakes[limit - 1 - number].uncheck();
  };

  exports.addLimit = function() {
    limit++;
    if (limit > mistakes.length) {
      limit = mistakes.length;
      return;
    }

    mistakes[limit - 1].show();
    if (number) {
      mistakes[limit - 1].check();
      mistakes[limit - 1 - number].uncheck();
    }
  };

  exports.subtractLimit = function() {
    limit--;
    if (limit < number) {
      limit = number;
      return;
    }

    mistakes[limit].hide();
    if (number) {
      mistakes[limit].uncheck();
      mistakes[limit - number].check();
    }
  };

  exports.resize = function() {
    setPos();
  };

  exports.showAt = function(x, y) {
    if (y === undefined)
      y = layout.height();

    var image = layer.createImage("default", "images/mistake.png", x - 27, y - 74, 54, 50).scale(1e-5, 1e-5);
    var duration = 500;

    var control = {
      show: function(start) {
        timeline.createTask({
          start: start,
          duration: duration,
          data: [tween.back.co, 1e-5, 1],
          object: this,
          onTimeUpdate: this.onScaling,
          onTimeEnd: this.onShowEnd
        });
      },

      hide: function(start) {
        timeline.createTask({
          start: start,
          duration: duration,
          data: [tween.back.ci, 1, 1e-5],
          object: this,
          onTimeUpdate: this.onScaling,
          onTimeEnd: this.onHideEnd
        });
      },

      onScaling: function(time, anim, a, b, z) {
        image.scale(z = anim(time, a, b - a, duration), z);
      },

      onShowEnd: function() {
        this.hide(1500);
      },

      onHideEnd: function() {
        image.remove();
      }
    };

    control.show(200);
  };

});
