import { initMixin } from "./init"
import { initLifeCycle } from "./lifecycle"
import { initGlobalAPI } from "./globalAPI"
import { initStateMixin } from "./state"
import { compileToFunction } from "./compiler"
import { createElm, patch } from "./vdom/patch"

function Vue(options){
    this._init(options)
}

initMixin(Vue) //扩展init方法
initLifeCycle(Vue) //vm_update vm_mount
initGlobalAPI(Vue) //扩展全局API
initStateMixin(Vue) //扩展nextTick和$watch
window.Vue = Vue

const render1 = compileToFunction(`<ul id="app" style="color: red;"><li key="1">1</li><li key="2">2</li><li key="3">3</li></ul>`)
const render2 = compileToFunction(`<ul id="app" style="color: red;"><li key="4">4</li><li key="2">2</li><li key="6">6</li></ul>`)

const vm1 = new Vue({
    data:{
        name: "zhu"
    }
})
const preVnode = render1.call(vm1)
let el = createElm(preVnode)
console.log(document.body);
document.body.appendChild(el)
const nextVnode = render2.call(vm1)
setTimeout(() => {
    patch(preVnode, nextVnode)
}, 1000);