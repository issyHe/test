import {  Lesson, CartState } from '@/typings'

import * as actionTypes from '@/reducers/action-types'
import { AnyAction } from 'redux'

export const initialState: CartState = {cart: []};
// immer 优化 不可变数据集
export default function(state: CartState = initialState,action: AnyAction): CartState{
    console.log('cart reducer')
    switch(action.type){
       case actionTypes.ADD_CART_ITEM:
            let oldLesson = state.cart.find((item: any)=>item.lesson.id === action.payload.id);
            if(oldLesson) {
                oldLesson.count += 1;
            } else {
                state.cart.push({count:1, checked: false, lesson: action.payload});
            }
           return state;
        case actionTypes.REMOVE_CART_ITEM:
            let removeIndex = state.cart.findIndex((item: any)=>item.lesson.id === action.payload.id);
            if(removeIndex != -1){
                state.cart.splice(removeIndex, 1);
            }
            return state;
        case actionTypes.CLEAR_CART_ITEM:
            return {cart: []}
        case actionTypes.CHANGE_CART_ITEM_COUNT:
            let changeLesson = state.cart.find((item: any)=>item.lesson.id === action.payload.id);
            if(changeLesson) {
                changeLesson.count = action.payload.count
            }
           return state;
        case actionTypes.CHNAGE_CHECKED_CART_ITEMS:
            let checkedIds = action.payload;
            state.cart.map(item=>{
                if(checkedIds.includes(item.lesson.id)){
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            });
            return state;
        case actionTypes.SETTLE:
            state.cart.filter(item=>!item.checked);
            return state;
    }
    return state;
}