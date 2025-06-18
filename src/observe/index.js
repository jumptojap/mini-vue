import { proto } from "./array"
import Dep from "./dep"
export function observe(data){
    if(typeof data !== 'object' || data === null)
        return
    if(data._ob_){
        return data._ob_
    }
    return new Observer(data)
}
class Observer{
    constructor(data){
        this.dep = new Dep()

        
        Object.defineProperty(data, '_ob_', {
            value: this,
            enumerable: false
        })
        if(Array.isArray(data)){
            data.__proto__ = proto
            this.observeArray(data)
        }else{
            this.walk(data)
        }
    }
    walk(data){
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
    observeArray(data){
        data.forEach(item => observe(item))
    }
}
function dependArray(value){
    value.forEach(item => {
        const childOb = observe(item)
        childOb?.dep.depend()
        if(Array.isArray(item)){
            dependArray(item)
        }
    })
}
export function defineReactive(target, key, value){
    //如果value是对象，则递归观察
    const childOb = observe(value)
    let dep = new Dep()
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        set(newValue){
            if(value === newValue)
                return
            observe(newValue)
            value = newValue
            dep.notify()
        },
        get(){
            if(Dep.target){
                dep.depend()
                if(childOb){
                    childOb.dep.depend()
                    if(Array.isArray(value)){
                        dependArray(value)
                    }   
                }
            }
            return value
        }
    })
}