export function createElementVNode(vm, tag, data, ...children){
    if(data == null){
        data = {}
    }
    let key = data.key
    if(key){
        delete data.key
    }
    return vnode(vm, tag, key, data, children)
}
export function createTextVNode(vm, text){
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}
//ast做的是描述语言(可以描述dom、js、css)，虚拟dom做的是描述dom
function vnode(vm, tag, key, data, children, text){
    return {
        vm,
        tag,
        key,
        data,
        children, 
        text
     }
}
export function isSameVnode(oldVnode, newVnode){
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}
