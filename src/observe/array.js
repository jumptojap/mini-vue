let oldArrayPrototype = Array.prototype
export let proto = Object.create(oldArrayPrototype)
const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
methods.forEach(method => {
    proto[method] = function(...args){
        const result = oldArrayPrototype[method].apply(this, args)
        let inserted = null
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        if(inserted){
            this._ob_.observeArray(inserted)
        }
        this._ob_.dep.notify()
        return result
    }
})
