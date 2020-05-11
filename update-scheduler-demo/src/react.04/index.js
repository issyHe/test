import React from './react'

function sayHello(){
    alert('hello')
}

// let element = React.createElement(
//     'button',
//     {
//         id: "sayHello",
//         onClick: sayHello,
//         style: {color:'red', backgroundColor:'green'}
//     },
//     'say',
//     React.createElement('b',{},'Hello')
// )



class Counter extends React.Component {
    constructor(props){
        super(props);
        this.state = { old: true };
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({old: !this.state.old})
        },1000)
    }

    /*
        A-A  , B-B  , C-C  , D-D  

        A-A1 , C-C1 , B-B1 , E-E1 , F-F1
    */
    
    render(){
        if(this.state.old){
            return React.createElement('ul',{key:'wrapper'},
            React.createElement('li',{key:'A'},'A'),
            React.createElement('li',{key:'B'},'B'),
            React.createElement('li',{key:'C'},'C'),
            React.createElement('li',{key:'D'},'D'),
            )
        } else {
            return React.createElement('ul',{key:'wrapper'},
            React.createElement('li',{key:'A'},'A1'),
            React.createElement('li',{key:'C'},'C1'),
            React.createElement('li',{key:'B'},'B1'),
            React.createElement('li',{key:'E'},'E1'),
            React.createElement('li',{key:'F'},'F1'),
            )
        }
    }
}

let element = React.createElement(Counter, {name: '计数器'});
React.render(element, document.getElementById('root'))
