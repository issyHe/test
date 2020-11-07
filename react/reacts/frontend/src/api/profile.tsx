import reqeust from './index'
import { AxiosResponse } from 'axios';

export function validate(){
    return reqeust.get('/user/validate');
}

export function register<T>(values: any){
    return reqeust.post<T, T>('/user/register', values);
}

export function login<T>(values: any){
    return reqeust.post<T, T>('/user/login', values);
}