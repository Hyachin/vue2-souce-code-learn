export function observe(data) {
    if (typeof data !== 'object' || data === null) return
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
}
export function defineReactive(target, key, value) {
    observe(value) //对深层嵌套的对象也进行属性劫持
    Object.defineProperty(target, key, {
        get() {
            console.log(`获取${key}属性，值为${value}`);
            return value
        },
        set(newValue) {
            console.log(`修改${key}属性，值为${newValue}`);
            value = newValue
        }
    })
}