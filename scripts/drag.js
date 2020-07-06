define("scripts/drag.js", function(exports, require, module) {
  "use strict";

  var tools = require("scripts/tools");

  function getCoors(e) {
    var coors = [];
    if (e.targetTouches && e.targetTouches.length) { // iPhone
      var thisTouch = e.targetTouches[0];
      coors[0] = thisTouch.clientX;
      coors[1] = thisTouch.clientY;
    } else { // all others
      coors[0] = e.clientX;
      coors[1] = e.clientY;
    }
    return coors;
  }

  function BasicDrag() {
    var isTouch = this.isTouch = "ontouchstart" in window;

    this.TOUCH_START = isTouch ? "touchstart" : "mousedown",
      this.TOUCH_MOVE = isTouch ? "touchmove" : "mousemove",
      this.TOUCH_END = isTouch ? "touchend" : "mouseup";
  }

  BasicDrag.prototype.init = function(el) {
    this.element = el;
    tools.addEvent(el, this.TOUCH_START, function(e) {
      this.startDrag(getCoors(e));
      e.cancelBubble = true;
      e.stopPropagation && e.stopPropagation();
      return e.returnValue = false;
    }.bind(this));
  };

  //private
  BasicDrag.prototype.startDrag = function(coors) {
    var element = this.element;
    var draging = this.draging = {};
    this.isDraging = true;

    draging.mouseX = coors[0];
    draging.mouseY = coors[1];

    this.registerDocumentEvent();
  };

  //private
  BasicDrag.prototype.endDrag = function() {
    this.isDraging = false;
    this.unRegisterDocumentEvent();
  };

  //private
  BasicDrag.prototype.registerDocumentEvent = function() {
    var draging = this.draging;

    draging.documentSelectStart =
      tools.addEvent(document, "selectstart", function(e) {
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        return e.returnValue = false;
      });

    draging.documentMouseMove =
      tools.addEvent(document, this.TOUCH_MOVE, function(e) {
        var coors = getCoors(e);
        draging.newMouseX = coors[0];
        draging.newMouseY = coors[1];
        e.stopPropagation && e.stopPropagation();
        return e.returnValue = false;
      }.bind(this));

    draging.documentMouseUp =
      tools.addEvent(document, this.TOUCH_END, function() {
        this.endDrag();
      }.bind(this));

    var lx, ly;

    clearInterval(draging.timer);
    draging.timer = setInterval(function() {
      var dx, dy;
      if (draging.newMouseX != lx && draging.newMouseY != ly) {
        lx = draging.newMouseX;
        ly = draging.newMouseY;
        dx = draging.newMouseX - draging.mouseX;
        dy = draging.newMouseY - draging.mouseY;
        this.returnValue(dx, dy, draging.newMouseX, draging.newMouseY);
      }
    }.bind(this), 10);
  };

  //private
  BasicDrag.prototype.unRegisterDocumentEvent = function() {
    var draging = this.draging;
    tools.delEvent(document, this.TOUCH_MOVE, draging.documentMouseMove);
    tools.delEvent(document, this.TOUCH_END, draging.documentMouseUp);
    tools.delEvent(document, "selectstart", draging.documentSelectStart);
    clearInterval(draging.timer);
  };

  //private
  BasicDrag.prototype.returnValue = function(dx, dy, x, y) {
    //todo something
  };

  BasicDrag.prototype.on = function(name, fn) {
    var method = this[name];
    if (!method)
      return;
    this[name] = function() {
      method.apply(this, arguments);
      fn.apply(this, arguments);
    }.bind(this);
  };

  exports.create = function() {
    return new BasicDrag();
  };

});
