import { AnyAction } from 'redux'
import * as actionTypes from '../reducers/action-types';
import { LOGIN_TYPES, LoginState } from '@/typings/profile'

export const initialState: LoginState = {
    loginState: LOGIN_TYPES.UN_VALIDATE,
    user: null,
    error: null
};

export default function(state: LoginState = initialState,action: AnyAction): LoginState{
    console.log("profile reducer")
    switch(action.type){
        case actionTypes.VALIDATE:
            if(action.payload.success) {
                return {
                    loginState: LOGIN_TYPES.LOGINED,
                    user: action.payload.data,
                    error: null
                }
            } else {
                return {
                    loginState: LOGIN_TYPES.UNLOGINED,
                    user: null,
                    error: action.payload
                }
            }
        case actionTypes.LOGOUT: 
            return {
                loginState: LOGIN_TYPES.UNLOGINED,
                    user: null,
                    error: null
                }
                break;
        case actionTypes.SET_AVATAR: 
                return {
                    ...state,
                    user: {
                        ...state.user,
                        avatar: action.payload
                    }
                }
        default:
            break;
    }
    return state;
}