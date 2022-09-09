import { initLifeCycle } from "./lifecycle"
import { initMixin } from "./init"
import { nextTick } from "./observe/watcher"
import { initGlobalAPI } from "./globalAPI"

function Vue(options) {
    this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue)
initGlobalAPI(Vue)
export default Vue