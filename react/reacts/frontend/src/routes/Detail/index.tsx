import React, { PropsWithChildren, useState, useEffect, useCallback, cloneElement } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import {Card, Button} from 'antd'
import {Lesson, LessonSingleData} from '@/typings'
import Nav from '@/components/Nav';
import { formatCountdown } from 'antd/lib/statistic/utils';
import {StaticContext } from 'react-router'
import {connect} from 'react-redux'
import { RootState } from '@/reducers';
import { getSignleLesson } from '@/api/home'
import actions from '@/store/actions/cart'
interface Params {
    id: string
}

type Props = PropsWithChildren<
RouteComponentProps<Params,StaticContext,Lesson>&typeof actions
>

function Detail(props:Props){
    let [lesson, setLesson]  = useState<Lesson>({} as Lesson);
    useEffect(()=>{
        (async function(){
            let lesson = props.location.state;
            if(!lesson){
                let result = await getSignleLesson<LessonSingleData>(props.match.params.id);
                if(result.success) {
                    lesson = result.data;
                }
            }
            setLesson(lesson);
        })();
        
    },[]);
    // useCallback不用每次都去生成一个新的函数了, 优化
    const addCartItem = useCallback((lesson:Lesson)=>{
        let cover: HTMLDivElement = document.querySelector('.ant-card-cover');
        let coverLeft = cover.getBoundingClientRect().left;
        let coverTop = cover.getBoundingClientRect().top;
        let coverWidth = cover.offsetWidth;
        let coverHeight = cover.offsetHeight;
        let cart:HTMLAreaElement = document.querySelector('a .anticon.anticon-shop');
        let cartWidth = cart.offsetWidth;
        let cartHeight = cart.offsetHeight;
        let cartRight = cart.getBoundingClientRect().right;
        let cartBottom = cart.getBoundingClientRect().bottom;
        let cloneCover: HTMLDivElement = cover.cloneNode(true) as HTMLDivElement;

        cloneCover.style.cssText = (
            `
            z-index:1000;
            opacity: .8;
            position: fixed;
            width:${coverWidth}px;
            height:${coverHeight}px;
            top:${coverTop}px;
            left:${coverLeft}px;
            transition: all 2s ease-in-out;
            `
        );
        document.body.appendChild(cloneCover);
        setTimeout(()=>{
            cloneCover.style.left = cartRight - cartWidth/2 + 'px';
            cloneCover.style.top = cartBottom - cartHeight/2 + 'px';
            cloneCover.style.width = '0px';
            cloneCover.style.height = '0px';
            cloneCover.style.opacity = '.5';
        },0);
        setTimeout(()=>{
            cloneCover.parentNode.removeChild(cloneCover);
        },2000);
        let  result = props.addCartItem(lesson);
    },[]);
    return (
        <>
            <Nav history={props.history}>课程详情</Nav>
            <Card
                hoverable
                style={{width:'100%'}}
                cover={<img src={lesson.poster} />}
            >
                <Card.Meta
                    title={lesson.title}
                    description={<>
                    <p>{`价格：￥${lesson.price}`}</p>
                    <p>
                        <Button className="add-card"
                            icon="shopping-cart"
                            onClick={()=>addCartItem(lesson)}
                        >加入购物车</Button>
                    </p>
                    </>
                    }
                />
            </Card>
        </>
    )
}

export default connect(
    null , //(state: RootState) => state,
    actions
)(Detail)