import { connect } from "react-redux";

export function loadMore(element: HTMLDivElement, callback: any){
    function _loadMore(){
        let containerHeight = element.clientHeight;
        let scrollTop = element.scrollTop;
        let scrollHeight = element.scrollHeight;
        if(containerHeight + scrollTop + 20 >= scrollHeight) {
            callback();
        }
    }

    element.addEventListener('scroll',debounce(_loadMore, 300))

}

export function downRefresh(element: HTMLDivElement, callback: Function){
    let startY:number; //变量，存储按下时候的纵坐标
    let distance: number;   // 本次下拉的距离
    let originalTop = element.offsetTop; // 最初此元素距离顶部的距离\
    let timer: any = null;
    let currentTop: number;
    let addedCount = 1;
    element.addEventListener('touchstart', function(event:TouchEvent){
        //只有当此元素处于原始位置才能下拉，如果处于回弹的过程中则不能下拉了，并且此元素向上卷云的高度==0
        if(timer) clearInterval(timer);
        let touchMove = throttle(_touchMove, 60);
        if(element.scrollTop === 0) {
            currentTop = element.offsetTop;
            startY = event.touches[0].pageY; //记录当前点的纵会标
            element.addEventListener('touchmove', touchMove);
            element.addEventListener('touchend', _touchEnd);
        }
        function _touchMove(event: TouchEvent){
            let pageY = event.touches[0].pageY;
            if(pageY > startY) {
                distance  = pageY  - startY;
                element.style.top = currentTop + distance + 'px';
            } else {
                element.removeEventListener('touchmove', _touchMove);
                element.removeEventListener('touchend', _touchEnd);
            }
        }

        function _touchEnd(event: TouchEvent){
            element.removeEventListener('touchmove', touchMove);
            element.removeEventListener('touchend', _touchEnd);
            timer = setInterval(()=>{
                let currentTop = element.offsetTop;
                if(currentTop - originalTop > 1) {
                    element.style.top = (currentTop -addedCount) + 'px';
                    addedCount += .5;
                } else{
                    addedCount = 1;
                    element.style.top  = originalTop + 'px';
                }
            },13);
            if(distance > 30) {
                callback();
            }
        }
    });
}

export function debounce(fn: Function, wait: number) {
    let timeout: number = null;
    return function(){
        if(timeout ) clearTimeout(timeout);
        timeout = setTimeout(fn, wait);
    }
}

export function throttle(fn: Function, delay: number){
    let prev = Date.now();
    return function(){
        let context = this;
        let args = arguments;
        let now = Date.now();
        if(now - prev >= delay){
            fn.apply(context, args);
            prev = now;
        }
    }
}