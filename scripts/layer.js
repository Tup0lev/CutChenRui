define("scripts/layer.js", function(exports, require, module) {
  "use strict";

  /**
   * layer manager
   */

  var Raphael = require("scripts/lib/raphael");
  var layout = require("scripts/layout");

  var layers = {};
  var zIndexes = {
    "default": zi(),
    "light": zi(),
    "knife": zi(),
    "fruit": zi(),
    "juice": zi(),
    "flash": zi(),
    "mask": zi()
  };


  var imageCache = {};

  exports.preloadImage = function(src, callback) {
    var img = new Image(), canvas, ctx, error;
    //img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = function() {
      canvas = document.createElement('canvas');
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        imageCache[src] = canvas.toDataURL();
      } catch (e) {
        error = e;
      }
      callback(error);
    };
  };

  exports.replaceImage = function(image, src) {
    src = imageCache[src] || src;
    image.attr("src", src);
  };

  exports.createImage = function(layer, src, x, y, w, h) {
    layer = this.getLayer(layer);
    src = imageCache[src] || src;
    return layer.image(src, x, y, w, h);
  };

  exports.createText = function(layer, text, x, y, fill, size) {
    layer = this.getLayer(layer);

    return layer.text(x, y, text).attr({
      fill: fill || "#fff",
      "font-size": size || "14px",
      "text-anchor": "start"
    });
  };

  exports.getLayer = function(name) {
    var p, layer;
    name = name || "default";

    if (p = layers[name]) {
      return p;
    } else {
      layer = document.createElement("div");
      layer.className = "layer";
      layer.style.cssText = "z-index: " + (zIndexes[name] || 0) + ";";

      document.getElementById("extra").appendChild(layer);
      p = layers[name] = Raphael(layer, layout.width(), layout.height());
      return p;
    }
  };

  function zi() {
    return zi.num = ++zi.num || 2;
  };

  exports.resize = function() {
    for (var name in layers) {
      layers[name].setSize(layout.width(), layout.height());
    }
  };
});
