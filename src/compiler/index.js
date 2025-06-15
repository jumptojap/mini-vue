import { parseHTML } from "./parse"


export function compileToFunction(template){
    //1.将template转换成ast语法树
    let ast = parseHTML(template)
    console.log(ast)
    //2.将ast语法树转换成render函数(render函数返回虚拟dom)
    let code = codegen(ast)
    let render = new Function(`with(this){return ${code}}`) 
    return render
}

function codegen(ast){
    let children = genChildren(ast.children)
    let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'},${children ? children : ''})`
    return code
}
function genProps(attrs){
    let str = ''
    for(let i = 0; i < attrs.length; i++){
        let attr = attrs[i]
        if(attr.name === 'style'){
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
function genChildren(children){
    return children.map(child => {
        return gen(child)
    }).join(',')
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配插值
function gen(node){
    if(node.type === 1){
        return codegen(node)
    }else{
        let text = node.text
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`
        }else{
            let tokens = []
            let match, lastIndex = 0
            defaultTagRE.lastIndex = 0
            while(match = defaultTagRE.exec(text)){
                let index = match.index
                if(index > lastIndex){
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if(lastIndex < text.length){
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}
