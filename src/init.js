import { callHook, mountComponent } from "./lifecycle"
import { compileToFunction } from "./compiler/index"
import { initState } from "./state"
import { mergeOptions } from "./utils"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this
        vm.$options = mergeOptions(this.constructor.options, options)
        callHook(vm, 'beforeCreate')
        initState(vm)
        callHook(vm, 'created')
        if (options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        let ops = this.$options
        el = document.querySelector(el)
        // 编译优先级： render>tamplate>el
        if (!ops.render) {
            let template = ops.template
            if (!template && el) {
                template = el.outerHTML
            }
            // 模板编译
            if (template) {
                const render = compileToFunction(template)
                ops.render = render
            }

        }
        // 组件的挂载
        mountComponent(vm, el)
    }
}
