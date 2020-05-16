import React, { useState, CSSProperties } from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import classnames from 'classnames'
import './index.less'
import {Transition} from 'react-transition-group';
import {Icon } from 'antd'
let logo = require('../../assets/logo.png')


const duration = 1000;
const defaultStyle: CSSProperties = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
}

const transitionStyles = {
    entering: { opacity:1},
    entered: {opacity:1},
    exiting: {opacity:0},
    exited: {opacity:0},
    unmounted:{opacity:0}
}

interface Props {
    currentCategory: string;
    setCurrentCategory: (currentCategory:string)=>any;
    refreshLessons: Function;
}

function Header(_props: Props){
    let [isMenuVisible, setIsMenuVisible] = useState(false);
    const setCurrentCategory = (evnet: React.MouseEvent<HTMLUListElement>)=>{
        let target = event.target as HTMLUListElement;
        let category = target.dataset.category;
        _props.setCurrentCategory(category);
        _props.refreshLessons();
        setIsMenuVisible(false)
    };
    return (
        <header className="home-header">
            <div className="logo-header">
                <img src={logo.default} />
                <p onClick={()=>setIsMenuVisible(!isMenuVisible)}><Icon type="menu" /></p>
            </div>
            <Transition in={isMenuVisible} timeout={duration}>
                {
                    (state)=>(<ul className="category" onClick={setCurrentCategory}
                    
                    style={{...defaultStyle, ...transitionStyles[state]}}
                    >
                    <li data-category="all" className={classnames({active:_props.currentCategory === 'all'})}>全部课程</li>  
                    <li data-category="react" className={classnames({active:_props.currentCategory === 'react'})}>react</li>  
                    <li data-category="vue" className={classnames({active:_props.currentCategory === 'vue'})}>vue</li>     
            </ul>)
                }
           
            </Transition>
            
        </header>
    )
}

export default Header;