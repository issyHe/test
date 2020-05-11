import React, { Component } from 'react'
import './App.css'
let count = 0;

class Pure extends React.PureComponent {
  constructor(){
    super();
    this.state = {list:{name:'issy'}};
  }

  handleChange = ()=>{
    count++;
    this.setState((old)=>{
      let list = {name: 'issy'};
      return {...old, list};
    })
  }

  render(){
    console.log('render:', this.state)
    const {list } = this.state;
    return (<>
    <span>count: {list.length}</span>
    <button onClick={this.handleChange}>Increase</button>
    </>);
  }

}

class List extends Component {
  state = {
    a: 1,
    b: 2,
    c: 3,
  }

  handleClick = () => {
    this.setState(oldState => {
      const { a, b, c } = oldState
      return {
        a: a * a,
        b: b * b,
        c: c * c,
      }
    },(arg)=>{
      console.log("arg: ", this.state)
    });
    this.setState(oldState=>{
       return {
        oldState,
        x : 'issy'
       }
    })
  }

  render() {
    const { a, b, c } = this.state;
    console.log(this)
    return [
      <span key="a">{a}</span>,
      <span key="b">{b}</span>,
      <span key="c">{c}</span>,
      <button key="button" onClick={this.handleClick}>
        click me
      </button>,
    ]
  }
}

class Input extends Component {
  state = {
    name: 'jokcy',
  }

  handleChange = e => {
    // 这里如果使用方法设置`state`
    // 那么需要现在外面读取`e.target.value`
    // 因为在React走完整个事件之后会重置event对象
    // 以复用event对象，如果等到方法被调用的时候再读取`e.target.value`
    // 那时`e.target`是`null`
    this.setState({
      name: e.target.value,
    })
  }

  render() {
    return (
      <input
        type="text"
        style={{ color: 'red' }}
        onChange={this.handleChange}
        value={this.state.name}
      />
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="main">
        <Pure />
        <Input />
        <List />
      </div>
    )
  }
}

export default App
