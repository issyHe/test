import reqeust from './index'
import { AxiosResponse } from 'axios';
import { sliderData } from '@/typings';

export function getSliders(){
    return reqeust.get<sliderData, sliderData>('/slider/list');
}
export function getLesson<T>(
    category: string = 'all',
    offset: number,
    limit: number
){
    return reqeust.get<T, T>(`/lesson/list?category=${category}&offset=${offset}&limit=${limit}`);
}

export function getSignleLesson<T>(
   id: string
){
    return reqeust.get<T, T>(`/lesson/${id}`);
}































