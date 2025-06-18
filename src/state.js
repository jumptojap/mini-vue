import { observe } from "./observe"
import Dep from "./observe/dep"
import Watcher from "./observe/watcher"

export function initState(vm){
    const options = vm.$options
    if(options.data){
        initData(vm)
    }
    if(options.computed){
        initComputed(vm)
    }
}
function initData(vm){
    let data = vm.$options.data
    data = typeof data === 'function'? data().bind(vm) : data
    vm._data = data
    observe(data)
    Object.keys(data).forEach(key => proxy(vm, '_data', key))
}
function proxy(vm, target, key){
    Object.defineProperty(vm, key, {
        get(){
            return vm[target][key]
        },
        set(newValue){
            vm[target][key] = newValue
        }
    })
}
function initComputed(vm){
    const computed = vm.$options.computed
    const watchers = vm._computedWatchers = {}
    
    for(let key in computed){
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        // const setter = userDef.set || (() => {})
        
        watchers[key] = new Watcher(vm, getter, {lazy:true})
        defineComputed(vm, key, userDef)
    }
}
function createComputedGetter(key){
    return function(){
        const watcher = this._computedWatchers[key]
        if(watcher.dirty){
            watcher.evaluate()
        }
        if(Dep.target){
            watcher.depend()
        }
        return watcher.value
    }
}
function defineComputed(vm, key, userDef){
    const setter = userDef.set || (() => {})
    Object.defineProperty(vm, key, {
        get:createComputedGetter(key),
        set:setter
    })
}