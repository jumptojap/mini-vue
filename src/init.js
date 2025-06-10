import { observe } from "./observe"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = options
        initState(vm)
    }
}
function initState(vm){
    const options = vm.$options
    if(options.data){
        initData(vm)
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