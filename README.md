# WaterMark
----------------------------
## CONFIGS
```js
  {
    text: "watermark",
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
  }
```
## USAGE
```js watermark.mark(opts);```
