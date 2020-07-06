define("scripts/fruit-manager.js", function(exports, require, module) {
  "use strict";

  var layer = require("scripts/layer");
  var fruit = require("scripts/fruit");
  var collision = require("scripts/collision");
  var tools = require("scripts/tools");
  var random = tools.randomNumber;
  var getAngleByRadian = tools.getAngleByRadian;
  var pointToRadian = tools.pointToRadian;

  var groups = {
    "frog": [
      {img: "f1", width: 128, height: 128, radius: 36, fixAngle: 5},
      {img: "f2", width: 128, height: 128, radius: 36, fixAngle: 5},
      {img: "f3", width: 128, height: 128, radius: 36, fixAngle: -25},
      {img: "f4", width: 128, height: 128, radius: 36, fixAngle: -25},
      {img: "f5", width: 128, height: 128, radius: 36, fixAngle: -45},
      {img: "f6", width: 128, height: 128, radius: 36, fixAngle: -45}
    ],

    "bun": [
      {img: "b1", width: 128, height: 128, radius: 32, fixAngle: -45, color: "#e6c731"},
      {img: "b2", width: 128, height: 128, radius: 32, fixAngle: -85, color: "#e6c731"},
      {img: "b3", width: 128, height: 128, radius: 32, fixAngle: -5, color: "#e6c731"},
      {img: "b4", width: 128, height: 128, radius: 32, fixAngle: -95, color: "#e6c731"}
    ],

    "winnie": [
      {img: "w1", width: 96, height: 96, radius: 36, fixAngle: 180},
      {img: "w2", width: 96, height: 96, radius: 36, fixAngle: 180},
      {img: "w3", width: 96, height: 96, radius: 36, fixAngle: 180}
    ],

    "gesar": [
      {img: "gesar", width: 68, height: 96, radius: 36, isBomb: true, isStatic: true, color: "#c8e925"}
    ],

    "basiclaw": [
      {img: "basiclaw", width: 66, height: 96, radius: 36, isBomb: true, isStatic: true, color: "#ffe155"}
    ],

    "shakespeare": [
      {img: "s1", width: 66, height: 96, radius: 36, isBomb: true, isStatic: true, color: "#ea5519"},
      {img: "s2", width: 72, height: 100, radius: 38, isBomb: true, isStatic: true, color: "#ea5519"}
    ],

    "ferrari": [
      {img: "ferrari", width: 192, height: 192, radius: 96, isBomb: true, isStatic: true, color: "#cc453b"}
    ],

    "fault": [
      {img: "zy", width: 100, height: 100, radius: 50, isBomb: true, isStatic: true}
    ]

  };

  var collisionList = [], pendingRemoveList = [];

  function removeFromList(fruit) {
    var index = collisionList.indexOf(fruit);
    if (index > -1) {
      collisionList.splice(index, 1);
    }
  }

  exports.create = function(groupName, x, y, hide) {
    var group = groups[groupName];
    var len = group.length;
    var info = len == 1 ? group[0] : group[random(len)];
    var f = fruit.create(x, y, info, hide);
    f.groupName = groupName;
    collisionList.unshift(f);
    return f;
  };

  exports.throw = function(groupName, x, y) {
    var fruit = exports.create(groupName, x, y);
    fruit.throw(function() {
      removeFromList(fruit);
      if (fruit.onFallOff)
        fruit.onFallOff(fruit);
    });
    return fruit;
  };

  exports.checkCollision = function(knife) {
    var angle;
    collisionList.forEach(function(fruit) {
      if (!collision.check(knife, fruit))
        return;
      angle = getAngleByRadian(pointToRadian(knife.slice(0, 2), knife.slice(2, 4)));
      removeFromList(fruit);
      if (fruit.onSlice)
        fruit.onSlice(fruit, angle);
    });
  };

  exports.stopAll = function() {
    while (collisionList.length) {
      collisionList[0].stop();
      pendingRemoveList.unshift(collisionList.shift());
    }
  };

  exports.removeAll = function() {
    while (pendingRemoveList.length) {
      pendingRemoveList[0].remove();
      pendingRemoveList.shift();
    }
  };

  exports.count = function() {
    return collisionList.length;
  };


  function preloadImage(name, callback) {
    var src = "images/fruit/" + name + ".png";
    layer.preloadImage(src, callback);
    return 1;
  }

  function preloadGroupImage(arr, callback) {
    var info, imgName, count = 0;
    for (var i = 0; i < arr.length; i++) {
      info = arr[i];
      imgName = info.img;
      count += preloadImage(imgName, callback);
      if (!info.isBomb) {
        count += preloadImage(imgName + "-1", callback);
        count += preloadImage(imgName + "-2", callback);
      }
    }
    return count;
  }

  exports.preloadImages = function(callback) {
    var count = 0;
    for (var groupName in groups) {
      count += preloadGroupImage(groups[groupName], callback)
    }
    return count;
  };

});
