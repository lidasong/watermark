(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["watermark"] = factory();
	else
		root["watermark"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(1);

var INTERVAL = 1e3;

var config = {
  text: "watermark",
  imgSrc: null,
  rotate: 10,
  xSpace: 80,
  ySpace: 80,
  font: {
    size: 16,
    family: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif'
  },
  xStart: 40,
  yStart: 40,
  opacity: .08,
  zIndex: 10000,
  color: "#ddd",
  parent: document.body,
  className: 'water-mark-wrap',
  isNeedLoop: true
};
var $items = [],
    offsetWidth = void 0,
    offsetHeight = void 0,
    isInited = false,
    isPainting = false;
$wmContainer = null, markImg = null, function reset(repaint, context, interval) {
  clearTimeout(repaint.tId);
  repaint.tId = setTimeout(function () {
    repaint.call(context);
  }, interval);
};

function getItemElement() {
  var $wrap = document.createElement("div");
  if (config.imgSrc && markImg) {
    $wrap.appendChild(markImg.cloneNode(true));
  }
  $wrap.innerText = config.text;
  $wrap.className = config.className;
  return $wrap;
}

function setItemOffset() {
  var parent = config.parent;
  var $item = getItemElement();
  $item.style.top = "-1000px";
  parent.appendChild($item);
  offsetWidth = $item.offsetWidth;
  offsetHeight = $item.offsetHeight;
  parent.removeChild($item);
}

function collectItems(left, top) {
  var $item = getItemElement();
  $item.style.left = left + "px";
  $item.style.top = top + "px";
  $item.style.width = offsetWidth + "px";
  $item.style.height = offsetHeight + "px";
  $wmContainer.appendChild($item);
  $items.push($item);
}

function initMark() {
  var width = void 0,
      height = void 0,
      parent = config.parent;
  if (config.imgSrc) {
    if (!markImg) {
      markImg = new Image();
      markImg.onload = function () {
        isPainting = true;
        initMark();
      };
      markImg.src = config.imgSrc;
      return;
    }
    if (!isPainting) {
      return;
    }
  }

  var xStart = config.xStart,
      yStart = config.yStart,
      xSpace = config.xSpace,
      ySpace = config.ySpace;
  var _ref = [Math.max(parent.clientWidth, parent.scrollWidth, document.documentElement.scrollWidth), Math.max(parent.clientHeight, parent.scrollHeight, document.documentElement.scrollHeight)];
  width = _ref[0];
  height = _ref[1];


  setItemOffset();

  for (var tempY = yStart; height > tempY + offsetHeight; tempY += ySpace + offsetHeight) {
    for (var tempX = xStart; width > tempX + offsetWidth; tempX += xSpace + offsetWidth) {
      collectItems(tempX, tempY);
    }
  }
}

function repaint() {
  if ($items.length) {
    clear();
    mark();
  }
}

function loopPaint() {
  var parent = config.parent;
  var originWidth = Math.max(parent.clientWidth, parent.scrollWidth, document.documentElement.scrollWidth),
      originHeight = Math.max(parent.clientHeight, parent.scrollHeight, document.documentElement.scrollHeight);

  setTimeout(cycle, INTERVAL);

  function cycle() {
    var width = Math.max(parent.clientWidth, parent.scrollWidth, document.documentElement.scrollWidth),
        height = Math.max(parent.clientHeight, parent.scrollHeight, document.documentElement.scrollHeight);
    if (originWidth !== width || originHeight !== height) {
      originWidth = width;
      originHeight = height;
      repaint();
    }
    config.isNeedLoop && setTimeout(cycle, INTERVAL);
  }
}

function initPaint() {
  if (isInited) {
    return;
  }
  isInited = true;
  window.onresize = function () {
    reset(repaint, this, 300);
  };
  loopPaint();
}

function initMarkStyle() {
  var ID = 'water-mark-style';
  var $head = document.head || document.getElementsByTagName("head")[0],
      className = config.className,
      zIndex = config.zIndex,
      color = config.color,
      opacity = config.opacity,
      rotate = config.rotate,
      _config$font = config.font,
      size = _config$font.size,
      family = _config$font.family;

  styles = '\n      .' + className + ' {\n        position: absolute;\n        pointer-events: none;\n        z-index: ' + zIndex + ';\n        font-size: "' + size + 'px";\n        font-family: ' + family + ';\n        color: "' + color + '";\n        opacity: ' + opacity + ';\n        filter: alpha(opacity=' + 100 * opacity + ');\n        ' + ['-webkit-', '-moz-', '-o-', '-ms-', ''].map(function (item) {
    return item + "transform:rotate(" + -rotate + "deg);";
  }).join('') + '\n      }\n    ';

  document.getElementById(ID) && $head.removeChild(document.getElementById(ID));

  $style = document.createElement("style");
  $style.type = 'text/css';
  $style.id = ID;
  $style.innerHTML = '';

  $style.styleSheet ? $style.styleSheet.cssText = styles : $style.appendChild(document.createTextNode(styles));
  $head.appendChild($style);
}

function generateMarkContainer() {
  if ($wmContainer) {
    return;
  }
  $wmContainer = document.createElement("div");
  $wmContainer.setAttribute('className', 'water-mark-container');
  config.parent.appendChild($wmContainer);
}

function mark(opts) {
  opts = opts || {};
  _.extend(config, opts);
  clear();
  generateMarkContainer();
  initMarkStyle();
  initMark();
  initPaint();
  _.isFunction(opts.callback) && opts.callback();
}

function clear() {
  if ($wmContainer) {
    markImg = null;
    isPainting = false;
    for (; $items.length;) {
      $wmContainer.removeChild($items.shift());
    }
  }
}

module.exports = {
  mark: mark,
  clear: clear
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
  isObject: function isObject(arg) {
    return "[object Object]" === Object.prototype.toString.call(arg);
  },
  extend: function extend(dest, source) {
    if (this.isObject(dest) && this.isObject(source)) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }
    return dest;
  },
  isFunction: function isFunction(arg) {
    return typeof arg === 'function';
  }
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=watermark.js.map