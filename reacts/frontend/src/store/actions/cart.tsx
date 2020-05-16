import * as actionTypes from '@/reducers/action-types'
//import { getSliders, getLesson } from '@/api/home'
import { Lesson } from '@/typings'
import { StoreDispatch } from '..'
import { message } from 'antd'
//import { StoreDispatch , StoreGetState } from '@/store'
export default {
   addCartItem(lesson:Lesson){
       return function(dispatch: StoreDispatch){
           dispatch({
            type: actionTypes.ADD_CART_ITEM,
            payload: lesson
           });
           message.info('添加购物车成功')
       }
   },
   changeCartItemCount(id: string, count: number){
       return {
        type: actionTypes.CHANGE_CART_ITEM_COUNT,
        payload: {id, count}
       }
   },
   removeCartItem(id:string){
       return {
           type: actionTypes.REMOVE_CART_ITEM,
           payload: {id}
       }
   },
   changeCheckedCartitems(selectedRowKeys: string[]) {
    return {
        type: actionTypes.CHNAGE_CHECKED_CART_ITEMS,
        payload: selectedRowKeys
    }
   },
   clearCartItems(){
       return {
           type: actionTypes.CLEAR_CART_ITEM
       }
   },
   settle(){
       return {
           type: actionTypes.SETTLE
       }
   }
}