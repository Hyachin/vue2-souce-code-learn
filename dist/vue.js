(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function observe(data) {
    if (_typeof(data) !== 'object' || data === null) return;
    Object.keys(data).forEach(function (key) {
      return defineReactive(data, key, data[key]);
    });
  }
  function defineReactive(target, key, value) {
    observe(value); //对深层嵌套的对象也进行属性劫持

    Object.defineProperty(target, key, {
      get: function get() {
        console.log("\u83B7\u53D6".concat(key, "\u5C5E\u6027\uFF0C\u503C\u4E3A").concat(value));
        return value;
      },
      set: function set(newValue) {
        console.log("\u4FEE\u6539".concat(key, "\u5C5E\u6027\uFF0C\u503C\u4E3A").concat(newValue));
        value = newValue;
      }
    });
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    observe(data); // 数据劫持

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
