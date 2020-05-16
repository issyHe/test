import * as actionTypes from '@/reducers/action-types'
import { getSliders, getLesson } from '@/api/home'
import { LessonData } from '@/typings'
import { StoreDispatch , StoreGetState } from '@/store'
export default {
    setCurrentCategory(currentCategory:string){
        return {
            type: actionTypes.SET_CURRENT_CATEGORY,
            payload: currentCategory
        }
    },
    getSliders() {
        return {
            type: actionTypes.GET_SLIDERS,
            payload: getSliders()
        }
    },
    getLessons() {
        return function(dispatch: StoreDispatch, getState: StoreGetState) {
            (async function(){
                let { currentCategory, lessons: {hasMore, offset, limit, loading} } = getState().home;
                if(!loading && hasMore) {
                    dispatch({type: actionTypes.SET_LESSONS_LOADING, payload: true});
                    let result: LessonData = await getLesson<LessonData>(currentCategory, offset, limit);
                    dispatch({
                        type: actionTypes.SET_LESSONS,
                        payload: result.data
                    })
                }
                
            })();
        }
    },
    refreshLessons(){
        return function(dispatch: StoreDispatch, getState: StoreGetState) {
            (async function(){
                let { currentCategory, lessons: { limit, loading} } = getState().home;
                if(!loading) {
                    dispatch({type: actionTypes.SET_LESSONS_LOADING, payload: true});
                    let result: LessonData = await getLesson<LessonData>(currentCategory, 0, limit);
                    dispatch({
                        type: actionTypes.REFRESH_LESSONS,
                        payload: result.data
                    })
                }
                
            })();
        }
    }
}