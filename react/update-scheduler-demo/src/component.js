class Component {
    constructor(props){
        this.props = props;
    }
    setState(partialState){
        // params: 1.新的元素，2.新的状态
        this._currentUnit.update(null, partialState)
    }
}

export {
    Component
}