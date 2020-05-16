import React, { useState, CSSProperties, PropsWithChildren, useEffect } from 'react';
import './index.less';
import { Carousel } from 'antd';
import { Slider } from '@/typings'
import Home from '..';

type Props = PropsWithChildren<{
    sliders: Slider[],
    getSliders:()=>void
}>

function HomeSliders(props: Props) {
    useEffect(()=>{
        if(props.sliders.length === 0){
            props.getSliders();
        }
    },[]);
    return (
        <Carousel draggable={false} autoplay>
            {
                props.sliders.map((item:Slider, index: number)=>{
                    return (
                        <div key={item._id}>
                            <img src={item.url} />
                        </div>
                    )
                })
            }
        </Carousel>
    );
}

export default HomeSliders;