define("scripts/sound.js", function(exports, require, module) {
  "use strict";

  function ClassSound(src) {
    this.sound = document.createElement("audio");
    var source = document.createElement("source");
    source.src = src;
    this.sound.appendChild(source);
    this.sound.preload = "auto";
    this.sound.volume = 1;
  }

  ClassSound.prototype.play = function() {
    return this.sound.play();
  };

  exports.create = function(src, opts) {
    return new ClassSound(src, opts);
  };

});
