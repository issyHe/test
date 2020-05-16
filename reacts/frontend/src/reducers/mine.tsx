export interface MineState {
}
import { AnyAction } from 'redux'
export const initialState: MineState = {};

export default function(state: MineState = initialState,action: AnyAction): MineState{
    return state;
}