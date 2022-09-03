import { createElementVNode, createTextVNode } from './vdom/index'
function createElm(vnode) {
    let { tag, data, children, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
function patchProps(el, props) {
    for (let key in props) {
        if (key === 'style') {
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }

}
// patch既有初始化的功能 又有更新的功能
function patch(oldVNode, vnode) {
    const isRealElement = oldVNode.nodeType
    if (isRealElement) {
        const elm = oldVNode
        const parentElm = elm.parentNode
        let newElm = createElm(vnode)
        console.log(newElm);
        parentElm.insertBefore(newElm, elm.nextSibiling)
        parentElm.removeChild(elm)
        return newElm
    } else {
        // diff算法
    }
}
export function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        const el = vm.$el
        console.log(vnode);
        vm.$el = patch(el, vnode)
    }
    Vue.prototype._c = function () {
        return createElementVNode(this, ...arguments)
    }
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments)
    }
    Vue.prototype._s = function (value) {
        if (typeof value !== 'object') return value
        return JSON.stringify(value)
    }
    Vue.prototype._render = function () {
        const vm = this
        return vm.$options.render.call(vm)
    }
}
export function mountComponent(vm, el) {
    vm.$el = el
    // 1.调用render方法产生虚拟节点 虚拟DOM
    vm._update(vm._render())
    // 2.根据虚拟DOM产生真实DOM

    // 3.插入到el元素中
}