import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import Watcher, { nextTick } from "./observe/watcher"
import { initGlobalAPI } from "./globalAPI"

function Vue(options){
    this._init(options)
}
Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue)
initGlobalAPI(Vue)

Vue.prototype.$watch = function(expOrFn, cb, options = {}){
    new Watcher(this, expOrFn, {
        user: true
    },cb)
    
}
window.Vue = Vue