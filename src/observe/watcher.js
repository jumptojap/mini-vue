import Dep, { popTarget, pushTarget } from "./dep"

let id = 0
class Watcher{
    constructor(vm, fn, options){
        this.id = id++
        this.getter = fn // updateComponent
        this.renderWatcher = options
        this.deps = [] // 后续我们实现计算属性，和清理工作，需要用到这个数组
        this.depsId = new Set()
        this.lazy = options.lazy
        this.dirty = this.lazy
        this.vm = vm
        this.lazy || this.get()
    }
    // 一个组件，对应多个属性，重复的属性，不能重复收集
    addDep(dep){
        let id = dep.id
        if(!this.depsId.has(id)){
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this) // 让dep记住watcher
        }
    }
    get(){
        pushTarget(this)
        const value = this.getter.call(this.vm)
        popTarget()
        return value
    }
    update(){
        // this.get()
        if(this.lazy){
            this.dirty = true
        }else{
            queueWatcher(this) // 等待所有同步代码执行完毕后，再执行watcher的更新
        }
    }
    depend(){
        let i = this.deps.length
        while(i--){
            this.deps[i].depend()
        }
    }
    run(){
        console.log("update")
        this.get()
    }
    evaluate(){
        this.dirty = false
        this.value = this.get()
    }
}
let queue = []
let has = {}
let pending = false // 防抖
function flushSchedulerQueue(){
    let flushQueue = queue.slice(0)
    queue = []
    has = {}
    pending = false //
    flushQueue.forEach(watcher => watcher.run())
}
function queueWatcher(watcher){
    const id = watcher.id
    //同一时间的多次相同watcher，只会执行一次
    if(!has[id]){
        queue.push(watcher)
        has[id] = true
        // 同一时间内不同watcher，如果每次都发起异步更新，那么除了第一次异步更新会将任务队列的watcher执行，
        // 其他异步更新都是无效操作，因为任务队列中的watcher已经执行过了
        // 因此，考虑设置pending, 其他异步更新都会被忽略，因为pending = true 后，就不会再次设置 setTimeout。
        if(!pending){
            nextTick(flushSchedulerQueue)// 异步更新
            pending = true 
        }
    }
}
let callbacks = []
let waiting = false

function flushCallbacks(){
    const copies = callbacks.slice(0)
    callbacks = []
    waiting = false
    copies.forEach(cb => cb())
}
export function nextTick(cb){
    callbacks.push(cb)
    if(!waiting){
        if(Promise){
            Promise.resolve().then(flushCallbacks)
        }else if(MutationObserver){
            let observer = new MutationObserver(flushCallbacks)
            let textNode = document.createTextNode(1)
            observer.observe(textNode, { characterData: true })
            textNode.textContent = 1
        }else if(setImmediate){
            setImmediate(flushCallbacks)
        }else{
            setTimeout(flushCallbacks, 0)
        }
        waiting = true
    }
}
export default Watcher