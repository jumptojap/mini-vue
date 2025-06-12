import { compileToFunction } from "./compiler"
import { initState } from "./state"

export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = options
        //初始化状态
        initState(vm)
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
        
    }
}
