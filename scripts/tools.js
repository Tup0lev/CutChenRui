define("scripts/tools.js", function(exports, require, module) {
  "use strict";

  exports.unsetObject = function(object) {
    for (var i in object)
      if (object.hasOwnProperty(i) && typeof object[i] == "function")
        object[i] = function() {};
  };

  exports.getAngleByRadian = function(radian) {
    return radian * 180 / Math.PI;
  };

  exports.pointToRadian = function(origin, point) {
    var PI = Math.PI;

    if (point[0] === origin[0]) {
      if (point[1] > origin[1])
        return PI * 0.5;
      return PI * 1.5
    } else if (point[1] === origin[1]) {
      if (point[0] > origin[0])
        return 0;
      return PI;
    }

    var t = Math.atan((origin[1] - point[1]) / (origin[0] - point[0]));

    if (point[0] > origin[0] && point[1] < origin[1])
      return t + 2 * PI;

    if (point[0] > origin[0] && point[1] > origin[1])
      return t;

    return t + PI;
  };

  exports.randomNumber = function(num) {
    return Math.floor(Math.random() * num);
  };

  exports.randomArray = function(arr) {
    arr = arr.slice(0);
    var ret = [], i = arr.length;
    while( i -- )
      ret.push( arr.splice( exports.randomNumber( i + 1 ), 1 )[0] );
    return ret;
  };

  exports.addEvent = function(target, name, fn) {
    var call = function() {
      fn.apply(target, arguments);
    };
    if (window.attachEvent) {
      target.attachEvent("on" + name, call);
    } else if (window.addEventListener) {
      target.addEventListener(name, call, false);
    } else {
      target["on" + name] = call;
    }
    return call;
  };

  exports.delEvent = function(target, name, fn) {
    if (window.detachEvent) {
      target.detachEvent("on" + name, fn);
    } else if (window.removeEventListener) {
      target.removeEventListener(name, fn, false);
    } else if (target["on" + name] == fn) {
      target["on" + name] = null;
    }
  };

});
