export function createElementVNode(vm, tag, data = {}, ...children) {
    if (data == null) {
        data = {}
    }
    let key = data.key
    if (key) {
        delete data.key
    }
    return vnode(vm, tag, key, data, children)
}
export function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}
// vnode 和 ast 不一样
// ast 做的是语法层面的转换 他描述的是语法本身 (可以描述js css html)
// 虚拟dom 描述的dom元素,可以增加一些自定义属性(描述dom的)

function vnode(vm, tag, key, data, children, text) {
    return {
        vm, tag, key, data, children, text
    }
}