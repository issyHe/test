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
    
    componentDidUpdate(){
        console.log('Counter componentDidUpdate');
    }

    componentShouldUpdate(nextState, nextProps){
        return true;
    }

    componentWillMount(){
        console.log('Counter Will Mount')
    }
    componentDidMount(){
        setInterval(()=>{
            this.setState({number:this.state.number+1})
        },1000)
    }
    increment(){
        alert('+')
    }
    render(){
        return this.state.number;
    }
}

 let element = React.createElement(Counter, {name: '计数器'});


React.render(element, document.getElementById('root'))
