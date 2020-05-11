import {Element,createElement } from './element'
import $ from 'jQuery'
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
                    let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`);
                    childString += childMarkUp;
                });
            } else {
                tagStart += ` ${propName}=${props[propName]} `;
            }
        }

        return tagStart + '>' + childString + tagEnd;
    }
}
// 判断两个元素类型一样不一样
function shouldDeepCompare(oldElement, newElement){
    if(oldElement != null && newElement != null) {
        let oldType = typeof oldElement;
        let newType = typeof newElement
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
        this._componentInstance._currentUnit = this;
        let renderedElement = componentInstance.render();
        // 当前组件rende方法返回的react元素对应的unit
        // unit上的_currentElement就是组件对应的react元素
        let renderedUnitInstance = this._renderedUnitInstace = createUnit(renderedElement);
        let renderedMarkUp = renderedUnitInstance.getMarkUp(reactid);
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