import React, { useState, CSSProperties, PropsWithChildren, useEffect, forwardRef } from 'react';
import './index.less';
import { Icon, Card ,Button, Alert, Skeleton } from 'antd';
import { Lessons } from '@/reducers/home';
import { Lesson } from '@/typings';
import { Link } from 'react-router-dom'

type Props = PropsWithChildren<{
    getLessons: ()=> void;
    container: any;
    lessons: Lessons
}>

function LessonList(props: Props, ref: any) {
    const [_, forceUpdate] = useState(0)
    useEffect(()=>{
        if(props.lessons.list.length === 0) props.getLessons();
        ref.current = ()=> forceUpdate(x=>x+1);
    },[]);
    let start:number; //开始真正渲染的起始索引，从它开始向下渲染三条,其余用空div来保留
    let rootFoutSize = parseFloat(document.documentElement.style.fontSize);
    if(props.container.current) {
        let scrollTop = props.container.current.scrollTop;
        start = Math.floor((scrollTop - 7.5 * rootFoutSize)/ (7.5 * rootFoutSize));
    }
    return (
    <section className="lesson-list">
        <h2><Icon type="menu" />全部课程</h2>
        <Skeleton loading={props.lessons.loading && props.lessons.list.length === 0}
        active paragraph={{rows:8}}
        >
        {
            props.lessons.list.map((item: Lesson, index: number)=>{
                return (index >= start && index <= start+3) ? 
                <Link
                key={item.id}
                to={{pathname: `/detail/${item.id}`, state:item}}
                > <Card
                    key={item.id}
                    hoverable={true}
                    style={{width:'100%'}}
                    cover={<img src={item.poster} />}
                >
                    <Card.Meta title={item.title} description={`价格：￥${item.price}元`}></Card.Meta>
                </Card>
                </Link> : 
                <div key={item.id} style={{height:`${7.5*rootFoutSize}px`}} />
            })
        }
        {
            props.lessons.hasMore ? <Button 
            onClick={props.getLessons}
            loading={props.lessons.loading}
            type="primary" block >
                {props.lessons.loading ? '' : '加载更多'}
                </Button>
            : <Alert style={{textAlign:'center'}} message="到底了" />
        }
        </Skeleton>
        
    </section>);
}

export default forwardRef(LessonList);