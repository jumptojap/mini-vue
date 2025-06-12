const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) //匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配结束标签 
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"|'([^']*)'|([^"'<>\s]*)))?/
const startTagClose = /^\s*(\/?)>/ //匹配开始标签的结束部分
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配插值
// vue3采用的不是正则
export function compileToFunction(template){
    //1.将template转换成ast语法树
    let ast = parseHTML(template)
    console.log(ast)
    //2.将ast语法树转换成render函数(render函数返回虚拟dom)
    //3.将render函数转换成虚拟dom
    //4.将虚拟dom转换成真实dom
    //5.将真实dom插入到el中
    //6.将真实dom转换成虚拟dom
    //7.将虚拟dom转换成真实dom
    //8.将真实dom插入到el中
}
function parseHTML(html){
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = []
    let root = null
    let currentParent //指向栈中的最后一个
    function createASTElement(tagName, attrs){
        return {
            tag: tagName,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }
    //需要转换成ast语法树
    function start(tagName, attrs){
        let element = createASTElement(tagName, attrs)
        if(!root){
            root = element
        }
        if(currentParent){
            element.parent = currentParent
            currentParent.children.push(element)
        }
        currentParent = element
        stack.push(element)
    }
    function end(tagName){
        stack.pop()
        currentParent = stack[stack.length - 1]
    }
    function chars(text){
        debugger
        text = text.replace(/\s/g, '')
        currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }
    function advance(n){
        html = html.slice(n)
    }
    function parseStartTag(){
        const start = html.match(startTagOpen)
        if(start){
            const match = {
                tagName: start[1],
                attrs: [],
                start: 0
            }
            advance(start[0].length)
            let end, attr
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true
                })
            }
            if(end){
                advance(end[0].length)
            }
            return match
        }
    }
    while(html){
        //如果textEnd为0，则说明是一个开始标签
        //如果textEnd大于0，则说明是文本的结束
        let textEnd = html.indexOf('<') 
        if(textEnd === 0){
            const startTagMatch = parseStartTag()
            if(startTagMatch){ //如果匹配到开始标签
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag) //如果匹配到结束标签
            if(endTagMatch){
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
        }
        if(textEnd > 0){
            let text = html.substring(0, textEnd)
            if(text){
                chars(text)
                advance(textEnd)
            }
            
        }
    }
    return root

}