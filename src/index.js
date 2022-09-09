import { initLifeCycle } from "./lifecycle"
import { initMixin } from "./init"
import { nextTick } from "./observe/watcher"

function Vue(options) {
    this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue)
export default Vue