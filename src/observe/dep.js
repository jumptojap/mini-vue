let id = 0
class Dep{
    constructor(){
        this.subs = []
        this.id = id++
    }
    depend(){
        Dep.target.addDep(this) // 让watcher记住dep
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null
export default Dep