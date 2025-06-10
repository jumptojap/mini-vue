import { initMixin } from "./init"


function Vue(options){
    this._init(options)
}
initMixin(Vue)
window.Vue = Vue