import { proto } from "./array"

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
export function defineReactive(target, key, value){
    observe(value)
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: true,
        set(newValue){
            if(value === newValue)
                return
            value = newValue
        },
        get(){
            return value
        }
    })
}