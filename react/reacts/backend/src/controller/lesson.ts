import { Lesson, LessonDocument } from "../model";
import { Request, Response, NextFunction } from 'express';


export const list = async (req: Request, res: Response, _next: NextFunction) => {
    let { category = 'all', offset, limit } = req.query;

    const offset1 = isNaN(Number(offset)) ? 0 : Number(offset);
    const limit1 = isNaN(Number(limit)) ? 5 : Number(limit);

    let query: Partial<LessonDocument> = {};

    if(category && category != 'all') {
        // @ts-ignore
        query.category = category;
    }
    let total: number = await Lesson.count(query);
    try {
       let list: LessonDocument[] = await Lesson.find(query).sort({order:1}).skip(offset1).limit(limit1);
       setTimeout(()=>{
        res.json({
            success: true,
            data: {
                list,
                hasMore : total > offset1 + limit1
            }
        })
       },1000);
       
    }catch(e) {
        _next(e);
    }
};

export const getLesson = async (req: Request, res: Response, _next: NextFunction) => {
   let id = req.params.id;
   let lesson = await Lesson.findById(id);
   res.json({
       success: true,
       data: lesson
   })
};