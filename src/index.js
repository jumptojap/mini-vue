import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import { initGlobalAPI } from "./globalAPI"
import { initStateMixin } from "./state"


function Vue(options){
    this._init(options)
}

initMixin(Vue) //扩展init方法
initLifeCycle(Vue) //vm_update vm_mount
initGlobalAPI(Vue) //扩展全局API
initStateMixin(Vue) //扩展nextTick和$watch
window.Vue = Vue
