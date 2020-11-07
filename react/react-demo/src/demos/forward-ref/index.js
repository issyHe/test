import React from 'react'

const TargetComponent = React.forwardRef((props, ref) => {
  console.log('ref:', ref)
  console.log("props: ", props)
  return <input type="text" ref={ref} />;
}
)

export default class Comp extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.ref.current.value = 'ref get input'
  }

  render() {
    return <TargetComponent ref={this.ref} />
  }
}
