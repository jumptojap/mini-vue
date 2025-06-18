const strats = {}
const LIFECYCLE = ['beforeCreate', 'created','beforeMount', 'mounted','beforeUpdate', 'updated','beforeDestroy', 'destroyed']
LIFECYCLE.forEach(key => {
    strats[key] = function(parent, child){
        if(child){
            if(parent){
                return parent.concat(child)
            }
            return [child]
        }else{
            return parent
        }
    }
})
export function mergeOptions(parent, child){
    const options = {}
    function mergeField(key){
        if(strats[key]){
            options[key] = strats[key](parent[key], child[key])
        }else{
            options[key] = child[key] || parent[key]
        }
    }
    for(let key in parent){
        mergeField(key)
    }
    for(let key in child){
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }
    }
    return options
}