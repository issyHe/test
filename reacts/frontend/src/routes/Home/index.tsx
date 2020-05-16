import React, { Component, PropsWithChildren, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import {RouteComponentProps } from 'react-router-dom'
import {connect} from 'react-redux'
import home, { initialState, HomeState } from '@/reducers/home'
import {RootState} from '@/reducers'
import HomeSliders from './HomeSliders';
import LessonList from './LessonList';
import mapDispatchToProps from '@/store/actions/home'
import { loadMore, downRefresh } from '@/utils'
import { Spin } from 'antd'
import './index.less'
const mapStateToProps = (state: RootState): HomeState=>{
    return state.home;
};

type Props = PropsWithChildren<RouteComponentProps>&ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
function Home(props:Props){
    let homeContainer = useRef<HTMLDivElement>(null);
    let lessonList = useRef(null);
    useEffect(()=>{
        loadMore(homeContainer.current, props.getLessons);
        downRefresh(homeContainer.current, props.refreshLessons);
        homeContainer.current.addEventListener('scroll', lessonList.current);
        if(props.lessons.list.length > 0){
            homeContainer.current.scrollTop = parseFloat(localStorage.getItem('homeScrollTop'))
        }
        return ()=>{
            localStorage.setItem('homeScrollTop',  homeContainer.current.scrollTop + '');
        };
    },[])
    return (
        <>
            <Header 
            currentCategory={props.currentCategory} 
            setCurrentCategory={props.setCurrentCategory}
            refreshLessons={props.refreshLessons} />
            />
            <div className="refresh-loading" style={{display:'none'}}>
                <Spin size="large"></Spin>
            </div>
            <div className="home-container" ref={homeContainer}>
                <HomeSliders
                     sliders={props.sliders}
                     getSliders={props.getSliders}
                />
                <LessonList ref={lessonList} container={homeContainer} lessons={props.lessons} getLessons={props.getLessons} />
            </div>
        </>
    )
}



export default connect(mapStateToProps, mapDispatchToProps)(Home);