define("scripts/game.js", function(exports, require, module) {
  "use strict";

  /**
   * game logic
   */
  var soundManager = require("scripts/sound-manager");
  var fruitManager = require("scripts/fruit-manager");
  var score = require("scripts/object/score");
  var mistake = require("scripts/object/mistake");
  var background = require("scripts/object/background");
  var light = require("scripts/light");
  var layout = require("scripts/layout");
  var random = require("scripts/tools").randomNumber;

  var gameInterval;
  var onGameOver;

  var scoreNumber;
  var mistakeNumber;
  var mistakeLimit;
  var gameOver;

  function reset() {
    scoreNumber = 0;
    mistakeNumber = 0;
    mistakeLimit = 3;
    gameOver = false;
  }

  function end() {
    if (gameOver)
      return;
    gameOver = true;

    clearInterval(gameInterval);
    gameInterval = null;

    setTimeout(onGameOver, 1000);
  }

  function explode(fruit) {
    if (gameOver)
      return;
    gameOver = true;

    clearInterval(gameInterval);
    gameInterval = null;

    fruitManager.stopAll();
    background.wobble();
    fruit.break(0, function() {
      fruitManager.removeAll();
      background.stop();
      light.showWhiteLight(onGameOver);
    });
  }

  function addScore(n) {
    scoreNumber += n;
    score.number(scoreNumber);
  }

  function addMistake(x, y) {
    mistake.showAt(x, y);
    mistake.add();
    mistakeNumber++;
    if (mistakeNumber >= mistakeLimit) {
      end();
    }
  }

  function subtractMistake() {
    if (mistakeNumber > 0) {
      mistake.subtract();
      mistakeNumber--;

    } else if (mistakeLimit < 30) {
      mistake.addLimit();
      mistakeLimit++;

    } else {
      addScore(301);
    }
  }

  function addMistakeLimit() {
    if (mistakeLimit < 30) {
      mistake.addLimit();
      mistakeLimit++;

    } else if (mistakeNumber > 0) {
      mistake.subtract();
      mistakeNumber--;

    } else {
      addScore(301);
    }
  }

  function subtractMistakeLimit() {
    mistake.subtractLimit();
    mistakeLimit--;
    if (mistakeNumber >= mistakeLimit) {
      end();
    }
  }

  function throwFruit(group, num) {
    var startX = random(layout.width()),
      startY = layout.height() + 120;
    var fruit = fruitManager.throw(group, startX, startY);
    fruit.onSlice = onSlice;
    fruit.onFallOff = onFallOff;

    if (num && num > 1) {
      num--;
      throwFruit(group, num);
    }
  }

  function onFallOff(fruit) {
    if (gameOver)
      return;

    if (fruit.groupName != "bun")
      return;
    addMistake(fruit.x);
  }

  function onSlice(fruit, angle) {
    if (gameOver)
      return;

    soundManager.play(fruit.groupName);
    switch (fruit.groupName) {
      case "fault":
        explode(fruit);
        return;

      case "bun":
        addScore(1);
        break;

      case "frog":
        addScore(89);
        addMistake(fruit.x, fruit.y);
        break;

      case "winnie":
        addScore(64);
        break;

      case "gesar":
        throwFruit("winnie", 2);
        throwFruit("frog", 2);
        throwFruit("bun", 4);
        break;

      case "basiclaw":
        addMistakeLimit();
        break;

      case "ferrari":
        subtractMistake();
        break;

      case "shakespeare":
        subtractMistakeLimit();
        break;
    }

    fruit.break(angle);
  }

  function gameLogic() {
    var group = "bun", num = 1;
    var r = random(10000);

    if (r < 500) {
      // 5%
      group = "fault";

    } else if (r < 1000) {
      // 5%
      group = "basiclaw";

    } else if (r < 1500) {
      // 5%
      group = "ferrari";

    } else if (r < 2000) {
      // 5%
      group = "gesar";

    } else if (r < 2500) {
      // 5%
      group = "winnie";

    } else if (r < 3000) {
      // 5%
      group = "shakespeare";

    } else if (r < 6500) {
      // 35%
      group = "frog";

    } else {
      // 35%
      num += random(2);
    }

    throwFruit(group, num);
  }

  exports.start = function(callback) {
    if (gameInterval)
      return;
    reset();
    onGameOver = callback;
    setTimeout(function() {
      gameInterval = setInterval(gameLogic, 1000);
    }, 500);
  };

});
