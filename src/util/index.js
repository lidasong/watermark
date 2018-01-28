module.exports = {
  isObject(arg) {
    return "[object Object]" === Object.prototype.toString.call(arg);
  },
  extend(dest, source) {
    if (this.isObject(dest) && this.isObject(source)){
      for (var key in source){
        if (source.hasOwnProperty(key)) {
          dest[key] = source[key];
        }
      }
    }
    return dest;
  },
  isFunction(arg){
    return typeof arg === 'function';
  },
}