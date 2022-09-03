import { initLifeCycle } from "./lifecycle"
import { initMixin } from "./init"

function Vue(options) {
    this._init(options)
}
initMixin(Vue)
initLifeCycle(Vue)
export default Vue