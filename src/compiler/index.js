import { parseHTML } from "./parse";
function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }

        str += `${attr.name}:${JSON.stringify(attr.value)},`

    }
    return `{${str.slice(0, -1)}}`
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function gen(node) {
    // 元素
    if (node.type === 1) {
        return codegen(node)
    } else {
        let text = node.text
        // 普通文本
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            // 带有{{}}的
            let tokens = []
            let match
            defaultTagRE.lastIndex = 0
            let lastIndex = 0
            while (match = defaultTagRE.exec(text)) {
                let index = match.index
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}
function genChildren(children) {
    return children.map(child => gen(child)).join(',')
}
function codegen(ast) {
    // _c 创建元素
    // _v 创建文本
    // _s JSON.stringify
    let children = ast.children && genChildren(ast.children)
    let code = (
        `_c('${ast.tag}',
        ${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'}
        ${ast.children.length ? `,${children}` : ''})`)

    return code
}
export function compileToFunction(template) {
    let ast = parseHTML(template)
    let code = codegen(ast)
    code = `with(this){return ${code}}`
    let render = new Function(code)
    return render
}