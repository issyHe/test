import * as actionTypes from '@/reducers/action-types'
import { validate, register, login } from '@/api/profile'
import { push } from 'connected-react-router'
import { message} from 'antd'
import {RegisterData, LoginData, RegisterPayload, LoginPayload } from '@/typings/profile'
import { AxiosResponse } from 'axios'



export default {
    validate(){
        return {
            type: actionTypes.VALIDATE,
            payload: validate()
        }
    },
    logout(){
        return function(dispatch: any){
            sessionStorage.removeItem('access_token');
            dispatch(push('./login'));
        }
    },
    register(values: RegisterPayload){
        return function(dispatch: any, getState: any) {
            (async function(){
                try {
                    let result:RegisterData = await register<RegisterData>(values);
                    if(result.success) {
                        dispatch(push('/login'));
                    } else{
                        message.error("注册失败")
                    }
                } catch(e){
                    message.error('注册失败')
                }
            })();
        }
    },
    login(values:LoginPayload) {
        return function(dispatch: any, getState: any) {
            (async function(){
                try {
                    let result:LoginData = await login<LoginData>(values);
                    if(result.success) {
                        sessionStorage.setItem('access_token', result.data);
                        dispatch(push('/profile'));
                    } else{
                        message.error("登录失败")
                    }
                } catch(e){
                    message.error('登录失败')
                }
            })();
        }
    },
    setAvatar(avatarUrl: string) {
        return {
            type: actionTypes.SET_AVATAR,
            payload: avatarUrl
        }
    }
}