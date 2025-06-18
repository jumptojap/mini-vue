import { compileToFunction } from "./compiler"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"
import { mergeOptions } from "./utils"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        //我们定义的全局指令和过滤器都会挂载到实例上
        vm.$options = mergeOptions(vm.constructor.options, options)
        console.log(vm.$options);

        callHook(vm, 'beforeCreate')
        //初始化状态
        initState(vm)
        callHook(vm, 'created') 
        if(options.el){
            //将数据挂载到el上
            vm.$mount(options.el)
        }

    }
    Vue.prototype.$mount = function(el){
        const vm = this
        const options = vm.$options
        el = document.querySelector(el);
        if(!options.render){
            let template = null;
            if(options.template){
                template = options.template
            }else if(el){
                template = el.outerHTML
            }
            if(template){
                const render = compileToFunction(template)
                options.render = render
            }
        }
        mountComponent(vm, el) // 组件挂载
    }
}
