import React, { PropsWithChildren } from 'react'
import { Link, NavLink, withRouter, RouteComponentProps } from 'react-router-dom'
import {History} from 'history'
import './index.less'

type Props = PropsWithChildren<{history: History}>

function Tabs(_props: Props){
    return (
        <nav className="nav-header">
           <span onClick={()=>_props.history.goBack()}>{'<'}</span>
           {_props.children}
        </nav>
    )
}

export default Tabs;