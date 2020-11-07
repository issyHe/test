import React, { PropsWithChildren, useState, useEffect, useCallback } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {connect} from 'react-redux'

import { RootState } from '@/reducers'
import actions from '@/store/actions/cart'
import { Lesson, CartItem, CartState } from '@/typings'
import {Table, Popconfirm, Button, Col} from 'antd'
import Nav from '@/components/Nav'
import { InputNumber, Row } from 'antd'
interface Params {
    
}

const mapStateToProps = (state: RootState): CartState=>{
    return state.cart;
};

type Props = PropsWithChildren<RouteComponentProps<Params> & ReturnType<typeof mapStateToProps> & typeof actions>;

function Cart(props:Props){
    const columns = [
        {
            title: '商品',
            dataIndex: 'lesson',
            render:(val:Lesson, row: CartItem)=>{
                return (
                    <>
                        <p>{val.title}</p>
                        <p>单价: ￥{val.price}元</p>
                    </>
                );
            }
        },
        {
            title: '数量',
            dataIndex: 'count',
            render:(val: number, row: CartItem)=>{
                return (
                   <InputNumber 
                size="small"
                min={1}
                value={val}
                onChange={(value)=>{
                    props.changeCartItemCount(row.lesson.id, value)
                }}
                   />
                )
            }
        },
        {
            title: '操作',
            render:(val: number, row: CartItem)=>{
                return (
                    <Popconfirm
                    title="是否要删除商品"
                    onConfirm={()=>props.removeCartItem(row.lesson.id)}
                    okText="是"
                    cancelText="否"
                    >
                        <Button size="small" type="primary">删除</Button>
                    </Popconfirm>
                )
            }
        }
    ];

    const rowSelection = {
        selectedRowKeys: props.cart.filter((item:CartItem)=>item.checked).map((item:CartItem)=>item.lesson.id),
        onChange: (selectedRowKeys: string[])=>{
            props.changeCheckedCartitems(selectedRowKeys);
        }
    };
    let totalCount = props.cart.filter((item:CartItem)=>item.checked).reduce((total, item)=>total+item.count,0);
    let totalPrice = props.cart.filter((item:CartItem)=>item.checked).
    reduce((total, item)=>total+item.count*item.lesson.price,0);
   return (
       <>
       <Nav history={props.history}>购物车</Nav>
       <Table
            columns={columns}
            // @ts-ignore
            dataSource={props.cart}
            pagination={false}
            rowSelection={rowSelection}
            rowKey={row=>row.lesson.id}
       />
       <Row style={{padding:'5px'}}>
           <Col span={4}>
               <Button type="danger" size="small" onClick={()=>props.clearCartItems()}>清空</Button>
           </Col>
           <Col span={8}>
   已选择了{totalCount}件商品
           </Col>
           <Col span={8}>
   总价￥{totalPrice}元
           </Col>
           <Col span={4}>
               <Button type="danger" size="small" onClick={props.settle}>结算</Button>
           </Col>
       </Row>
       </>
   )
}




export default connect(
    mapStateToProps,
    actions
)(Cart);