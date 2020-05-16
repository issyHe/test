import home,  {HomeState} from './home'
import mine, {MineState} from './mine'
import profile from './profile'
import { ReducersMapObject, AnyAction,Reducer } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import history from '../history';
import produce from 'immer';
import cart from './cart';
import {combineReducers} from 'redux-immer';
import {  CartState, ProfileState } from '@/typings'

export interface RootState {
    home: HomeState,
    mine: MineState,
    profile: ProfileState,
    router:RouterState,
    cart: CartState
}

let reducers: ReducersMapObject<RootState, AnyAction> = {
    home,
    mine,
    profile,
    cart,
    router: connectRouter(history)
}

const rootReducer: Reducer<RootState, AnyAction> = combineReducers<RootState>(produce, reducers);

export default rootReducer