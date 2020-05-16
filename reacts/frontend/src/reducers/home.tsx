import { Slider, Lesson } from '@/typings'

import * as actionTypes from '@/reducers/action-types'
import { AnyAction } from 'redux'

export interface Lessons {
    loading: boolean;
    list: Lesson[];
    hasMore: boolean;
    offset: number;
    limit: number;
}

export interface HomeState {
    currentCategory:string;
    sliders: Slider[],
    lessons:  Lessons,
    setCurrentCategory:()=>any;
}

export const initialState: HomeState = {
    currentCategory: "all",
    sliders: [],
    lessons: {
        loading: false,
        list: [],
        hasMore: true,
        offset: 0,
        limit: 5
    },
    setCurrentCategory: null
};
// immer 优化 不可变数据集
export default function(state: HomeState = initialState,action: AnyAction): HomeState{
    console.log("home reducer");
    switch(action.type){
        case actionTypes.SET_CURRENT_CATEGORY:
            return {...state, currentCategory: action.payload};
        case actionTypes.GET_SLIDERS:
            return {
                ...state,
                sliders: action.payload.data
            }
        case actionTypes.SET_LESSONS_LOADING:
            return {
                ...state,
                lessons : {
                    ...state.lessons,
                    loading: true
                }
            };
        case actionTypes.SET_LESSONS:
            return {
                ...state,
                lessons: {
                    ...state.lessons,
                    loading: false,
                    list: [...state.lessons.list, ...action.payload.list],
                    hasMore: action.payload.hasMore,
                    offset: state.lessons.offset + action.payload.list.length
                }
            }
        case actionTypes.REFRESH_LESSONS:
            return {
                ...state,
                lessons: {
                    ...state.lessons,
                    loading: false,
                    list:action.payload.list,
                    hasMore: action.payload.hasMore,
                    offset: action.payload.list.length
                }
            }
        default:
            break;
    }
    return state;
}