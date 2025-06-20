import Watcher from "./observe/watcher"
import { createElementVNode, createTextVNode } from "./vdom"
import { patch } from "./vdom/patch"

export function mountComponent(vm, el){
    //这里的el是真实dom
    vm.$el = el
    // 1.调用render方法产生虚拟dom
    const updateComponent = () => {
        vm._update(vm._render())
    }
    const watcher = new Watcher(vm, updateComponent, true) // true表示是一个渲染过程
}

export function initLifeCycle(Vue){
    //将虚拟dom转化成真实dom
    Vue.prototype._update = function(vnode){
        const vm = this
        const prevVnode = vm._vnode  // 保存上一次的虚拟节点
        vm._vnode = vnode           // 更新当前虚拟节点
        
        if(!prevVnode){
            // 初始化：真实DOM vs 虚拟节点
            vm.$el = patch(vm.$el, vnode)
        }else{
            // 更新：虚拟节点 vs 虚拟节点
            vm.$el = patch(prevVnode, vnode)
        }
    }
    Vue.prototype._render = function(){
        const vm = this
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

export function callHook(vm, hook){
    const handlers = vm.$options[hook]
    if(handlers){
        handlers.forEach(handler => handler.call(vm))
    }
}