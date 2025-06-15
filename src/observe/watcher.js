import Dep from "./dep"

let id = 0
class Watcher{
    constructor(vm, fn, options){
        this.id = id++
        this.getter = fn // updateComponent
        this.renderWatcher = options
        this.deps = [] // 后续我们实现计算属性，和清理工作，需要用到这个数组
        this.depsId = new Set()
        this.get()
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
        Dep.target = this
        this.getter()
        Dep.target = null
    }
    update(){
        this.get()
    }
}
export default Watcher