const _ = require('./util');

const INTERVAL = 1e3;

let config = {
  text: "watermark",
  imgSrc: null,
  rotate: 10,
  xSpace: 80,
  ySpace: 80,
  font:{
    size: 16,
    family: '"Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif',
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
let $items = [],offsetWidth,offsetHeight,
  isInited = false,isPainting = false;
  $wmContainer = null,markImg = null,


function reset(repaint, context, interval) {
  clearTimeout(repaint.tId);
  repaint.tId = setTimeout(function() {
    repaint.call(context);
  }, interval);
}

function getItemElement() {
  let $wrap = document.createElement("div");
  if(config.imgSrc && markImg){
    $wrap.appendChild(markImg.cloneNode(true));
  }
  $wrap.innerText = config.text;
  $wrap.className = config.className;
  return $wrap;
}

function setItemOffset() {
  let parent = config.parent;
  let $item = getItemElement();
  $item.style.top = "-1000px";
  parent.appendChild($item);
  offsetWidth = $item.offsetWidth;
  offsetHeight = $item.offsetHeight;
  parent.removeChild($item);
}

function collectItems(left, top) {
  let $item = getItemElement();
  $item.style.left = left + "px";
  $item.style.top = top + "px";
  $item.style.width = offsetWidth + "px";
  $item.style.height = offsetHeight + "px";
  $wmContainer.appendChild($item);
  $items.push($item);
}

function initMark() {
  let width,height,parent = config.parent;
  if (config.imgSrc) {
    if(!markImg){
      markImg = new Image;
      markImg.onload = () => {
        isPainting = true;
        initMark();
      };
      markImg.src = config.imgSrc;
      return;
    }
    if(!isPainting){
      return;
    }
  }

  let {xStart,yStart,xSpace,ySpace} = config;

  [width,height] = [
    Math.max(parent.clientWidth, parent.scrollWidth, document.documentElement.scrollWidth),
    Math.max(parent.clientHeight, parent.scrollHeight, document.documentElement.scrollHeight)
  ];

  setItemOffset();

  for (let tempY = yStart; height > tempY + offsetHeight; tempY += ySpace + offsetHeight) {
    for (let tempX = xStart; width > tempX + offsetWidth; tempX += xSpace + offsetWidth) {
      collectItems(tempX, tempY)
    }
  }
}

function repaint() {
  if($items.length){
    clear();
    mark();
  }
}

function loopPaint() {
  let parent = config.parent;
  let originWidth = Math.max(parent.clientWidth, parent.scrollWidth, document.documentElement.scrollWidth),
    originHeight = Math.max(parent.clientHeight, parent.scrollHeight, document.documentElement.scrollHeight);

  setTimeout(cycle, INTERVAL);

  function cycle() {
    let width = Math.max(parent.clientWidth, parent.scrollWidth, document.documentElement.scrollWidth),
      height = Math.max(parent.clientHeight, parent.scrollHeight, document.documentElement.scrollHeight);
    if(originWidth !== width || originHeight !== height){
      originWidth = width;
      originHeight = height;
      repaint();
    }
    config.isNeedLoop && setTimeout(cycle, INTERVAL);
  }
}

function initPaint() {
  if(isInited){
    return;
  }
  isInited = true;
  window.onresize = function() {
    reset(repaint, this, 300);
  };
  loopPaint();
}

function initMarkStyle() {
  const ID = 'water-mark-style';
  let $head = document.head || document.getElementsByTagName("head")[0],
    {className,zIndex,color,opacity,rotate,font:{size,family}} = config;
    styles = `
      .${className} {
        position: absolute;
        pointer-events: none;
        z-index: ${zIndex};
        font-size: "${size}px";
        font-family: ${family};
        color: "${color}";
        opacity: ${opacity};
        filter: alpha(opacity=${100 * opacity});
        ${['-webkit-','-moz-','-o-','-ms-',''].map((item => {
          return item + "transform:rotate(" + -rotate + "deg);";
        })).join('')}
      }
    `;

  document.getElementById(ID) && $head.removeChild(document.getElementById(ID));

  $style = document.createElement("style");
  $style.type = 'text/css';
  $style.id = ID;
  $style.innerHTML = '';

  $style.styleSheet ? $style.styleSheet.cssText = styles : $style.appendChild(document.createTextNode(styles));
  $head.appendChild($style);
}

function generateMarkContainer() {
  if($wmContainer){
    return;
  }
  $wmContainer = document.createElement("div");
  $wmContainer.setAttribute('className','water-mark-container');
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
  if ($wmContainer){
    markImg = null;
    isPainting = false;
    for (; $items.length ;){
      $wmContainer.removeChild($items.shift());
    }
  }
}


module.exports = {
  mark,
  clear
};