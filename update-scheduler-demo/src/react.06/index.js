import React from './react'

class Todos extends React.Component {
    constructor(props){
        super(props)
        this.state = {list:[], text: ''}
    }
    onChange = (event)=> {
        this.setState({text:event.target.value});
    }
    handleClick = (event) => {
        let text = this.state.text;
        this.setState({
            list: [...this.state.list, text]
        })
    }
    onDel =(index) =>{
        this.setState({
            list: [...this.state.list.slice(0,index),
            ...this.state.list.slice(index+1)]
        })
    }
    render(){
        let input = React.createElement('input',{onKeyup:this.onChange, value:this.state.text});

        let button = React.createElement('button', {onClick: this.handleClick},"+")

        let lists = this.state.list.map((item, index)=>{
            return React.createElement('div',{},item,
            React.createElement('button', 
            {
                onClick:()=>{this.onDel(index)}
            },
            'X')
            );
        })

        return React.createElement('div',{},
        input,
        button,
        ...lists
        )
    }
}


let element = React.createElement(Todos);
React.render(element, document.getElementById('root'))
