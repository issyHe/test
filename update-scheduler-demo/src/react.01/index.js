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
        this.state = {number :0};
        this.increment = this.increment.bind(this)
    }

    componentWillMount(){
        console.log('Counter Will Mount')
    }
    componentDidMount(){
        console.log('Counter Did Mount')
    }
    increment(){
        alert('+')
    }
    render(){
        let p = React.createElement('p',{style:{color:'red'}},
        this.props.name, this.state.number);
        let button = React.createElement('button',{onClick:this.increment},'+')
        return React.createElement('div', {id:'counter'}, p, button)
    }
}

 let element = React.createElement(Counter, {name: '计数器'});


React.render(element, document.getElementById('root'))
