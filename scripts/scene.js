define("scripts/scene.js", function(exports, require, module) {
  "use strict";

  var soundManager = require("scripts/sound-manager");
  var fruitManager = require("scripts/fruit-manager");
  var drag = require("scripts/drag");
  var knife = require("scripts/knife");
  var layout = require("scripts/layout");
  var layer = require("scripts/layer");
  var tools = require("scripts/tools");

  var background = require("scripts/object/background");
  var logo = require("scripts/object/logo");
  var newGame = require("scripts/object/new-game");
  var score = require("scripts/object/score");
  var mistake = require("scripts/object/mistake");
  var gameOver = require("scripts/object/game-over");

  var game = require("scripts/game");

  var newGameIcon;
  var gameOverState;
  var curScene;

  var playButton;
  function showPlayButton(cb) {
    if (playButton) {
      setTimeout(cb, 2000);
      return;
    }
    playButton = document.getElementById("play-button");
    playButton.style.display = "block";
    tools.addEvent(playButton, "ontouchend" in window ? "touchend" : "click", function() {
      playButton.style.display = "none";
      cb();
    });
  }

  function showNewGame() {
    newGame.setIcon("winnie", 96, 96, function(){
      soundManager.play("winnie");
      switchScene("game-body");
    });
    newGame.show();
  }

  var _sceneHomeMenu = {
    enter: function() {
      logo.show();
      showPlayButton(showNewGame);
    },

    exit: function() {
      newGame.hide();
      logo.hide();
    }
  };

  var _sceneGameBody = {
    enter: function() {
      score.show();
      mistake.show();
      game.start(function() {
        switchScene("game-over");
      });
    },

    exit: function() {}
  };

  var _sceneGameOver = {
    enter: function() {
      soundManager.play("gameover");
      gameOver.show();
      setTimeout(function() {
        gameOverState = true;
      }, 1000);
    },

    exit: function() {
      gameOverState = false;
      score.hide();
      mistake.hide();
      gameOver.hide();
    }
  };

  var sceneList = {
    "home-menu": _sceneHomeMenu,
    "game-body": _sceneGameBody,
    "game-over": _sceneGameOver
  };

  function switchScene(name, delay) {
    if (curScene === name)
      return;
    if (curScene)
      sceneList[curScene].exit();
    curScene = name;

    if (delay) {
      setTimeout(sceneList[name].enter, delay);
    } else {
      sceneList[name].enter();
    }
  }

  function bindDrag() {
    var dragger = drag.create();

    var ret;
    dragger.on("returnValue", function(dx, dy, x, y) {
      if (ret = knife.through(x - layout.x(), y - layout.y()))
        fruitManager.checkCollision(ret);
    });

    dragger.on("startDrag", function() {
      knife.newKnife();
    });

    dragger.init(document.documentElement);
  }

  var inited = false;
  function init() {
    if (inited) return;

    logo.set();
    newGame.set();
    mistake.set();
    score.set();
    gameOver.set();

    bindDrag();

    tools.addEvent(document, "ontouchend" in window ? "touchend" : "click", function() {
      if (gameOverState)
        switchScene("home-menu", 1000);
    });

    resize();
    inited = true;
  }

  function resize() {
    layer.resize();
    background.resize();
    if (inited) {
      logo.resize();
      newGame.resize();
      mistake.resize();
      score.resize();
      gameOver.resize();
    }
  }

  background.set();
  tools.addEvent(window, "resize", resize);

  exports.init = init;
  exports.switchScene = switchScene;

});
