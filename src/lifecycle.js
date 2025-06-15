import { createElementVNode, createTextVNode } from "./vdom"

export function mountComponent(vm, el){
    //这里的el是真实dom
    vm.$el = el
    // 1.调用render方法产生虚拟dom
    vm._update(vm._render())
}
function createElm(vnode){  
    let {tag, data, key, children, text} = vnode
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag) // 虚拟dom的el指向真实dom
        updateProperties(vnode.el, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
function updateProperties(el, props){
    for(let key in props){
        if(key === 'style'){
            for(let styleName in props.style){
                el.style[styleName] = props.style[styleName]
            }
        }else{
            el.setAttribute(key, props[key])
        }
    }
}
function patch(oldVnode, vnode){
    const isRealElement = oldVnode.nodeType
    if(isRealElement){
        //初始化
        const oldElm = oldVnode
        const parentElm = oldVnode.parentNode
        let newElm = createElm(vnode)
        parentElm.insertBefore(newElm, oldElm.nextSibling)
        parentElm.removeChild(oldElm) //删除老节点
        return newElm
    }else{
        //更新过程
    }
}

export function initLifeCycle(Vue){
    //将虚拟dom转化成真实dom
    Vue.prototype._update = function(vnode){
        const vm = this
        const el = vm.$el
        //既有初始化过程又有更新过程
        vm.$el = patch(el, vnode)
        
    }
    Vue.prototype._render = function(){
        const vm = this
        console.log(vm.$options.render)
        return vm.$options.render.call(vm)
    }
    Vue.prototype._c = function(){
        return createElementVNode(this, ...arguments)
    }
    Vue.prototype._v = function(){
        return createTextVNode(this, ...arguments)
    }
    Vue.prototype._s = function(val){
        if(val === null || val === undefined) return ''
        if(typeof val !== 'object'){
            return String(val)
        }
        return JSON.stringify(val)
    }
    
}
// vue核心流程 
// 1）创造了响应式数据 
// 2）将模板编译成ast语法树 
// 3）将ast语法树转换成render函数 
// 4）render函数执行的返回结果 用这个结果生成虚拟dom(无需再次执行ast语法树转化)
// 5）用虚拟dom生成真实dom