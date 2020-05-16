import { Slider, SliderDocument } from "../model";
import { Request, Response, NextFunction } from 'express';


export const list = async (_req: Request, res: Response, _next: NextFunction) => {
    try {
       let sliders: SliderDocument[] = await Slider.find();
       res.json({
           success: true,
           data: sliders
       })
    }catch(e) {
        _next(e);
    }
};