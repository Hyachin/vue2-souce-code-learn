import Dep from './dep'
let id = 0

class Watcher {
    constructor(vm, fn, options) {
        this.id = id++
        this.renderWatcher = options
        this.getter = fn
        this.deps = [] // 后续实现计算属性和一些清理工作需要用到
        this.depsId = new Set()
        this.get()
    }
    addDep(dep) { // 一个组件 对应着多个属性 重复的属性不需要记录
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this) // 让dep也记住watcher
        }
    }
    get() {
        Dep.target = this
        this.getter() // 会去vm上取值
        // 为什么要设置null？ 确保其只在模板中取值的时候才做依赖收集
        Dep.target = null
    }
    update() {
        // 异步更新
        queueWatcher(this)
        // this.get() // 重新渲染
    }
    run() {
        // 真正更新视图
        console.log('run');
        this.get()
    }
}
let queue = []
let has = {}
let pending = false
function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    // 初始化队列的相关数据
    queue = []
    has = {}
    pending = false
    flushQueue.forEach(q => q.run())
}
function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true
        // 不管update执行多少次，最终只执行一轮刷新操作
        if (!pending) {
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}
let callbacks = []
let waiting = false
function flushCallbacks() {
    let cbs = callbacks.slice(0)
    waiting = false
    callbacks = []
    cbs.forEach(cb => cb())
}
let timerFunc;
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    let observer = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1)
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks)
    }
}
export function nextTick(cb) {
    callbacks.push(cb) // 维护nextTick中callback方法
    if (!waiting) {
        timerFunc()
        waiting = true
    }
}
export default Watcher