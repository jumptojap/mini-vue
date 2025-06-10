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
    console.log(data);
    
}