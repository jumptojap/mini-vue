export function observe(data){
    if(typeof data !== 'object' || data === null){
        return
    }
    return new Observer(data)
}
class Observer{
    constructor(data){
        this.data = data
        this.walk(data)
    }
    walk(data){
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }
}
export function defineReactive(target, key, value){
    if(typeof value === 'object' && value !== null){
        observe(value)
    }
    Object.defineProperty(target, key, {
        get(){
            return value
        },
        set(newValue){
            if(newValue === value){
                return
            }
            value = newValue
        }
    })
}