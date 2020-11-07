export interface Lesson {
    order: number;
    title: string;
    video: string;
    poster: string;
    url: string;
    price: number;
    category: string;
    id: string;
}

export interface LessonData {
    success: boolean;
    data: {
        hasMore: boolean,
        list: Lesson[]
    }
}

export interface LessonSingleData {
    success: boolean;
    data: Lesson
}