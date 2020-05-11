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
        this.handleCLick = this.handleCLick.bind(this)
    }
    
    componentDidUpdate(){
        console.log('Counter componentDidUpdate');
    }

    componentShouldUpdate(nextState, nextProps){
        return true;
    }
    
    handleCLick(){
        this.setState({
            number: this.state.number+1
        })
    }
    render(){
        let p = React.createElement('p', {}, this.state.number);
        let button = React.createElement('button', {
            onClick: this.handleCLick
        }, '+');

        return React.createElement('div', 
            {
                style:{
                    color: this.state.number%2 == 0 ? 'red':'green',
                    backgroundColor: this.state.number%2 == 0 ? 'green':'red',
                }
            },
            p, button
        )
    }
}

let element = React.createElement(Counter, {name: '计数器'});
React.render(element, document.getElementById('root'))
