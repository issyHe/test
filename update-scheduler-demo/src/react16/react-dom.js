import { createElement } from "react";

let isFirstRender = false;
let HostROot = 'HostRoot'; // RootFiber type
let ClassComponent = 'ClassCOmponent'; // class comp type
let HostComponent = 'HostCOmponent'; 
let HostText = 'HostText';
let FunctionComponent = 'FunctionComponent';

let NoWork = 'NoWork'; // 表示没有任何动作
let Placement = 'Placement'; // 表示这个节点是新插入的
let Update = 'Update'; // 表示这个节点有更新
let Delection = 'Delection';
let PlacementAndUpdate = 'PlacementAndUpdate'; // 节点换了位置和更新了


class FiberNode {
    constructor(tag, key, pendingProps){
        this.tag = tag;  //标识当前Fiber的类型
        this.key = key;
        this.type = null; // 节点类型 'div' | 'h1' 
        this.stateNode = null; // 当前Fiber的实例
        this.child = null; // 表示当前fiber的第一个子节点
        this.sibing = null; // 表示当前节点的兄弟节点
        this.return = null ; // 表示当前节点的父节点
        this.index = 0;
        this.memoizeState = null // 表示当前Fiber的state
        this.memoizeProps = null // 列示当前Fiber的props
        this.pendingProps = pendingProps // 新来的props
        this.effectTag = null // 表示当前节点要进行何种更新
        this.firstEffect = null // 表示当前节点的有更新的第一个子节点
        this.lastEffect = null // 表示当前 节点的有更新的最后一个子节点
        this.nextEffect = null //表示下一个要更新的子节点
        this.alternate = null // 用来连接current 和 workingProgress
        this.updateQueue = null // 一条链表，上面挂的是当前fiber的新的状态, 和setState有关

    }
}


function createFiber(tag, key, pendingProps){
    new FiberNode(tag, key, pendingProps);
}

function createWorkInProgress(current, pendingProps){
    // 复用current.alternate
    let workInProgress = current.alternate;
    if(!workInProgress) {
        workInProgress = createFiber(current.tag, pendingProps, current.key);
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
        workInProgress.alternate = current;
        current.alternate = workInProgress;
    } else {
        workInProgress.pendingProps = pendingProps;
        workInProgress.effectTag = NoWork;
        workInProgress.firstEffect = null;
        workInProgress.lastEffect = null;
        workInProgress.nextEffect = null;
    }
    // 要保证current 和 curent.alternate上的updateQueue同步 
    // 因为每次执行setState时，会创建更新，把更新挂到组件对应的fiber上
    // 这个fiber在奇数更新时，在current树上，在偶数时存在于current.alternate上
    // 每次创建or复用workInprogree是从current.alternate上拿的对象
    // 复用的这个alternate上updateQueue上不一定有新的更新
    // 所以这里要判断 如果current.alternate上没有新的更新，就说明本轮更新
    // 找到这个fiber存在 于current
    // 只有初次渲染的时候，会给组件实例一个属性指向它的fiber
    // 以后这个fiber就不会再改变 了，
    if(!!workInProgress && !!workInProgress.updateQueue && !workInProgress.updateQueue.lastUpdate) {
        workInProgress.updateQueue = current.updateQueue;
    }
    
    workInProgress.child = current.child;
    workInProgress.memoizeState = current.memoizeState
    workInProgress.memoizeProps = current.memoizeProps;
    workInProgress.sibing = current.sibing;
    workInProgress.index= current.index;
    return workInProgress;
}

class ReactRoot {
    constructor(container){
        this._internalRoot = this._createRoot(container);
    }
    _createRoot(container){
        let uninitialFiber = this._createUnitialFiber(tag, key, pendingProps);

        let root = {
            container: container,
            current: uninitialFiber,
            finishedWork: null
        };

        uninitialFiber.stateNode = root;


        return root;
    }

    _createUnitialFiber(){
        return this.createFiber(tag, key, pendingProps);
    }

    render(reactElement, callback){
        let root = this._internalRoot;

        let workInProgress = createWorkInProgress(root.current, );
    }
}

const ReactDOM = {
    render(reactElement, container, callback){
        isFirstRender = true;
        let root = new ReactRoot(container);

        container._reactRootContainer = root;

        root.render(reactElement, callback)



        isFirstRender = false;
    }
}