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

class CompositeUnit extends Unit {
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