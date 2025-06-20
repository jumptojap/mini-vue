function isReservedTag(tag){
    return ['a', 'div', 'span', 'button', 'ul', 'li', 'input', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
}
export function createElementVNode(vm, tag, data, ...children){
    if(data == null){
        data = {}
    }
    let key = data.key
    if(key){
        delete data.key
    }
    if(isReservedTag(tag)){
        return vnode(vm, tag, key, data, children)
    }else{
        //创建组件的虚拟节点
        const Ctor = vm.$options.components[tag]
        return createComponentVNode(vm, tag, key, data, children, Ctor)
    }
    return vnode(vm, tag, key, data, children)
}
function createComponentVNode(vm, tag, key, data, children, Ctor){
    if(typeof Ctor === 'object' && Ctor !== null){
        Ctor = vm.$options._base.extend(Ctor)
    }
    return vnode(vm, tag, key, data,children, null, {Ctor})
}
export function createTextVNode(vm, text){
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}
//ast做的是描述语言(可以描述dom、js、css)，虚拟dom做的是描述dom
function vnode(vm, tag, key, data, children, text, componentOptions){
    return {
        vm,
        tag,
        key,
        data,
        children, 
        text,
        componentOptions
     }
}
export function isSameVnode(oldVnode, newVnode){
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}
