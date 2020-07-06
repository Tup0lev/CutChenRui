define("scripts/main.js", function(exports, require, module) {
  "use strict";

  var scene = require("scripts/scene");
  var layer = require("scripts/layer");
  var soundManager = require("scripts/sound-manager");
  var fruitManager = require("scripts/fruit-manager");

  var imageList = [
    "images/flash.png",
    "images/game-over.png",
    "images/home-mask.png",
    "images/logo.png",
    "images/mistake.png",
    "images/new-game.png",
    "images/ninja.png",
    "images/shadow.png",
    "images/x.png",
    "images/xf.png",
    "images/xx.png",
    "images/xxf.png",
    "images/xxx.png",
    "images/xxxf.png"
  ];

  function preloadImages(callback) {
    for (var i = 0; i < imageList.length; i++) {
      layer.preloadImage(imageList[i], callback);
    }
    return imageList.length;
  }

  function preload(text, callback) {
    var info = "正在加载 %d/%d";
    info += "\n请打开声音...";

    var num = 0, count = 0;
    var onload = function() {
      num++;
      text.attr("text", info.replace("%d", num).replace("%d", count));
      if (num >= count) {
        callback();
      }
    };

    count += fruitManager.preloadImages(onload);
    count += preloadImages(onload);
  }

  exports.start = function() {
    soundManager.init();

    var text = layer.createText("default", "", 16, 20);
    preload(text, function() {
      setTimeout(function() {
        text.remove();
        scene.init();
        scene.switchScene("home-menu");
      }, 1000);
    });
  };

});
