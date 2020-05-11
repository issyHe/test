import $ from 'jQuery'
import {createUnit} from './unit'
import {createElement} from './element'
import { Component } from './component'
let React = {
    render,
    rootIndex:0,
    createElement,
    Component
}

function render(element, container){
    // 单元就是用来负责渲染的，负责把元素转换成HTML字符串
    let unit = createUnit(element)
    let markUp = unit.getMarkUp(React.rootIndex);
    $(container).html(markUp);
    $(document).trigger('mounted');
}
export default React