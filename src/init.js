import { compileToFunction } from "./compiler/index"
import { initState } from "./state"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this
        vm.$options = options
        initState(vm)
        if (options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
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
        console.log(ops.render);

    }
}
