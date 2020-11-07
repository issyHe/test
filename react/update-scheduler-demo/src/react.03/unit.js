import {Element,createElement } from './element'
import $ from 'jQuery'
let diffQueue; //差异队列
let updateDepth = 0;// 更新的级别
class Unit {
    constructor(element){
        this._currentElement = element;
    }
    getMarkUp(){
        throw Error('this method is not called!')
    }
}

class TextUnit extends Unit {
    getMarkUp(reactid){
        this._reactid = reactid;
        return `<span data-reactid="${reactid}">${this._currentElement}</span>`;
    }
    update(nextElement) {
        if(this._currentElement !== nextElement){
            this._currentElement = nextElement;
            $(`[data-reactid="${this._reactid}"]`).html(nextElement);
        }
    }
}

class NativeUnit extends Unit {
    getMarkUp(reactid){
        this._reactid = reactid;
        let {type, props} = this._currentElement;
        let tagStart = `<${type} data-reactid="${this._reactid}" `;
        let childString = '';
        let tagEnd = `</${type}>`;
        this._renderedChildrenUnits = [];
        for(let propName in props) {
            if(/^on[A-Z]/.test(propName)) {
                let eventName = propName.slice(2).toLowerCase();
                $(document).delegate(`[data-reactid="${this._reactid}"]`,
                `${eventName}.${this._reactid}`, props[propName]);
            } else if(propName === 'style') {
                let styleObj = props[propName];
                let styles = Object.entries(styleObj).map(([attr, value])=>{
                    return `${attr.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`)}:${value}`;
                }).join(";");
                tagStart += `style="${styles}"`;
            } else if (propName === 'className'){
                tagStart += ` class=\"${props[propName]}\"`;
            } else if(propName === 'children') {
                let children = props[propName];
                children.forEach((child, index)=>{
                    let childUnit = createUnit(child);
                    this._renderedChildrenUnits.push(childUnit);
                    let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`);
                    childString += childMarkUp;
                });
            } else {
                tagStart += ` ${propName}=${props[propName]} `;
            }
        }

        return tagStart + '>' + childString + tagEnd;
    }

    update(nextElement){
        console.log('nextElement', nextElement)
        let oldProps = this._currentElement.props;
        let newProps = nextElement.props;
        this.updateDOMProperties(oldProps,newProps);
        this.updateDOMChildren(nextElement.props.children);

    }
    //  此处把新的儿子们传过来，然后拿老的儿子们进行比对，然后找出差异，进行DOM修改
    updateDOMChildren(newChildElements) {
        this.diff(diffQueue, newChildElements);
    }
    diff(diffQueue, newChildElements){
        let oldChildrenUnitMap = this.getOldChildrenMap(this._renderedChildrenUnits);
        let newChildren = this.getNewChildren(oldChildrenUnitMap,newChildElements);
    }
    getNewChildren(oldChildrenUnitMap, newChildElements){
        let newChildren = [];
        newChildElements.forEach((newElement, index)=>{
            let newKey = (newElement.props && newElement.props.key) || index.toString();
            let oldUnit = oldChildrenUnitMap[newKey]; 
            let oldElement = oldUnit && oldUnit._currentElement;
            if(shouldDeepCompare(oldElement, newElement)){
                oldUnit.update(newElement);
                newChildren.push(oldUnit);
            } else {
                let newUnit = createUnit(newElement);
                newChildren.push(newUnit);
            }
        });
        return newChildren;
    }
    getOldChildrenMap(childrenUnits = []){
        let map  = {};
        for(let i = 0; i < childrenUnits.length;i++){
            let unit = childrenUnits[i];
            let key = (unit._currentElement.props && unit._currentElement.props.key) || i.toString();
            map[key] = unit;
        }
        return map;
    }
    updateDOMProperties(oldProps, newProps){
        let propName;
        for(propName in oldProps) {
            if(!newProps.hasOwnProperty(propName)){
                $(`[data-reactid="${this._reactid}"]`).removeAttr(propName);
            }
            if(/on[A-Z]/.test(propName)){
                $(document).undelegate(`.${this._reactid}`);
            }
        }
        for(propName in newProps) {
            // 如果是children，先不处理
            if(propName == 'children'){
                continue; 
            } else if(/^on[A-Z]/.test(propName)) {
                let eventName = propName.slice(2).toLowerCase();
                $(document).delegate(`[data-reactid="${this._reactid}"]`,
                `${eventName}.${this._reactid}`, newProps[propName]);

            } else if(propName === 'style') {
                let styleObj = newProps[propName];
                Object.entries(styleObj).map(([attr, value])=>{
                    $(`[data-reactid="${this._reactid}"]`).css(attr, value);
                });
            } else {
                $(`[data-reactid="${this._reactid}"]`).props(propName, newProps[propName]);
            }
        }
    }

}
// 判断两个元素类型一样不一样
function shouldDeepCompare(oldElement, newElement){
    if(oldElement != null && newElement != null) {
        let oldType = typeof oldElement;
        let newType = typeof newElement;
        if((oldType === 'string' || oldType ==='number') &&
        (newType ==='string' || newType === 'number')){
            return true;
        }
        if(oldElement instanceof Element && newElement instanceof Element){
            return oldElement.type === newElement.type;
        }
    }
    return false
}

class CompositeUnit extends Unit {
    // 组件的更新操作
    update(nextElement, partialState) {
        // 先猎取新的元素
        this._currentElement = nextElement || this._currentElement;
        // 获取新的状态 不管是否更新组件， 组件的状态一定要改的
        let nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState);
        //新的属性对象 
        let nextProps = this._currentElement.props;
        if(this._componentInstance.componentShouldUpdate  && !this._componentInstance.componentShouldUpdate(nextProps, nextState)) {
            return;
        }
        //进行比较更新
        // 上次渲染的单元
        let preRenderedUnitInstance = this._renderedUnitInstace;
        // 上次渲染的元素
        let preRenderedElement =  preRenderedUnitInstance._currentElement;
        let nextRenderedElement = this._componentInstance.render();
        // 如果新旧元素类型一样，则进行深度比较，如果不一样，直接干掉老的，新建一个
        if(shouldDeepCompare(preRenderedElement, nextRenderedElement)){
            // 如果可以深度比较，则把更新的工作交给上次渲染出来的那个element元素对应的unit来处理
            preRenderedUnitInstance.update(nextRenderedElement);
            this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();
        } else {
            this._renderedUnitInstace = createUnit(nextRenderedElement);
            let nextMarkUp = this._renderedUnitInstace.getMarkUp(this._reactid);
            $(`[data-reactid="${this._reactid}"]`).replaceWith(nextMarkUp);
        }
    }
    getMarkUp(reactid){
        this._reactid = reactid;
        let {type: Component, props} = this._currentElement;
        // 当前组件的实例
        let componentInstance = this._componentInstance = new Component(props);
        componentInstance.componentWillMount && componentInstance.componentWillMount();
        // 让组件的实例的curentUnit等于当前的unit
        this._componentInstance._currentUnit = this;
        // 调用组件的render方法，获得要渲染的元素
        let renderedElement = componentInstance.render();
        // 得到这个元素对应的unit
        let renderedUnitInstance = this._renderedUnitInstace = createUnit(renderedElement);
        // 通过unit可以获得它的html标记markup
        let renderedMarkUp = renderedUnitInstance.getMarkUp(reactid);
        // 在这时候绑定一个事件
        $(document).on('mounted',()=>{
            componentInstance.componentDidMount && componentInstance.componentDidMount();
        })
        return renderedMarkUp;
    }
}


function createUnit(element){
    if(typeof element === 'string' || typeof element === 'number'){
        return new TextUnit(element);
    }
    if(element instanceof Element && typeof element.type === 'string'){
        return  new NativeUnit(element)
    }
    if(element instanceof Element && typeof element.type === 'function') {
        return new  CompositeUnit(element)
    }
}

export {
    createUnit
}