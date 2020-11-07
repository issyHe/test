import React from 'react'
import ReactDom from 'react-dom'

class App extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        inputState: ''
      }
      this.clickHandle = this.clickHandle.bind(this);
    }
  
    clickHandle(e){
    console.log('clickHandle:', e)
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    let per = e.persist();
    }

    clickHandle2(e){
        console.log('clickHandle2:', e)
        e.persist();
        }
        
        clickHandle3(e){
            e.preventDefault();
            console.log("link")

        }
    componentDidMount(){
      const div = this.refs.div;
      div.addEventListener('click', (e)=>{
        console.log('native event')
      });
      window.addEventListener('click',(e)=>{
          console.log('window click')
      })
    }
  
    componentWillUnmount(){
      const div = this.refs.div;
      div.removeEventListener('click');
    }
  
    render(){
      return (
        <div onClick={this.clickHandle2}>
            wrpper div
            <div ref="div">
                inner div
                <a href="http://www.baidu.com" target="_blank" onClick={this.clickHandle3}>Link</a>
            <button onClick={this.clickHandle}>Click Me</button>
            </div>
        </div>
      )
    }
  }





class IncrementByFunction extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0
      };
      this.increment = this.increment.bind(this);
    }
  
    increment() {
      // 采用传入函数的方式来更新 state
      this.setState((prevState, props) => 
          {
              console.log("prevState1:" , prevState)
            return {  count: prevState.count + 1 }
      }, ()=>{
          console.log('callback1')
      });
      this.setState((prevState, props) => {
        console.log("prevState2:" , prevState)
        return { count: prevState.count + 1 }
      }, ()=>{
        console.log('callback2')
    })
    }
  
    render() {
        console.log("----")
      return (
        <div>
          <button onClick={this.increment}>IncrementByFunction</button>
          <span>{this.state.count}</span>
        </div>
      );
    }
  }


ReactDom.render(<App />, document.getElementById('root'))
