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
        console.log('update');
        this.get() // 重新渲染
    }
}
export default Watcher