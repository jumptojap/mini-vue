import { isSameVnode } from "."

export function createElm(vnode){  
    let {tag, data, key, children, text} = vnode
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag) // 虚拟dom的el指向真实dom
        updateProperties(vnode.el, {}, data)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
export function updateProperties(el, oldProps, props){
    // 老的属性需要删除
    for(let key in oldProps){
        if(key === 'style'){
            for(let styleName in oldProps.style){
                if(!props.style[styleName]){
                    el.style[styleName] = ''
                }
            }
        }else{
            el.removeAttribute(key)
        }
    }
    // 新的属性需要添加
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
export function patch(oldVnode, vnode){
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
        console.log("走的更新");
        
        return patchVnode(oldVnode, vnode)
    }
}
function patchVnode(oldVnode, vnode){
    // 1.两个节点不是同一个节点，直接删除老的换上新的        
    if(!isSameVnode(oldVnode, vnode)){
        const newElm = createElm(vnode)
        oldVnode.el.parentNode.replaceChild(newElm, oldVnode.el)
        return newElm
    }
    // 文本的情况
    // 复用老节点的真实dom,将老节点的真实dom赋值给新节点的el属性,这样新节点就可以操作这个真实dom了
    let el = vnode.el = oldVnode.el 
    if(!oldVnode.tag){
        if(oldVnode.text !== vnode.text){
            el.textContent = vnode.text //用新的文本覆盖老的文本
        }
    }
    // 两个节点是同一个节点，复用老节点，将差异的属性更新
    updateProperties(el, oldVnode.data, vnode.data)

    // 2.节点比较完毕后，再比较儿子节点
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if(oldChildren.length > 0 && newChildren.length > 0){
        // 完整的diff算法，需要比较两个儿子节点
        updateChildren(el, oldChildren, newChildren)
    }else if(newChildren.length > 0){
        // 如果老的没有儿子，新的有儿子，将新的儿子添加到老的里面
        mountChildren(el, newChildren)
    }else if(oldChildren.length > 0){
        // 如果老的有儿子，新的没有儿子，将老的儿子删除
        unMountChildren(el, oldChildren)
    }
    return el
}
function mountChildren(el, newChildren){
    for(let i = 0; i < newChildren.length; i++){
        let child = newChildren[i]
        el.appendChild(createElm(child))
    }
}
function unMountChildren(el, oldChildren){
    for(let i = 0; i < oldChildren.length; i++){
        let child = oldChildren[i]
        el.removeChild(child.el)
    }
}
function updateChildren(el, oldChildren, newChildren){
    //我们可以针对push、unshift、shift、pop、splice reverse sort进行优化
    //vue2中采用双指针的方式，比较两个儿子节点
    let oldStartIndex = 0
    let oldEndIndex = oldChildren.length - 1
    let newStartIndex = 0
    let newEndIndex = newChildren.length - 1

    let oldStartVnode = oldChildren[0]
    let oldEndVnode = oldChildren[oldEndIndex]
    let newStartVnode = newChildren[0]
    let newEndVnode = newChildren[newEndIndex]
    
    let oldKeyToIndex = {}
    for(let i = oldStartIndex; i <= oldEndIndex; i++){
        oldKeyToIndex[oldChildren[i].key] = i
    }
   
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex){
        if(!oldStartVnode){
            oldStartVnode = oldChildren[++oldStartIndex]
        }else if(!oldEndVnode){
            oldEndVnode = oldChildren[--oldEndIndex]
        }else if(isSameVnode(oldStartVnode, newStartVnode)){
            // 1.如果两个节点是同一个节点，则进行patchVnode
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else if(isSameVnode(oldEndVnode, newEndVnode)){
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameVnode(oldEndVnode, newStartVnode)){  
            patchVnode(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else if(isSameVnode(oldStartVnode, newEndVnode)){
            patchVnode(oldStartVnode, newEndVnode)
            el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else{
            //乱序比对
            let moveIndex = oldKeyToIndex[newStartVnode.key]
            let moveVnode = oldChildren[moveIndex]
            if(moveIndex && isSameVnode(moveVnode, newStartVnode)){
                patchVnode(moveVnode, newStartVnode)
                el.insertBefore(moveVnode.el, oldStartVnode.el)
                oldChildren[moveIndex] = undefined // 将移动的节点标记为undefined，表示已经移动过了
              
            }else{
                // 没找到相同key的节点，创建新节点
                el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
        //再给动态列表添加Key时，要避免使用索引，因为索引可能会发生变化，导致diff算法不能正确识别变化前后哪些是同一个节点
        
    }
    if(newStartIndex <= newEndIndex){
        for(let i = newStartIndex; i <= newEndIndex; i++){
            let newVnode = newChildren[i]
            let newElm = createElm(newVnode)
            // 如果新节点还有下一个节点，则插入到下一个节点的后面，否则插入到末尾
            // 1 2 3 4 5     1 2 3 4 5 
            // 1 2 3 4 5 6   6 1 2 3 4 5 
            let anchor = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null
            el.insertBefore(newElm, anchor)
        }
    }
    if(oldStartIndex <= oldEndIndex){
        for(let i = oldStartIndex; i <= oldEndIndex; i++){
            if(oldChildren[i]){
                let oldVnode = oldChildren[i]
                el.removeChild(oldVnode.el)
            }
        }
    }
    
}

