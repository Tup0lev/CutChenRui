define("scripts/object/score.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var translateX = require("scripts/animation").translateX;

  var score;

  exports.set = function() {
    score = layer.createText("default", "", -59, 24, "90-#fc7f0c-#ffec53", "30px").hide();
  };

  exports.show = function() {
    score.attr("text", "盈利0元");
    score.show();
    translateX(score, -59, 7, 500);
  };

  exports.hide = function() {
    translateX(score, 7, -59, 500, score.hide);
  };

  exports.resize = function() {

  };

  exports.number = function(number) {
    score.attr("text", "盈利" + number + "元");
    score.attr("font-size", "36px");
    setTimeout(function() {
      score.attr("font-size", "30px");
    }, 30);
  };

});
