(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function compileToFunction(template) {
      console.log(template);
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }

    var oldArrayProto = Array.prototype; // newArrayProto.__proto__ == oldArrayProto

    var newArrayProto = Object.create(oldArrayProto);
    var methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    methods.forEach(function (method) {
      newArrayProto[method] = function () {
        var _oldArrayProto$method;

        console.log('method', method);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));

        var inserted;
        var ob = this.__ob__;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            inserted = args.slice(2);
            break;
        }

        if (inserted) {
          ob.observeArray(inserted);
        }

        return result;
      };
    });

    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);

        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false
        }); // data.__ob__ = this

        if (Array.isArray(data)) {
          data.__proto__ = newArrayProto;
          this.observeArray(data);
        } else {
          this.walk(data);
        }
      }

      _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          Object.keys(data).forEach(function (key) {
            return defineReactive(data, key, data[key]);
          });
        }
      }, {
        key: "observeArray",
        value: function observeArray(data) {
          data.forEach(function (item) {
            return observe(item);
          });
        }
      }]);

      return Observer;
    }();

    function observe(data) {
      if (_typeof(data) !== 'object' || data === null) return;
      return new Observer(data);
    }
    function defineReactive(target, key, value) {
      observe(value); //对深层嵌套的对象也进行属性劫持

      Object.defineProperty(target, key, {
        get: function get() {
          console.log("\u83B7\u53D6".concat(key, "\u5C5E\u6027\uFF0C\u503C\u4E3A").concat(value));
          return value;
        },
        set: function set(newValue) {
          if (newValue === value) return;
          console.log("\u4FEE\u6539".concat(key, "\u5C5E\u6027\uFF0C\u503C\u4E3A").concat(newValue));
          observe(newValue);
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

        if (options.el) {
          vm.$mount(options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
        var ops = this.$options;
        el = document.querySelector(el); // 编译优先级： render>tamplate>el

        if (!ops.render) {
          var template = ops.template;

          if (!template && el) {
            template = el.outerHTML;
          } // 模板编译


          if (template) {
            compileToFunction(template);
          }
        }
      };
    }

    function Vue(options) {
      this._init(options);
    }

    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
