import { Lesson } from '@/typings';

export interface CartItem {
    lesson: Lesson;
    count: number;
    checked: boolean;
}

export type CartState = {
    cart: CartItem[]
};

