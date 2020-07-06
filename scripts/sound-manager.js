define("scripts/sound-manager.js", function(exports, require, module) {
  "use strict";

  var sound = require("scripts/sound");
  var random = require("scripts/tools").randomNumber;

  var soundArrays = {
    "basiclaw": 2,
    "shakespeare": 2,
    "gesar": 1,
    "winnie": 1,
    "ferrari": 6,
    "fault": 10,
    "frog": 4,
    "bun": 5,
    "gameover": 3
  };

  function loadArrays() {
    var arr, count, src;
    for (var name in soundArrays) {
      arr = [];
      count = soundArrays[name];
      for (var i = 0; i < count; i++) {
        arr.push(sound.create("sounds/" + name + (i + 1) + ".mp3"));
      }
      soundArrays[name] = arr;
    }
  }

  exports.init = function() {
    loadArrays();
  };

  exports.play = function(name) {
    var arr = soundArrays[name];
    var len = arr.length;
    return arr[len == 1 ? 0 : random(len)].play();
  };

});
