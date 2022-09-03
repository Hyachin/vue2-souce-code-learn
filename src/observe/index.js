import { newArrayProto } from "./array"
import Dep from "./dep"

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        // data.__ob__ = this
        if (Array.isArray(data)) {
            data.__proto__ = newArrayProto
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    walk(data) {
        Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
    }
    observeArray(data) {
        data.forEach(item => observe(item))
    }
}
export function observe(data) {
    if (typeof data !== 'object' || data === null) return
    return new Observer(data)
}
export function defineReactive(target, key, value) {
    observe(value) //对深层嵌套的对象也进行属性劫持
    let dep = new Dep()
    Object.defineProperty(target, key, {
        get() {
            if (Dep.target) {
                dep.depend()
            }
            // console.log(`获取${key}属性，值为${value}`);
            return value
        },
        set(newValue) {
            if (newValue === value) return
            // console.log(`修改${key}属性，值为${newValue}`);
            observe(newValue)
            value = newValue
            dep.notify() // 通知更新视图
        }
    })
}